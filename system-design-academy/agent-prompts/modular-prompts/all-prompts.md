# Modular Prompt Library

10 reusable low-token prompts. Each is independent, copy-paste ready, and designed for a single specific task. Replace values in [brackets].

---

## Prompt 1 — Generate One Concept

**Use**: Concept Generator Agent. Generate one full level section for one concept.

```
[MODE: STRUCTURED]
[AGENT: Concept Generator]

CONCEPT: [concept name]
CATEGORY: [Networking | Data | Security | Messaging | Reliability | Architecture | Operations]
LEVEL: [Beginner | Intermediate | Advanced | Expert]

CONTEXT LOADED:
- CONCEPT_TEMPLATE.md
- shared-context/terminology.md

TASK:
Generate the [LEVEL] section of the concept document for [concept name].
Follow CONCEPT_TEMPLATE.md section structure for the [LEVEL] level exactly.

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
```

---

## Prompt 2 — Generate One Short Story

**Use**: Story Writing Agent. Generate the story section for one concept.

```
[MODE: STRUCTURED]
[AGENT: Story Writer]

CONCEPT: [concept name]
DEFINITION: [one-line definition of the concept]
SYSTEM TYPE: [Netflix | Uber | Amazon | Bank | Hospital | SaaS startup | Logistics company | E-commerce]

TASK:
Write the Short Story section for [concept name] using the structure below.

REQUIRED STRUCTURE:
### Scenario
[3-5 sentences. The system before the concept is applied. Set the scene.]

### The Problem
[1 paragraph. Concrete, specific failure or pain point.]

### The Solution
[3-5 sentences. How the concept directly fixes the problem.]

### What Changed
[2-3 sentences. Measurable or observable outcome after the fix.]

REQUIREMENTS:
- Under 200 words total
- Plain language — no unexplained jargon
- Problem must be concrete, not abstract ("response times increased 400%" not "the system was slow")
- Solution must clearly and directly apply the concept
- Use the specified system type as the setting

CONSTRAINTS:
- Do not load other concept files
- Do not repeat the definition at length — one brief mention is enough
- No fabricated company names — use system types (e.g., "a major streaming service" or "Netflix-scale")
```

---

## Prompt 3 — Generate One UI Template

**Use**: UI/UX Template Agent. Generate the UI Template Idea section for one concept.

```
[MODE: STRUCTURED]
[AGENT: UI/UX Template]

CONCEPT: [concept name]
CATEGORY: [category]

AVAILABLE TEMPLATE TYPES:
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
13. Enterprise Case Study Page

TASK:
Select the most appropriate UI template type for [concept name] and write the UI Template Idea section.

REQUIRED STRUCTURE:
### Template Type
[Name from list above]

### Screen Description
[What the user sees. Layout, components, data displayed. 3-5 sentences.]

### User Interactions
[Bulleted list. 3-5 specific interactions the user can perform.]

### Learning Outcome
[One sentence. What specific understanding does the user gain?]

CONSTRAINTS:
- No code. No HTML. No CSS. Specification language only.
- Screen description must be implementable (not "it's visual and interactive")
- At least one interaction should simulate a failure or edge case
- 100-150 words total
```

---

## Prompt 4 — Generate Beginner Tutorial Steps

**Use**: Tutorial Agent. Generate step-by-step tutorial for Beginner level.

```
[MODE: TEACHING]
[AGENT: Tutorial]

CONCEPT: [concept name]
LEVEL: Beginner

BEGINNER SECTION TEXT:
[paste the Beginner Explanation section from the concept file here]

TASK:
Convert the Beginner Explanation into a step-by-step tutorial.
Each step is one thing the learner does or understands.

OUTPUT FORMAT:
Numbered list. 5-8 steps. Each step one sentence.

REQUIREMENTS:
- Use action verbs: "Understand that...", "Identify...", "Notice...", "Draw..."
- Progress logically — each step builds on the previous
- No step should repeat another
- Final step: what the learner can now explain or do
- No unexplained jargon

EXAMPLE FORMAT:
1. Understand that a [concept] exists to solve [specific problem].
2. Notice that without a [concept], [specific failure] occurs.
3. Identify the three main components: [A], [B], [C].
4. See how [A] connects to [B] in the basic diagram.
5. Draw a simple diagram showing [A] → [B] → [C].
6. Explain the concept in one sentence to someone who has never heard of it.

CONSTRAINTS:
- 5-8 steps only
- No prose paragraphs — numbered list only
- Do not add content not in the source text
```

---

## Prompt 5 — Generate Advanced Tutorial Steps

**Use**: Tutorial Agent. Generate step-by-step tutorial for Advanced level.

```
[MODE: STRUCTURED]
[AGENT: Tutorial]

CONCEPT: [concept name]
LEVEL: Advanced

ADVANCED SECTION TEXT:
[paste the Advanced Explanation section from the concept file here]

TASK:
Convert the Advanced Explanation into a step-by-step tutorial focused on decision-making.

OUTPUT FORMAT:
Numbered list. 6-8 steps. Each step one sentence.

REQUIREMENTS:
- Steps should guide the learner through trade-off analysis and design decisions
- Include steps for: reading the trade-off table, selecting the right approach for a given scenario, identifying failure modes, knowing when not to use the concept
- Frame steps as choices or analyses: "Compare...", "Select...", "Evaluate...", "Identify..."
- Final step: "Defend your architectural choice in a design review."

CONSTRAINTS:
- 6-8 steps only
- Do not duplicate trade-off table content — reference it, don't restate it
- Steps must be actionable decisions, not passive reading
```

---

## Prompt 6 — Generate Enterprise Use Case

**Use**: Enterprise Architect Agent. Generate the enterprise use case section for one concept.

```
[MODE: STRUCTURED]
[AGENT: Enterprise Architect]

CONCEPT: [concept name]
DEFINITION: [one-line definition]
INDUSTRY: [fintech | healthcare | e-commerce | logistics | SaaS — or "auto-select best fit"]

TASK:
Write the Enterprise Use Case section for [concept name].

REQUIRED STRUCTURE:
### Company Type
[Industry]

### Context
[Scale: ~users, ~request volume, team size order-of-magnitude, regulatory environment if relevant]

### How It's Used
[Numbered list, 4-6 steps. Specific deployment pattern, tools, configuration choices.]

### Business Impact
[Before vs after. Quantified or order-of-magnitude metrics. Revenue, cost, reliability, or compliance outcome.]

### Lessons
[2-3 hard-won lessons from operating this concept at enterprise scale. Specific, not generic.]

REQUIREMENTS:
- 200-300 words total
- Scale must be mentioned (millions of users, thousands of requests/sec, etc.)
- Business impact must be concrete
- Lessons must be specific to this concept — not generic "monitor your system" advice
- If industry has compliance context (fintech → PCI-DSS, healthcare → HIPAA), include it

CONSTRAINTS:
- Do not load other concept files
- No fabricated company names — use industry types
- No toy examples — production-realistic scale and complexity
```

---

## Prompt 7 — Generate Interview Notes

**Use**: Interview Prep Agent. Generate the full Interview Talking Points section.

```
[MODE: INTERVIEW]
[AGENT: Interview Prep]

CONCEPT: [concept name]
DEFINITION: [one-line definition]
CORE TRADE-OFFS: [2-3 key trade-offs, comma separated]

TASK:
Write the Interview Talking Points section for [concept name].

REQUIRED STRUCTURE:
### One-Line Answer
[Exactly one sentence. The verbal definition. Under 20 words.]

### Structured Answer (2 minutes)
[Using this template exactly:
"[Concept] is [definition]. It solves [problem] by [mechanism]. For example, [system type] uses it to [outcome]. The main trade-off is [A] vs [B]."]
[Under 150 words. Must work when spoken aloud.]

### Follow-Up Questions to Expect
- [Real interview question 1]
- [Real interview question 2]
- [Real interview question 3]

### Common Interview Mistakes
- [Specific mistake 1 — what people say wrong or omit]
- [Specific mistake 2 — what people say wrong or omit]

REQUIREMENTS:
- One-line answer is genuinely one line (not one paragraph)
- Structured answer uses the template exactly — do not rephrase the template structure
- Follow-up questions must be real questions a senior engineer would ask
- Mistakes must be specific (not "don't be vague" — that's useless feedback)

CONSTRAINTS:
- 150 words max for the structured answer
- Do not load the full concept file — work only from definition and trade-offs provided
```

---

## Prompt 8 — Generate Diagram Description

**Use**: Diagram Agent. Generate all three diagram descriptions for one concept.

```
[MODE: STRUCTURED]
[AGENT: Diagram]

CONCEPT: [concept name]
KEY COMPONENTS: [comma-separated list of main components in this concept]

TASK:
Write three diagram descriptions for [concept name].

REQUIRED OUTPUT:

### Component Diagram
[ASCII art or text boxes showing the architecture. Label every box and arrow.
Format: [Component Name] → arrow label → [Component Name]]

### Sequence Diagram
[Numbered steps showing message flow between components. Mermaid-style or plain numbered list.
Format: ComponentA → ComponentB: message label]

### Failure Diagram
[Show what breaks when this concept fails or is removed. Which paths fail (❌). What fallback activates. Recovery path.]

REQUIREMENTS:
- All three diagrams use consistent component names
- Every arrow labeled with what flows (data, request, event, ACK, etc.)
- Failure diagram shows at least one fallback path or recovery step
- ASCII art diagrams use simple box notation: [Box Name]
- Sequence diagrams show at least one success path and one failure path

CONSTRAINTS:
- Text only — no image generation
- Mermaid syntax preferred for sequence diagrams
- Component diagram uses ASCII boxes only
```

---

## Prompt 9 — Review One Concept

**Use**: Reviewer Agent. Validate a completed concept document against the review checklist.

```
[MODE: REVIEW]
[AGENT: Reviewer]

CONCEPT FILE:
[paste full concept .md file here]

CHECKLIST: REVIEW_CHECKLIST.md (loaded)

TASK:
Review this concept document against all 50 checklist items.
Report PASS or FAIL for every item.

OUTPUT FORMAT:

## Review Report: [Concept Name]

**Overall Verdict**: [PUBLISH-READY | NEEDS-REVISION | BLOCKED]

**Summary**: N/50 items passed. Critical: X | Major: Y | Minor: Z

| # | Item | Status | Note |
|---|---|---|---|
[one row per checklist item]

**Must Fix Before Publish** (Critical + Major FAILs only):
1. [item # — specific fix needed with line/section reference]

REQUIREMENTS:
- Every checklist item must have a status (no skipping)
- FAIL items must include: section reference, specific problem, what to fix
- Do not rewrite any content — report only
- Severity: Critical = blocks publish | Major = must fix before phase complete | Minor = polish pass

CONSTRAINTS:
- Do not suggest rewrites
- Do not praise passing sections
- Report exactly what's wrong and where — one line per FAIL
```

---

## Prompt 10 — Compress and Optimize One Concept

**Use**: Token Optimization Agent. Compress a reviewed, passing concept document.

```
[MODE: REVIEW]
[AGENT: Token Optimizer]

CONCEPT FILE:
[paste full reviewed concept .md file here]

OPTIMIZATION RULES: TOKEN_OPTIMIZATION.md (loaded)

TASK:
Compress this concept document by 15-25% without removing any information.

WHAT TO REMOVE:
- Filler phrases: "It's important to note that...", "In today's world...", "Essentially...", "As mentioned above..."
- Redundant sentences that repeat a point already made in the same section
- Over-explained obvious points in Advanced/Expert (if stated clearly once, don't restate)
- Verbose transitions that add no meaning ("With that in mind, let's now look at...")

WHAT TO PRESERVE (do not touch):
- All definitions
- All examples (real-world system names and scenarios)
- All trade-off tables (every row, every cell)
- All checklist items
- All numbered steps in flows
- All interview answers
- All template structure (headers, section names)
- All numbers and order-of-magnitude estimates

OUTPUT:
- Full optimized file (complete, not a diff)
- Word count line at top: "Word count: [before] → [after] ([X]% reduction)"

CONSTRAINTS:
- Do not change section structure
- Do not delete any mandatory template sections
- Target 15-25% reduction — do not over-compress
- If 15% reduction is not achievable without information loss, note that and report actual reduction
```
