"""
Smoke test — verify all prompt builders work without making API calls.
Checks: required files exist, no import errors, prompts are non-empty strings.

Run: python test_prompts.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from config import (
    TERMINOLOGY, CONCEPT_TEMPLATE, ARCHITECTURE_STANDARDS,
    ENTERPRISE_GLOSSARY, REVIEW_CHECKLIST, TOKEN_OPTIMIZATION,
    NAMING_CONVENTIONS, UI_CONVENTIONS,
)
from prompts import (
    research_prompt, generator_all_levels_prompt,
    story_prompt, enterprise_prompt, ui_prompt,
    diagram_prompt, tutorial_prompt, interview_prompt,
    documentation_prompt, reviewer_prompt, optimizer_prompt,
    planner_prompt,
)

SAMPLE_CONCEPT = {"name": "Load Balancer", "slug": "load-balancer", "category": "Infrastructure"}

REQUIRED_FILES = [
    TERMINOLOGY, CONCEPT_TEMPLATE, ARCHITECTURE_STANDARDS,
    ENTERPRISE_GLOSSARY, REVIEW_CHECKLIST, TOKEN_OPTIMIZATION,
    NAMING_CONVENTIONS,
]


def check_files():
    missing = [str(f) for f in REQUIRED_FILES if not f.exists()]
    if missing:
        print("FAIL — missing files:")
        for f in missing:
            print(f"  {f}")
        return False
    print("✓ all required files present")
    return True


def check_prompts():
    c = SAMPLE_CONCEPT
    fake_content = "## Review Report\n**Overall Verdict**: PUBLISH-READY\n"
    fake_sections = {"Core Sections": "some content", "Short Story": "story content"}
    fake_levels = {"Beginner": "beginner text", "Advanced": "advanced text"}

    tests = [
        ("planner",    lambda: planner_prompt(2, [c], "Phase 2 stub")),
        ("research",   lambda: research_prompt(c)),
        ("generator",  lambda: generator_all_levels_prompt(c)),
        ("story",      lambda: story_prompt(c, "A load balancer distributes requests.")),
        ("enterprise", lambda: enterprise_prompt(c, "A load balancer distributes requests.")),
        ("ui",         lambda: ui_prompt(c)),
        ("diagram",    lambda: diagram_prompt(c, "Client, Load Balancer, Server A, Server B")),
        ("tutorial",   lambda: tutorial_prompt(c, fake_levels)),
        ("interview",  lambda: interview_prompt(c, "distributes requests", "scalability vs single point of failure")),
        ("docs",       lambda: documentation_prompt(c, fake_sections)),
        ("reviewer",   lambda: reviewer_prompt(c, fake_content)),
        ("optimizer",  lambda: optimizer_prompt(c, fake_content)),
    ]

    all_pass = True
    for name, fn in tests:
        try:
            sys_p, usr_p = fn()
            assert isinstance(sys_p, str) and len(sys_p) > 10, "system prompt too short"
            assert isinstance(usr_p, str) and len(usr_p) > 50, "user prompt too short"
            print(f"  ✓ {name}")
        except Exception as e:
            print(f"  ✗ {name}: {e}")
            all_pass = False

    return all_pass


if __name__ == "__main__":
    print("FlowArchitect Prompt Smoke Test")
    print("=" * 40)

    files_ok = check_files()
    print()
    print("Prompt builders:")
    prompts_ok = check_prompts()

    print()
    if files_ok and prompts_ok:
        print("ALL PASS — safe to run orchestrator")
    else:
        print("FAILURES — fix above before running orchestrator")
        sys.exit(1)
