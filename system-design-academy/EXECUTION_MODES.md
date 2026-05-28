# Execution Modes

Six distinct Claude execution modes. Each mode shapes output format, depth, and speed. Always specify mode in the agent prompt header.

---

## Mode 1 — Fast Mode

**Invoke With**: `[MODE: FAST]`

**Purpose**: Rapid first draft. Get something on the page quickly. Ideal for brainstorming or checking if a concept needs a research brief.

**Output Character**:
- Shorter sections than targets
- Informal prose allowed
- Trade-off tables can be plain text instead of Markdown tables
- Missing sections noted as "TODO: [section name]"
- No metadata header required

**Quality Level**: 60-70% of final quality. Needs a Structured pass after.

**When to Use**:
- First pass on a new concept
- Checking if the right analogy works before committing
- Generating a story draft to review the tone
- Batch drafting 5+ concepts quickly before polishing them

**Not Suitable For**:
- Final concept documents
- Expert-level sections (requires precision)
- Interview answers (must fit verbal delivery)
- Any enterprise use case intended for team consumption

**Token Cost**: Lowest. Fast Mode outputs are 30-40% shorter than Structured Mode.

**Example Invocation**:
```
[MODE: FAST]
CONCEPT: Rate Limiting
LEVEL: Beginner
TASK: Draft beginner section. Quick, capture the core idea.
```

---

## Mode 2 — Structured Mode

**Invoke With**: `[MODE: STRUCTURED]`

**Purpose**: Enterprise-ready, template-compliant output. Final generation quality. Suitable for Documentation Agent assembly.

**Output Character**:
- All CONCEPT_TEMPLATE.md sections present
- Correct word counts per section
- Tables properly formatted
- Metadata header included
- Every mandatory field filled
- Technical precision at full level

**Quality Level**: 100% — review-ready.

**When to Use**:
- All final concept generation
- Any content going into `concepts/` folder
- Content being reviewed by Reviewer Agent
- Content being exported for learner consumption

**Not Suitable For**:
- Brainstorming (too slow, too rigid)
- Testing whether an analogy works

**Token Cost**: Moderate to High. Highest quality output.

**Example Invocation**:
```
[MODE: STRUCTURED]
AGENT: Concept Generator
CONCEPT: Rate Limiting
LEVEL: Intermediate
TEMPLATE: CONCEPT_TEMPLATE.md (loaded)
CONTEXT: terminology.md (loaded)
TASK: Generate Intermediate section.
```

---

## Mode 3 — Deep Architecture Mode

**Invoke With**: `[MODE: DEEP]`

**Purpose**: Maximum technical depth on Advanced and Expert sections. Expands trade-offs, failure modes, distributed system nuance, and production considerations.

**Output Character**:
- Advanced section: up to 700 words (vs 500 in Structured)
- Expert section: up to 700 words
- Multiple failure scenarios (not just one)
- Expanded trade-off table (5+ rows)
- CAP theorem and distributed system implications explicitly addressed
- Production operations checklist expanded

**Quality Level**: 100% with extra depth. Takes longer to generate.

**When to Use**:
- CAP Theorem, CQRS, Saga Pattern, Distributed Tracing, Event Sourcing, Eventual Consistency
- Any concept where the Advanced/Expert sections are the primary value
- Generating content for senior engineer or architect audiences
- Concepts where "it depends" answers have many real distinct conditions

**Not Suitable For**:
- Beginner concepts (Client-Server, What is a Database, REST basics)
- Interview prep (interview answers need brevity, not depth expansion)
- Fast drafts

**Token Cost**: High. 40-60% more output than Structured Mode for Advanced/Expert sections.

**Example Invocation**:
```
[MODE: DEEP]
CONCEPT: CAP Theorem
LEVEL: Advanced
TASK: Generate Advanced section. Expand all trade-off scenarios. Include consistency model analysis.
```

---

## Mode 4 — Teaching Mode

**Invoke With**: `[MODE: TEACHING]`

**Purpose**: Maximum clarity and accessibility. Prioritizes Beginner and Intermediate sections. Emphasizes analogy, story, and sequential explanation.

**Output Character**:
- Beginner section: up to 400 words (vs 300 in Structured)
- Every technical term defined inline on first use
- Multiple analogies offered (pick the best, mention alternates briefly)
- Explanation written for someone with no CS background for Beginner
- Step-by-step flow for Intermediate
- Empathetic tone — acknowledges common confusion points

**Quality Level**: 100% with extra teaching depth.

**When to Use**:
- Content for beginner curriculum
- Onboarding documentation for non-technical stakeholders
- Concepts with historically confusing names (e.g., "Idempotency" — name itself is the barrier)
- Story section generation — maximum narrative clarity

**Not Suitable For**:
- Expert sections (depth is more important than accessibility there)
- Interview prep (too slow and narrative for verbal delivery)

**Token Cost**: Moderate to High for Beginner/Intermediate. Same as Structured for Advanced/Expert.

**Example Invocation**:
```
[MODE: TEACHING]
CONCEPT: Idempotency
LEVEL: Beginner
TASK: Generate Beginner section. Assume reader has never heard the word. Multiple analogies.
```

---

## Mode 5 — Interview Mode

**Invoke With**: `[MODE: INTERVIEW]`

**Purpose**: Generate only the Interview Talking Points section. Concise, verbal, structured. Nothing else.

**Output Character**:
- One-line answer (one line only)
- 2-minute structured answer using the standard template
- 3 follow-up questions (real questions from real interviews)
- 2 common mistakes
- No other sections
- No context-setting prose
- Starts with content, no preamble

**Quality Level**: 100%. Interview sections are short but high-density — every word must work.

**When to Use**:
- Batch generating interview sections for all 44 concepts
- Refreshing interview content independently of concept body
- Learner-facing interview prep mode in the UI

**Not Suitable For**:
- Learning the concept (goes straight to talking points without foundation)
- Expert architecture decisions

**Token Cost**: Lowest per section. Under 150 words output. Very efficient to batch.

**Example Invocation**:
```
[MODE: INTERVIEW]
CONCEPT: Message Queue
DEFINITION: A component that buffers messages between producers and consumers, decoupling them in time and throughput.
TRADE-OFFS: Decoupling vs complexity, async vs sync reliability, ordering vs throughput
TASK: Generate Interview Talking Points section.
```

---

## Mode 6 — Review Mode

**Invoke With**: `[MODE: REVIEW]`

**Purpose**: Quality validation pass. Read a completed concept document and check it against REVIEW_CHECKLIST.md. Report only — no fixes.

**Output Character**:
- Structured table: checklist item | PASS / FAIL | Note (if FAIL)
- Summary line: "N/N items passed. Severity breakdown: X Critical, Y Major, Z Minor."
- No rewrites
- No suggested fix text — only flags the problem and its location
- Starts with overall verdict: PUBLISH-READY / NEEDS-REVISION / BLOCKED

**Quality Level**: Review accuracy is the output — 100% required.

**When to Use**:
- After Documentation Agent assembles the final concept file
- Before Token Optimizer runs
- Any time a concept file is updated manually

**Not Suitable For**:
- Generating content
- Suggesting rewrites (that's the Concept Generator's job on a targeted re-run)

**Token Cost**: Moderate input (full concept file), low output (structured table).

**Example Invocation**:
```
[MODE: REVIEW]
CONCEPT FILE: [paste full concept file]
CHECKLIST: REVIEW_CHECKLIST.md (loaded)
TASK: Review concept document. Report pass/fail per checklist item. Severity: Critical/Major/Minor.
```

---

## Mode Selection Quick Reference

| Situation | Mode |
|---|---|
| First draft of a new concept | Fast |
| Final generation, any section | Structured |
| CAP Theorem, Saga, CQRS, Distributed systems | Deep |
| Beginner audience, complex term | Teaching |
| Generating interview content | Interview |
| Validating completed concept | Review |
| Unknown — default | Structured |
