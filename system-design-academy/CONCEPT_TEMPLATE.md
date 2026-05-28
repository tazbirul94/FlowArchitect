# Concept Template

Standard template every concept document must follow. All 44 concepts use this exact structure.

Agents: load this file + `shared-context/terminology.md` before generating any concept.

---

## Template Schema

```
concept-name:        [kebab-case identifier]
category:            [Networking/Data/Security/Messaging/Reliability/Architecture/Operations]
difficulty-range:    [Beginner | Beginner-Intermediate | All Levels]
related-concepts:    [comma-separated concept names]
last-updated:        [YYYY-MM-DD]
generated-by:        [agent name or "human"]
reviewed:            [true | false]
```

---

# [CONCEPT NAME]

## Metadata
- **Category**: [category]
- **One-Line Definition**: [One sentence. No jargon. Anyone can understand it.]
- **Simple Analogy**: [Everyday object or scenario — restaurant, post office, traffic, etc.]
- **Why It Matters**: [One paragraph. What problem does this solve? What breaks without it?]
- **Related Concepts**: [List 3-5 related concepts with links]

---

## Short Story

### Scenario
[Set up a product scenario. Use a recognizable company or system type: Netflix, Uber, Amazon, bank, hospital, SaaS startup. 3-5 sentences. Describe the situation BEFORE this concept is applied.]

### The Problem
[What specific pain point or failure did they hit? Be concrete. One paragraph.]

### The Solution
[How does this concept solve it? Walk through it simply. 3-5 sentences.]

### What Changed
[Outcome after applying the concept. What improved? What became possible? 2-3 sentences.]

---

## Enterprise Use Case

### Company Type
[Industry: fintech, e-commerce, healthcare, logistics, SaaS, etc.]

### Context
[Describe the enterprise system. Scale. Team size. Regulatory environment if relevant.]

### How It's Used
[Step-by-step: how does this concept appear in their production system? What components use it?]

### Business Impact
[Revenue, cost, reliability, compliance, or speed outcome. Be specific with order-of-magnitude estimates where possible.]

### Lessons
[2-3 hard-won lessons from operating this concept at enterprise scale.]

---

## UI Template Idea

### Template Type
[Which UI template from UI_TEMPLATE_SYSTEM.md applies? e.g., Architecture Flow Diagram, Scaling Simulator, Cache Hit/Miss Simulator]

### Screen Description
[Describe what the user sees. Layout. Key interactive elements. Data shown.]

### User Interactions
[What can the user do? Click, adjust, simulate, compare? List interactions.]

### Learning Outcome
[What does the user understand after interacting with this UI?]

---

## Tutorial Path

### Beginner Explanation
[Plain language. No jargon without definition. Use the analogy. Explain what it is, why it exists, and what it does. 200-300 words max.]

**Key Terms**:
- Term 1: [plain definition]
- Term 2: [plain definition]
- Term 3: [plain definition]

**Diagram Idea**: [Describe a simple ASCII or box diagram showing the concept at its simplest]

---

### Intermediate Explanation
[Real workflow. Name the components. Walk through a request or data flow step by step. Introduce 1-2 failure scenarios. 300-400 words.]

**Request Flow**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
...

**Common Configurations**:
- Config A: [description]
- Config B: [description]

**Failure Scenario**: [What goes wrong? What happens to the system?]

---

### Advanced Explanation
[Scale. Reliability. Trade-offs. Performance. Failure modes. When NOT to use. 400-500 words.]

**Trade-Off Table**:

| Approach | Pros | Cons | Best For |
|---|---|---|---|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |
| Option C | ... | ... | ... |

**Scale Considerations**:
- At 1K req/sec: [behavior]
- At 100K req/sec: [behavior]
- At 1M req/sec: [behavior]

**When NOT to Use**:
- [Scenario 1]
- [Scenario 2]

**Performance Notes**: [Latency impact, throughput ceiling, resource cost]

---

### Expert Explanation
[Enterprise context. Compliance. Security. Cost. Multi-region. Governance. 400-500 words.]

**Enterprise Considerations**:
- Multi-region: [notes]
- Compliance: [GDPR/HIPAA/SOC2 notes if relevant]
- Security posture: [threat model notes]
- Cost model: [infrastructure + operational cost]
- Team ownership: [who owns this? how do teams coordinate?]

**Migration Path**: [How to adopt this concept in an existing system without full rewrite]

**Vendor Evaluation**:
| Option | Build | Buy (SaaS) | Managed (Cloud) |
|---|---|---|---|
| Cost | ... | ... | ... |
| Control | ... | ... | ... |
| Ops overhead | ... | ... | ... |

**Production Operations Checklist**:
- [ ] Monitoring configured
- [ ] Alerting thresholds set
- [ ] Runbook written
- [ ] Failover tested
- [ ] Capacity plan documented

---

## Common Mistakes

1. **[Mistake name]**: [What developers do wrong. Why. What to do instead.]
2. **[Mistake name]**: [What developers do wrong. Why. What to do instead.]
3. **[Mistake name]**: [What developers do wrong. Why. What to do instead.]

---

## Interview Talking Points

### One-Line Answer
[If asked "What is [concept]?" — one sentence answer for verbal delivery.]

### Structured Answer (2 minutes)
[1. Define it. 2. Explain why it matters. 3. Give one real-world example. 4. State one key trade-off.]

**Template**:
> "[Concept] is [definition]. It solves [problem] by [mechanism]. For example, [company/system] uses it to [outcome]. The main trade-off is [trade-off A] vs [trade-off B]."

### Follow-Up Questions to Expect
- [Question 1]
- [Question 2]
- [Question 3]

### Common Interview Mistakes
- [Mistake 1 — what people say wrong]
- [Mistake 2 — what people omit]

---

## Trade-Offs Summary

| Dimension | Benefit | Cost |
|---|---|---|
| Performance | ... | ... |
| Complexity | ... | ... |
| Cost | ... | ... |
| Consistency | ... | ... |
| Scalability | ... | ... |

---

## Diagram Idea

### Component Diagram
[Describe boxes, arrows, and labels for a component architecture diagram. Use ASCII if helpful.]

### Sequence Diagram
[Describe a step-by-step sequence of messages between components. Suitable for Mermaid or hand-drawn.]

### Failure Diagram
[Describe what the diagram looks like when this component fails. Which paths break? What fallback triggers?]

---

## Agent Execution Prompt

Use this prompt when asking a Claude agent to generate or expand this concept:

```
CONCEPT: [concept name]
CATEGORY: [category]
LEVEL: [Beginner | Intermediate | Advanced | Expert | All]
TEMPLATE: Load CONCEPT_TEMPLATE.md
CONTEXT: Load shared-context/terminology.md

TASK: Generate the [LEVEL] section for the concept [concept name].

OUTPUT FORMAT:
- Follow CONCEPT_TEMPLATE.md exactly
- Use plain language for Beginner, technical precision for Advanced/Expert
- Include: definition, analogy (Beginner only), real-world example, trade-offs (Advanced+)
- Do not repeat content from other levels
- 200-500 words per section depending on level
- No fluff. No hedging. Precise and practical.

CONSTRAINTS:
- Do not load other concept files
- Do not summarize the full concept — generate only the requested level
- If generating all levels, output each as a clearly labelled section
```

---

## Template Usage Notes for Agents

1. **Mandatory fields**: Concept name, category, one-line definition, analogy, all four tutorial levels, trade-offs, interview talking points
2. **Optional for Beginner concepts only**: Enterprise section can be brief (2-3 sentences)
3. **Trade-off table**: Required for Advanced and Expert. At least 3 rows.
4. **Story**: Required for all concepts. Must use a named real-world system type.
5. **Agent prompt**: Required at bottom of every concept document.
6. **Diagram idea**: Required. Even if just ASCII text boxes.
7. **Word count targets**:
   - Beginner: 200-300 words
   - Intermediate: 300-400 words
   - Advanced: 400-500 words
   - Expert: 400-500 words
   - Story: 150-200 words
   - Enterprise use case: 200-300 words
