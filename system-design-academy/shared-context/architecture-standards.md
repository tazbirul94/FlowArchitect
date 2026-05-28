# Architecture Standards

Component naming, diagram conventions, and layer labeling. Load for: Concept Generator, Diagram Agent, Documentation Agent.

---

## Component Naming

Use these exact names in all content and diagrams. No abbreviations in prose.

| Correct | Never Use |
|---|---|
| Load balancer | LB, proxy, balancer |
| API gateway | Gateway, AG, APIGW |
| Message broker | Broker, MQ, bus |
| Message queue | Queue (OK in context), Q |
| Service discovery | SD, registry (OK in context) |
| Circuit breaker | CB |
| Dead letter queue | DLQ (OK in context after first use) |
| Kubernetes | K8s (OK in context after first use) |
| Database | DB (OK in context after first use) |
| Cache | Cache — never "memory store" ambiguously |

## Diagram Conventions

### Boxes (Components)
- All component boxes: `[Component Name]`
- Active/healthy: no decoration
- Failed/degraded: `[Component Name ❌]`
- Optional/standby: `[Component Name*]`

### Arrows (Data Flow)
- Synchronous request: `→` (solid arrow)
- Asynchronous message: `⇢` (dashed arrow, or `-->` in text)
- Bidirectional: `↔`
- Label every arrow: what flows (HTTP GET, Event, ACK, Response, etc.)

### Layer Ordering
- Top: Client / End User
- Upper-middle: Edge layer (CDN, Load Balancer, API Gateway)
- Middle: Application layer (Services, APIs)
- Lower-middle: Data layer (Databases, Caches, Queues)
- Bottom: Infrastructure layer (Kubernetes, Docker, Cloud)

## Standard Architecture Layers

| Layer | Components |
|---|---|
| Client | Browser, Mobile App, Third-party Client |
| Edge | CDN, Load Balancer, WAF, API Gateway |
| Application | Service A, Service B, Worker |
| Data | Database (Primary), Read Replica, Cache (Redis), Message Queue |
| Infrastructure | Kubernetes Cluster, Docker, Cloud Provider |

## Scale Notation

Use these ranges consistently across all concepts:

| Label | Meaning |
|---|---|
| Low scale | < 1,000 req/sec |
| Medium scale | 1K–100K req/sec |
| High scale | 100K–1M req/sec |
| Hyper scale | > 1M req/sec |

User counts:
- Small: < 10K daily active users
- Medium: 10K–1M daily active users
- Large: 1M–100M daily active users
- Hyper: > 100M daily active users
