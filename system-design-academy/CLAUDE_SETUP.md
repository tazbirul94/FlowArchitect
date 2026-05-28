# Claude Setup

Project workspace configuration, context loading strategy, and agent isolation rules.

---

## Project Folder Structure

```
/system-design-academy
├── concepts/                          # Generated concept documents
│   ├── examples/                      # Three reference concepts (fully complete)
│   │   ├── load-balancer.md
│   │   ├── caching.md
│   │   └── event-driven-architecture.md
│   ├── networking/
│   │   ├── client-server.md
│   │   ├── apis.md
│   │   ├── rest.md
│   │   ├── graphql.md
│   │   └── grpc.md
│   ├── data/
│   │   ├── databases.md
│   │   ├── sql-vs-nosql.md
│   │   ├── indexing.md
│   │   ├── replication.md
│   │   ├── sharding.md
│   │   ├── caching.md
│   │   └── cdn.md
│   ├── security/
│   │   ├── rate-limiting.md
│   │   ├── authentication.md
│   │   ├── authorization.md
│   │   ├── oauth.md
│   │   └── jwt.md
│   ├── messaging/
│   │   ├── message-queues.md
│   │   ├── pub-sub.md
│   │   ├── event-driven-architecture.md
│   │   ├── kafka-event-streaming.md
│   │   ├── event-sourcing.md
│   │   └── cqrs.md
│   ├── reliability/
│   │   ├── saga-pattern.md
│   │   ├── dead-letter-queue.md
│   │   ├── retry-mechanism.md
│   │   ├── idempotency.md
│   │   └── circuit-breaker.md
│   ├── architecture/
│   │   ├── monolith.md
│   │   ├── microservices.md
│   │   ├── service-discovery.md
│   │   ├── distributed-systems.md
│   │   ├── cap-theorem.md
│   │   ├── consistency.md
│   │   ├── eventual-consistency.md
│   │   ├── availability.md
│   │   ├── reliability.md
│   │   └── fault-tolerance.md
│   ├── infrastructure/
│   │   ├── load-balancer.md
│   │   ├── api-gateway.md
│   │   └── service-discovery.md
│   └── operations/
│       ├── observability.md
│       ├── logging.md
│       ├── monitoring.md
│       ├── distributed-tracing.md
│       ├── ci-cd.md
│       ├── docker.md
│       ├── kubernetes.md
│       ├── cloud-deployment.md
│       ├── security.md
│       └── enterprise-architecture-patterns.md
│
├── stories/                           # Standalone story files per concept
│   └── [concept-name]-story.md
│
├── ui-templates/                      # UI learning template specifications
│   ├── concept-card.md
│   ├── architecture-flow-diagram.md
│   ├── interactive-request-journey.md
│   ├── failure-simulation.md
│   ├── scaling-simulator.md
│   ├── before-after-comparison.md
│   ├── trade-off-table.md
│   ├── event-flow-visualizer.md
│   ├── queue-processing-visualizer.md
│   ├── database-sharding-visualizer.md
│   ├── cache-hit-miss-simulator.md
│   ├── interview-practice-card.md
│   └── enterprise-case-study-page.md
│
├── tutorials/                         # Level-specific tutorial step files
│   └── [concept-name]-[level].md
│
├── enterprise-use-cases/              # Expanded enterprise scenario documents
│   └── [concept-name]-enterprise.md
│
├── diagrams/                          # Diagram description files
│   └── [concept-name]-diagrams.md
│
├── agent-prompts/                     # Reusable Claude prompts
│   ├── execution-manifest.md
│   ├── research-briefs/
│   │   └── [concept-name]-brief.md
│   └── modular-prompts/
│       ├── generate-concept.md
│       ├── generate-story.md
│       ├── generate-ui-template.md
│       ├── generate-beginner-tutorial.md
│       ├── generate-advanced-tutorial.md
│       ├── generate-enterprise-use-case.md
│       ├── generate-interview-notes.md
│       ├── generate-diagram.md
│       ├── review-concept.md
│       └── optimize-concept.md
│
├── review-checklists/                 # Quality review templates and results
│   ├── REVIEW_CHECKLIST.md
│   └── reviews/
│       └── [concept-name]-review.md
│
├── shared-context/                    # Loaded by agents as minimal context
│   ├── terminology.md
│   ├── architecture-standards.md
│   ├── ui-conventions.md
│   ├── naming-conventions.md
│   ├── token-optimization-rules.md
│   └── enterprise-architecture-glossary.md
│
├── design-system/                     # UI component and token specs (future)
│   ├── color-tokens.md
│   ├── typography.md
│   ├── component-library.md
│   └── layout-grid.md
│
├── versioning/                        # Change tracking
│   ├── CHANGELOG.md
│   └── concept-version-index.md
│
└── exports/                           # Output formats
    ├── markdown/
    ├── html/
    ├── pdf/
    └── json/
```

---

## Global System Prompt

Loaded at the top of every Claude agent context. Never modified per concept.

```
You are a senior system design educator, solution architect, and technical writer.

You generate content for the FlowArchitect System Design Academy — a concept-driven learning platform covering 44 system design concepts from beginner to expert level.

CORE RULES:
1. Follow CONCEPT_TEMPLATE.md exactly. Do not invent structure.
2. Do not load the full project. Load only what the current task requires.
3. Write for the assigned level (Beginner/Intermediate/Advanced/Expert). Never merge levels.
4. Beginner: plain language, everyday analogies, no unexplained jargon.
5. Advanced/Expert: precise technical language, quantified trade-offs, production reality.
6. All stories must use a named real-world system type (Netflix, Uber, bank, etc.).
7. All trade-off tables need at least 3 rows with Pros, Cons, Best For.
8. Do not fabricate statistics or company names. Use order-of-magnitude estimates ("~10K req/sec", "millions of users").
9. Interview sections must fit verbal delivery. No walls of text.
10. Output is Markdown. Headers, tables, and code blocks formatted correctly.
```

---

## Shared Context Files

### What Goes in Each File

#### `shared-context/terminology.md`
- 80-100 key terms with 1-sentence definitions
- Examples: "Idempotency: an operation that produces the same result whether executed once or many times", "Sharding: horizontal partitioning of a database across multiple nodes"
- Used by: all generation agents as minimal baseline vocabulary

#### `shared-context/architecture-standards.md`
- Standard component naming (e.g., "load balancer" not "LB" or "proxy")
- Standard diagram conventions (boxes = components, arrows = data flow, dashed arrows = async)
- Layer labeling conventions (client, network, application, data, infrastructure)
- Used by: Concept Generator, Diagram Agent, Documentation Agent

#### `shared-context/ui-conventions.md`
- Screen layout principles (left = input/controls, right = visual output)
- Color semantics (green = healthy, red = failure, yellow = degraded, blue = processing)
- Interaction patterns (slider = adjust scale, toggle = enable/disable, step buttons = advance tutorial)
- Used by: UI/UX Template Agent

#### `shared-context/naming-conventions.md`
- File naming: kebab-case (`event-driven-architecture.md`)
- Concept names in text: Title Case ("Event-Driven Architecture")
- Component names: lowercase in diagrams (`load-balancer`), Title Case in prose
- Code identifiers: camelCase for variables, SCREAMING_SNAKE for constants
- Used by: Documentation Agent, all agents generating file names

#### `shared-context/token-optimization-rules.md`
- Short version of TOKEN_OPTIMIZATION.md
- Rules: work one concept at a time, use template references not full text, separate generation from review, one agent task per prompt
- Used by: Token Optimization Agent, Planner Agent

#### `shared-context/enterprise-architecture-glossary.md`
- 40-50 enterprise terms with definitions
- Examples: ADR (Architecture Decision Record), RTO (Recovery Time Objective), RPO (Recovery Point Objective), SLO (Service Level Objective), MTTR (Mean Time to Recovery)
- Used by: Enterprise Architect Agent, Expert level generation

---

## Independent Agent Context Rules

**The Rule**: Each agent loads the minimum context required for its task. Never load the full project.

### Context Loading Per Agent

| Agent | Required Context | Optional Context |
|---|---|---|
| Planner | Concept list only | ROADMAP.md |
| Research | Concept name + terminology.md | — |
| Concept Generator | CONCEPT_TEMPLATE.md + terminology.md + research brief | Architecture standards |
| Story Writer | Concept name + definition | — |
| Enterprise Architect | Concept name + definition | Enterprise glossary |
| UI/UX Template | Concept name + category + UI template type list | UI conventions |
| Diagram Agent | Concept name + component list | Architecture standards |
| Tutorial Agent | Concept level section text only | — |
| Interview Prep | Concept name + definition + trade-offs | — |
| Documentation Agent | All section files for this concept + template | Naming conventions |
| Reviewer | Completed concept file + checklist | — |
| Token Optimizer | Completed concept file + optimization rules | — |

### What Agents Must NEVER Load
- Other concept files (no cross-loading)
- Full project folder
- Previous agent conversations
- UI template full specs (load type list only)
- Stories from other concepts
- The full ROADMAP.md (load only the phase relevant to current batch)

---

## Claude Project Configuration

### Conversation Structure per Concept

Each concept generation should be its own Claude conversation or clearly demarcated session. The pattern:

```
Turn 1: Load global system prompt + shared context files (terminology.md + architecture-standards.md)
Turn 2: Provide concept assignment + invoke Concept Generator Agent prompt
Turn 3: Review output → request fixes if needed
Turn 4: Invoke Story Writer Agent prompt (concept name + definition only)
Turn 5: Invoke Enterprise Architect Agent prompt
Turn 6: Invoke UI/UX Template Agent prompt (+ UI type list)
Turn 7: Invoke Diagram Agent prompt
Turn 8: Invoke Tutorial Agent prompt per level (can batch all 4 levels in one call)
Turn 9: Invoke Interview Prep Agent prompt
Turn 10: Invoke Documentation Agent — assemble final file
Turn 11: Invoke Reviewer Agent — paste final file + checklist
Turn 12: If PASS → Invoke Token Optimizer
         If FAIL → Return to step 3 with FAIL items listed
```

### Context Reset Strategy

After completing a concept (step 12), start a fresh conversation for the next concept. Do not carry over the previous concept's content into the next concept's context. This prevents token accumulation and context contamination.

Exception: the global system prompt and shared context files are always loaded fresh at Turn 1. They are small and must be present.

---

## Quality Checkpoints

| Checkpoint | When | Who |
|---|---|---|
| Template compliance | After Concept Generator | Documentation Agent |
| Technical accuracy | After assembly | Reviewer Agent |
| Word count range | After generation | Token Optimizer |
| No jargon in Beginner | After Concept Generator | Reviewer Agent |
| Trade-off table completeness | After Advanced/Expert gen | Reviewer Agent |
| Interview answer fit | After Interview Prep | Reviewer Agent |
| Diagram completeness | After Diagram Agent | Documentation Agent |
