---
concept-name: event-driven-architecture
category: Messaging
difficulty-range: All Levels
related-concepts: Message Queues, Pub/Sub, Kafka-style Event Streaming, Event Sourcing, CQRS, Saga Pattern, Dead Letter Queue
last-updated: 2026-05-28
generated-by: human
reviewed: true
---

# Event-Driven Architecture

## Metadata
- **Category**: Messaging
- **One-Line Definition**: A system design pattern where components communicate by producing and consuming events rather than calling each other directly.
- **Simple Analogy**: A newspaper. When something happens (a new edition publishes), the newspaper doesn't call every subscriber individually. It publishes the paper. Anyone who subscribed receives it. They read it when they're ready. The newspaper doesn't wait for each subscriber to finish reading before printing the next edition.
- **Why It Matters**: In a direct-call system (synchronous), when Service A calls Service B and Service B is slow or down, Service A is blocked or fails too. Event-driven decouples this: Service A publishes an event and moves on. Service B processes it when ready. They never directly depend on each other's uptime, speed, or implementation. At scale, this enables systems where dozens of services react to the same business event without any one service knowing the others exist.
- **Related Concepts**: [Message Queues](../messaging/message-queues.md), [Pub/Sub](../messaging/pub-sub.md), [Kafka-style Event Streaming](../messaging/kafka-event-streaming.md), [Event Sourcing](../messaging/event-sourcing.md), [CQRS](../messaging/cqrs.md), [Saga Pattern](../reliability/saga-pattern.md)

---

## Short Story

### Scenario
An e-commerce company has five services: Order Service, Payment Service, Inventory Service, Notification Service, and Analytics Service. When a customer places an order, all five services need to act on it.

### The Problem
Originally, the Order Service called each service sequentially: first Payment, then Inventory, then Notification, then Analytics. One morning, the Analytics Service deployed a bad update and started responding slowly (8-second timeouts). Every single order now took 8+ seconds to complete — not because payment or inventory was slow, but because the Order Service was blocking on Analytics. Customer-facing checkout times spiked. Conversions dropped 40%.

### The Solution
The team refactored to event-driven architecture. The Order Service now publishes one event: `OrderPlaced`. It writes the event to a message broker (Apache Kafka) and immediately returns a success response to the customer. Each downstream service — Payment, Inventory, Notification, Analytics — subscribes to `OrderPlaced` and processes it independently at its own pace.

### What Changed
Analytics being slow no longer affects checkout. Analytics processes events 30 seconds behind, which is fine — business intelligence doesn't need real-time consistency. Payment and Inventory process in under 500ms. New services can subscribe to `OrderPlaced` without touching the Order Service. The checkout flow is now decoupled from every downstream dependency.

---

## Enterprise Use Case

### Company Type
Large-scale financial services platform (e.g., payments or banking)

### Context
A payments platform processes 2M transactions per day across 20 internal services: fraud detection, ledger updates, compliance logging, customer notifications, partner webhooks, reporting, and risk scoring. Each transaction must trigger 8-12 downstream actions. Some are time-critical (fraud check: under 200ms). Others are asynchronous (compliance log: within 1 hour is fine). System must be auditable, reliable, and handle 100K events/minute at peak.

### How It's Used
1. **Event spine**: Apache Kafka with 6 partitions per topic. Core topics: `transaction.initiated`, `transaction.authorized`, `transaction.settled`, `transaction.failed`.
2. **Consumer groups**: Each service runs as a separate Kafka consumer group. Fraud detection consumes `transaction.initiated` and must respond before `transaction.authorized` is published (synchronous gate within async flow). All others are fully async.
3. **Event schema registry**: All events use Avro schemas registered in Confluent Schema Registry. Schema evolution rules enforced — no breaking changes without version bump.
4. **Exactly-once semantics**: Financial ledger service uses Kafka transactions for exactly-once writes. Idempotency keys on all downstream consumers prevent double-processing on retry.
5. **Dead letter queue**: Any event that fails processing 3 times routes to `transaction.dead-letter`. On-call team alerted. Manual review and replay available.
6. **Event sourcing integration**: The ledger service treats the Kafka event log as the source of truth. Account balances are computed by replaying events from the beginning.

### Business Impact
Before: Synchronous chain of service calls. One slow downstream (risk scoring, ~2 seconds) added 2 seconds to every transaction. 3 incidents in 6 months where one downstream brought down the full payment flow.
After: Transaction authorization under 300ms (only fraud check is synchronous). Risk scoring, compliance, and reporting async with no user impact. Zero payment outages caused by downstream service failures in 14 months. New compliance requirement (new GDPR log added) deployed in 2 days — no changes to any existing service.

### Lessons
1. **Not everything should be async** — fraud checks and payment authorization are synchronous gates within an otherwise event-driven system. Identify which consumers must respond before the flow continues. Build hybrid patterns, not pure async.
2. **Event schema evolution is a first-class concern** — once events are published to Kafka, many services depend on them. Breaking schema changes break all consumers. Use a schema registry and enforce backward compatibility.
3. **Replay capability is a superpower** — ability to replay events to a new service or replay from a point in time (for bug recovery) changes what's possible operationally. Design for it from day one.

---

## UI Template Idea

### Template Type
Event Flow Visualizer (Template 8) + Interactive Request Journey (Template 3)

### Screen Description
A canvas with three horizontal rows. Top row: three Producer icons (Order Service, Payment Service, User Service) with a "Publish Event" button on each. Middle row: a Kafka-style broker with visible topic lanes — `order.placed`, `payment.completed`, `user.registered` — each lane shows a live scrolling list of recent events. Bottom row: five Consumer icons (Inventory, Notification, Analytics, Shipping, Loyalty). Connecting arrows from producers to topics and from topics to consumers show subscription mappings. When an event is published, an animated bubble travels from producer → topic lane → all subscribed consumers. Each consumer shows a processing indicator (spinner) and then a checkmark.

### User Interactions
- Click "Publish Event" on Order Service → `OrderPlaced` event bubble animates through the system
- Click any consumer icon → sidebar shows its event subscription list and processing status
- Toggle "Slow Consumer" on Analytics → it falls behind, other consumers unaffected
- "Kill Consumer" on Notifications → events queue in broker, consumer revives and processes backlog
- Toggle "Show Event Payload" → bubbles expand to show JSON event structure
- "Inject Failure" → one consumer throws an error, DLQ routing animation plays

### Learning Outcome
Learner understands that producers and consumers are independent (decoupled), that one slow or failed consumer doesn't affect others, and that the broker acts as a durable buffer that enables temporal decoupling (produce now, consume later).

---

## Tutorial Path

### Beginner Explanation
Imagine a hotel. When a guest checks in, the front desk doesn't personally walk to the restaurant to reserve a table, call the porter to take the luggage, and phone the concierge about preferences. Instead, they post a note on a shared board: "New Guest: Room 204. VIP." Anyone who needs to act on that information reads the board on their own schedule.

**Event-driven architecture** works the same way. When something important happens in a system (a user places an order, a payment is processed, a video is uploaded), a **producer** publishes a message called an **event** to a shared channel called a **message broker**. Any service that cares about that event is a **consumer** — it reads the event from the broker and acts on it independently.

The big benefit: the service that created the event doesn't wait for anyone else. It publishes and moves on. Consumers run at their own speed. They don't know about each other. Adding a new consumer (a new feature) doesn't require changing the event producer at all.

**Key Terms**:
- **Event**: A message describing something that happened — "OrderPlaced", "UserSignedUp", "PaymentFailed".
- **Producer**: The service that creates and publishes an event.
- **Consumer**: A service that subscribes to an event and reacts to it.
- **Message Broker**: The intermediary that holds events and delivers them to consumers (examples: Kafka, RabbitMQ, AWS SNS/SQS).
- **Decoupling**: Producers and consumers don't know about each other — they only share the event format.

**Diagram Idea**: One box "Order Service (Producer)" → arrow labeled "OrderPlaced event" → one box "Message Broker" → three arrows to "Payment Service (Consumer)", "Inventory Service (Consumer)", "Notification Service (Consumer)".

---

### Intermediate Explanation
Event-driven architecture has two primary messaging patterns. Understanding both is essential.

**Message Queue (Point-to-Point)**:
One producer, one consumer. A message is consumed once and removed. Used for task distribution — "process this order", "resize this image". Worker pools subscribe to a queue. Each message is processed by exactly one worker.

**Pub/Sub (Publish-Subscribe)**:
One producer, many consumers. Each consumer gets a copy of every event. Used for notifications and fan-out — "this order was placed, and everyone who cares needs to know". Kafka, AWS SNS, Google Pub/Sub operate this way.

**Event Flow in a Real System**:
1. User places order at `/checkout`
2. Order Service validates the order and persists it to the database
3. Order Service publishes `OrderPlaced` event to message broker with payload: `{orderId, userId, items, total, timestamp}`
4. Order Service returns HTTP 202 Accepted to the user immediately
5. Payment Service (subscriber) receives event, charges the card, publishes `PaymentCompleted`
6. Inventory Service (subscriber) receives `OrderPlaced`, decrements stock
7. Notification Service (subscriber) receives `OrderPlaced`, sends confirmation email
8. Analytics Service (subscriber) receives `OrderPlaced`, updates conversion funnel metrics

**Common Configurations**:
- **At-least-once delivery**: Broker retries on consumer failure. Consumers must be idempotent (safe to process same event twice).
- **At-most-once delivery**: Event delivered once; if consumer fails, event is lost. Fast but unreliable. Used for non-critical telemetry.
- **Exactly-once delivery**: Kafka Transactions provide this at significant complexity cost. Use for financial operations.

**Failure Scenario**: Notification Service crashes mid-event-processing. With at-least-once delivery, the broker retries the `OrderPlaced` event after the consumer ACK timeout. When Notification Service recovers, it processes the event. Customer gets their confirmation email, possibly 5 minutes late. Order processing and payment were unaffected.

---

### Advanced Explanation
Event-driven architecture trades simplicity and consistency for scale and resilience.

**Consistency Challenges**:
In a synchronous system, an operation either completes fully or fails. In event-driven, "success" to the user means "event published" — not "all consumers processed it". Payment might succeed but inventory decrement might fail without the Order Service knowing. This is **eventual consistency** — the system converges on the correct state, but not immediately. Managing this requires careful design.

**Saga Pattern for Distributed Transactions**: When multiple services must collectively succeed or collectively roll back, events coordinate a saga. Each step publishes a success event (triggering the next step) or a failure event (triggering compensating transactions). More complex than a database transaction, but works across service boundaries.

**Trade-Off Table**:

| Approach | Pros | Cons | Best For |
|---|---|---|---|
| Synchronous REST calls | Simple, immediate consistency, easy debugging | Tight coupling, cascading failures, blocking | Simple CRUD, low-scale systems |
| Message Queue (point-to-point) | Decouples timing, natural load buffering | At-most/at-least-once semantics, no fan-out | Task queues, worker pools |
| Pub/Sub | Fan-out, producer ignorance of consumers | Consumer management complexity | Notification, analytics, multi-consumer scenarios |
| Event Streaming (Kafka) | Durable, replayable, high throughput | Operational complexity, schema management | High-volume events, audit trails, event sourcing |
| Choreography (events only) | No central coordinator | Hard to trace distributed flows | Loosely coupled independent services |
| Orchestration (central saga) | Explicit control flow, easier to debug | Central coordinator is a coupling point | Complex business processes with compensation |

**Scale Considerations**:
- At 1K events/sec: Any message broker works. RabbitMQ, AWS SQS are fine. Kafka is over-engineering.
- At 100K events/sec: Kafka's partitioned log architecture shines. Partition count defines parallelism. Consumer lag monitoring critical.
- At 1M events/sec: Kafka cluster with 50+ partitions per topic. Consumer group coordination overhead becomes visible. Consider compacted topics for state rather than unbounded log growth.

**When NOT to Use**:
- **When you need immediate consistency**: Bank transfer where debit and credit must be atomic. Use a database transaction.
- **When the system is simple and small**: Adding a message broker to a 2-service system adds ops burden for no resilience benefit.
- **When debugging is already hard**: Async event flows are significantly harder to trace than synchronous calls. If your team struggles with observability, add it first.

**Performance Notes**: Publishing an event to Kafka: ~2-5ms. Consumer processing latency: depends entirely on consumer logic. Total end-to-end latency for async consumers is unbounded — designed in, not a bug. Consumer lag (how far behind current offset) is the key operational metric.

---

### Expert Explanation
At enterprise scale, event-driven architecture is the backbone of organizational decoupling, not just technical decoupling.

**Enterprise Considerations**:

- **Multi-region**: Event streams replicate across regions using Kafka MirrorMaker 2 or Confluent Replication. Consumers in each region read from local cluster. Cross-region replication adds 50-200ms lag. Design for eventual cross-region consistency or accept regional independence with reconciliation.

- **Compliance**: Events often contain personal data. GDPR "right to erasure" is architecturally complex in event logs — you can't delete from an immutable log. Patterns: event compaction (replace sensitive events with tombstones), encryption with per-user keys (revoke key to effectively erase), or strict PII exclusion from events (store PII in a mutable store, events reference IDs only). Events containing PHI (HIPAA) must use encryption at rest (Kafka topic encryption), access control per topic, and audit logs for all consumer group access.

- **Security posture**: Kafka ACLs (per-topic read/write) enforced. mTLS between producers, brokers, and consumers. Schema registry access controlled — only authorized producers can register new schemas. Event data must not contain secrets or tokens — events are stored durably and readable by any consumer with topic access.

- **Cost model**: Kafka (self-managed on EC2): ~$5K-15K/month for a 3-broker cluster handling 100K events/sec. Confluent Cloud (managed): $0.10-0.30 per GB ingested — at 100K events/sec × 1KB average: ~$25K-75K/month. Storage cost adds up: 200GB/day retention × 7 days × $0.023/GB = ~$30/day. Long retention policies (90 days, 1 year) for compliance need explicit cost planning.

- **Team ownership**: Platform/data engineering owns the Kafka cluster and schema registry. Application teams own topics within their domain (domain-bounded topic ownership). Cross-team schemas need RFC process (schema change proposal, review, versioning). Consumer group ownership tracked in a service catalog. No team can consume another team's events without a formal subscription (data contract).

**Migration Path**: Moving from synchronous service calls to event-driven:
1. Identify one high-value, non-critical integration (e.g., analytics, notifications — not payments)
2. Introduce message broker alongside existing synchronous calls
3. New consumers subscribe to events. Old synchronous calls still run in parallel (dual-write period)
4. Validate new consumers produce correct results for 2 weeks
5. Remove synchronous calls to converted consumers
6. Repeat for next integration, building team confidence

**Vendor Evaluation**:
| Option | Self-managed Kafka | Confluent Cloud | AWS Kinesis/MSK | GCP Pub/Sub |
|---|---|---|---|---|
| Cost | Low infra, high ops | High per-GB | Medium | Low for low volume |
| Control | Full | Good | Medium | Limited |
| Ops overhead | Very high | Low | Medium | Very Low |
| Replay / retention | Configurable | Configurable | 7 days max (Kinesis) | 7 days |
| Schema management | Manual + Registry | Built-in | Manual | Manual |

**Production Operations Checklist**:
- [ ] Consumer lag monitoring per consumer group (alert on lag > 10K for real-time, > 100K for analytics)
- [ ] Dead letter queue configured per consumer with alerting on DLQ depth > 0
- [ ] Schema registry enforcing compatibility (BACKWARD or FULL)
- [ ] Topic ACLs reviewed quarterly (access audit)
- [ ] Retention policy documented and cost-estimated for each topic
- [ ] Idempotency keys implemented in all consumers processing financial events
- [ ] Event replay procedure tested (can you replay 24 hours of events to a new consumer?)
- [ ] mTLS certificates expiry monitored (alert at 30 days)
- [ ] Runbook for broker leadership election failures
- [ ] PII exclusion from event payloads audited

---

## Common Mistakes

1. **Making everything async without identifying synchronous gates**: Some operations must complete before the response is returned (fraud check, payment authorization, inventory reservation). Forcing these async introduces latency and complexity without benefit. Identify synchronous gates first; make everything else async.

2. **Ignoring consumer idempotency**: With at-least-once delivery (the standard), the same event can be delivered multiple times. If a consumer isn't idempotent, it processes duplicate events — charging a card twice, sending two confirmation emails. Every consumer must handle duplicates gracefully.

3. **No schema evolution strategy**: Publishing `{"orderId": 123, "total": 99.99}` today and `{"orderId": 123, "total": 99.99, "discount": 5.00}` next month breaks every consumer that doesn't expect the new field. Use a schema registry with backward-compatible evolution rules from day one.

---

## Interview Talking Points

### One-Line Answer
Event-driven architecture is a pattern where services communicate by publishing and consuming events through a broker, decoupling producers from consumers in time, scale, and failure.

### Structured Answer (2 minutes)
> "Event-driven architecture decouples services by having them communicate through events rather than direct calls. A producer publishes an event — 'OrderPlaced' — to a broker like Kafka and moves on immediately. Any number of consumers subscribe and process that event independently, at their own pace. For example, Uber uses event-driven architecture so that when a ride completes, a dozen systems — billing, driver rating, surge pricing, analytics, support — all process the event independently without any one of them blocking the others. The main trade-off is that you get resilience and scale but lose immediate consistency — consumers may be seconds or minutes behind, and debugging distributed event flows is significantly harder than tracing synchronous calls."

### Follow-Up Questions to Expect
- "How do you handle failures in event-driven systems? What is a dead letter queue?"
- "What's the difference between a message queue and pub/sub?"
- "How do you achieve exactly-once processing in Kafka?"
- "How would you handle a distributed transaction across multiple event consumers?"
- "What is the Saga pattern, and when would you use it?"

### Common Interview Mistakes
- Describing event-driven as "just using a queue" — misses the pub/sub fan-out, event sourcing implications, and schema governance
- Not addressing consistency — saying "everything is async" without explaining how the system eventually converges or how you handle partial failures

---

## Trade-Offs Summary

| Dimension | Benefit | Cost |
|---|---|---|
| Coupling | Services independent; consumers added without changing producers | Event schema becomes a shared contract — schema changes break consumers |
| Resilience | One slow/failed consumer doesn't affect others | Partial failure is silent — payment succeeds, inventory decrement fails without Order Service knowing |
| Scale | Each consumer scales independently; broker absorbs traffic bursts | Broker becomes infrastructure that must be operated and monitored |
| Debugging | Each service isolated — easy to test in isolation | End-to-end tracing across async event chains is significantly harder |
| Consistency | High throughput; producer doesn't wait | Eventual consistency — consumers may be behind; no atomic cross-service transactions |

---

## Diagram Idea

### Component Diagram
```
[Order Service]  [Payment Service]  [User Service]
  (Producer)         (Producer)       (Producer)
       \                 |                /
        \                ▼               /
         ─────► [Message Broker (Kafka)] ◄─
                         |
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
  [Inventory Svc]  [Notification]  [Analytics]
    (Consumer)      (Consumer)      (Consumer)
```

### Sequence Diagram
```
User → Order Service: POST /orders
Order Service → Database: INSERT order (status: pending)
Order Service → Kafka: PUBLISH OrderPlaced {orderId, userId, items}
Order Service → User: HTTP 202 Accepted {orderId}

-- Async, independent --
Kafka → Payment Service: DELIVER OrderPlaced
Payment Service → Payment Gateway: charge card
Payment Service → Kafka: PUBLISH PaymentCompleted

Kafka → Inventory Service: DELIVER OrderPlaced
Inventory Service → Database: UPDATE stock -= qty
Inventory Service → Kafka: PUBLISH StockReserved

Kafka → Notification Service: DELIVER OrderPlaced
Notification Service → Email Gateway: send confirmation
```

### Failure Diagram
```
[Order Service] → Kafka: PUBLISH OrderPlaced ✓
                              |
                    ┌─────────┼──────────┐
                    ▼         ▼          ▼
             [Payment ✓] [Inventory ✓] [Notification ❌ CRASH]
                                           |
                                    [Broker retries]
                                    (3 attempts, 30s each)
                                           |
                                    [Dead Letter Queue]
                                    Alert: on-call paged
                                    Manual replay when service recovers
```

---

## Agent Execution Prompt

```
CONCEPT: Event-Driven Architecture
CATEGORY: Messaging
LEVEL: [Beginner | Intermediate | Advanced | Expert | All]
TEMPLATE: Load CONCEPT_TEMPLATE.md
CONTEXT: Load shared-context/terminology.md

TASK: Generate the [LEVEL] section for Event-Driven Architecture.

OUTPUT FORMAT:
- Follow CONCEPT_TEMPLATE.md exactly
- Beginner: newspaper analogy, producer/consumer/broker/event defined
- Intermediate: message queue vs pub/sub distinction, full async flow with Kafka, failure scenario
- Advanced: saga pattern referenced, trade-off table with 6 rows, scale at 1K/100K/1M events/sec, when not to use (immediate consistency needed, small system)
- Expert: GDPR "right to erasure" in event log problem, Kafka security (mTLS + ACLs), schema registry, multi-region replication, consumer lag as primary operational metric
- 200-500 words per section

CONSTRAINTS:
- Do not load other concept files
- Reference related concepts by name only (Saga Pattern, CQRS, Event Sourcing)
- Advanced section must address idempotency requirement explicitly
```
