# /new-concept — Generate a single System Design Academy concept page

## Usage
```
/new-concept <concept-name>
```
Examples:
- `/new-concept rest`
- `/new-concept circuit-breaker`
- `/new-concept kafka-streaming`

## What to do

1. Read `system-design-academy-portal/concepts/load-balancer.html` as structural reference
2. Read `system-design-academy-portal/assets/style.css` for available CSS classes
3. Write complete HTML to `system-design-academy-portal/concepts/<concept>.html`
4. Follow mandatory 9-section structure (see build-academy.md Step 3 for full template)

## Mandatory 9-section structure (in order)

1. `.concept-meta-bar` + `.page-title` + `.page-subtitle` + level badges
2. `h2#definition` — `.analogy-box` + why-it-matters paragraph
3. `h2#story` — `.story-section` with .story-scenario/problem/solution/outcome
4. `h2#learn` — `.level-tabs` with 4 panels (beginner/intermediate/advanced/expert)
5. `h2#enterprise` — `.enterprise-card` (real company, concrete numbers)
6. `h2#mistakes` — 3× `.common-mistake`
7. `h2#interview` — `.interview-prep` (one-liner, structured, follow-ups, mistakes)
8. `h2#tradeoffs` — `.decision-table`
9. Related concepts flex row

## Rules

- All `h2` must have `id` and `class="section-title"`
- All code blocks in `.code-wrapper > pre > code`
- Mermaid diagram in beginner panel: `.mermaid-wrapper > .mermaid`
- `.tradeoff-table` with `.good`/`.bad` cells in advanced panel
- Inline level-tab script above `../assets/app.js` (see load-balancer.html)
- `data-page-id="<concept-id>"` on body
- Real companies + concrete numbers (latency, scale, error rates)
- Complete HTML — no placeholders, no truncation, minimum 400 lines

## Concept filename map

| Concept | File | Category |
|---------|------|----------|
| REST | rest.html | APIs |
| GraphQL | graphql.html | APIs |
| gRPC | grpc.html | APIs |
| API Gateway | api-gateway.html | Networking |
| CDN | cdn.html | Networking |
| Databases | databases.html | Data |
| SQL vs NoSQL | sql-vs-nosql.html | Data |
| Indexing | indexing.html | Data |
| Sharding | sharding.html | Data |
| Replication | replication.html | Data |
| Authentication | authentication.html | Security |
| Authorization | authorization.html | Security |
| OAuth | oauth.html | Security |
| JWT | jwt.html | Security |
| Message Queues | message-queues.html | Messaging |
| Pub/Sub | pub-sub.html | Messaging |
| Event-Driven Architecture | event-driven-architecture.html | Messaging |
| Kafka Streaming | kafka-streaming.html | Messaging |
| Circuit Breaker | circuit-breaker.html | Reliability |
| Rate Limiting | rate-limiting.html | Reliability |
| Retry & Idempotency | retry-idempotency.html | Reliability |
| CAP Theorem | cap-theorem.html | Architecture |
| Microservices | microservices.html | Architecture |
| Monolith | monolith.html | Architecture |
| CQRS | cqrs.html | Architecture |
| Saga Pattern | saga.html | Architecture |

## Output
Write complete HTML file. Report filename and line count when done.
