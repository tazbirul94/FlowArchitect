# Continue Session — System Design Academy Portal

Paste this as your first message in a new Claude session.

---

## Context

Working on: `C:\Users\mhaque\Downloads\Myself\Coding\FlowArchitect`

Two portals exist in this repo:
1. `software-architect-learning-portal/` — DevArchitect portal (24 pages, all done, DO NOT TOUCH)
2. `system-design-academy-portal/` — System Design Academy (NEW — in progress)

## What's already built in the academy portal

```
system-design-academy-portal/
  index.html                    ✅ Landing page (inline script, hardcoded sidebar nav)
  assets/style.css              ✅ Full CSS — base + level-tabs, enterprise-card, tradeoff-table, story-section, interview-prep, analogy-box
  assets/app.js                 ✅ Full JS — NAV_ITEMS (8 groups, 28 concepts), initLevelTabs(), sidebar, theme, search, TOC
  concepts/
    load-balancer.html          ✅ Done
    caching.html                ✅ Done
```

**26 concept pages still pending.**

## Your task: build the next batch of concept pages

Build these 4 in parallel (one agent per page):
1. `concepts/rest.html` — Category: APIs, Difficulty: Beginner-Intermediate
2. `concepts/databases.html` — Category: Data, Difficulty: Beginner
3. `concepts/authentication.html` — Category: Security, Difficulty: Beginner-Intermediate
4. `concepts/microservices.html` — Category: Architecture, Difficulty: Intermediate-Advanced

## How to build each page

Read these files before generating:
- `CLAUDE.md` — has the full page template, 9-section structure, CSS classes, filename map
- `system-design-academy-portal/concepts/load-balancer.html` — reference implementation (use as structural model)
- `system-design-academy-portal/assets/style.css` — all CSS classes available

Each concept page must:
1. Use the 9-section template from CLAUDE.md
2. Use `../assets/style.css` and `../assets/app.js` (defer)
3. Include inline level-tab script above app.js (see CLAUDE.md)
4. Have `data-page-id="CONCEPT-ID"` on body
5. Breadcrumb: `<a href="../index.html">Academy</a> → CATEGORY → CONCEPT NAME`
6. Level tabs: beginner / intermediate / advanced / expert panels
7. Mermaid diagram in beginner panel
8. `.tradeoff-table` with `.good`/`.bad` cells in advanced panel
9. `.enterprise-card` for enterprise use case section
10. `.interview-prep` with one-liner, structured answer, follow-ups, mistakes

## Content source

No pre-written MD for these concepts. Generate expert-quality content:
- Real companies (Netflix, Uber, Amazon, Stripe, GitHub — pick distinct ones per concept)
- Concrete numbers (latency, scale, error rates)
- Real tools by name (PostgreSQL, Redis, JWT, OAuth2, Spring Boot, Node.js, etc.)
- Beginner: analogy + plain language. Intermediate: request flows. Advanced: trade-offs + when NOT to use. Expert: enterprise, compliance (GDPR/HIPAA/SOC2), cost model, multi-region.

## After building the 4 pages

Run the next batch:
5. `concepts/api-gateway.html` — Category: Networking
6. `concepts/message-queues.html` — Category: Messaging
7. `concepts/circuit-breaker.html` — Category: Reliability
8. `concepts/rate-limiting.html` — Category: Reliability

Keep batching until all 26 pending pages are done.

## Full pending concept list (26 remaining)

**APIs:** rest, graphql, grpc, api-gateway
**Data:** databases, sql-vs-nosql, indexing, sharding, replication
**Security:** authentication, authorization, oauth, jwt
**Networking:** cdn, api-gateway
**Messaging:** message-queues, pub-sub, event-driven-architecture, kafka-streaming
**Reliability:** circuit-breaker, rate-limiting, retry-idempotency, cap-theorem
**Architecture:** microservices, monolith, cqrs, saga

## Filename map (must match exactly — from app.js NAV_ITEMS)

| Concept | File |
|---|---|
| REST | rest.html |
| GraphQL | graphql.html |
| gRPC | grpc.html |
| API Gateway | api-gateway.html |
| CDN | cdn.html |
| Databases | databases.html |
| SQL vs NoSQL | sql-vs-nosql.html |
| Indexing | indexing.html |
| Sharding | sharding.html |
| Replication | replication.html |
| Authentication | authentication.html |
| Authorization | authorization.html |
| OAuth | oauth.html |
| JWT | jwt.html |
| Message Queues | message-queues.html |
| Pub/Sub | pub-sub.html |
| Event-Driven Architecture | event-driven-architecture.html |
| Kafka Streaming | kafka-streaming.html |
| Circuit Breaker | circuit-breaker.html |
| Rate Limiting | rate-limiting.html |
| Retry & Idempotency | retry-idempotency.html |
| CAP Theorem | cap-theorem.html |
| Microservices | microservices.html |
| Monolith | monolith.html |
| CQRS | cqrs.html |
| Saga Pattern | saga.html |

## Do NOT

- Regenerate `assets/style.css` or `assets/app.js`
- Touch anything in `software-architect-learning-portal/`
- Regenerate `index.html`
- Add any new CSS classes — all needed classes already exist in style.css
