---
concept-name: caching
category: Data
difficulty-range: All Levels
related-concepts: CDN, Databases, Load Balancer, Replication, Eventual Consistency
last-updated: 2026-05-28
generated-by: human
reviewed: true
---

# Caching

## Metadata
- **Category**: Data
- **One-Line Definition**: Stores copies of frequently requested data in fast-access storage so repeated requests can be served without hitting the original, slower data source.
- **Simple Analogy**: A chef who keeps frequently used ingredients on the counter (the cache) instead of walking to the pantry every time (the database). The counter has limited space, so only the most-used items stay there. When someone asks for salt, the chef grabs it from the counter instantly. For a rare spice, they walk to the pantry.
- **Why It Matters**: Databases are slow relative to memory. A database query might take 50-200ms. Serving the same result from an in-memory cache takes 1-5ms. For read-heavy systems where the same data is requested thousands of times per second, caching is the difference between a system that works and one that doesn't. Without caching, popular content causes database overload even when the data hasn't changed.
- **Related Concepts**: [CDN](../data/cdn.md), [Databases](../data/databases.md), [Replication](../data/replication.md), [Eventual Consistency](../architecture/eventual-consistency.md), [Load Balancer](../infrastructure/load-balancer.md)

---

## Short Story

### Scenario
A social media platform shows a "Trending Topics" sidebar on every page. The trending topics query runs against a database that aggregates 50M posts from the last hour. The query itself takes 800ms and hits a complex aggregation pipeline.

### The Problem
With 5M daily active users, the trending topics query was executing 2 million times per hour — even though the results changed only once every 5 minutes. The database was spending 60% of its capacity running the same expensive query repeatedly. Response times degraded. Other queries slowed. At peak hours, the database became a bottleneck for the entire platform.

### The Solution
The team cached the trending topics result in Redis with a 5-minute TTL (time-to-live). The first request each 5 minutes runs the expensive database query and stores the result in Redis. All subsequent requests within that 5-minute window read from Redis in under 2ms.

### What Changed
Database load dropped 94%. Trending topics response time fell from 800ms to 2ms. The database recovered capacity for user-generated writes and other complex queries. Peak hour performance stabilized. Cost: one Redis cluster.

---

## Enterprise Use Case

### Company Type
High-scale SaaS platform (e.g., Salesforce-scale CRM or analytics dashboard)

### Context
A SaaS analytics platform serves dashboards to 500,000 business users. Dashboard data aggregates transactions across hundreds of tables. Each dashboard has 20+ widgets. During business hours, 50,000 users refresh dashboards simultaneously. The underlying data warehouse processes 10B rows. Warehouse queries take 3-30 seconds. Users expect dashboard load times under 2 seconds.

### How It's Used
1. **Multi-layer caching strategy**:
   - CDN layer: static assets (JS, CSS, images) cached at edge — cache control headers, 30-day TTL
   - Application cache (Redis Cluster): computed dashboard results cached per user per dashboard per time range — 5-minute TTL
   - Query result cache (database-level): materialized views for common aggregations — refreshed every 15 minutes
   - Object cache: individual records (company profiles, user settings) — 60-second TTL with write-through invalidation

2. **Cache warming**: New deployments pre-warm caches for the top 10,000 dashboards (by access frequency) before cutover. Users on hot dashboards never see a cold cache.

3. **Invalidation strategy**: Write-through for user settings (update both cache and DB simultaneously). Cache-aside for analytics results (application reads from cache first, populates on miss). TTL-based expiry for dashboard results (staleness tolerated, freshness not critical).

### Business Impact
Before: Average dashboard load = 8 seconds. User satisfaction score 3.1/5. Support tickets about slowness: 400/week.
After: Average dashboard load = 1.4 seconds. User satisfaction score 4.3/5. Support tickets: 40/week. Database compute cost down 35%.

### Lessons
1. **Cache invalidation is the hardest part** — TTL is easy. Event-driven invalidation (invalidate on write) is complex. Stale-while-revalidate is often the right middle ground for analytics.
2. **Cache stampede kills you at scale** — when a popular cache key expires, thousands of requests simultaneously query the DB. Use mutex locks, probabilistic early expiry, or background refresh to avoid stampede.
3. **Cache hit rate below 80% means your cache strategy is wrong** — if you're getting 50% hits, your TTL is too short, your keyspace is too granular, or you're caching the wrong things.

---

## UI Template Idea

### Template Type
Cache Hit/Miss Simulator (Template 11) + Before/After Comparison (Template 6)

### Screen Description
Left panel shows an animated request stream — colored dots representing requests. Green dots hit the cache (labeled "Cache HIT — 2ms"). Red dots miss the cache, pass through to the database (labeled "Cache MISS — 180ms"). Above the stream: real-time hit/miss ratio gauge. Right panel: the cache inventory — a grid of tiles showing cached keys, TTL countdown, and last-access indicator. "Hot" keys glow brighter. Evicted keys fade out. A bottom graph shows database load over time — spikes on cache misses.

### User Interactions
- Adjust cache size slider → watch hit rate change as cache fills or shrinks
- Select eviction policy (LRU / LFU / FIFO) → watch which keys get evicted under load
- "Expire All" button → all TTLs hit zero simultaneously, stampede simulation triggers
- Toggle "Enable Background Refresh" → see how stampede is prevented
- Request pattern selector: Uniform / Hot Keys (80/20) / Sequential

### Learning Outcome
Learner understands that cache effectiveness depends on access patterns (not all data is worth caching), that eviction policy matters for hit rate, and that cache expiry requires stampede mitigation in production.

---

## Tutorial Path

### Beginner Explanation
Your computer is fast but your hard drive is slow. That's why your computer uses RAM — it copies your most-used files into fast memory so you don't have to wait for the hard drive every time. That's caching.

In web systems, the "hard drive" is a database — it stores everything permanently but takes time to answer questions. The "RAM" is a cache — it stores recent answers in fast memory.

When your app gets a question it has answered recently (like "what are the trending topics?"), it checks the cache first. If the answer is there (a **cache hit**), it returns it instantly. If not (a **cache miss**), it goes to the database, gets the answer, stores a copy in the cache, and returns it.

The catch: the cache has limited space, and data in it can become stale (outdated) if the original data changes. That's why each cached item has an **expiry time (TTL)** — after which it's removed and the next request goes back to the database for a fresh answer.

**Key Terms**:
- **Cache hit**: The requested data is found in the cache. Fast. Cheap.
- **Cache miss**: The data is not in the cache. Must go to the database. Slow. Expensive.
- **TTL (Time to Live)**: How long a cached item stays before it expires and is deleted.
- **Eviction**: Removing items from the cache when it's full to make room for new ones.

**Diagram Idea**: Client → Cache (hit: return fast, miss: go to DB) → Database → Cache stores result → Client receives response.

---

### Intermediate Explanation
Caches can live at multiple layers of a system. Each layer serves a different purpose.

**Cache Layers**:
- **Client-side cache (browser)**: Stores static assets (JS, CSS, images) locally. HTTP cache headers control TTL.
- **CDN cache**: Serves static and semi-static content from edge nodes near the user. No origin hit needed.
- **Application cache (Redis / Memcached)**: Stores computed results, session data, or frequently read records in memory.
- **Database query cache**: Database engines can cache query results internally (less common — often disabled in favor of application-level caching).

**Cache-Aside Pattern (most common)**:
1. Application receives request for data
2. Check cache for the key
3. Cache hit → return data (done)
4. Cache miss → query the database
5. Store result in cache with a TTL
6. Return data to caller

**Write-Through Pattern**:
1. Application writes new data
2. Write to cache AND database simultaneously
3. Cache always has the latest version
4. Higher write latency, but reads never go stale

**Common Configurations**:
- **Redis**: In-memory data store, supports complex data types (sets, sorted sets, hashes). Persistence optional. Clustering built-in for horizontal scale.
- **Memcached**: Simpler, pure in-memory key-value. No persistence. Faster for simple string values at high throughput.

**Failure Scenario**: Redis cluster loses its primary node. Failover to replica takes 30-60 seconds. During that window, all cache reads miss. Every request hits the database. If the database isn't sized for 100% traffic load (it usually isn't, because the cache absorbs 90%+), it gets overwhelmed. This is a **cache stampede** — the scenario that breaks systems after a cache outage.

---

### Advanced Explanation
Caching introduces consistency trade-offs that get harder to manage at scale.

**Cache Invalidation Strategies**:
- **TTL-based expiry**: Simple. Stale data for up to TTL duration. Works when staleness is acceptable.
- **Write-through**: Cache always current. Higher write latency. Every write hits two systems.
- **Write-behind (write-back)**: Write to cache immediately, persist to DB asynchronously. Fast writes, risk of data loss on cache failure.
- **Event-driven invalidation**: Publish an "item updated" event on write. Consumers invalidate cache entries. Complex but precise. Requires an event bus.

**Trade-Off Table**:

| Strategy | Pros | Cons | Best For |
|---|---|---|---|
| TTL-based | Simple, no coordination | Data staleness up to TTL | Read-heavy, freshness not critical |
| Write-through | Always consistent | Higher write latency, double writes | User settings, profile data |
| Write-behind | Fast writes | Data loss risk, complexity | Write-heavy, can tolerate async persistence |
| Event-driven invalidation | Precise, low staleness | High complexity, requires event bus | Financial data, inventory, real-time systems |
| Cache-aside | Flexible, lazy | Thundering herd on miss, stale risk | General purpose read optimization |

**Scale Considerations**:
- At 1K req/sec: Single Redis instance sufficient. Hit rate optimization matters more than infrastructure.
- At 100K req/sec: Redis Cluster with 3+ shards. Hot key problem emerges — a single popular key overwhelms one shard. Use key replication or local in-process cache as a second layer.
- At 1M req/sec: Multi-layer caching mandatory. Local in-process cache (LRU with 1000-item limit) → Redis Cluster → Database. Local cache absorbs most reads, Redis handles cross-instance sharing.

**When NOT to Use**:
- **Highly dynamic data with strict consistency requirements**: Financial balances, inventory counts. Cache invalidation complexity outweighs benefits. Use read replicas instead.
- **Data that's unique per request**: User-specific pages where no two requests have the same key. Cache hit rate approaches zero — all overhead, no benefit.
- **Write-heavy systems** where reads are rare: Caching adds write complexity for data that rarely gets read.

**Performance Notes**: Redis get/set latency: ~0.1-0.3ms on local network. Compare to database query: 5-200ms. At 100K reads/sec, the difference is 500ms× 100K = ~$50M/year in saved database compute (rough order of magnitude).

---

### Expert Explanation
At enterprise scale, caching is a distributed consistency problem wrapped in a performance optimization.

**Enterprise Considerations**:

- **Multi-region**: Each region has its own Redis cluster. Cross-region cache synchronization is generally not worth it (network latency defeats the purpose). Accept that each region's cache warms independently. On failover/switchover, expect cold cache performance for 5-15 minutes.

- **Compliance**: GDPR and HIPAA require that PII/PHI not be stored outside approved data stores. Redis is typically not an approved long-term data store. Cache must not store raw PII. Cache user IDs as keys, not names or emails. PHI in cache requires the same encryption at rest and in transit as the primary database. Cache eviction must be auditable for compliance reporting.

- **Security posture**: Redis default config has no authentication. Production Redis must have: AUTH password enabled, TLS in transit, network-level access controls (VPC, security groups), no public exposure. Cache poisoning is a real attack — validate cache key construction, never allow user input to directly form cache keys.

- **Cost model**: Redis on AWS ElastiCache: r6g.large = ~$150/month. Database query cost avoided at 100K queries/minute: ~$2,000-8,000/month equivalent compute. Cache pays for itself at modest scale. Cost rises with cluster size for high availability and persistence requirements.

- **Team ownership**: Application teams own cache keys and TTL decisions. Platform team owns Redis cluster infrastructure. No shared cache namespaces — each service has a prefixed key space. Cache misuse (storing too much, no TTL, unbounded key growth) monitored via memory usage alerts per service prefix.

**Migration Path**: Adding caching to an existing uncached system:
1. Identify top 5 most expensive, most frequent read queries (use slow query log)
2. Implement cache-aside for those 5 queries — measure hit rate after 24 hours
3. If hit rate > 60%, proceed. If < 60%, reconsider TTL or query selection.
4. Add monitoring: hit/miss ratio, memory usage, eviction rate per key prefix
5. Expand to more queries. Aim for 80%+ overall hit rate.
6. Add stampede protection (mutex or probabilistic early expiry) for keys that cause DB spikes on miss

**Vendor Evaluation**:
| Option | Build (custom in-memory) | Buy (Memcached/Redis OSS) | Managed (ElastiCache/Upstash) |
|---|---|---|---|
| Cost | High engineering, low infra | Low | Medium |
| Control | Full | Full | Limited |
| Ops overhead | Very high | High (patching, HA setup) | Low |
| Features | Custom | Full Redis feature set | Full, less admin |

**Production Operations Checklist**:
- [ ] Memory usage alerting per service key prefix
- [ ] Hit rate monitoring dashboard (alert if < 70% for 15 min)
- [ ] Eviction rate alert (high eviction = cache too small)
- [ ] Redis replica lag monitored
- [ ] Cache stampede protection implemented (mutex or background refresh)
- [ ] TTLs documented per key pattern in runbook
- [ ] PII/PHI not stored in cache (audit last performed on: [date])
- [ ] Redis AUTH and TLS verified in prod
- [ ] Key expiry and eviction policy set explicitly (not using Redis default)

---

## Common Mistakes

1. **No TTL set (unbounded cache growth)**: Caching without expiry fills memory until Redis starts evicting randomly or crashes. Every cache key must have a TTL. If you can't decide on a TTL, start at 60 seconds and tune up.

2. **Caching computed data that changes on every write**: Caching something that gets invalidated more often than it gets read means you pay the write complexity without getting the read benefit. Measure your cache hit rate. If it's under 40%, the caching strategy is wrong.

3. **Cache stampede on expiry**: At peak load, a popular key expires. Thousands of requests simultaneously miss the cache and hammer the database. Protection pattern: probabilistic early expiry (start refreshing before TTL expires), mutex lock (first miss locks and refreshes, others wait), or background refresh (async TTL extension before expiry).

---

## Interview Talking Points

### One-Line Answer
Caching stores copies of expensive-to-compute data in fast storage so repeated requests can be served without going to the original slow source.

### Structured Answer (2 minutes)
> "Caching stores results of expensive operations in fast memory so future requests for the same data skip the slow path. It solves the read amplification problem — when the same data is requested thousands of times per second but only changes occasionally. For example, Twitter caches tweet content and user timelines in Redis — the tweet exists once in the database but might be read 50 million times. The main trade-off is freshness vs performance: a long TTL means more cache hits but potentially stale data; a short TTL means fresher data but more database load. The hardest problem is cache invalidation — knowing when to remove stale data — which is why 'there are only two hard problems in computer science: cache invalidation and naming things.'"

### Follow-Up Questions to Expect
- "What's the difference between cache-aside and write-through?"
- "How would you handle a cache stampede?"
- "What data should you NOT cache?"
- "How does a CDN differ from an application cache?"
- "What eviction policies does Redis support, and when would you use each?"

### Common Interview Mistakes
- Describing caching only as "making things faster" without addressing invalidation — interviewers always follow up on invalidation
- Not knowing what data to NOT cache (PII, financial balances, highly dynamic records) — shows lack of production experience

---

## Trade-Offs Summary

| Dimension | Benefit | Cost |
|---|---|---|
| Performance | Read latency 10-100× lower | Write complexity (invalidation strategy required) |
| Complexity | Simple to add cache-aside | Hard to get right (invalidation, stampede, consistency) |
| Cost | Reduces DB compute cost significantly | Redis/Memcached cluster cost + ops overhead |
| Consistency | Configurable freshness | Potential for stale data reads |
| Scalability | Dramatically extends DB read capacity | Cache itself needs scaling (cluster, hot key mitigation) |

---

## Diagram Idea

### Component Diagram
```
[Client]
   |
   ▼
[Application Server]
   |
   ├── Check Redis Cache
   |       |
   |   [Cache HIT] → Return in 2ms
   |       |
   |   [Cache MISS] → Query Database
   |                       |
   |                   [Database]
   |                       |
   └── Store result in Redis (TTL: 60s)
   |
   ▼
[Response to Client]
```

### Sequence Diagram
```
Client → App Server: GET /trending-topics
App Server → Redis: GET trending:global
Redis → App Server: (nil) — CACHE MISS
App Server → Database: SELECT ... complex aggregation
Database → App Server: [{topic: "AI", count: 1.2M}, ...]
App Server → Redis: SET trending:global <data> EX 300
App Server → Client: 200 [{...}]

-- 30 seconds later --
Client2 → App Server: GET /trending-topics
App Server → Redis: GET trending:global
Redis → App Server: [{topic: "AI", count: 1.2M}] — CACHE HIT
App Server → Client2: 200 [{...}] — 2ms total
```

### Failure Diagram
```
[Application Server] → Redis: TIMEOUT (Redis cluster failover)
    |
    ▼
All requests → Database (cache bypass)
    |
    ▼
Database CPU: 10% → 95% (designed for 20% sustained load)
    |
    ▼
Database connection pool exhausted
    |
    ▼
Application errors (500s) propagate to users

Recovery: Redis failover completes (30-60s)
Cache warms up over next 5-10 minutes
Load returns to normal
```

---

## Agent Execution Prompt

```
CONCEPT: Caching
CATEGORY: Data
LEVEL: [Beginner | Intermediate | Advanced | Expert | All]
TEMPLATE: Load CONCEPT_TEMPLATE.md
CONTEXT: Load shared-context/terminology.md

TASK: Generate the [LEVEL] section for Caching.

OUTPUT FORMAT:
- Follow CONCEPT_TEMPLATE.md exactly
- Beginner: chef/counter analogy, cache hit/miss/TTL defined in plain language
- Intermediate: cache-aside and write-through patterns required, Redis and Memcached mentioned
- Advanced: trade-off table with 5 strategies, stampede discussion, scale at 1K/100K/1M req/sec
- Expert: multi-region cold cache, GDPR/PII restrictions, Redis security (AUTH + TLS), cost model
- 200-500 words per section

CONSTRAINTS:
- Do not load other concept files
- Do not generate code
- Related concepts referenced by name only
```
