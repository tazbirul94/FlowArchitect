"""
Prompt builders for each of the 12 agents.
Each function returns (system_prompt, user_prompt) tuple.
All prompts load ONLY the minimal context slice their agent needs.
"""

from pathlib import Path
from config import (
    CONCEPT_TEMPLATE, TERMINOLOGY, ARCHITECTURE_STANDARDS,
    ENTERPRISE_GLOSSARY, UI_TEMPLATE_SYSTEM, REVIEW_CHECKLIST,
    TOKEN_OPTIMIZATION, NAMING_CONVENTIONS, UI_CONVENTIONS,
)


def _read(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Required context file missing: {path}")
    return path.read_text(encoding="utf-8")


GLOBAL_SYSTEM = """You are a senior system design educator, solution architect, and technical writer.

You generate content for the FlowArchitect System Design Academy — a concept-driven learning platform covering 44 system design concepts from beginner to expert level.

CORE RULES:
1. Follow CONCEPT_TEMPLATE.md exactly. Do not invent structure.
2. Do not load the full project. Use only what is provided in this prompt.
3. Write for the assigned level. Never merge levels.
4. Beginner: plain language, everyday analogies, no unexplained jargon.
5. Advanced/Expert: precise technical language, quantified trade-offs, production reality.
6. All stories must use a named real-world system type (Netflix, Uber, bank, etc.).
7. All trade-off tables need at least 3 rows with Pros, Cons, Best For.
8. Do not fabricate statistics. Use order-of-magnitude estimates (~10K req/sec, millions of users).
9. Interview sections must fit verbal delivery. No walls of text.
10. Output is Markdown. Headers, tables, and code blocks formatted correctly."""


# ── Agent 1: Planner ──────────────────────────────────────────────────────────

def planner_prompt(phase: int, concepts: list[dict], roadmap_phase_text: str) -> tuple[str, str]:
    concept_list = "\n".join(
        f"- {c['name']} ({c['category']}) [slug: {c['slug']}]"
        for c in concepts
    )
    system = "You are a project planner. Output structured Markdown tables only. No prose explanations."
    user = f"""AGENT: Planner
TASK: Create execution manifest for Phase {phase} concepts.

CONCEPTS:
{concept_list}

PHASE DEFINITION:
{roadmap_phase_text}

OUTPUT: A Markdown table with columns:
| Concept Name | Slug | Category | Phase | Priority | Needs Research Brief | Agent Assignments | Dependencies |

RULES:
- Priority: Foundation | Core | Advanced | Expert
- Needs Research Brief: Yes | No
- Agent Assignments: always "2→3→[4,5,6,7,8,9 parallel]→10→11→12"
- Dependencies: list prerequisite concept slugs or "none"
- One row per concept. No concept descriptions. No prose.
"""
    return system, user


# ── Agent 2: Research ─────────────────────────────────────────────────────────

def research_prompt(concept: dict) -> tuple[str, str]:
    terminology = _read(TERMINOLOGY)
    system = GLOBAL_SYSTEM
    user = f"""AGENT: Concept Research
CONCEPT: {concept['name']}
CATEGORY: {concept['category']}

TERMINOLOGY REFERENCE:
{terminology}

TASK: Write a research brief for this concept. 200-300 words.

INCLUDE:
- Definition (1-2 sentences)
- 2-3 variants or configurations
- 2-3 real-world systems that use it (Netflix, AWS, Uber, etc.)
- Core trade-off
- 2-3 common interview angles

OUTPUT: Plain Markdown paragraphs. No headers. No lists.
CONSTRAINTS: Do not generate the full concept document. Brief only. Under 300 words.
"""
    return system, user


# ── Agent 3: Concept Generator ────────────────────────────────────────────────

def generator_prompt(concept: dict, level: str, research_brief: str = "") -> tuple[str, str]:
    template = _read(CONCEPT_TEMPLATE)
    terminology = _read(TERMINOLOGY)
    arch_standards = _read(ARCHITECTURE_STANDARDS)

    research_section = f"\nRESEARCH BRIEF:\n{research_brief}\n" if research_brief else ""

    system = GLOBAL_SYSTEM
    user = f"""[MODE: STRUCTURED]
[AGENT: Concept Generator]

CONCEPT: {concept['name']}
CATEGORY: {concept['category']}
LEVEL: {level}

CONCEPT TEMPLATE:
{template}

TERMINOLOGY:
{terminology}

ARCHITECTURE STANDARDS:
{arch_standards}
{research_section}
TASK:
Generate the {level} section of the concept document for {concept['name']}.
Follow CONCEPT_TEMPLATE.md section structure for the {level} level exactly.

REQUIREMENTS:
- Beginner: plain language, everyday analogy, Key Terms list (3 terms), diagram idea (2-3 components)
- Intermediate: real request flow (numbered steps), 2 configurations, 1 failure scenario, real tool names
- Advanced: trade-off table (3+ rows, Approach/Pros/Cons/Best For), scale at 3 traffic levels, "When NOT to Use" (2 scenarios), performance notes
- Expert: enterprise context, multi-region note, compliance note, cost note, vendor evaluation table, ops checklist (4+ items)

OUTPUT FORMAT:
- Start directly with section content (no preamble)
- Markdown headers matching CONCEPT_TEMPLATE.md
- Word count: Beginner 200-300 | Intermediate 300-400 | Advanced 400-500 | Expert 400-500

CONSTRAINTS:
- Do not load or reference other concept files
- Do not generate content for other levels
- No fabricated statistics — use order-of-magnitude estimates
"""
    return system, user


def generator_all_levels_prompt(concept: dict, research_brief: str = "") -> tuple[str, str]:
    """Generate all 4 levels in one call for simpler concepts."""
    template = _read(CONCEPT_TEMPLATE)
    terminology = _read(TERMINOLOGY)
    research_section = f"\nRESEARCH BRIEF:\n{research_brief}\n" if research_brief else ""

    system = GLOBAL_SYSTEM
    user = f"""[MODE: STRUCTURED]
[AGENT: Concept Generator]

CONCEPT: {concept['name']}
CATEGORY: {concept['category']}
LEVEL: All

CONCEPT TEMPLATE:
{template}

TERMINOLOGY:
{terminology}
{research_section}
TASK:
Generate ALL FOUR level sections (Beginner, Intermediate, Advanced, Expert) for {concept['name']}.
Also generate the metadata header and the Common Mistakes section and the Trade-Offs Summary table.

Follow CONCEPT_TEMPLATE.md exactly. Output each section with its full header.

Word count targets:
- Beginner: 200-300 words
- Intermediate: 300-400 words
- Advanced: 400-500 words
- Expert: 400-500 words
- Common Mistakes: 3 items
- Trade-Offs Summary: 5 rows (Performance, Complexity, Cost, Consistency, Scalability)

CONSTRAINTS:
- Do not reference other concept files
- No fabricated statistics
- Metadata header: fill concept-name, category, difficulty-range, related-concepts, last-updated={__import__('datetime').date.today().isoformat()}, generated-by=Concept Generator, reviewed=false
"""
    return system, user


# ── Agent 4: Story Writer ─────────────────────────────────────────────────────

def story_prompt(concept: dict, definition: str) -> tuple[str, str]:
    system = GLOBAL_SYSTEM
    user = f"""[MODE: STRUCTURED]
[AGENT: Story Writer]

CONCEPT: {concept['name']}
DEFINITION: {definition}

TASK:
Write the Short Story section for {concept['name']}.

REQUIRED STRUCTURE:
### Scenario
[3-5 sentences. The system before the concept is applied. Use a real-world system type.]

### The Problem
[1 paragraph. Concrete, specific failure or pain point. Include a metric if possible.]

### The Solution
[3-5 sentences. How the concept directly fixes the problem.]

### What Changed
[2-3 sentences. Measurable or observable outcome after the fix.]

REQUIREMENTS:
- Under 200 words total
- Plain language — no unexplained jargon
- Problem must be concrete ("response times increased 400%" not "the system was slow")
- Solution must clearly and directly apply the concept
- Pick one system type that fits this concept naturally (Netflix/Uber/bank/hospital/SaaS/logistics)

CONSTRAINTS:
- Do not repeat the definition at length — one brief mention is enough
- No fabricated company names — use system types ("a major streaming service")
"""
    return system, user


# ── Agent 5: Enterprise Architect ────────────────────────────────────────────

def enterprise_prompt(concept: dict, definition: str) -> tuple[str, str]:
    glossary = _read(ENTERPRISE_GLOSSARY)
    system = GLOBAL_SYSTEM
    user = f"""[MODE: STRUCTURED]
[AGENT: Enterprise Architect]

CONCEPT: {concept['name']}
CATEGORY: {concept['category']}
DEFINITION: {definition}
INDUSTRY: auto-select best fit

ENTERPRISE GLOSSARY:
{glossary}

TASK:
Write the Enterprise Use Case section for {concept['name']}.

REQUIRED STRUCTURE:
### Company Type
[Industry]

### Context
[Scale: ~users, ~request volume, team size, regulatory environment if relevant]

### How It's Used
[Numbered list, 4-6 steps. Specific deployment pattern, tools, configuration choices.]

### Business Impact
[Before vs after. Quantified or order-of-magnitude metrics.]

### Lessons
[2-3 hard-won lessons. Specific to this concept — not generic advice.]

REQUIREMENTS:
- 200-300 words total
- Scale must be mentioned (millions of users, thousands req/sec)
- If category has compliance context (Security→PCI-DSS/HIPAA, Data→GDPR), include it
- Lessons must be specific — not "monitor your system"

CONSTRAINTS:
- No fabricated company names
- No toy examples — production-realistic scale
"""
    return system, user


# ── Agent 6: UI/UX Template ───────────────────────────────────────────────────

def ui_prompt(concept: dict) -> tuple[str, str]:
    ui_types = """Available UI template types:
1. Concept Card
2. Architecture Flow Diagram
3. Interactive Request Journey
4. Failure Simulation
5. Scaling Simulator
6. Before/After Comparison
7. Trade-Off Comparison Table
8. Event Flow Visualizer
9. Queue Processing Visualizer
10. Database Sharding Visualizer
11. Cache Hit/Miss Simulator
12. Interview Practice Card
13. Enterprise Case Study Page"""

    system = GLOBAL_SYSTEM
    user = f"""[MODE: STRUCTURED]
[AGENT: UI/UX Template]

CONCEPT: {concept['name']}
CATEGORY: {concept['category']}

{ui_types}

TASK:
Select the most appropriate UI template type for {concept['name']} and write the UI Template Idea section.

REQUIRED STRUCTURE:
### Template Type
[Name from list above]

### Screen Description
[What the user sees. Layout, components, data displayed. 3-5 sentences.]

### User Interactions
[Bulleted list. 3-5 specific interactions.]

### Learning Outcome
[One sentence. What specific understanding does the user gain?]

CONSTRAINTS:
- No code. No HTML. No CSS. Specification language only.
- Screen description must be implementable (not "it's visual and interactive")
- At least one interaction should simulate a failure or edge case
- 100-150 words total
"""
    return system, user


# ── Agent 7: Diagram Agent ────────────────────────────────────────────────────

def diagram_prompt(concept: dict, components: str) -> tuple[str, str]:
    system = GLOBAL_SYSTEM
    user = f"""[MODE: STRUCTURED]
[AGENT: Diagram]

CONCEPT: {concept['name']}
KEY COMPONENTS: {components}

TASK:
Write three diagram descriptions for {concept['name']}.

REQUIRED OUTPUT:

### Component Diagram
[ASCII art showing the architecture. Label every box and arrow.
Format: [Component Name] --arrow label--> [Component Name]]

### Sequence Diagram
[Mermaid sequenceDiagram syntax. Show one success path and one failure path.
Label every message.]

### Failure Diagram
[Show what breaks when this concept fails. Mark failed paths ❌.
Show what fallback activates. Show recovery path.]

REQUIREMENTS:
- All three diagrams use consistent component names
- Every arrow labeled with what flows (data, request, event, ACK, error)
- Failure diagram shows at least one fallback path

CONSTRAINTS:
- Text only — no image generation
- Mermaid syntax for sequence diagrams
- ASCII boxes only for component/failure diagrams
"""
    return system, user


# ── Agent 8: Tutorial Agent ───────────────────────────────────────────────────

def tutorial_prompt(concept: dict, level_sections: dict[str, str]) -> tuple[str, str]:
    """level_sections: dict of level → section text, e.g. {'Beginner': '...', 'Advanced': '...'}"""
    sections_text = "\n\n---\n\n".join(
        f"LEVEL: {lvl}\n{text}" for lvl, text in level_sections.items()
    )
    system = GLOBAL_SYSTEM
    user = f"""[MODE: TEACHING]
[AGENT: Tutorial]

CONCEPT: {concept['name']}
LEVELS: {', '.join(level_sections.keys())}

CONCEPT SECTIONS:
{sections_text}

TASK:
For EACH level provided, convert the explanation into a step-by-step tutorial.
Each step is one thing the learner does or understands.

OUTPUT FORMAT:
For each level:
## [Level] Tutorial Steps
1. [step]
2. [step]
...

REQUIREMENTS:
- 5-8 steps per level
- Use action verbs: "Understand that...", "Identify...", "Notice...", "Draw...", "Compare...", "Evaluate..."
- Progress logically — each step builds on the previous
- Final step: what the learner can now explain or demonstrate
- Beginner steps: no unexplained jargon
- Advanced/Expert steps: focus on trade-off analysis and design decisions

CONSTRAINTS:
- 5-8 steps per level only
- No prose paragraphs — numbered lists only
- Do not add content not in the source text
"""
    return system, user


# ── Agent 9: Interview Prep ───────────────────────────────────────────────────

def interview_prompt(concept: dict, definition: str, tradeoffs: str) -> tuple[str, str]:
    system = GLOBAL_SYSTEM
    user = f"""[MODE: INTERVIEW]
[AGENT: Interview Prep]

CONCEPT: {concept['name']}
DEFINITION: {definition}
CORE TRADE-OFFS: {tradeoffs}

TASK:
Write the Interview Talking Points section for {concept['name']}.

REQUIRED STRUCTURE:
### One-Line Answer
[Exactly one sentence. Under 20 words. The verbal definition.]

### Structured Answer (2 minutes)
[Use this template EXACTLY:
"{concept['name']} is [definition]. It solves [problem] by [mechanism]. For example, [system type] uses it to [outcome]. The main trade-off is [A] vs [B]."]
[Under 150 words. Must work when spoken aloud.]

### Follow-Up Questions to Expect
- [Real interview question 1]
- [Real interview question 2]
- [Real interview question 3]

### Common Interview Mistakes
- [Specific mistake 1 — what people say wrong or omit, with what to say instead]
- [Specific mistake 2 — what people say wrong or omit, with what to say instead]

REQUIREMENTS:
- One-line answer is genuinely one line (not one paragraph)
- Follow-up questions must be real senior engineer questions
- Mistakes must be specific — not "don't be vague"

CONSTRAINTS:
- 150 words max for structured answer
- Do not load the full concept file
"""
    return system, user


# ── Agent 10: Documentation Agent ────────────────────────────────────────────

def documentation_prompt(concept: dict, sections: dict[str, str]) -> tuple[str, str]:
    """sections: {section_name: content} — all 7 parallel agent outputs + core sections."""
    template = _read(CONCEPT_TEMPLATE)
    naming = _read(NAMING_CONVENTIONS)

    sections_block = "\n\n---SECTION: ".join(
        f"{name}\n{content}" for name, content in sections.items()
    )

    system = GLOBAL_SYSTEM
    user = f"""[MODE: STRUCTURED]
[AGENT: Documentation]

CONCEPT: {concept['name']}
SLUG: {concept['slug']}

CONCEPT TEMPLATE (for ordering reference):
{template}

NAMING CONVENTIONS:
{naming}

SECTIONS TO ASSEMBLE:
---SECTION: {sections_block}

TASK:
Assemble all provided sections into the final concept document.
Follow CONCEPT_TEMPLATE.md section ORDER exactly.

RULES:
- Do not rewrite content
- Do not add new content
- Fix formatting only (consistent headers, table alignment)
- Add the YAML frontmatter metadata header at the top
- Ensure all sections present in the template exist in output (flag any missing)

OUTPUT:
Complete final {concept['slug']}.md content — start with YAML frontmatter, end with the Agent Execution Prompt section.
"""
    return system, user


# ── Agent 11: Reviewer ────────────────────────────────────────────────────────

def reviewer_prompt(concept: dict, concept_file_content: str) -> tuple[str, str]:
    checklist = _read(REVIEW_CHECKLIST)
    system = "You are a strict technical content reviewer. Report only. Do not rewrite. Do not praise."
    user = f"""[MODE: REVIEW]
[AGENT: Reviewer]

CONCEPT FILE:
{concept_file_content}

CHECKLIST:
{checklist}

TASK:
Review this concept document against all checklist items.
Report PASS or FAIL for every item.

OUTPUT FORMAT:

## Review Report: {concept['name']}

**Overall Verdict**: [PUBLISH-READY | NEEDS-REVISION | BLOCKED]

**Summary**: N items passed. Critical: X | Major: Y | Minor: Z

| # | Item | Status | Note |
|---|---|---|---|
[one row per checklist item]

**Must Fix Before Publish** (Critical + Major FAILs only):
1. [item # — section reference — specific fix needed]

REQUIREMENTS:
- Every checklist item must have a status
- FAIL items: section reference + specific problem + what to fix
- Do not suggest rewrites — flag only
- Severity: Critical = blocks publish | Major = must fix | Minor = polish

CONSTRAINTS:
- Do not praise passing sections
- One line per FAIL
"""
    return system, user


# ── Agent 12: Token Optimizer ─────────────────────────────────────────────────

def optimizer_prompt(concept: dict, concept_file_content: str) -> tuple[str, str]:
    rules = _read(TOKEN_OPTIMIZATION)
    system = "You are a technical editor. Compress without information loss. Output full optimized file."
    user = f"""[MODE: REVIEW]
[AGENT: Token Optimizer]

CONCEPT FILE:
{concept_file_content}

OPTIMIZATION RULES:
{rules}

TASK:
Compress this concept document by 15-25% without removing any information.

REMOVE:
- Filler phrases: "It's important to note that...", "In today's world...", "Essentially...", "As mentioned above..."
- Redundant sentences repeating a point already made in the same section
- Verbose transitions that add no meaning

PRESERVE (do not touch):
- All definitions
- All examples (real-world system names and scenarios)
- All trade-off tables (every row, every cell)
- All checklist items
- All numbered steps in flows
- All interview answers
- All template structure (headers, section names)
- All numbers and order-of-magnitude estimates

OUTPUT:
- Word count line at top: "Word count: [before] → [after] ([X]% reduction)"
- Full optimized file (complete, not a diff)

CONSTRAINTS:
- Do not change section structure
- Do not delete mandatory template sections
- Target 15-25% reduction — do not over-compress
- If 15% not achievable without information loss, report actual reduction
"""
    return system, user
