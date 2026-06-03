# /build-academy — Orchestrator: auto-implement all pending academy concept pages

Fully automated pipeline: detect pending concepts → build in parallel batches → validate → report.

## Usage
```
/build-academy              # build ALL pending concepts (full auto)
/build-academy next         # build only next batch
/build-academy next 2       # build next 2 batches
/build-academy status       # show status only
```

## Step 1 — Detect pending concepts

Glob `system-design-academy-portal/concepts/*.html`. Compare against the 28-concept list below.
Built = file exists. Pending = file missing.

## Step 2 — Batch map (parallel within batch, sequential across batches)

| Batch | Concepts | Files |
|-------|----------|-------|
| A | REST, Databases, Authentication, Microservices | rest, databases, authentication, microservices |
| B | API Gateway, Message Queues, Circuit Breaker, Rate Limiting | api-gateway, message-queues, circuit-breaker, rate-limiting |
| C | GraphQL, gRPC, CDN, SQL vs NoSQL | graphql, grpc, cdn, sql-vs-nosql |
| D | Indexing, Sharding, Replication, Authorization | indexing, sharding, replication, authorization |
| E | OAuth, JWT, Pub/Sub, Event-Driven Architecture | oauth, jwt, pub-sub, event-driven-architecture |
| F | Kafka Streaming, Retry & Idempotency, CAP Theorem, Monolith | kafka-streaming, retry-idempotency, cap-theorem, monolith |
| G | CQRS, Saga Pattern | cqrs, saga |

Skip batches where all files exist. Build only batches with ≥1 pending file.

## Step 3 — Sub-agent briefing (use EXACT format per concept)

```
You are building one HTML concept page for the System Design Academy portal.

PROJECT ROOT: C:/Users/mhaque/Downloads/Myself/Coding/FlowArchitect
YOUR FILE: system-design-academy-portal/concepts/<FILENAME>.html
CONCEPT: <CONCEPT NAME>
CATEGORY: <CATEGORY>
DIFFICULTY: <DIFFICULTY>
DATA-PAGE-ID: <filename-without-extension>

REFERENCE (read before writing):
- system-design-academy-portal/concepts/load-balancer.html — structural model (read first)
- system-design-academy-portal/assets/style.css — all available CSS classes

MANDATORY 9-SECTION STRUCTURE:
1. Page header: .concept-meta-bar (Category/Difficulty/Read time) + .page-title + .page-subtitle + badges (.badge-all-levels or difficulty badge)
2. h2#definition: .analogy-box + why-it-matters paragraph
3. h2#story: .story-section with .story-scenario, .story-problem, .story-solution, .story-outcome divs
4. h2#learn: .level-tabs with 4 panels (beginner/intermediate/advanced/expert)
   - beginner: plain analogy + Mermaid diagram in .mermaid-wrapper
   - intermediate: request flow, how it works
   - advanced: trade-offs table (.tradeoff-table with .good/.bad cells), when NOT to use
   - expert: enterprise scale, compliance (GDPR/HIPAA/SOC2 where relevant), cost model, multi-region
5. h2#enterprise: .enterprise-card with real company + concrete numbers
6. h2#mistakes: 3× .common-mistake
7. h2#interview: .interview-prep with .interview-one-liner, .interview-structured, .interview-followups, .interview-mistakes
8. h2#tradeoffs: .decision-table
9. Related concepts: flex row of 3–4 concept links

HEAD (exact):
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><CONCEPT> — System Design Academy</title>
  <script>if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class'}</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body data-page-id="<CONCEPT-ID>" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">

SIDEBAR SHELL:
<aside id="sidebar">
  <div class="logo">
    <div style="font-size:1.1rem;font-weight:800;color:white;">System Design</div>
    <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:2px;">Academy by FlowArchitect</div>
  </div>
  <input type="text" id="search-input" placeholder="Search concepts... (Ctrl+K)">
  <nav id="sidebar-nav"></nav>
</aside>
<div id="sidebar-overlay"></div>
<div id="mobile-header">
  <button id="hamburger">☰</button>
  <span style="font-weight:700;"><CONCEPT NAME></span>
  <button id="theme-toggle">🌙</button>
</div>
<main id="main-content">
  <div class="top-bar">
    <span class="breadcrumb"><a href="../index.html">Academy</a> <span>→</span> <CATEGORY> <span>→</span> <CONCEPT NAME></span>
    <button id="theme-toggle">🌙</button>
  </div>
  <div class="page-content">
    <!-- 9 sections here -->
  </div>
</main>

SCRIPT (before app.js):
<script>
  document.querySelectorAll('.level-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.level;
      const tabs = btn.closest('.level-tabs');
      tabs.querySelectorAll('.level-tab-btn').forEach(b => b.classList.remove('active'));
      tabs.querySelectorAll('.level-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      tabs.querySelector(`.level-tab-panel[data-level="${level}"]`).classList.add('active');
    });
  });
  mermaid.initialize({ startOnLoad: true, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default' });
</script>
<script src="../assets/app.js" defer></script>

CONTENT RULES:
- Real companies with concrete numbers (Netflix/Uber/Amazon/Stripe/GitHub — pick distinct ones)
- Real tool names (PostgreSQL, Redis, Kafka, HAProxy, NGINX, etc.)
- All code blocks in .code-wrapper > pre > code
- All h2 need id + class="section-title"
- Write COMPLETE HTML — no placeholders, no TODO, no truncation
- Minimum 400 lines

TOPIC OUTLINE:
<insert topic outline from specs below>

Write the complete file. Report filename and line count when done.
```

## Step 4 — Concept specs (insert relevant spec in each agent briefing)

**rest** — Category: APIs, Difficulty: Beginner-Intermediate
Topics: HTTP methods (GET/POST/PUT/DELETE/PATCH), status codes, statelessness, resource design, versioning (/v1/), pagination (cursor vs offset), HATEOAS, idempotency. Real company: GitHub REST API. Mermaid: request-response flow. Tradeoffs vs GraphQL/gRPC. Common mistakes: using GET for mutations, wrong status codes, no versioning.

**databases** — Category: Data, Difficulty: Beginner
Topics: RDBMS vs NoSQL overview, ACID properties, transactions, indexes, query planning, connection pooling, read replicas, when to use PostgreSQL vs MongoDB vs Redis vs Cassandra. Real company: Instagram (PostgreSQL at scale). Mermaid: database access patterns. Tradeoffs: consistency vs availability. Common mistakes: no indexes, N+1 queries, single point of failure.

**authentication** — Category: Security, Difficulty: Beginner-Intermediate
Topics: Auth vs authz, session-based vs token-based, cookie security (HttpOnly/Secure/SameSite), password hashing (bcrypt/argon2), MFA, SSO, OAuth2 vs OIDC overview, brute-force protection. Real company: Stripe (API key auth + webhook signatures). Mermaid: session vs JWT flow comparison. Common mistakes: storing passwords in plaintext, weak secrets, no rate limiting on login.

**microservices** — Category: Architecture, Difficulty: Intermediate-Advanced
Topics: Why microservices, service boundaries (DDD bounded contexts), inter-service communication (sync REST/gRPC vs async events), service discovery, distributed tracing, data ownership, database-per-service. Real company: Amazon (service decomposition). Mermaid: monolith vs microservices decomposition. Tradeoffs: operational complexity, network latency, eventual consistency. Common mistakes: too fine-grained services, shared databases.

**api-gateway** — Category: Networking, Difficulty: Intermediate
Topics: What API gateway does (routing, auth, rate limiting, SSL termination, request transformation), BFF pattern, Kong vs NGINX vs AWS API Gateway vs Traefik, circuit breaking at gateway layer. Real company: Netflix Zuul → Spring Cloud Gateway migration. Mermaid: gateway routing architecture. Tradeoffs vs service mesh. Common mistakes: too much business logic in gateway, single point of failure.

**message-queues** — Category: Messaging, Difficulty: Intermediate
Topics: Why queues (decoupling, buffering, async processing), FIFO vs priority queues, at-most-once vs at-least-once vs exactly-once delivery, dead letter queues, RabbitMQ vs SQS vs ActiveMQ. Real company: Stripe payment processing queue. Mermaid: producer-queue-consumer flow. Tradeoffs vs direct calls. Common mistakes: no DLQ, unbounded queue growth, not handling duplicate messages.

**circuit-breaker** — Category: Reliability, Difficulty: Intermediate-Advanced
Topics: Cascade failure problem, circuit states (closed/open/half-open), Hystrix vs Resilience4j, timeout vs circuit breaker difference, bulkhead pattern, fallback strategies. Real company: Netflix (Hystrix origin story). Mermaid: state machine diagram. Tradeoffs: stale data, complexity. Common mistakes: too aggressive thresholds, no fallback, not monitoring circuit state.

**rate-limiting** — Category: Reliability, Difficulty: Intermediate
Topics: Why rate limit (abuse prevention, cost control, fairness), algorithms (token bucket, leaky bucket, sliding window, fixed window), per-user vs per-IP vs per-endpoint, distributed rate limiting (Redis), HTTP 429 response. Real company: GitHub API (5000 req/hr). Mermaid: token bucket algorithm. Tradeoffs: accuracy vs performance. Common mistakes: per-instance not global, no retry-after header.

**graphql** — Category: APIs, Difficulty: Intermediate
Topics: Schema definition, queries vs mutations vs subscriptions, resolver chain, N+1 problem (DataLoader), fragments, introspection, persisted queries, Apollo vs Relay. Real company: GitHub GraphQL API. Mermaid: query resolution tree. Tradeoffs vs REST. Common mistakes: over-fetching with no field limits, no query depth limiting, missing DataLoader.

**grpc** — Category: APIs, Difficulty: Intermediate-Advanced
Topics: Protocol Buffers, service definitions (.proto), unary vs streaming (client/server/bidirectional), HTTP/2 multiplexing, code generation, gRPC-web for browsers. Real company: Google internal + Uber (data plane). Mermaid: protobuf serialization vs JSON. Tradeoffs vs REST. Common mistakes: ignoring error codes (use gRPC status codes not HTTP), no deadline/timeout, breaking changes in proto schema.

**cdn** — Category: Networking, Difficulty: Beginner-Intermediate
Topics: PoP locations, edge caching, cache-control headers, TTL, origin shield, cache invalidation, dynamic vs static content, CDN failover, Cloudflare vs Fastly vs CloudFront. Real company: Cloudflare at scale. Mermaid: request flow with/without CDN. Tradeoffs: stale content, cost. Common mistakes: caching authenticated content, wrong cache-control headers, not purging on deploy.

**sql-vs-nosql** — Category: Data, Difficulty: Beginner-Intermediate
Topics: Relational model (normalized, ACID, joins), document (MongoDB), key-value (Redis/DynamoDB), wide-column (Cassandra), graph (Neo4j). Decision framework: consistency requirements, query patterns, scale needs, schema flexibility. Real company: Airbnb (polyglot persistence). Mermaid: data model comparison. Common mistakes: using NoSQL just because it's "faster", ignoring consistency requirements.

**indexing** — Category: Data, Difficulty: Intermediate
Topics: B-tree vs hash indexes, composite indexes, covering indexes, partial indexes, index selectivity, EXPLAIN/EXPLAIN ANALYZE, when indexes hurt (write-heavy), full-text search. Real company: Slack message search at scale. Mermaid: B-tree lookup visual. Tradeoffs: read speed vs write overhead, storage. Common mistakes: over-indexing, wrong column order in composite index, missing index on FK.

**sharding** — Category: Data, Difficulty: Advanced
Topics: Horizontal partitioning, shard key selection, range vs hash vs directory sharding, hotspot problem, cross-shard queries, resharding, consistent hashing. Real company: MongoDB sharded cluster. Mermaid: consistent hash ring. Tradeoffs: operational complexity, cross-shard joins. Common mistakes: bad shard key (sequential IDs → hotspot), not planning for resharding.

**replication** — Category: Data, Difficulty: Advanced
Topics: Leader-follower vs multi-leader vs leaderless, sync vs async replication, replication lag, read-your-writes consistency, conflict resolution (CRDTs, last-write-wins), Raft/Paxos overview. Real company: PostgreSQL streaming replication. Mermaid: leader-follower replication flow. Tradeoffs: consistency vs availability. Common mistakes: reading from replica without accounting for lag, no failover testing.

**authorization** — Category: Security, Difficulty: Intermediate
Topics: RBAC vs ABAC vs ReBAC, permission hierarchy, principle of least privilege, policy engines (OPA/Casbin), resource-level vs field-level permissions, audit logging. Real company: Google Zanzibar (ReBAC). Mermaid: RBAC permission check flow. Tradeoffs: flexibility vs complexity. Common mistakes: checking authz in UI only, no audit log, hardcoded roles.

**oauth** — Category: Security, Difficulty: Intermediate
Topics: OAuth2 flows (authorization code + PKCE, client credentials, device flow), scopes, access tokens vs refresh tokens, token storage, OAuth2 vs OIDC, common providers (Google/GitHub/Auth0). Real company: GitHub OAuth App flow. Mermaid: authorization code + PKCE flow. Common mistakes: using implicit flow (deprecated), storing tokens in localStorage, no PKCE.

**jwt** — Category: Security, Difficulty: Intermediate
Topics: Header.payload.signature structure, signing (HS256 vs RS256), claims (iss/sub/exp/aud), stateless validation, token revocation problem, refresh token rotation, JWK endpoints. Real company: Auth0 JWT usage. Mermaid: JWT validation flow. Tradeoffs vs opaque tokens. Common mistakes: no expiry, not validating audience, storing secrets in payload, ignoring token revocation.

**pub-sub** — Category: Messaging, Difficulty: Intermediate
Topics: Publisher-subscriber decoupling, topics vs queues, fan-out, message filtering, push vs pull consumers, ordering guarantees, Google Pub/Sub vs SNS+SQS. Real company: Google Cloud Pub/Sub at YouTube scale. Mermaid: pub-sub fan-out diagram. Tradeoffs vs point-to-point. Common mistakes: no message ordering when required, ignoring duplicate delivery.

**event-driven-architecture** — Category: Messaging, Difficulty: Advanced
Topics: Events vs commands vs queries, event sourcing, choreography vs orchestration, eventual consistency, saga pattern preview, outbox pattern (dual-write problem), CQRS connection. Real company: Shopify (event-driven order processing). Mermaid: choreography vs orchestration comparison. Tradeoffs: debugging complexity, eventual consistency challenges. Common mistakes: fat events vs thin events, no schema registry.

**kafka-streaming** — Category: Messaging, Difficulty: Advanced
Topics: Kafka architecture (brokers, topics, partitions, offsets, consumer groups), producer configs (acks, idempotent), Kafka Streams vs ksqlDB, exactly-once semantics, compacted topics, schema registry (Avro), Kafka Connect. Real company: LinkedIn (Kafka origin). Mermaid: partition/offset/consumer group diagram. Tradeoffs vs RabbitMQ. Common mistakes: too few partitions, no schema registry, consumer group lag ignored.

**retry-idempotency** — Category: Reliability, Difficulty: Intermediate
Topics: Why retry (transient failures), exponential backoff + jitter, retry budgets, idempotency keys, HTTP methods and idempotency (GET/PUT/DELETE idempotent, POST not), database idempotency (upsert), Stripe idempotency keys. Real company: Stripe payment retry logic. Mermaid: retry with backoff timeline. Tradeoffs: duplicate operations, retry storms. Common mistakes: retry non-idempotent ops, no jitter (thundering herd), infinite retries.

**cap-theorem** — Category: Architecture, Difficulty: Advanced
Topics: Consistency (all nodes see same data), Availability (every request gets response), Partition Tolerance (must have this in distributed systems), CP vs AP systems, PACELC (adds latency dimension), real-world examples (Cassandra AP, HBase CP, Zookeeper CP). Real company: Amazon DynamoDB (AP by default, tunable). Mermaid: CAP triangle + examples plotted. Tradeoffs: this IS the tradeoff framework. Common mistakes: claiming all 3, ignoring PACELC, applying to single-node systems.

**monolith** — Category: Architecture, Difficulty: Beginner-Intermediate
Topics: Modular monolith vs distributed monolith vs microservices, when monolith wins (startup speed, simple ops, team size), strangler fig pattern for migration, vertical slice architecture. Real company: Shopify (Rails monolith at scale). Mermaid: monolith vs modular monolith vs microservices. Tradeoffs vs microservices. Common mistakes: dismissing monoliths, deploying monolith like microservices (no benefit), big ball of mud.

**cqrs** — Category: Architecture, Difficulty: Advanced
Topics: Separate read/write models, command handlers, query handlers, event store, read-side projections, CQRS + Event Sourcing combination, when to use (complex domain, read/write scale mismatch). Real company: Microsoft Azure Event Store pattern. Mermaid: command vs query path. Tradeoffs: eventual consistency, complexity. Common mistakes: using CQRS everywhere, not handling projection failures, stale read replicas.

**saga** — Category: Architecture, Difficulty: Advanced
Topics: Distributed transaction problem, choreography-based saga vs orchestration-based saga, compensating transactions, saga state machine, failure modes, saga vs 2PC. Real company: Uber (trip lifecycle saga). Mermaid: orchestration saga with compensation flow. Tradeoffs: complexity, debugging. Common mistakes: no compensation transactions, not idempotent compensations, too many steps.

## Step 5 — Validation after each batch

Run /validate-concept on each new file. If FAIL: patch inline with Edit tool, do not re-run full agent.

## Step 6 — Final report

```
BUILD COMPLETE
==============
Built: N concepts
Validated: N/N passed
Failed: 0 (or list)

Academy progress: ██████████████████████ N/28 (N%)

All concepts at: system-design-academy-portal/concepts/
Open index.html to verify.
```

## Token efficiency rules

- Pass all specs inline — agents read only load-balancer.html as reference (NOT CLAUDE.md)
- Do NOT re-read CLAUDE.md inside this orchestrator — it is already in context
- Parallel agents per batch — never sequential when batch allows parallel
- Validation: grep for key classes, don't read full file
