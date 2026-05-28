# FlowArchitect System Design Academy

Enterprise-grade system design learning platform. Concept-based, beginner-to-expert, multi-agent generated.

## What Is This

Structured knowledge base for learning system design. Each concept delivers:

- Simple explanation + analogy
- Real-world short story
- Enterprise use case
- UI template specification
- Four-level tutorial path (Beginner → Expert)
- Interview preparation notes
- Trade-off analysis
- Agent-ready modular prompts

## Who This Is For

| Audience | Focus |
|---|---|
| Beginner developer | Foundations, analogies, simple mental models |
| Backend engineer | Implementation patterns, real system workflows |
| Interview candidate | Concise explanations, structured talking points |
| Senior engineer | Trade-offs, scale, failure modes, reliability |
| Solution architect | Enterprise patterns, governance, compliance |
| Enterprise team | Cost, security, production design, team onboarding |

## Folder Structure

```
/system-design-academy
├── concepts/                  # One .md file per concept (full template)
│   └── examples/              # Three fully completed reference concepts
├── stories/                   # Short story documents, one per concept
├── ui-templates/              # UI template specs (not implementations)
├── tutorials/                 # Tutorial content per concept and level
├── enterprise-use-cases/      # Deep enterprise scenario documents
├── diagrams/                  # Diagram descriptions and ASCII specs
├── agent-prompts/             # Reusable modular Claude prompts
├── review-checklists/         # Quality review templates
├── shared-context/            # Terminology, standards, naming conventions
├── design-system/             # UI tokens, component specs, layout rules
├── versioning/                # Change log and version history
└── exports/                   # Generated PDF, HTML, JSON exports
```

## Key Documents

| File | Purpose |
|---|---|
| [PRODUCT_VISION.md](PRODUCT_VISION.md) | Platform goals, audience, success metrics |
| [LEARNING_LEVELS.md](LEARNING_LEVELS.md) | Four-level progression definition |
| [CONCEPT_TEMPLATE.md](CONCEPT_TEMPLATE.md) | Standard template every concept follows |
| [AGENT_WORKFLOW.md](AGENT_WORKFLOW.md) | 12-agent architecture and execution order |
| [CLAUDE_SETUP.md](CLAUDE_SETUP.md) | Claude workspace, context, and prompt setup |
| [MASTER_SYSTEM_PROMPT.md](MASTER_SYSTEM_PROMPT.md) | Production Claude system prompt |
| [UI_TEMPLATE_SYSTEM.md](UI_TEMPLATE_SYSTEM.md) | Interactive UI learning templates |
| [ROADMAP.md](ROADMAP.md) | 8-phase delivery plan |
| [TOKEN_OPTIMIZATION.md](TOKEN_OPTIMIZATION.md) | Token efficiency rules for agents |
| [EXECUTION_MODES.md](EXECUTION_MODES.md) | Six Claude execution mode definitions |
| [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) | Quality gates for concept completion |

## Concepts Covered (44 Total)

**Networking & APIs**: Client-Server, APIs, REST, GraphQL, gRPC, Load Balancer, API Gateway

**Data Layer**: Databases, SQL vs NoSQL, Indexing, Replication, Sharding, Caching, CDN

**Security**: Rate Limiting, Authentication, Authorization, OAuth, JWT

**Messaging & Events**: Message Queues, Pub/Sub, Event-Driven Architecture, Kafka-style Streaming, Event Sourcing, CQRS, Saga Pattern

**Reliability**: Dead Letter Queue, Retry Mechanism, Idempotency, Circuit Breaker

**Architecture**: Monolith, Microservices, Service Discovery, Distributed Systems, CAP Theorem, Consistency, Eventual Consistency, Availability, Reliability, Fault Tolerance

**Operations**: Observability, Logging, Monitoring, Distributed Tracing, CI/CD, Docker, Kubernetes, Cloud Deployment, Security, Enterprise Architecture Patterns

## How to Use

### Content Generation via Claude Agents
1. Load `shared-context/terminology.md` + `CONCEPT_TEMPLATE.md`
2. Invoke Concept Generator Agent with concept name and target level
3. Agent writes to `concepts/[concept-name].md`
4. Reviewer Agent validates against `REVIEW_CHECKLIST.md`
5. Token Optimization Agent compresses if needed

### For Self-Study
Browse `concepts/` by category. Follow progression in `tutorials/` per level.

### For UI Implementation
Read `UI_TEMPLATE_SYSTEM.md` for component specs. Pull content from `concepts/`.

### For Interview Prep
Load any concept file and jump to the `interview-talking-points` section.

## Completed Example Concepts

- [Load Balancer](concepts/examples/load-balancer.md)
- [Caching](concepts/examples/caching.md)
- [Event-Driven Architecture](concepts/examples/event-driven-architecture.md)
