# UI Template System

13 reusable interactive learning templates. Each maps to specific concept types. No implementation here — specification only.

---

## Template 1 — Concept Card

**Purpose**: Entry-level overview of a single concept. First screen a learner sees.

**Used For**: All 44 concepts. The default landing view for any concept.

**Layout**:
- Left panel (40%): Concept metadata — name, category, difficulty badge, related concepts list
- Center (60%): One-line definition, analogy, and "Why it matters" paragraph
- Bottom strip: Four level buttons (Beginner / Intermediate / Advanced / Expert) — clicking navigates to full tutorial

**Inputs**:
- Concept name
- Category badge color (mapped from shared-context/ui-conventions.md)
- One-line definition
- Simple analogy
- Difficulty level indicators (filled dots: 1-4)

**Output**: Rendered card with navigation to tutorial levels

**User Interactions**:
- Click any level button → navigate to that level's tutorial
- Click related concept tag → navigate to that concept's card
- Toggle "Short Story" → expands story panel below card
- Save to favorites (bookmarks for review mode)

**Example Screen**: A card for "Load Balancer" shows: Category = Infrastructure (blue badge), Definition = "Distributes requests across multiple servers", Analogy = "A maître d' who seats diners at the least-busy table", four level buttons below.

---

## Template 2 — Architecture Flow Diagram

**Purpose**: Visual walkthrough of how components interact in a real request flow.

**Used For**: Client-Server, REST, GraphQL, gRPC, API Gateway, Load Balancer, Service Discovery, Microservices, CDN

**Layout**:
- Full-width canvas with component boxes and labeled arrows
- Left-to-right request flow from client to response
- Step counter in top-right ("Step 3 of 7")
- Component detail panel on right — expands when a component is clicked
- Playback controls at bottom (Previous, Play, Next)

**Inputs**:
- Component list with names and types (client, server, database, cache, queue, etc.)
- Ordered steps with from/to component and message label
- Failure scenarios with alternative paths

**Output**: Animated request journey through the architecture

**User Interactions**:
- Click Play → steps animate one at a time with description
- Click component box → sidebar shows component description
- Click arrow → tooltip shows "what data flows here"
- Toggle "Show Failure" → replaces one component with an error state, shows fallback path

**Example Screen**: REST API request flow — box labeled "Client" sends arrow labeled "HTTP GET /products" to "Load Balancer", which fans out to two "App Server" boxes, one of which queries "Database" and returns through the chain.

---

## Template 3 — Interactive Request Journey

**Purpose**: Learner controls a step-by-step request through a system. More interactive than Template 2 — learner drives the flow.

**Used For**: Authentication, OAuth, JWT, Rate Limiting, Circuit Breaker, Retry Mechanism, Saga Pattern

**Layout**:
- Top: system diagram (static component layout)
- Middle: current step highlight — active component glows, inactive dims
- Bottom: narrative panel showing what's happening at this step ("The API gateway checks the JWT token. If valid, the request passes. If invalid, it returns 401.")
- Left sidebar: step list with checkboxes (progress indicator)

**Inputs**:
- Component list
- Step sequence with decision points (success / failure branches)
- Narrative text per step (up to 3 sentences)
- Decision trigger labels ("Token valid?", "Rate limit exceeded?")

**Output**: Step-by-step request navigation with decision outcomes

**User Interactions**:
- "Next Step" button → advances to next step
- At decision points: two option buttons ("Yes" / "No") — each leads to a different branch
- "Show Happy Path" → skips failures, shows clean success flow
- "Inject Failure" → forces a failure at the current step to show error handling

**Example Screen**: JWT authentication — user clicks "Next" through: Client → API Gateway (verify token) → Decision: "Valid?" → Yes path: continue to service → No path: return 401. User can choose either branch.

---

## Template 4 — Failure Simulation

**Purpose**: Shows what happens to a system when a component fails. Teaches resilience and failure modes.

**Used For**: Circuit Breaker, Dead Letter Queue, Idempotency, Retry Mechanism, Fault Tolerance, Availability, Reliability, Replication, Sharding

**Layout**:
- Top: healthy system diagram (all green)
- Control panel: "Inject Failure" dropdown — list of components that can fail
- After injection: failed component turns red, affected paths highlight in red, fallback paths highlight in yellow
- Status panel: shows system health metrics (% requests succeeding, latency, affected components)
- Recovery panel: "Trigger Recovery" button → component restores, paths turn green

**Inputs**:
- System components (normal state + failure state)
- Failure scenarios per component
- Fallback paths (circuit breaker routes, retry attempts, DLQ redirection)
- Recovery sequence

**Output**: Visual before/during/after failure representation

**User Interactions**:
- Select failure type from dropdown (component crash, network partition, high latency, data corruption)
- Click "Inject" → system redraws in failure state
- Click "Trigger Recovery" → system heals step by step
- Slider: "Failure Duration" — see how extended failures affect queue buildup, retry storms

**Example Screen**: Circuit Breaker simulation — user injects "Database Overload". The circuit opens (red). Requests to the database fail fast instead of timing out. After 30 seconds (slider), circuit moves to "Half-Open". User clicks "Send Test Request" — it succeeds → circuit closes (green).

---

## Template 5 — Scaling Simulator

**Purpose**: Shows how a system behaves as traffic increases. Teaches horizontal vs vertical scaling, bottlenecks, and capacity limits.

**Used For**: Load Balancer, Caching, Sharding, Replication, CDN, Microservices, Kubernetes, Databases

**Layout**:
- Left: Traffic slider ("10 req/sec" → "1M req/sec") with a "Ramp Up" animation button
- Center: Architecture diagram — servers, databases, caches — with load indicators (bars or heat maps)
- Right: Metrics panel — Latency, Error Rate, Throughput, Server Count
- Bottom: Event log — "Server 3 added at 50K req/sec", "Cache hit rate dropped at 200K req/sec"

**Inputs**:
- System components with capacity limits
- Scale events (when to add servers, when cache misses spike, when DB becomes bottleneck)
- Configuration options ("Enable caching", "Add read replica", "Enable sharding")

**Output**: Real-time visual representation of scaling behavior

**User Interactions**:
- Drag slider to increase traffic → watch metrics change
- Toggle "Enable Caching" → cache hit rate appears, DB load drops
- Toggle "Add Read Replica" → read latency improves
- "Simulate Traffic Spike" button → instant jump to peak load
- "Add Server" button → manually add a server and watch load redistribute

**Example Screen**: User drags traffic from 1K to 100K req/sec. At 20K, a "DB CPU 90%" alert appears. User toggles "Enable Caching" — DB load drops to 40%. At 80K, cache starts missing. User enables "Add Read Replica" — latency stabilizes.

---

## Template 6 — Before/After Comparison

**Purpose**: Side-by-side comparison of a system without vs. with a concept applied. Shows the concrete improvement.

**Used For**: Caching, CDN, Indexing, Load Balancer, API Gateway, Monolith vs Microservices, Message Queues, Rate Limiting

**Layout**:
- Split screen: Left = "Before" (without concept), Right = "After" (with concept)
- Each side has the same request scenario
- Key metrics shown below each side: Latency, Throughput, Error Rate, Complexity
- Highlighted differences in yellow on the "After" side

**Inputs**:
- Before architecture (components + request path)
- After architecture (same + new component)
- Metrics for each state (can be illustrative, not real)
- Difference annotations ("Database hit every request" vs "Cache serves 80% of requests")

**Output**: Parallel visual comparison with annotated differences

**User Interactions**:
- "Run Request" button → plays a request animation on both sides simultaneously
- Click highlighted difference → tooltip explains why it changed
- Toggle "Show Metrics" → overlays latency and error rate numbers
- "Zoom In" on a component → detail view of what changed inside that component

**Example Screen**: Database indexing — Left side shows "Full Table Scan" with red latency bar. Right side shows "Index Lookup" with green latency bar. Running a request shows left side taking 10 steps to find a record, right side taking 2. Clicking the index on the right shows the B-tree structure.

---

## Template 7 — Trade-Off Comparison Table

**Purpose**: Interactive trade-off exploration. Learner adjusts priorities and sees how options rank.

**Used For**: SQL vs NoSQL, REST vs GraphQL vs gRPC, Monolith vs Microservices, Consistency vs Availability, Replication strategies, Caching strategies

**Layout**:
- Left column: Criteria (Latency, Scalability, Consistency, Complexity, Cost, Operational overhead)
- Column per option (Option A, B, C — up to 4)
- Each cell: colored rating (green = good, yellow = trade-off, red = weakness)
- Priority sliders on left: learner can weight criteria by importance
- Bottom: "Best Fit For" section updates based on priority weights

**Inputs**:
- Option names and short descriptions
- Per-option ratings per criterion
- Criteria definitions (tooltip on hover)
- Context scenarios ("Choose if you need strong consistency", "Choose if you need horizontal scale")

**Output**: Ranked recommendation that updates as learner adjusts priorities

**User Interactions**:
- Adjust priority sliders → "Best Fit" recommendation updates in real time
- Click any cell → tooltip with detailed explanation
- Select a scenario preset: "Interview Scale-Up", "Small Startup", "Banking System", "IoT Platform" → sliders auto-set to that scenario's priorities
- Export table → downloadable comparison summary

**Example Screen**: SQL vs NoSQL trade-off. User has sliders: Consistency (8/10), Scale (3/10). Table shows SQL wins. User flips to Scale (9/10), Consistency (4/10) → NoSQL wins. "Best Fit" section updates live.

---

## Template 8 — Event Flow Visualizer

**Purpose**: Animates event-driven message flows. Shows producers, brokers, and consumers in action.

**Used For**: Message Queues, Pub/Sub, Event-Driven Architecture, Kafka-style Streaming, Event Sourcing, CQRS, Saga Pattern

**Layout**:
- Top row: Producers (service icons)
- Middle row: Event broker (queue or topic with message count indicator)
- Bottom row: Consumers (service icons with processing indicators)
- Message bubbles travel from producer → broker → consumer with event name labels
- Speed control slider

**Inputs**:
- Producer list with event types they emit
- Topic/queue names and partitions (for Kafka-style)
- Consumer list with subscriptions
- Message payloads (simplified labels: "OrderPlaced", "PaymentProcessed", etc.)
- Failure scenarios (consumer failure, message retry, DLQ redirect)

**Output**: Animated event flow with message routing and consumer processing

**User Interactions**:
- "Publish Event" button → user triggers a specific event and watches it flow
- Speed slider → slow down to understand, speed up to see scale
- Click a consumer → shows messages it has received and processed
- Toggle "Consumer Failure" → consumer drops messages, watch DLQ fill
- Toggle "Replay Events" (Event Sourcing mode) → replay past events to a new consumer

**Example Screen**: Order processing — "Order Service" publishes "OrderPlaced". Message flows to "payment-events" topic. Two consumers process it: "Payment Service" and "Inventory Service" simultaneously. User pauses Payment Service → DLQ starts filling → Retry kicks in after 30s.

---

## Template 9 — Queue Processing Visualizer

**Purpose**: Shows message queue behavior — depth, throughput, backpressure, and DLQ routing.

**Used For**: Message Queues, Dead Letter Queue, Retry Mechanism, Rate Limiting, Backpressure

**Layout**:
- Center: Queue visualization — messages as colored blocks stacking up or emptying
- Left: Producer panel — rate slider, "Publish" button
- Right: Consumer panel — processing rate slider, enable/disable toggle
- Bottom metrics: Queue depth, Messages/sec in, Messages/sec out, DLQ count, Average wait time

**Inputs**:
- Producer throughput range
- Consumer throughput range
- Max queue depth before messages fail
- DLQ routing rules (after N retries, message moves to DLQ)
- Retry timing (immediate, exponential backoff, fixed delay)

**Output**: Visual queue depth and processing behavior

**User Interactions**:
- Producer slider → increase/decrease publish rate
- Consumer slider → throttle or speed up consumer
- "Kill Consumer" → queue depth grows, DLQ fills
- "Revive Consumer" → processing resumes, queue drains
- "Inject Poison Message" → one message causes consumer to crash repeatedly → shows DLQ routing after max retries

**Example Screen**: User sets producer to 100 msg/sec, consumer to 60 msg/sec. Queue fills. At depth 500, new messages start failing. User increases consumer to 150 msg/sec — queue drains. User injects poison message — it retries 3 times, then routes to DLQ (red).

---

## Template 10 — Database Sharding Visualizer

**Purpose**: Shows how data is distributed across shards and how queries route to the right shard.

**Used For**: Sharding, Replication, Indexing, Distributed Systems, Databases

**Layout**:
- Top: User/application layer
- Middle: Shard router (shows routing logic — range-based, hash-based, directory-based)
- Bottom row: 4 database shards with data samples and row count indicators
- Query panel: user enters a query or selects a record → animation shows routing

**Inputs**:
- Shard count (2-8)
- Shard key definition
- Routing strategy (hash, range, directory)
- Sample data records with shard assignment
- Hotspot scenarios (uneven distribution)

**Output**: Visual routing of queries to appropriate shards

**User Interactions**:
- "Add Shard" button → watch data rebalance across shards
- Select routing strategy → see how data distribution changes
- "Query Record #12345" → animation shows router hash the key and highlight the correct shard
- Toggle "Hotspot Mode" → one shard overloads while others sit idle (shows uneven distribution problem)
- "Rebalance" button → watches data migrate across shards

**Example Screen**: Hash-based sharding of user records. User queries "User ID: 5678" → router computes hash → Shard 3 lights up → record retrieved. User adds a 5th shard → data rebalances animation plays.

---

## Template 11 — Cache Hit/Miss Simulator

**Purpose**: Teaches cache behavior — hit rates, eviction, invalidation, and performance impact.

**Used For**: Caching, CDN, Databases, Read Performance

**Layout**:
- Top: Request generator panel (request types, frequency)
- Center-left: Cache layer (shows cached keys, TTL countdown, eviction indicator)
- Center-right: Origin/Database (shows load indicator)
- Bottom: Hit/miss ratio graph updating in real time
- Color coding: green requests = cache hit, red = cache miss (go to DB), orange = cache expired

**Inputs**:
- Cache size (number of items)
- TTL (time to live per item)
- Eviction policy (LRU, LFU, FIFO)
- Request pattern (uniform, 80/20 hot keys, sequential)
- Cache warm-up toggle

**Output**: Live cache performance visualization

**User Interactions**:
- Send requests via button or auto-play slider
- Change eviction policy → watch hit rate change
- "Invalidate All" → cache clears, DB load spikes, cache refills
- Adjust cache size slider → see how more cache improves hit rate
- Toggle "Cold Start" → cache starts empty, watch warm-up period
- Select request pattern preset (Zipf distribution → hot keys, Sequential → poor hit rate)

**Example Screen**: LRU cache with 100 items. Uniform requests → 70% hit rate. Switch to "Hot Key (80/20)" preset → hit rate jumps to 92%. User shrinks cache to 20 items → hit rate drops to 45%. DB load indicator spikes red.

---

## Template 12 — Interview Practice Card

**Purpose**: Structured interview preparation for one concept. Tests verbal delivery.

**Used For**: All 44 concepts. Interview Mode view.

**Layout**:
- Top: Concept name + difficulty rating
- Center: Question card ("Explain load balancing in 2 minutes")
- Below: Timer (optional, 2-minute countdown)
- Hidden panel (reveal on click): Model answer following structured format
- Comparison section: learner rates their answer against model (self-evaluation rubric)
- Bottom: "Next Question" → follow-up questions from the concept's interview section

**Inputs**:
- Interview questions for this concept
- Model answers (from concept file interview section)
- Follow-up questions
- Common mistakes list
- Self-evaluation rubric (4 criteria: Definition, Example, Trade-off, Confidence)

**Output**: Self-paced interview preparation

**User Interactions**:
- "Start Timer" → 2-minute countdown begins
- "Reveal Answer" → model answer appears (timer stops)
- Self-rate each rubric criterion (1-5 stars)
- "Shuffle Questions" → randomizes question order
- "Interview Mode" → hides all hints, shows only question (full simulation)
- Mark concept as "Confident", "Needs Practice", or "Not Ready" → updates review queue

**Example Screen**: Question: "What is a load balancer and why do you need it?" Timer runs. User speaks their answer. Clicks "Reveal". Model answer shows: "A load balancer distributes incoming traffic across multiple servers..." User self-rates: Definition 4/5, Example 3/5, Trade-off 2/5 → system flags Trade-off section for review.

---

## Template 13 — Enterprise Case Study Page

**Purpose**: Full enterprise scenario walkthrough. Shows how a concept is applied at scale in a real org.

**Used For**: Load Balancer, API Gateway, Microservices, Kafka, CQRS, Service Mesh, Distributed Tracing, Kubernetes — all Expert-level concepts

**Layout**:
- Hero section: Company type, industry, scale ("10M daily active users, 500 engineers, fintech")
- Problem statement banner
- Architecture diagram (from Template 2, embedded)
- Scrollable sections: Context → Challenge → Solution → Architecture → Trade-offs → Lessons
- Side panel: Key metrics (before/after if applicable)
- Footer: Related concepts and next concepts to study

**Inputs**:
- Company profile (type, industry, scale)
- Problem narrative
- Solution description
- Architecture component list
- Before/after metrics
- Lessons learned (2-3 points)

**Output**: Comprehensive case study reading view

**User Interactions**:
- Click architecture component → pop-up explains that component's role
- Toggle "Show Trade-offs" → highlights the architectural decisions made and alternatives considered
- "Deep Dive" link → navigates to full concept page for any component mentioned
- "Save Case Study" → add to personal notes
- "Quiz Me" → 3 comprehension questions about the case study appear

**Example Screen**: "How a major bank migrated from monolith to microservices over 3 years." Shows the architecture before (single Rails app, PostgreSQL) and after (12 domain services, event bus, API gateway). Clicking the "Payment Service" box shows its responsibilities. Toggle "Trade-offs" highlights where they chose CQRS for audit compliance.
