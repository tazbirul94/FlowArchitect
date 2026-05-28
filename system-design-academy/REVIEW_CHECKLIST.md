# Review Checklist

Used by Reviewer Agent (Agent 11) to validate every completed concept document before it publishes.

---

## How to Use

Load this checklist + the concept file. Check every item. Mark PASS or FAIL. Note line/section reference for every FAIL.

Severity levels:
- **Critical**: Blocks publish. Must fix before any use.
- **Major**: Must fix before Phase completion.
- **Minor**: Polish item. Fix during optimization pass.

---

## Section 1 — Structure Compliance

| # | Item | Severity |
|---|---|---|
| 1.1 | Metadata header present (concept-name, category, difficulty-range, related-concepts, last-updated, reviewed) | Major |
| 1.2 | All four level sections present (Beginner, Intermediate, Advanced, Expert) | Critical |
| 1.3 | Short Story section present with all four sub-sections (Scenario, Problem, Solution, What Changed) | Major |
| 1.4 | Enterprise Use Case section present | Major |
| 1.5 | UI Template Idea section present | Minor |
| 1.6 | Common Mistakes section present with at least 3 items | Major |
| 1.7 | Interview Talking Points section present with one-line answer, 2-min answer, follow-up questions | Major |
| 1.8 | Trade-Offs Summary table present | Major |
| 1.9 | Diagram Idea section present | Minor |
| 1.10 | Agent Execution Prompt section present at bottom | Minor |
| 1.11 | Sections appear in CONCEPT_TEMPLATE.md order | Minor |

---

## Section 2 — Content Quality — Beginner Level

| # | Item | Severity |
|---|---|---|
| 2.1 | One-line definition uses no unexplained acronyms | Critical |
| 2.2 | Simple analogy present (everyday object or scenario) | Critical |
| 2.3 | "Why It Matters" paragraph explains the problem solved, not just the feature | Major |
| 2.4 | Beginner section under 350 words | Minor |
| 2.5 | No technical jargon in Beginner section without inline definition | Critical |
| 2.6 | Key Terms list present with at least 3 terms | Major |
| 2.7 | Diagram idea for Beginner is simple (2-3 components max) | Minor |

---

## Section 3 — Content Quality — Intermediate Level

| # | Item | Severity |
|---|---|---|
| 3.1 | Request flow or data flow steps numbered sequentially | Major |
| 3.2 | At least one real tool or technology named (Redis, Nginx, Kafka, etc.) | Minor |
| 3.3 | At least one failure scenario described | Major |
| 3.4 | At least two configurations or variants described | Major |
| 3.5 | Intermediate section under 450 words | Minor |

---

## Section 4 — Content Quality — Advanced Level

| # | Item | Severity |
|---|---|---|
| 4.1 | Trade-off table present with at least 3 rows | Critical |
| 4.2 | Trade-off table has columns: Approach, Pros, Cons, Best For | Major |
| 4.3 | Scale considerations present (at least two traffic/scale levels) | Major |
| 4.4 | "When NOT to Use" section present with at least 2 scenarios | Major |
| 4.5 | Performance notes present (latency, throughput, or resource cost) | Major |
| 4.6 | Advanced section under 600 words | Minor |
| 4.7 | No content that belongs in Expert section (no compliance, no multi-region strategy) | Minor |

---

## Section 5 — Content Quality — Expert Level

| # | Item | Severity |
|---|---|---|
| 5.1 | Enterprise context clearly described (industry, scale, team size approximate) | Major |
| 5.2 | Multi-region or distributed consideration addressed | Major |
| 5.3 | Compliance or regulatory note present (or "N/A — no direct compliance implications") | Major |
| 5.4 | Security posture or threat note present | Major |
| 5.5 | Cost note present (infra cost, operational cost, or engineering cost) | Major |
| 5.6 | Production operations checklist present with at least 4 items | Minor |
| 5.7 | Vendor evaluation table present (build vs buy vs managed) or explicitly noted as "N/A" | Minor |
| 5.8 | Expert section under 600 words | Minor |

---

## Section 6 — Story Quality

| # | Item | Severity |
|---|---|---|
| 6.1 | Story uses a named real-world system type (Netflix, bank, hospital, etc.) — not "a company" | Major |
| 6.2 | Story under 200 words | Minor |
| 6.3 | Problem is concrete and specific, not abstract | Major |
| 6.4 | Solution clearly and directly applies the concept | Critical |
| 6.5 | "What Changed" describes measurable or observable improvement | Minor |

---

## Section 7 — Enterprise Use Case Quality

| # | Item | Severity |
|---|---|---|
| 7.1 | Industry type specified | Major |
| 7.2 | Scale mentioned (approximate — users, requests, data volume) | Major |
| 7.3 | Business impact is quantified or order-of-magnitude estimated | Major |
| 7.4 | At least 2 lessons included | Major |
| 7.5 | Lessons are specific to this concept in this context — not generic advice | Minor |

---

## Section 8 — Interview Section Quality

| # | Item | Severity |
|---|---|---|
| 8.1 | One-line answer is exactly one line | Critical |
| 8.2 | 2-minute structured answer follows template: definition, problem, example, trade-off | Critical |
| 8.3 | Structured answer under 150 words (must fit 2 minutes spoken) | Major |
| 8.4 | At least 3 follow-up questions listed | Major |
| 8.5 | At least 2 common interview mistakes listed | Major |
| 8.6 | Mistakes are specific (not "don't be vague") | Minor |

---

## Section 9 — Technical Accuracy

| # | Item | Severity |
|---|---|---|
| 9.1 | No fabricated statistics cited as facts | Critical |
| 9.2 | Technology names spelled and used correctly (Kafka not "Apache Kafta", Kubernetes not "k8") | Critical |
| 9.3 | CAP theorem claims, if made, are accurate | Critical |
| 9.4 | Trade-off directions are correct (e.g., "adding more caches reduces DB load" — direction right) | Critical |
| 9.5 | No contradictions between sections (Beginner says X, Advanced says opposite) | Critical |
| 9.6 | Scale estimates are plausible (not "a CDN saves 99.99% of all requests" without context) | Major |

---

## Section 10 — Token and Format

| # | Item | Severity |
|---|---|---|
| 10.1 | No filler phrases ("In today's world", "It's important to note", "Essentially") | Minor |
| 10.2 | Tables are properly Markdown-formatted | Minor |
| 10.3 | No duplicate content between sections | Major |
| 10.4 | Agent Execution Prompt at bottom uses correct template format | Minor |
| 10.5 | File name matches concept name in kebab-case | Minor |

---

## Review Report Format

Reviewer Agent outputs this format:

```markdown
## Review Report: [Concept Name]

**Overall Verdict**: [PUBLISH-READY | NEEDS-REVISION | BLOCKED]

**Summary**: N/50 items passed. Critical: X | Major: Y | Minor: Z

| # | Item | Status | Note |
|---|---|---|---|
| 1.1 | Metadata header present | PASS | |
| 2.5 | No jargon in Beginner | FAIL | "L4/L7" used in Beginner section without definition (line 47) |
| 4.1 | Trade-off table present | PASS | |
...

**Must Fix Before Publish** (Critical + Major FAILs):
1. [item #] — [specific fix needed]
2. [item #] — [specific fix needed]
```

---

## Automatic BLOCK Conditions

A concept is BLOCKED (cannot proceed to Token Optimizer) if ANY of these are true:
- Any Critical item FAILS
- More than 5 Major items FAIL
- Sections 9 (Technical Accuracy) has any FAIL — even one fabricated fact or wrong trade-off direction

BLOCKED concepts return to Concept Generator with the specific FAIL items listed. Do not re-generate the whole concept — fix only the failed sections.
