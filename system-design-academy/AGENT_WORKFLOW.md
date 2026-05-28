# Agent Workflow

12-agent architecture for generating the full system design academy. Each agent is independent. No agent loads the full project.

---

## Agent Architecture Overview

```
Planner Agent
      |
      ├── Concept Research Agent
      |         |
      |         └── Concept Generator Agent
      |                   |
      |         ┌─────────┴──────────┐
      |         |                    |
      |   Story Writing Agent   Tutorial Agent
      |         |                    |
      |   Enterprise Architect Agent  |
      |         |                    |
      |   UI/UX Template Agent        |
      |         |                    |
      |   Diagram Agent               |
      |         |                    |
      |   Interview Prep Agent        |
      |         |                    |
      |   Documentation Agent ←───────┘
      |         |
      |   Reviewer Agent
      |         |
      |   Token Optimization Agent
      |         |
      |   [Published Concept]
```

---

## Agent 1 — Planner Agent

**Responsibility**: Breaks the full concept list into execution batches. Assigns priority. Defines agent execution order per concept. Creates a task manifest.

**Input Needed**:
- Concept list (44 concepts)
- Phase roadmap from `ROADMAP.md`
- Category groupings from `shared-context/terminology.md`

**Output Expected**:
- `agent-prompts/execution-manifest.md` — ordered list of concepts with assigned agents and dependencies
- Batch groupings (e.g., "Phase 2 Beginner: client-server, APIs, REST, GraphQL, gRPC — 5 concepts")
- Priority flag per concept (Foundation | Core | Advanced | Expert)

**Prompt Template**:
```
AGENT: Planner
TASK: Create execution manifest for Phase [N] concepts.
INPUT: Concept list, ROADMAP.md phase definition
OUTPUT: Ordered task list with concept name, phase, priority, agent assignment, dependencies
FORMAT: Markdown table
CONSTRAINTS: One concept per row. No concept descriptions. Planning only.
```

**Token-Saving Rules**:
- Do not load concept files — only the concept names list
- Do not generate content — only plan
- Output is a table, not prose

**Dependencies**: None — runs first

**Quality Checks**:
- All 44 concepts assigned
- No concept appears in two phases
- Dependencies are directional (no cycles)

---

## Agent 2 — Concept Research Agent

**Responsibility**: For a given concept, researches and summarizes the key facts needed before generation. Acts as a pre-processing step for complex concepts.

**Input Needed**:
- Concept name
- Category
- `shared-context/terminology.md`

**Output Expected**:
- Research brief (200-300 words): definition, key variants, notable real-world uses, common trade-offs, interview angles
- Stored in `agent-prompts/research-briefs/[concept-name]-brief.md`

**Prompt Template**:
```
AGENT: Concept Research
CONCEPT: [name]
CATEGORY: [category]
TASK: Write a research brief for this concept. 200-300 words.
INCLUDE: definition, 2-3 variants or configurations, 2-3 real-world systems that use it, core trade-off, common interview angles
OUTPUT: Markdown. No headers. Plain paragraphs.
CONSTRAINTS: Do not generate full concept document. Brief only.
```

**Token-Saving Rules**:
- Load only `terminology.md` from shared-context
- Do not load the full CONCEPT_TEMPLATE.md — brief format only
- Skip for simple concepts (e.g., "What is a database?" — skip research step)

**Dependencies**: Planner Agent output

**Quality Checks**:
- Brief covers definition, variants, real-world, and trade-off
- Under 300 words
- No fabricated company names or statistics

---

## Agent 3 — Concept Generator Agent

**Responsibility**: Generates the full concept document for one concept at one level, following the standard template.

**Input Needed**:
- Concept name
- Target level (Beginner | Intermediate | Advanced | Expert | All)
- `CONCEPT_TEMPLATE.md`
- `shared-context/terminology.md`
- Research brief from Agent 2 (if exists)

**Output Expected**:
- Full concept `.md` file written to `concepts/[concept-name].md`
- Follows CONCEPT_TEMPLATE.md exactly
- All mandatory fields filled

**Prompt Template**:
```
AGENT: Concept Generator
CONCEPT: [name]
LEVEL: [target level]
TEMPLATE: CONCEPT_TEMPLATE.md (loaded)
CONTEXT: terminology.md (loaded)
RESEARCH: [brief if available]
TASK: Generate the [LEVEL] section of the concept document.
OUTPUT: Markdown following CONCEPT_TEMPLATE.md structure exactly.
CONSTRAINTS:
- Do not invent statistics
- Do not merge levels
- Use plain language for Beginner, technical precision for Advanced/Expert
- 200-500 words per section
```

**Token-Saving Rules**:
- Generate one level at a time unless "All" is specified
- Load only the required template sections for the target level
- Do not regenerate sections that already exist in the concept file

**Dependencies**: Concept Research Agent, CONCEPT_TEMPLATE.md

**Quality Checks**:
- All mandatory template sections present
- Word count within range per level
- No jargon in Beginner without definition
- Trade-off table present in Advanced/Expert

---

## Agent 4 — Story Writing Agent

**Responsibility**: Writes the short story section for one concept.

**Input Needed**:
- Concept name
- Concept one-line definition (from concept file or provided inline)
- Story format specification from CONCEPT_TEMPLATE.md

**Output Expected**:
- Story section (Scenario, Problem, Solution, What Changed)
- 150-200 words total
- Uses a named real-world system type (Netflix, Uber, bank, etc.)

**Prompt Template**:
```
AGENT: Story Writer
CONCEPT: [name]
DEFINITION: [one-line definition]
TASK: Write a short story for this concept using the story format.
FORMAT:
  ### Scenario: [3-5 sentences, real system, before the concept]
  ### The Problem: [1 paragraph, concrete pain point]
  ### The Solution: [3-5 sentences, how concept fixes it]
  ### What Changed: [2-3 sentences, outcome]
SYSTEM TYPE: [Netflix | Uber | Bank | Hospital | SaaS | E-commerce | Logistics — pick one that fits]
CONSTRAINTS: 150-200 words total. No jargon. Simple language. Real-world grounding.
```

**Token-Saving Rules**:
- Load only concept name + definition (not full concept file)
- Do not load other stories for reference — follow format spec
- Story is independent of all other content

**Dependencies**: Concept Generator Agent (for definition)

**Quality Checks**:
- Uses a recognizable system type
- Concrete problem described (not abstract)
- Solution clearly applies the concept
- Under 200 words

---

## Agent 5 — Enterprise Architect Agent

**Responsibility**: Writes the enterprise use case section for one concept.

**Input Needed**:
- Concept name
- Concept one-line definition
- Industry type (optional — agent selects if not provided)
- Expert level context if available

**Output Expected**:
- Enterprise use case section (Context, How It's Used, Business Impact, Lessons)
- 200-300 words
- Grounded in enterprise production reality

**Prompt Template**:
```
AGENT: Enterprise Architect
CONCEPT: [name]
INDUSTRY: [fintech | healthcare | e-commerce | logistics | SaaS — or "auto-select"]
TASK: Write enterprise use case section.
FORMAT: Context, How It's Used, Business Impact (quantified where possible), Lessons (2-3 points)
CONSTRAINTS: 200-300 words. Production-realistic. No toy examples. Reference scale (users, requests, data volume) with order-of-magnitude estimates.
```

**Token-Saving Rules**:
- Load only concept name and definition
- Do not load intermediate or beginner sections
- Enterprise section is self-contained

**Dependencies**: Concept Generator Agent

**Quality Checks**:
- Scale mentioned (users or request volume, even approximate)
- Compliance or regulatory reference if relevant to industry
- Lessons are specific, not generic

---

## Agent 6 — UI/UX Template Agent

**Responsibility**: Writes the UI template specification for one concept.

**Input Needed**:
- Concept name
- Concept category
- Available UI template types from `UI_TEMPLATE_SYSTEM.md`

**Output Expected**:
- UI Template Idea section (Template Type, Screen Description, User Interactions, Learning Outcome)
- Written for a future UI developer, not a user
- Clear, specific screen description

**Prompt Template**:
```
AGENT: UI/UX Template
CONCEPT: [name]
CATEGORY: [category]
AVAILABLE TEMPLATES: [list from UI_TEMPLATE_SYSTEM.md]
TASK: Select the best UI template type for this concept and write the specification.
FORMAT: Template Type, Screen Description, User Interactions (list), Learning Outcome
CONSTRAINTS: Describe, do not implement. No code. No CSS. No HTML. UI spec only. 100-150 words.
```

**Token-Saving Rules**:
- Load only UI_TEMPLATE_SYSTEM.md template type list (not full specs)
- Do not load other UI specs
- Output is spec only, not implementation

**Dependencies**: Concept Generator Agent, UI_TEMPLATE_SYSTEM.md

**Quality Checks**:
- Template type matches concept complexity
- Screen description is implementable (not vague)
- At least 2 user interactions described
- Learning outcome is specific and measurable

---

## Agent 7 — Diagram Agent

**Responsibility**: Creates diagram descriptions for each concept.

**Input Needed**:
- Concept name
- Key components (from concept file or provided inline)
- Three diagram types needed: Component, Sequence, Failure

**Output Expected**:
- Three diagram descriptions (ASCII-style or Mermaid-compatible text)
- Clear box/arrow/label descriptions
- Saved in `diagrams/[concept-name]-diagrams.md`

**Prompt Template**:
```
AGENT: Diagram
CONCEPT: [name]
COMPONENTS: [list of key components in this concept]
TASK: Write three diagram descriptions.
1. Component Diagram: boxes and arrows showing the architecture
2. Sequence Diagram: numbered steps showing message flow
3. Failure Diagram: what happens when the concept fails or is removed
FORMAT: ASCII art or Mermaid markdown. Label every node and arrow.
CONSTRAINTS: Text only. No images. Mermaid syntax preferred for sequence diagrams.
```

**Token-Saving Rules**:
- Load only concept name and component list (not full concept)
- Diagrams are independent files — do not merge into concept files during generation
- Merge into concept file only during Documentation Agent pass

**Dependencies**: Concept Generator Agent

**Quality Checks**:
- All three diagram types present
- Every component labeled
- Failure diagram shows broken path and fallback

---

## Agent 8 — Tutorial Agent

**Responsibility**: Generates tutorial step sequences for each concept at each level.

**Input Needed**:
- Concept name
- Target level
- Concept explanation (from concept file, level section only)

**Output Expected**:
- Numbered tutorial steps for the level
- Each step is an action or insight, not just a description
- Stored in `tutorials/[concept-name]-[level].md`

**Prompt Template**:
```
AGENT: Tutorial
CONCEPT: [name]
LEVEL: [Beginner | Intermediate | Advanced | Expert]
CONCEPT TEXT: [paste the level section from concept file]
TASK: Convert this concept explanation into a step-by-step tutorial.
FORMAT: Numbered steps. Each step = one thing the learner does or understands.
CONSTRAINTS: 5-8 steps. Each step one sentence. Action verbs. No repetition of explanation prose.
```

**Token-Saving Rules**:
- Load only the relevant level section — not the full concept file
- Tutorial steps are short — output is compact
- One level per agent call

**Dependencies**: Concept Generator Agent

**Quality Checks**:
- 5-8 steps per level
- Each step is distinct
- Steps progress logically (not circular)
- Beginner steps use no unexplained jargon

---

## Agent 9 — Interview Prep Agent

**Responsibility**: Writes the interview talking points section for one concept.

**Input Needed**:
- Concept name
- One-line definition
- Core trade-offs (from Advanced section)

**Output Expected**:
- One-line answer
- Structured 2-minute answer
- 3 follow-up questions to expect
- 2 common interview mistakes

**Prompt Template**:
```
AGENT: Interview Prep
CONCEPT: [name]
DEFINITION: [one-line definition]
TRADE-OFFS: [2-3 key trade-offs]
TASK: Write interview talking points.
FORMAT: One-line answer, structured 2-min answer using template "[Concept] is [X]. It solves [Y] by [Z]. For example, [system] uses it to [outcome]. Main trade-off is [A] vs [B].", follow-up questions (3), common mistakes (2)
CONSTRAINTS: Concise. No fluff. Answers must fit verbal delivery.
```

**Token-Saving Rules**:
- Load only definition and trade-offs — not full concept
- Interview section is short — 150 words max output
- Do not load other concept interviews

**Dependencies**: Concept Generator Agent

**Quality Checks**:
- One-line answer is genuinely one line
- 2-minute answer follows the template format
- Follow-up questions are real interview questions
- Mistakes are specific, not generic ("don't be vague")

---

## Agent 10 — Documentation Agent

**Responsibility**: Assembles all generated sections into the final concept `.md` file in proper template order. Merges outputs from Agents 3-9.

**Input Needed**:
- Concept name
- All section files from Agents 3-9

**Output Expected**:
- Final `concepts/[concept-name].md` — complete, ordered, following CONCEPT_TEMPLATE.md

**Prompt Template**:
```
AGENT: Documentation
CONCEPT: [name]
SECTIONS: [list of section files to merge]
TEMPLATE: CONCEPT_TEMPLATE.md
TASK: Assemble sections into final concept document. Follow template order exactly.
CONSTRAINTS: Do not rewrite content. Do not add new content. Order only. Fix formatting only. Add metadata header.
```

**Token-Saving Rules**:
- Load only the section files (not other concept files)
- Output is assembly, not generation — low token cost
- Metadata header is templated — fill from manifest

**Dependencies**: All generation agents (3-9)

**Quality Checks**:
- All mandatory sections present
- Sections in template order
- Metadata header complete
- No duplicate content

---

## Agent 11 — Reviewer Agent

**Responsibility**: Reviews one completed concept document against the review checklist. Flags issues. Does not fix — reports only.

**Input Needed**:
- Completed concept `.md` file
- `REVIEW_CHECKLIST.md`

**Output Expected**:
- Review report: PASS / FAIL per checklist item
- Summary of issues with severity (Critical | Major | Minor)
- Stored in `review-checklists/reviews/[concept-name]-review.md`

**Prompt Template**:
```
AGENT: Reviewer
CONCEPT FILE: [paste concept file]
CHECKLIST: REVIEW_CHECKLIST.md (loaded)
TASK: Review concept document against checklist. Report pass/fail per item.
FORMAT: Table with item, status (PASS/FAIL), note (if FAIL)
OUTPUT: Review report + severity summary
CONSTRAINTS: Report only. Do not fix. Flag all FAIL items with specific line reference.
```

**Token-Saving Rules**:
- Load only the concept file and checklist — nothing else
- Output is a structured table — compact
- One concept per review call

**Dependencies**: Documentation Agent

**Quality Checks**:
- Every checklist item has a result
- FAIL items have specific, actionable notes
- No false positives on minor style issues

---

## Agent 12 — Token Optimization Agent

**Responsibility**: Compresses completed concept documents. Removes verbose phrasing. Preserves all technical content. Reduces word count by 15-25% without losing information.

**Input Needed**:
- Completed concept `.md` file (post-review)
- Token optimization rules from `TOKEN_OPTIMIZATION.md`

**Output Expected**:
- Optimized concept file (same path, overwrite)
- Word count reduction reported
- No information loss

**Prompt Template**:
```
AGENT: Token Optimizer
CONCEPT FILE: [paste concept file]
RULES: TOKEN_OPTIMIZATION.md (loaded)
TASK: Compress this concept document. Remove filler. Tighten sentences. Keep all facts, trade-offs, definitions, examples.
TARGET: 15-25% word count reduction
CONSTRAINTS: Do not remove: definitions, trade-offs, examples, code-style content, checklist items, interview answers. Only remove: filler phrases, redundant sentences, over-explained obvious points.
OUTPUT: Full optimized file.
```

**Token-Saving Rules**:
- Load only concept file and optimization rules
- Run after review passes — not before
- Do not optimize expert or advanced sections aggressively (depth is valuable)

**Dependencies**: Reviewer Agent (must PASS first)

**Quality Checks**:
- Word count reduced by at least 10%
- No facts removed
- No trade-offs removed
- Technical precision maintained

---

## Execution Order Per Concept

```
1. Planner Agent         → assigns concept to batch
2. Research Agent        → creates brief (skip for simple concepts)
3. Concept Generator     → generates level sections
4. Story Writer          → writes story section
5. Enterprise Architect  → writes enterprise section
6. UI/UX Template        → writes UI spec section
7. Diagram Agent         → writes diagram descriptions
8. Tutorial Agent        → writes tutorial steps (per level)
9. Interview Prep        → writes interview section
10. Documentation Agent  → assembles full concept file
11. Reviewer Agent       → validates against checklist
    ↓ if FAIL → back to Concept Generator (targeted fix)
    ↓ if PASS
12. Token Optimizer      → compresses final file
    → Concept Published
```

---

## Parallel Execution Rules

Agents 4-9 (Story, Enterprise, UI, Diagram, Tutorial, Interview) can run in parallel after Agent 3 produces the concept definition and level content. They are independent. They do not read each other's outputs.

Agent 10 (Documentation) waits for all of Agents 4-9. It assembles, not generates.

Agent 11 (Reviewer) and Agent 12 (Optimizer) run sequentially after Agent 10.

---

## Batch Sizing Recommendation

| Phase | Concepts per batch | Reason |
|---|---|---|
| Phase 1 (Foundation) | 1 | Establish template quality first |
| Phase 2-3 (Beginner/Intermediate) | 3-5 | Parallel generation safe |
| Phase 4-5 (Advanced/Expert) | 2-3 | More complex, needs closer review |
| Phase 6+ (Polish) | 5-10 | Token Optimizer runs on batches |
