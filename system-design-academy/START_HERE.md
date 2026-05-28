# New Session Starter Prompt

Copy the block below and paste it as your first message in any new Claude session for this project.
Replace values in [brackets] before sending.

---

## Option A — Generate One Concept (Most Common)

```
You are working on the FlowArchitect System Design Academy.

PROJECT LOCATION: C:\Users\mhaque\Downloads\Myself\Coding\FlowArchitect\system-design-academy\

LOAD THESE FILES BEFORE ANYTHING ELSE:
1. CONCEPT_TEMPLATE.md          — the standard template every concept must follow
2. shared-context/terminology.md — core vocabulary (~100 terms)
3. MASTER_SYSTEM_PROMPT.md      — your operating rules

REFERENCE EXAMPLES (read one if you need to calibrate quality):
- concepts/examples/load-balancer.md
- concepts/examples/caching.md
- concepts/examples/event-driven-architecture.md

YOUR TASK:
Generate the concept document for: [CONCEPT NAME]
Category: [Networking | Data | Security | Messaging | Reliability | Architecture | Operations]
Mode: [Structured | Teaching | Deep]
Level: [Beginner | Intermediate | Advanced | Expert | All]

Use CONCEPT_TEMPLATE.md structure exactly.
Write to: concepts/[category]/[concept-kebab-name].md

After generating, tell me the word count per section and flag any sections that need a second pass.
```

---

## Option B — Generate Story Only

```
You are working on the FlowArchitect System Design Academy.

PROJECT LOCATION: C:\Users\mhaque\Downloads\Myself\Coding\FlowArchitect\system-design-academy\

LOAD: agent-prompts/modular-prompts/all-prompts.md → use Prompt 2 (Generate One Short Story)

CONCEPT: [concept name]
DEFINITION: [one-line definition]
SYSTEM TYPE: [Netflix | Uber | Bank | Hospital | SaaS | E-commerce | Logistics]

Generate the Short Story section only. Under 200 words. Follow Prompt 2 format exactly.
```

---

## Option C — Generate Enterprise Use Case Only

```
You are working on the FlowArchitect System Design Academy.

PROJECT LOCATION: C:\Users\mhaque\Downloads\Myself\Coding\FlowArchitect\system-design-academy\

LOAD: agent-prompts/modular-prompts/all-prompts.md → use Prompt 6 (Generate Enterprise Use Case)

CONCEPT: [concept name]
DEFINITION: [one-line definition]
INDUSTRY: [fintech | healthcare | e-commerce | logistics | SaaS]

Generate Enterprise Use Case section only. 200-300 words. Follow Prompt 6 format exactly.
```

---

## Option D — Review a Completed Concept

```
You are working on the FlowArchitect System Design Academy.

PROJECT LOCATION: C:\Users\mhaque\Downloads\Myself\Coding\FlowArchitect\system-design-academy\

LOAD: REVIEW_CHECKLIST.md

MODE: Review
TASK: Review the concept file at concepts/[category]/[concept-name].md

Check all 50 checklist items. Output:
- Overall verdict: PUBLISH-READY | NEEDS-REVISION | BLOCKED
- Table: item # | PASS/FAIL | note (for every FAIL)
- Must-fix list (Critical + Major FAILs only)

Do not rewrite anything. Report only.
```

---

## Option E — Interview Prep (Fast)

```
You are working on the FlowArchitect System Design Academy.

LOAD: agent-prompts/modular-prompts/all-prompts.md → use Prompt 7 (Generate Interview Notes)

CONCEPT: [concept name]
DEFINITION: [one-line definition]
CORE TRADE-OFFS: [2-3 trade-offs, comma separated]

Generate Interview Talking Points section only. Follow Prompt 7 format exactly.
One-line answer, 2-min structured answer, 3 follow-up questions, 2 common mistakes.
```

---

## Option F — Generate All 4 Levels (Full Concept, One Shot)

Use this only for simple/foundational concepts. Complex concepts (CAP Theorem, CQRS, Saga) do levels separately.

```
You are working on the FlowArchitect System Design Academy.

LOAD THESE FILES:
1. CONCEPT_TEMPLATE.md
2. shared-context/terminology.md
3. MASTER_SYSTEM_PROMPT.md

CONCEPT: [concept name]
CATEGORY: [category]
MODE: [Teaching for foundational | Structured for standard | Deep for distributed systems]
LEVEL: All

Generate all four levels (Beginner → Expert) in one response.
Follow CONCEPT_TEMPLATE.md section structure exactly for each level.
Output each level as a clearly labelled section.
Target word counts: Beginner 250 | Intermediate 350 | Advanced 450 | Expert 450

After output, list: which sections are strongest, which need a review pass.
```

---

## Concept Backlog (Not Yet Generated)

Pick from this list for your next session:

### Phase 2 — Beginner (do these first)
- [ ] Client-Server Architecture
- [ ] APIs (What is an API)
- [ ] REST
- [ ] Databases (What is a database)
- [ ] SQL vs NoSQL
- [ ] CDN
- [ ] Authentication
- [ ] Authorization
- [ ] Docker (What is it)
- [ ] Monolith

### Phase 3 — Intermediate
- [ ] GraphQL
- [ ] gRPC
- [ ] API Gateway
- [ ] Indexing
- [ ] Replication
- [ ] Sharding
- [ ] Rate Limiting
- [ ] OAuth
- [ ] JWT
- [ ] Message Queues
- [ ] Pub/Sub
- [ ] Microservices
- [ ] Service Discovery

### Phase 4 — Advanced Distributed Systems
- [ ] Kafka-style Event Streaming
- [ ] Event Sourcing
- [ ] CQRS
- [ ] Saga Pattern
- [ ] Dead Letter Queue
- [ ] Retry Mechanism
- [ ] Idempotency
- [ ] Circuit Breaker
- [ ] CAP Theorem
- [ ] Consistency
- [ ] Eventual Consistency

### Phase 5 — Expert Enterprise
- [ ] Distributed Systems
- [ ] Availability
- [ ] Reliability
- [ ] Fault Tolerance
- [ ] Observability
- [ ] Logging
- [ ] Monitoring
- [ ] Distributed Tracing
- [ ] CI/CD
- [ ] Kubernetes
- [ ] Cloud Deployment
- [ ] Security (Systems)
- [ ] Enterprise Architecture Patterns

---

## Quick Reference: Which Mode for Which Concept

| Concept Type | Mode |
|---|---|
| Client-Server, APIs, REST, What is a Database | Teaching |
| Load Balancer, Caching, CDN, Auth, Docker | Structured |
| GraphQL, gRPC, Sharding, OAuth, Microservices | Structured |
| CAP Theorem, CQRS, Saga, Eventual Consistency | Deep |
| Observability, Enterprise Patterns, Kubernetes | Deep + Structured |
| Interview prep only | Interview |
| Reviewing finished concepts | Review |

## Key Files to Know

| File | When to Load |
|---|---|
| CONCEPT_TEMPLATE.md | Every generation session |
| shared-context/terminology.md | Every generation session |
| MASTER_SYSTEM_PROMPT.md | Every session (as system prompt) |
| shared-context/enterprise-architecture-glossary.md | Expert sections only |
| shared-context/ui-conventions.md | UI template generation only |
| REVIEW_CHECKLIST.md | Review sessions only |
| agent-prompts/modular-prompts/all-prompts.md | Quick single-task prompts |
