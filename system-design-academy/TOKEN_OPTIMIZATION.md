# Token Optimization Strategy

Rules for minimizing Claude token usage across all agent operations without sacrificing content quality.

---

## Core Principle

Every agent call should load the minimum context required for its specific task. Content generation is modular. Review is separate from generation. Assembly is separate from both.

---

## Rule Set

### Rule 1: One Concept Per Session

Never load two concept files in the same context. Each concept is a separate conversation. Cross-loading concepts adds token cost with no benefit.

**Do**: Open new context for each concept.
**Don't**: Load load-balancer.md when working on caching.md.

---

### Rule 2: Load Shared Context Once, Early

Shared context files (terminology.md, architecture-standards.md) are small and must be loaded at the start. Load them once in Turn 1. Do not re-paste them in later turns.

**Do**: Load terminology.md in Turn 1. Reference it by name in later turns.
**Don't**: Re-paste the full terminology.md in Turn 5 when requesting a story.

---

### Rule 3: Separate Generation from Review

Never generate and review in the same agent call. Mixing roles increases context length and reduces both quality.

**Do**: Generate → finish → start new call → review.
**Don't**: "Generate the concept and then review it in the same response."

---

### Rule 4: Reference Templates, Don't Paste Them

When invoking an agent, reference the template by name. Load CONCEPT_TEMPLATE.md once per session at the start. Do not paste the full template in every agent prompt.

**Do**: "TEMPLATE: CONCEPT_TEMPLATE.md (loaded at session start)"
**Don't**: Paste 500 lines of CONCEPT_TEMPLATE.md in every agent call.

---

### Rule 5: Level-Specific Generation

When generating a concept section, specify the exact level. Do not generate all four levels at once unless the task explicitly requires it and the concept is simple.

**Do**: "Generate the Intermediate level section for Load Balancer."
**Don't**: "Generate all four levels of Load Balancer in one response" (unless concept is simple like "What is an API").

**When "All Levels" is acceptable**:
- Concept has short sections (e.g., simple concepts like REST, CDN)
- Each level is under 200 words
- Session is fresh with minimal context loaded

---

### Rule 6: Compact Output Format

Agents use compact schema output where possible. No verbose headers, no re-stating the task, no "certainly, here is the output you requested" preamble.

**Do**: Start the output with the content directly.
**Don't**: "Sure! I'll now generate the Beginner section for Load Balancer. As requested, this will follow the CONCEPT_TEMPLATE.md structure..."

---

### Rule 7: Skip Research Brief for Simple Concepts

The Research Agent step is optional. Skip it for foundational concepts where the definition is universally known.

**Skip research brief for**: API, REST, Database, SQL, Docker, CDN, Authentication
**Run research brief for**: CAP Theorem, CQRS, Saga Pattern, Event Sourcing, Eventual Consistency, Distributed Tracing

Threshold: if the concept can be accurately defined in one sentence from training knowledge, skip the research brief.

---

### Rule 8: Batch Tutorial Steps

Tutorial steps (Agent 8) for all four levels can be batched in one call because they are short (5-8 steps each, one sentence per step). Total output is under 200 words. This is one exception to Rule 5.

**Do**: "Generate tutorial steps for all 4 levels of Load Balancer in one call."
**Don't**: Make 4 separate calls for 5-sentence outputs.

---

### Rule 9: Interview Section is Standalone

Interview Talking Points (Agent 9) needs only the concept name, definition, and 2-3 trade-offs. Do not provide the full concept file to the Interview Prep Agent.

**Do**:
```
CONCEPT: Load Balancer
DEFINITION: Distributes incoming network traffic across multiple servers.
TRADE-OFFS: Round-robin vs weighted, L4 vs L7, session affinity vs statelessness
```
**Don't**: Paste the full 2000-word concept file for a 150-word interview section.

---

### Rule 10: Diagrams Are Separate Files

Diagram descriptions are stored in `diagrams/[concept-name]-diagrams.md`, not inline in the concept file during generation. The Documentation Agent merges them at assembly time.

This prevents the Diagram Agent from loading the full concept file and prevents the Concept Generator from waiting for diagrams.

---

### Rule 11: Enterprise Section Has Its Own Agent

The Enterprise Use Case section is generated independently by the Enterprise Architect Agent. It needs only the concept name, definition, and industry type. Do not generate enterprise content inside the Concept Generator Agent call.

This keeps Concept Generator focused and short. Enterprise sections can be regenerated independently if quality is insufficient.

---

### Rule 12: Token Budget Per Agent Call

Approximate token budgets for each agent:

| Agent | Input Tokens | Output Tokens |
|---|---|---|
| Planner | ~500 | ~300 |
| Research | ~300 | ~400 |
| Concept Generator (one level) | ~800 | ~600 |
| Concept Generator (all levels) | ~800 | ~2000 |
| Story Writer | ~200 | ~300 |
| Enterprise Architect | ~200 | ~400 |
| UI/UX Template | ~300 | ~200 |
| Diagram Agent | ~300 | ~400 |
| Tutorial Agent (all levels) | ~400 | ~300 |
| Interview Prep | ~200 | ~200 |
| Documentation Agent | ~2000 | ~2500 |
| Reviewer | ~2500 | ~400 |
| Token Optimizer | ~2500 | ~2000 |

**Total per concept (all agents)**: ~8,000-12,000 tokens
**Target**: Under 10,000 tokens per concept

---

### Rule 13: Compress Before Publishing, Not During Generation

Run the Token Optimization Agent as the last step. Do not self-censor during generation — write the full accurate content. Compression happens in a dedicated pass.

Trying to be brief during generation reduces quality. Compression in a review pass is more surgical.

---

### Rule 14: Shared Context Files Must Be Lean

Target sizes for shared context files:

| File | Target Size |
|---|---|
| terminology.md | Under 1,500 tokens |
| architecture-standards.md | Under 800 tokens |
| ui-conventions.md | Under 600 tokens |
| naming-conventions.md | Under 400 tokens |
| token-optimization-rules.md | Under 500 tokens |
| enterprise-architecture-glossary.md | Under 1,200 tokens |

Total shared context load: under 5,000 tokens per session. Review these files monthly and trim.

---

### Rule 15: Fail Fast, Fix Targeted

When the Reviewer Agent reports FAILs, pass only the specific FAIL items and the relevant section back to the Concept Generator. Do not re-paste the full concept file.

**Do**:
```
REVIEW FAILED: Advanced section — Trade-off table missing "Best For" column. Please add.
SECTION: [paste only the Advanced section]
```
**Don't**: Re-paste the full 3000-word concept file to fix one table column.

---

## Token Savings Summary

| Strategy | Estimated Savings |
|---|---|
| One concept per session | 20-30% vs loading multiple |
| Level-specific generation | 40-60% vs all-levels always |
| Separate generation and review | 15-25% vs combined |
| Reference templates (don't paste) | 20-40% vs pasting templates |
| Skip research brief for simple concepts | 5-10% per simple concept |
| Batch tutorial steps | 30% vs 4 separate calls |
| Interview section minimal input | 60% vs full concept file |
| Targeted fix (not full re-gen) | 70% vs full regeneration |

**Combined target**: 60-80% token reduction vs naive "generate everything at once" approach.
