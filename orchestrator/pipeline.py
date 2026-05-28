"""
Core pipeline execution for FlowArchitect agent orchestration.

Wave architecture:
  Wave 1 (sequential): Planner → Research → Generator (all levels)
  Wave 2 (parallel):   Story + Enterprise + UI + Diagram + Tutorial + Interview
  Wave 3 (sequential): Documentation → Review → [fix loop] → Optimize
"""

import asyncio
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import anthropic

from config import (
    MODEL_FAST, MODEL_SMART, STAGING, CONCEPTS,
    SKIP_RESEARCH, REVIEWS,
)
from prompts import (
    research_prompt, generator_all_levels_prompt,
    story_prompt, enterprise_prompt, ui_prompt,
    diagram_prompt, tutorial_prompt, interview_prompt,
    documentation_prompt, reviewer_prompt, optimizer_prompt,
)


# ── Types ─────────────────────────────────────────────────────────────────────

@dataclass
class AgentResult:
    agent: str
    concept_slug: str
    content: str
    success: bool
    error: str = ""
    input_tokens: int = 0
    output_tokens: int = 0


@dataclass
class ConceptState:
    concept: dict
    research_brief: str = ""
    core_sections: str = ""           # all 4 levels + metadata + common mistakes
    definition: str = ""
    tradeoffs: str = ""
    components: str = ""
    story: str = ""
    enterprise: str = ""
    ui_spec: str = ""
    diagrams: str = ""
    tutorials: str = ""
    interview: str = ""
    assembled: str = ""
    review_report: str = ""
    review_verdict: str = ""          # PUBLISH-READY | NEEDS-REVISION | BLOCKED
    optimized: str = ""
    token_total: int = 0


# ── Claude API call ───────────────────────────────────────────────────────────

async def call_claude(
    system: str,
    user: str,
    model: str = MODEL_SMART,
    max_tokens: int = 8000,
    label: str = "",
) -> AgentResult:
    client = anthropic.Anthropic()
    slug = label or "unknown"

    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.messages.create(
                model=model,
                max_tokens=max_tokens,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
        )
        content = response.content[0].text
        return AgentResult(
            agent=label,
            concept_slug=slug,
            content=content,
            success=True,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
        )
    except Exception as e:
        return AgentResult(
            agent=label,
            concept_slug=slug,
            content="",
            success=False,
            error=str(e),
        )


# ── Extraction helpers ────────────────────────────────────────────────────────

def extract_definition(core_sections: str) -> str:
    """Pull One-Line Definition from generated core sections."""
    match = re.search(r"\*\*One-Line Definition\*\*:\s*(.+)", core_sections)
    if match:
        return match.group(1).strip()
    match = re.search(r"One-Line Definition[:\s]+(.+)", core_sections)
    if match:
        return match.group(1).strip()
    # Fallback: first non-empty sentence after "Definition"
    lines = [l.strip() for l in core_sections.split("\n") if l.strip()]
    for i, line in enumerate(lines):
        if "definition" in line.lower() and i + 1 < len(lines):
            return lines[i + 1]
    return ""


def extract_tradeoffs(core_sections: str) -> str:
    """Extract trade-offs summary as comma-separated string."""
    match = re.search(
        r"## Trade-Offs Summary.*?\n(.*?)(?=\n##|\Z)", core_sections, re.DOTALL
    )
    if match:
        table = match.group(1).strip()
        rows = re.findall(r"\|\s*(\w[^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|", table)
        return "; ".join(f"{r[0].strip()} — benefit: {r[1].strip()}, cost: {r[2].strip()}" for r in rows[:3])
    return "scalability vs consistency, performance vs cost"


def extract_components(core_sections: str) -> str:
    """Extract key components from intermediate section."""
    match = re.search(r"Request Flow.*?\n((?:\d+\..+\n?){3,})", core_sections, re.DOTALL)
    if match:
        steps = re.findall(r"\d+\.\s*(.+)", match.group(1))
        words = set()
        for step in steps:
            for word in re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b", step):
                words.add(word)
        if words:
            return ", ".join(list(words)[:8])
    return "Client, Server, Load Balancer, Database, Cache"


def extract_level_sections(core_sections: str) -> dict[str, str]:
    """Split core_sections into per-level text for tutorial agent."""
    levels = ["Beginner", "Intermediate", "Advanced", "Expert"]
    result = {}
    for i, lvl in enumerate(levels):
        pattern = rf"### {lvl} Explanation(.*?)"
        next_pattern = rf"### {levels[i+1]} Explanation" if i + 1 < len(levels) else r"\Z"
        match = re.search(pattern + next_pattern, core_sections, re.DOTALL)
        if match:
            result[lvl] = match.group(1).strip()
    if not result:
        result = {"Beginner": core_sections, "Advanced": core_sections}
    return result


def parse_review_verdict(review_report: str) -> str:
    match = re.search(r"\*\*Overall Verdict\*\*:\s*(\S+)", review_report)
    return match.group(1) if match else "NEEDS-REVISION"


# ── Staging file I/O ──────────────────────────────────────────────────────────

def write_staging(slug: str, filename: str, content: str) -> Path:
    dir_ = STAGING / slug
    dir_.mkdir(parents=True, exist_ok=True)
    path = dir_ / filename
    path.write_text(content, encoding="utf-8")
    return path


def read_staging(slug: str, filename: str) -> str:
    path = STAGING / slug / filename
    return path.read_text(encoding="utf-8") if path.exists() else ""


def write_final_concept(slug: str, content: str) -> Path:
    CONCEPTS.mkdir(parents=True, exist_ok=True)
    path = CONCEPTS / f"{slug}.md"
    path.write_text(content, encoding="utf-8")
    return path


def write_review(slug: str, content: str) -> Path:
    REVIEWS.mkdir(parents=True, exist_ok=True)
    path = REVIEWS / f"{slug}-review.md"
    path.write_text(content, encoding="utf-8")
    return path


# ── Wave 1: Sequential ────────────────────────────────────────────────────────

async def run_wave1(concept: dict, skip_research: bool) -> ConceptState:
    state = ConceptState(concept=concept)
    slug = concept["slug"]
    name = concept["name"]

    print(f"  [Wave 1] {name} — research + generation")

    # Agent 2: Research (skip for simple concepts)
    if not skip_research:
        sys_p, usr_p = research_prompt(concept)
        result = await call_claude(sys_p, usr_p, model=MODEL_FAST, max_tokens=1000, label=f"{slug}/research")
        if result.success:
            state.research_brief = result.content
            write_staging(slug, "research-brief.md", result.content)
            state.token_total += result.input_tokens + result.output_tokens
            print(f"    ✓ research brief ({result.output_tokens} tok out)")
        else:
            print(f"    ✗ research failed: {result.error}")
    else:
        print(f"    ↷ research skipped (simple concept)")

    # Agent 3: Concept Generator (all levels in one call)
    sys_p, usr_p = generator_all_levels_prompt(concept, state.research_brief)
    result = await call_claude(sys_p, usr_p, model=MODEL_SMART, max_tokens=8000, label=f"{slug}/generator")
    if not result.success:
        raise RuntimeError(f"Generator failed for {name}: {result.error}")

    state.core_sections = result.content
    state.token_total += result.input_tokens + result.output_tokens
    write_staging(slug, "core-sections.md", result.content)

    state.definition = extract_definition(result.content)
    state.tradeoffs = extract_tradeoffs(result.content)
    state.components = extract_components(result.content)

    print(f"    ✓ core sections ({result.output_tokens} tok out)")
    print(f"    definition: {state.definition[:80]}...")

    return state


# ── Wave 2: Parallel ──────────────────────────────────────────────────────────

async def run_wave2(state: ConceptState) -> ConceptState:
    concept = state.concept
    slug = concept["slug"]
    name = concept["name"]

    print(f"  [Wave 2] {name} — 6 agents parallel")

    level_sections = extract_level_sections(state.core_sections)

    # Build all 6 prompts
    s4, u4 = story_prompt(concept, state.definition)
    s5, u5 = enterprise_prompt(concept, state.definition)
    s6, u6 = ui_prompt(concept)
    s7, u7 = diagram_prompt(concept, state.components)
    s8, u8 = tutorial_prompt(concept, level_sections)
    s9, u9 = interview_prompt(concept, state.definition, state.tradeoffs)

    # Launch all 6 concurrently
    tasks = await asyncio.gather(
        call_claude(s4, u4, model=MODEL_FAST, max_tokens=1000, label=f"{slug}/story"),
        call_claude(s5, u5, model=MODEL_FAST, max_tokens=1500, label=f"{slug}/enterprise"),
        call_claude(s6, u6, model=MODEL_FAST, max_tokens=800,  label=f"{slug}/ui"),
        call_claude(s7, u7, model=MODEL_FAST, max_tokens=1500, label=f"{slug}/diagrams"),
        call_claude(s8, u8, model=MODEL_FAST, max_tokens=1500, label=f"{slug}/tutorials"),
        call_claude(s9, u9, model=MODEL_FAST, max_tokens=800,  label=f"{slug}/interview"),
    )

    agent_labels = ["story", "enterprise", "ui_spec", "diagrams", "tutorials", "interview"]
    filenames    = ["story.md", "enterprise.md", "ui-spec.md", "diagrams.md", "tutorials.md", "interview.md"]

    for result, attr, fname in zip(tasks, agent_labels, filenames):
        if result.success:
            setattr(state, attr, result.content)
            write_staging(slug, fname, result.content)
            state.token_total += result.input_tokens + result.output_tokens
            print(f"    ✓ {attr} ({result.output_tokens} tok out)")
        else:
            print(f"    ✗ {attr} failed: {result.error}")
            setattr(state, attr, f"<!-- {attr} generation failed: {result.error} -->")

    return state


# ── Wave 3: Sequential ────────────────────────────────────────────────────────

async def run_wave3(state: ConceptState, max_revision_cycles: int = 2) -> ConceptState:
    concept = state.concept
    slug = concept["slug"]
    name = concept["name"]

    print(f"  [Wave 3] {name} — documentation + review + optimize")

    # Agent 10: Documentation
    sections = {
        "Core Sections (all levels, metadata, common mistakes, trade-offs)": state.core_sections,
        "Short Story": state.story,
        "Enterprise Use Case": state.enterprise,
        "UI Template Idea": state.ui_spec,
        "Diagram Idea": state.diagrams,
        "Tutorial Path": state.tutorials,
        "Interview Talking Points": state.interview,
    }
    s10, u10 = documentation_prompt(concept, sections)
    result = await call_claude(s10, u10, model=MODEL_SMART, max_tokens=10000, label=f"{slug}/documentation")
    if not result.success:
        raise RuntimeError(f"Documentation assembly failed for {name}: {result.error}")

    state.assembled = result.content
    state.token_total += result.input_tokens + result.output_tokens
    write_staging(slug, "assembled.md", result.content)
    print(f"    ✓ documentation ({result.output_tokens} tok out)")

    # Agent 11: Reviewer — with fix loop
    current_content = state.assembled
    for cycle in range(max_revision_cycles + 1):
        s11, u11 = reviewer_prompt(concept, current_content)
        result = await call_claude(s11, u11, model=MODEL_SMART, max_tokens=4000, label=f"{slug}/reviewer")
        if not result.success:
            print(f"    ✗ reviewer failed: {result.error}")
            break

        state.review_report = result.content
        state.review_verdict = parse_review_verdict(result.content)
        state.token_total += result.input_tokens + result.output_tokens
        write_review(slug, result.content)
        print(f"    ✓ review cycle {cycle+1}: {state.review_verdict}")

        if state.review_verdict == "PUBLISH-READY":
            break

        if cycle < max_revision_cycles:
            print(f"    → applying targeted fixes (cycle {cycle+1})")
            current_content = await apply_targeted_fixes(concept, current_content, result.content, state)

    state.assembled = current_content
    write_staging(slug, "assembled-final.md", current_content)

    # Agent 12: Token Optimizer (only if review passed or after max cycles)
    if state.review_verdict in ("PUBLISH-READY", "NEEDS-REVISION"):
        s12, u12 = optimizer_prompt(concept, state.assembled)
        result = await call_claude(s12, u12, model=MODEL_FAST, max_tokens=10000, label=f"{slug}/optimizer")
        if result.success:
            state.optimized = result.content
            state.token_total += result.input_tokens + result.output_tokens
            final_path = write_final_concept(slug, result.content)
            print(f"    ✓ optimizer → {final_path}")
        else:
            # Fall back to unoptimized if optimizer fails
            state.optimized = state.assembled
            final_path = write_final_concept(slug, state.assembled)
            print(f"    ✗ optimizer failed, saved unoptimized → {final_path}")
    else:
        state.optimized = state.assembled
        final_path = write_final_concept(slug, state.assembled)
        print(f"    ⚠ BLOCKED — saved for manual review → {final_path}")

    return state


async def apply_targeted_fixes(
    concept: dict, current_content: str, review_report: str, state: ConceptState
) -> str:
    """Extract FAIL items and ask Concept Generator to fix only those sections."""
    slug = concept["slug"]

    # Extract must-fix items
    must_fix = re.search(r"\*\*Must Fix Before Publish\*\*(.*?)(?=\n##|\Z)", review_report, re.DOTALL)
    if not must_fix:
        return current_content

    fix_items = must_fix.group(1).strip()
    sys_fix = "You are a precise technical content editor. Fix only the flagged items. Do not rewrite other content."
    usr_fix = f"""CONCEPT FILE:
{current_content}

REVIEW FINDINGS (fix these only):
{fix_items}

TASK:
Apply fixes to the concept document.
Output the complete corrected document.
Change ONLY the flagged sections — do not rewrite anything else.
"""
    result = await call_claude(sys_fix, usr_fix, model=MODEL_SMART, max_tokens=10000, label=f"{slug}/fix")
    state.token_total += result.input_tokens + result.output_tokens if result.success else 0
    return result.content if result.success else current_content


# ── Full concept pipeline ─────────────────────────────────────────────────────

async def run_concept_pipeline(concept: dict) -> ConceptState:
    name = concept["name"]
    slug = concept["slug"]
    skip_research = name in SKIP_RESEARCH

    print(f"\n{'='*60}")
    print(f"Concept: {name}  [{slug}]")
    print(f"{'='*60}")

    state = await run_wave1(concept, skip_research)
    state = await run_wave2(state)
    state = await run_wave3(state)

    print(f"\n  Total tokens: {state.token_total:,}")
    print(f"  Verdict: {state.review_verdict}")
    print(f"  Output: concepts/{slug}.md")

    return state


# ── Batch execution ───────────────────────────────────────────────────────────

async def run_batch(concepts: list[dict], batch_size: int = 3) -> list[ConceptState]:
    """
    Run concepts in batches. Within each batch, concepts run concurrently.
    Batches run sequentially (respect dependency order).
    """
    results = []
    for i in range(0, len(concepts), batch_size):
        batch = concepts[i:i + batch_size]
        batch_nums = list(range(i + 1, i + len(batch) + 1))
        print(f"\n{'#'*60}")
        print(f"Batch {i//batch_size + 1}: concepts {batch_nums} of {len(concepts)}")
        print(f"{'#'*60}")

        batch_results = await asyncio.gather(
            *[run_concept_pipeline(c) for c in batch],
            return_exceptions=True,
        )

        for concept, result in zip(batch, batch_results):
            if isinstance(result, Exception):
                print(f"\n  ✗ FAILED: {concept['name']}: {result}")
            else:
                results.append(result)

    return results
