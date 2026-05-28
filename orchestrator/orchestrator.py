"""
FlowArchitect Orchestrator — main entry point.

Usage:
  # Generate a single concept
  python orchestrator.py --concept "Load Balancer"

  # Generate all Phase 2 concepts (batch mode)
  python orchestrator.py --phase 2

  # Generate Phase 2 with custom batch size
  python orchestrator.py --phase 2 --batch-size 4

  # Dry run — show what would be generated (no API calls)
  python orchestrator.py --phase 2 --dry-run

  # Resume from a specific concept (skip completed ones)
  python orchestrator.py --phase 2 --resume-from "REST"

  # Generate a specific list of concepts
  python orchestrator.py --concepts "APIs,REST,HTTP Basics"
"""

import argparse
import asyncio
import json
import sys
import time
from pathlib import Path
from datetime import datetime

# Add orchestrator dir to path
sys.path.insert(0, str(Path(__file__).parent))

from config import CONCEPTS_BY_PHASE, BATCH_SIZE, CONCEPTS, STAGING
from pipeline import run_concept_pipeline, run_batch
from prompts import planner_prompt
from pipeline import call_claude


# ── Utilities ──────────────────────────────────────────────────────────────────

def is_concept_done(slug: str) -> bool:
    """Concept is done if final file exists in concepts/ dir."""
    return (CONCEPTS / f"{slug}.md").exists()


def filter_pending(concepts: list[dict], resume_from: str = "") -> list[dict]:
    """Skip already-generated concepts. If resume_from set, skip everything before it."""
    if resume_from:
        idx = next(
            (i for i, c in enumerate(concepts) if c["name"] == resume_from or c["slug"] == resume_from),
            0
        )
        concepts = concepts[idx:]
    return [c for c in concepts if not is_concept_done(c["slug"])]


def print_phase_plan(phase: int, concepts: list[dict], batch_size: int):
    total = len(concepts)
    batches = (total + batch_size - 1) // batch_size
    print(f"\nPhase {phase} — {total} concepts in {batches} batch(es) of ~{batch_size}")
    print(f"{'─'*50}")
    for i, c in enumerate(concepts, 1):
        status = "✓ done" if is_concept_done(c["slug"]) else "○ pending"
        print(f"  {i:2}. {c['name']:<40} {status}")
    print(f"{'─'*50}")


async def run_planner(phase: int, concepts: list[dict], roadmap_text: str) -> str:
    """Run Planner Agent and print manifest."""
    from config import MODEL_FAST
    sys_p, usr_p = planner_prompt(phase, concepts, roadmap_text)
    result = await call_claude(sys_p, usr_p, model=MODEL_FAST, max_tokens=2000, label=f"phase{phase}/planner")
    if result.success:
        manifest_path = Path(__file__).parent.parent / "system-design-academy" / "agent-prompts" / "execution-manifest.md"
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        header = f"# Execution Manifest — Phase {phase}\nGenerated: {datetime.now().isoformat()}\n\n"
        manifest_path.write_text(header + result.content, encoding="utf-8")
        print(f"Manifest written → {manifest_path}")
        return result.content
    else:
        print(f"⚠ Planner failed: {result.error}")
        return ""


def print_summary(results: list, elapsed: float):
    passed = sum(1 for r in results if r.review_verdict == "PUBLISH-READY")
    revised = sum(1 for r in results if r.review_verdict == "NEEDS-REVISION")
    blocked = sum(1 for r in results if r.review_verdict == "BLOCKED")
    total_tokens = sum(r.token_total for r in results)

    print(f"\n{'='*60}")
    print(f"GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"  Concepts generated : {len(results)}")
    print(f"  PUBLISH-READY      : {passed}")
    print(f"  NEEDS-REVISION     : {revised}")
    print(f"  BLOCKED            : {blocked}")
    print(f"  Total tokens used  : {total_tokens:,}")
    print(f"  Elapsed            : {elapsed:.1f}s")
    print(f"  Avg tokens/concept : {total_tokens // max(len(results), 1):,}")
    print(f"{'='*60}")

    if blocked:
        print("\nBlocked concepts (manual review needed):")
        for r in results:
            if r.review_verdict == "BLOCKED":
                print(f"  - {r.concept['name']} → staging/{r.concept['slug']}/assembled-final.md")


# ── Main ───────────────────────────────────────────────────────────────────────

async def main():
    parser = argparse.ArgumentParser(description="FlowArchitect Concept Orchestrator")
    parser.add_argument("--phase",       type=int,   help="Generate all concepts in a phase (2-5)")
    parser.add_argument("--concept",     type=str,   help="Generate a single concept by name")
    parser.add_argument("--concepts",    type=str,   help="Comma-separated list of concept names")
    parser.add_argument("--batch-size",  type=int,   default=None, help="Override batch size")
    parser.add_argument("--resume-from", type=str,   default="",   help="Skip concepts before this one")
    parser.add_argument("--dry-run",     action="store_true",      help="Show plan without API calls")
    parser.add_argument("--planner-only",action="store_true",      help="Only run planner agent")
    parser.add_argument("--force",       action="store_true",      help="Re-generate already-done concepts")
    args = parser.parse_args()

    # ── Single concept ───────────────────────────────────────────────────────
    if args.concept:
        # Find concept across all phases
        target = args.concept.strip().lower()
        found = None
        for phase_concepts in CONCEPTS_BY_PHASE.values():
            for c in phase_concepts:
                if c["name"].lower() == target or c["slug"] == target:
                    found = c
                    break

        if not found:
            print(f"Concept not found: {args.concept}")
            print("Available concepts:")
            for pc in CONCEPTS_BY_PHASE.values():
                for c in pc:
                    print(f"  {c['name']}")
            sys.exit(1)

        if is_concept_done(found["slug"]) and not args.force:
            print(f"Already done: {found['name']} (use --force to regenerate)")
            sys.exit(0)

        if args.dry_run:
            print(f"Would generate: {found['name']} [{found['slug']}]")
            sys.exit(0)

        start = time.time()
        state = await run_concept_pipeline(found)
        print_summary([state], time.time() - start)
        return

    # ── Concept list ─────────────────────────────────────────────────────────
    if args.concepts:
        names = [n.strip() for n in args.concepts.split(",")]
        all_concepts = {c["name"].lower(): c for pc in CONCEPTS_BY_PHASE.values() for c in pc}
        selected = []
        for name in names:
            c = all_concepts.get(name.lower())
            if c:
                selected.append(c)
            else:
                print(f"Warning: concept not found: {name}")

        if not selected:
            print("No valid concepts found.")
            sys.exit(1)

        if not args.force:
            selected = [c for c in selected if not is_concept_done(c["slug"])]

        if args.dry_run:
            print(f"Would generate {len(selected)} concepts:")
            for c in selected:
                print(f"  - {c['name']}")
            sys.exit(0)

        batch = args.batch_size or 3
        start = time.time()
        results = await run_batch(selected, batch_size=batch)
        print_summary(results, time.time() - start)
        return

    # ── Phase mode ────────────────────────────────────────────────────────────
    if args.phase:
        if args.phase not in CONCEPTS_BY_PHASE:
            print(f"Phase {args.phase} not defined. Available: {sorted(CONCEPTS_BY_PHASE.keys())}")
            sys.exit(1)

        concepts = CONCEPTS_BY_PHASE[args.phase]
        batch_size = args.batch_size or BATCH_SIZE.get(args.phase, 3)

        print_phase_plan(args.phase, concepts, batch_size)

        # Run planner first
        roadmap_stub = f"Phase {args.phase}: {len(concepts)} concepts."
        if not args.dry_run:
            await run_planner(args.phase, concepts, roadmap_stub)

        if args.planner_only:
            return

        pending = concepts if args.force else filter_pending(concepts, args.resume_from)
        skipped = len(concepts) - len(pending)
        if skipped:
            print(f"\nSkipping {skipped} already-completed concepts (use --force to regenerate).")

        if not pending:
            print("All concepts already generated.")
            sys.exit(0)

        if args.dry_run:
            print(f"\nDry run: would generate {len(pending)} concepts in {(len(pending) + batch_size - 1) // batch_size} batches.")
            for c in pending:
                print(f"  - {c['name']}")
            sys.exit(0)

        start = time.time()
        results = await run_batch(pending, batch_size=batch_size)
        print_summary(results, time.time() - start)
        return

    parser.print_help()


if __name__ == "__main__":
    asyncio.run(main())
