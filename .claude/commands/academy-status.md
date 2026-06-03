# /academy-status — Show System Design Academy build progress

## What to do

1. Glob `system-design-academy-portal/concepts/*.html`
2. Compare against all 28 concept files below
3. Show built vs pending, identify next batch

## All 28 concept files

load-balancer.html, api-gateway.html, cdn.html, rest.html, graphql.html, grpc.html,
caching.html, databases.html, sql-vs-nosql.html, indexing.html, sharding.html, replication.html,
authentication.html, authorization.html, oauth.html, jwt.html,
message-queues.html, pub-sub.html, event-driven-architecture.html, kafka-streaming.html,
circuit-breaker.html, rate-limiting.html, retry-idempotency.html, cap-theorem.html,
microservices.html, monolith.html, cqrs.html, saga.html

## Output format

```
System Design Academy — Build Status
======================================

BUILT (N/28):
  ✅ load-balancer — Load Balancer
  ✅ caching — Caching
  ...

PENDING (N/28):
  ⏳ rest — REST
  ⏳ databases — Databases
  ...

NEXT BATCH: Batch A (rest, databases, authentication, microservices)
COMMAND: /build-academy next

Progress: ████░░░░░░░░░░░░░░░░ N/28 (N%)
```

Keep output compact.
