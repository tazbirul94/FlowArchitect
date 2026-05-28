# Roadmap

8 phases from foundation to published product. Each phase has clear scope, deliverables, and success criteria.

---

## Phase 1 — Foundation

**Goal**: Establish templates, Claude setup, shared context, and agent workflow. Validate the full pipeline end-to-end with one concept.

**Duration Estimate**: 1-2 weeks

### Deliverables

- [ ] `CONCEPT_TEMPLATE.md` — finalized and validated
- [ ] `LEARNING_LEVELS.md` — four levels defined and reviewed
- [ ] `MASTER_SYSTEM_PROMPT.md` — production-ready
- [ ] `AGENT_WORKFLOW.md` — all 12 agents defined
- [ ] `CLAUDE_SETUP.md` — folder structure and context rules
- [ ] `TOKEN_OPTIMIZATION.md` — all 15 rules documented
- [ ] `EXECUTION_MODES.md` — all 6 modes defined
- [ ] `REVIEW_CHECKLIST.md` — all 50 checklist items
- [ ] `UI_TEMPLATE_SYSTEM.md` — all 13 templates specified
- [ ] `ROADMAP.md` — this file
- [ ] `shared-context/terminology.md` — 80-100 terms
- [ ] `shared-context/architecture-standards.md`
- [ ] `shared-context/ui-conventions.md`
- [ ] `shared-context/naming-conventions.md`
- [ ] `shared-context/enterprise-architecture-glossary.md`
- [ ] `concepts/examples/load-balancer.md` — fully completed reference concept
- [ ] `concepts/examples/caching.md` — fully completed reference concept
- [ ] `concepts/examples/event-driven-architecture.md` — fully completed reference concept
- [ ] Pipeline test: Run all 12 agents on one concept end-to-end. Validate output.

**Success Criteria**:
- All 14 documentation files complete
- All 6 shared context files written
- Three reference concepts pass review (50/50 checklist items)
- End-to-end pipeline runs without gaps
- Token cost per concept confirmed under 12,000 tokens

---

## Phase 2 — Beginner Concepts

**Goal**: Complete all beginner-appropriate foundational concepts. Prioritize concepts most needed for understanding later concepts.

**Duration Estimate**: 2-3 weeks

**Concepts (12 total)**:
1. Client-Server Architecture
2. APIs (What is an API)
3. REST
4. HTTP Basics
5. Databases (What is a database)
6. SQL vs NoSQL
7. Caching (basic)
8. CDN
9. Authentication
10. Authorization
11. Docker (What is it)
12. Monolith

**Execution Strategy**:
- 3 concepts per batch
- Full 12-agent pipeline per concept
- Structured Mode for all
- Teaching Mode for concepts with confusing names (Idempotency skipped to Phase 3)

**Deliverables**:
- [ ] 12 concept files in `concepts/` (beginner-focused, all four levels)
- [ ] 12 story files in `stories/`
- [ ] 12 diagram files in `diagrams/`
- [ ] 12 tutorial files in `tutorials/` (all 4 levels per concept)
- [ ] All 12 reviewed and passing REVIEW_CHECKLIST.md

**Success Criteria**:
- All 12 concepts pass review
- Beginner sections readable by someone with no CS background
- Stories use distinct real-world system types (no two same)

---

## Phase 3 — Intermediate Concepts

**Goal**: Complete concepts that require foundational understanding. Cover real-world workflows, component interaction, and basic trade-offs.

**Duration Estimate**: 3-4 weeks

**Concepts (14 total)**:
1. GraphQL
2. gRPC
3. Load Balancer (full expansion)
4. API Gateway
5. Indexing
6. Replication
7. Sharding
8. Rate Limiting
9. OAuth
10. JWT
11. Message Queues
12. Pub/Sub
13. Microservices
14. Service Discovery

**Execution Strategy**:
- 3-4 concepts per batch
- Structured Mode default
- Deep Architecture Mode for complex concepts (gRPC, Sharding, OAuth)

**Deliverables**:
- [ ] 14 concept files
- [ ] 14 stories
- [ ] 14 diagrams
- [ ] 14 tutorials
- [ ] All reviewed and passing

**Success Criteria**:
- Intermediate sections include real tool names and request flows
- All trade-off tables have 3+ rows
- Intermediate concepts reference prerequisite concepts in Related Concepts list

---

## Phase 4 — Advanced Distributed Systems

**Goal**: Complete the hardest and most nuanced system design concepts. Full trade-off depth. Production reality.

**Duration Estimate**: 4-5 weeks

**Concepts (12 total)**:
1. Event-Driven Architecture (full expansion)
2. Kafka-style Event Streaming
3. Event Sourcing
4. CQRS
5. Saga Pattern
6. Dead Letter Queue
7. Retry Mechanism
8. Idempotency
9. Circuit Breaker
10. CAP Theorem
11. Consistency
12. Eventual Consistency

**Execution Strategy**:
- 2 concepts per batch (higher complexity)
- Deep Architecture Mode for all
- Research brief required for all (no skipping)
- Expert sections expanded to 700 words

**Deliverables**:
- [ ] 12 concept files with full Advanced and Expert depth
- [ ] 12 stories (distributed systems real-world scenarios — Kafka, bank, ride-share)
- [ ] 12 diagrams (sequence diagrams required for all event-based concepts)
- [ ] 12 tutorials
- [ ] All reviewed and passing

**Success Criteria**:
- Advanced sections address failure modes explicitly
- CAP theorem connections noted where applicable
- Expert sections include compliance note (financial systems, healthcare where relevant)

---

## Phase 5 — Expert Enterprise Architecture

**Goal**: Complete the highest-level architectural and operations concepts. Enterprise-grade depth.

**Duration Estimate**: 3-4 weeks

**Concepts (6 total)**:
1. Distributed Systems (principles and challenges)
2. Availability
3. Reliability
4. Fault Tolerance
5. Observability (Logging + Monitoring + Tracing combined)
6. Enterprise Architecture Patterns

**Plus Operations Concepts (5 total)**:
7. CI/CD
8. Kubernetes
9. Cloud Deployment
10. Security (Systems Security)
11. Distributed Tracing

**Execution Strategy**:
- 2 concepts per batch
- Deep Architecture Mode + Structured Mode combined
- Full enterprise use cases (no brief examples — full scenarios)
- Expert sections must include multi-region and compliance notes

**Deliverables**:
- [ ] 11 concept files — Expert sections are primary value
- [ ] All reviewed and passing
- [ ] Enterprise use case files in `enterprise-use-cases/` for each concept

**Success Criteria**:
- Expert sections reference real frameworks (AWS Well-Architected, TOGAF, NIST)
- Compliance notes specific to concept (GDPR for data storage, HIPAA for healthcare, SOC2 for SaaS)
- Cost modeling present in at least 8 of 11 concepts

---

## Phase 6 — UI Template Design

**Goal**: Expand all 13 UI template specifications into implementation-ready design documents. Prepare for frontend development.

**Duration Estimate**: 2-3 weeks

**Deliverables**:
- [ ] All 13 `ui-templates/` files expanded to full design specs
- [ ] `design-system/` folder populated: color tokens, typography, component library, layout grid
- [ ] Concept-to-template mapping: every concept assigned its primary and secondary UI templates
- [ ] Interaction specifications for all 13 templates (state diagrams, user flow)
- [ ] Accessibility notes per template (keyboard nav, screen reader, contrast)

**Success Criteria**:
- Any frontend developer can implement a template from the spec alone
- Every concept has at least one UI template assigned
- Templates cover all 44 concepts without gaps

---

## Phase 7 — Interactive Tutorial Implementation

**Goal**: Implement the UI based on Phase 6 specs. Out of scope for this planning phase — this phase begins after UI specs are approved.

**Duration Estimate**: 8-12 weeks (engineering)

**Note**: This phase is not content generation — it is frontend engineering. The academy planning documents hand off to the engineering team here. The `tutorials/` folder content feeds directly into the UI.

**Deliverables** (engineering team scope):
- [ ] Concept Card template implemented (Template 1)
- [ ] Architecture Flow Diagram interactive (Template 2)
- [ ] Cache Hit/Miss Simulator interactive (Template 11)
- [ ] Trade-Off Comparison Table interactive (Template 7)
- [ ] Interview Practice Card (Template 12)
- [ ] All 44 concepts rendered in the platform

---

## Phase 8 — Review, Polish, and Publish

**Goal**: Final quality pass across all content. Consistency review. Export generation. Launch.

**Duration Estimate**: 2-3 weeks

**Deliverables**:
- [ ] Cross-concept consistency review (terminology consistent, no contradictions between concepts)
- [ ] Reading level review for all Beginner sections (Flesch-Kincaid check or equivalent)
- [ ] All diagrams rendered from text descriptions into actual visual files
- [ ] Export formats generated: MD (done), HTML, PDF, JSON
- [ ] `CHANGELOG.md` and `concept-version-index.md` finalized
- [ ] All 44 concept files at reviewed: true in metadata
- [ ] Public README updated with full concept list and navigation

**Success Criteria**:
- All 44 concepts reviewed: true
- Zero Critical or Major review failures outstanding
- Export pipeline working for all 4 formats
- Product Vision success metrics met (see PRODUCT_VISION.md)

---

## Concept Count Summary

| Phase | Concepts | New | Cumulative |
|---|---|---|---|
| Phase 1 | Foundation + 3 examples | 3 | 3 |
| Phase 2 | Beginner foundational | 12 | 15 |
| Phase 3 | Intermediate | 14 | 29 |
| Phase 4 | Advanced distributed | 12 | 41 |
| Phase 5 | Expert enterprise | 11 | 52* |
| Total | — | 52 | 52 |

*Note: 52 > 44 because some concepts from the original list (Observability, Logging, Monitoring, Distributed Tracing) are grouped together in Phase 5. Individual concept count is 44; grouping decisions made in Phase 5 planning.

---

## Dependency Map (Critical Concepts)

These concepts must be completed before dependent concepts can be properly authored:

```
Client-Server → APIs → REST → Load Balancer → API Gateway
APIs → Authentication → OAuth → JWT
Databases → SQL vs NoSQL → Indexing → Replication → Sharding
Caching → CDN
Message Queues → Pub/Sub → Event-Driven Architecture → Kafka → Event Sourcing → CQRS
Microservices → Service Discovery → Distributed Systems
Distributed Systems → CAP Theorem → Consistency → Eventual Consistency → Availability
Fault Tolerance → Circuit Breaker → Retry → Idempotency → Dead Letter Queue
Monitoring → Logging → Distributed Tracing → Observability
Docker → Kubernetes → Cloud Deployment → CI/CD
```
