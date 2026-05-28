# Terminology

Core system design vocabulary. One-sentence definitions. Load this file in every agent session.

---

## Networking & APIs

**API (Application Programming Interface)**: A defined contract for how one software component communicates with another.
**REST (Representational State Transfer)**: An architectural style for APIs using HTTP methods and stateless requests.
**GraphQL**: A query language for APIs where clients specify exactly what data they need.
**gRPC**: A high-performance RPC framework using Protocol Buffers and HTTP/2.
**HTTP**: The protocol for transferring data on the web; stateless request-response model.
**WebSocket**: A protocol for persistent bidirectional connections between client and server.
**Client-Server Architecture**: A model where clients request resources and servers fulfill those requests.
**Idempotency**: An operation that produces the same result whether executed once or many times.
**Request-Response**: The basic pattern where a caller sends a request and waits for a reply.

## Load Balancing & Routing

**Load Balancer**: A component that distributes incoming traffic across multiple servers.
**API Gateway**: A single entry point for all clients that handles routing, auth, rate limiting, and transforms.
**Round-Robin**: A load balancing algorithm that sends requests to servers in sequential turns.
**Least Connections**: A load balancing algorithm that routes to the server with fewest active connections.
**Sticky Sessions (Session Affinity)**: Routing the same client to the same server on every request.
**Health Check**: A periodic ping to a server to verify it's alive and responding correctly.
**Layer 4 Load Balancing**: Routing based on TCP/IP headers (IP address + port).
**Layer 7 Load Balancing**: Routing based on HTTP content (URL, headers, body).
**DNS Load Balancing**: Distributing traffic by returning different IP addresses in DNS responses.

## Data Storage

**Database**: A structured system for storing, querying, and managing persistent data.
**SQL (Structured Query Language)**: Language for querying relational databases; also refers to relational databases themselves.
**NoSQL**: Databases that don't use the relational table model; includes document, key-value, column-family, and graph stores.
**Index**: A data structure that speeds up queries by creating a lookup pointer to data rows.
**B-Tree**: The most common index structure; balanced tree enabling O(log n) lookups.
**Replication**: Maintaining copies of data on multiple nodes for redundancy and read scaling.
**Sharding (Horizontal Partitioning)**: Splitting a database into smaller partitions across multiple nodes.
**Shard Key**: The field used to determine which shard a record belongs to.
**ACID**: Database transaction properties — Atomicity, Consistency, Isolation, Durability.
**BASE**: Distributed system properties — Basically Available, Soft state, Eventual consistency.
**Primary Key**: A unique identifier for a record in a database table.
**Foreign Key**: A reference from one table to a primary key in another table.

## Caching

**Cache**: Fast temporary storage for data that would be slow to fetch from its original source.
**Cache Hit**: The requested data is found in the cache.
**Cache Miss**: The data is not in the cache; must be fetched from the source.
**TTL (Time to Live)**: The duration after which a cached item expires and is removed.
**Eviction Policy**: The rule that determines which cached items to remove when the cache is full.
**LRU (Least Recently Used)**: Eviction policy that removes the item accessed least recently.
**LFU (Least Frequently Used)**: Eviction policy that removes the least-accessed item overall.
**Cache Stampede (Thundering Herd)**: Many simultaneous cache misses hitting the origin at the same time.
**Cache-Aside Pattern**: Application checks cache first; on miss, fetches from DB and stores in cache.
**Write-Through**: Writing to cache and database simultaneously on every update.
**Write-Behind (Write-Back)**: Writing to cache immediately and persisting to DB asynchronously.
**CDN (Content Delivery Network)**: A geographically distributed cache for static and semi-static content.

## Security

**Authentication**: Verifying who a user or system is (identity).
**Authorization**: Verifying what an authenticated user is allowed to do (permissions).
**JWT (JSON Web Token)**: A self-contained token encoding identity claims, signed by the issuer.
**OAuth 2.0**: A delegation protocol that lets users grant third-party apps limited access to their accounts.
**OAuth Scope**: The specific permissions a user is granting to an OAuth client.
**Bearer Token**: A token that grants access to whoever holds it (no additional proof required).
**mTLS (Mutual TLS)**: Both client and server present certificates — verifies identity on both ends.
**Rate Limiting**: Restricting how many requests a client can make in a given time window.
**Token Bucket Algorithm**: A rate limiting algorithm that allows bursts within a refill-rate ceiling.
**Leaky Bucket Algorithm**: A rate limiting algorithm that smooths out bursty traffic to a constant rate.

## Messaging & Events

**Message Queue**: A buffer that stores messages from producers until consumers are ready to process them.
**Producer**: A component that creates and sends messages or events.
**Consumer**: A component that receives and processes messages or events.
**Broker**: The intermediary that receives, stores, and routes messages between producers and consumers.
**Topic**: A named channel in a pub/sub or streaming system where events are published and consumed.
**Partition**: A subdivision of a topic that enables parallel processing; events in one partition maintain order.
**Consumer Group**: A set of consumers that collectively process messages from a topic, each reading different partitions.
**Offset**: The position of a message in a Kafka partition; consumers track their offset.
**Dead Letter Queue (DLQ)**: A queue that receives messages that failed processing after the maximum retry attempts.
**Pub/Sub (Publish-Subscribe)**: A pattern where producers publish to topics and all subscribers receive each message.
**At-Least-Once Delivery**: Messages delivered at least once; duplicates possible if consumer fails after processing but before ACK.
**At-Most-Once Delivery**: Messages delivered at most once; may be lost if consumer fails before ACK.
**Exactly-Once Delivery**: Messages delivered exactly once; requires transactional guarantees in the broker and consumer.
**ACK (Acknowledgment)**: A signal from consumer to broker confirming a message was successfully processed.
**Consumer Lag**: How far behind the current event stream a consumer group is (measured in messages or bytes).

## Distributed Systems

**Distributed System**: A system where components run on multiple computers and coordinate to appear as a single system.
**CAP Theorem**: In a distributed system that may partition, you can guarantee at most two of: Consistency, Availability, Partition Tolerance.
**Consistency**: Every read receives the most recent write or an error.
**Availability**: Every request receives a response (not necessarily the most recent data).
**Partition Tolerance**: The system continues operating even when network partitions occur.
**Eventual Consistency**: Given no new updates, all replicas will converge to the same value eventually.
**Strong Consistency**: Every read reflects the latest committed write — no stale reads.
**Linearizability**: Operations appear to execute instantaneously at a single point in time (strictest consistency model).
**Fault Tolerance**: The ability of a system to continue functioning correctly when some components fail.
**Availability (SLA)**: Percentage of time a system is operational; 99.9% = 8.7 hours downtime/year.
**SPOF (Single Point of Failure)**: A component whose failure causes the entire system to fail.

## Architecture Patterns

**Monolith**: A single deployable unit containing all application logic.
**Microservices**: An architecture where each service is a small, independently deployable unit with a single responsibility.
**Service Discovery**: The mechanism by which services find each other's network addresses dynamically.
**Service Mesh**: An infrastructure layer that manages service-to-service communication (e.g., Istio, Linkerd).
**Event Sourcing**: Storing all changes to application state as an immutable sequence of events.
**CQRS (Command Query Responsibility Segregation)**: Separating the read model from the write model.
**Saga Pattern**: A sequence of local transactions coordinated by events or a central orchestrator for distributed consistency.
**Circuit Breaker**: A component that stops calls to a failing service to give it time to recover.
**Bulkhead Pattern**: Isolating failures to a pool of resources so they don't cascade.
**Retry with Backoff**: Re-attempting failed operations with increasing delays to avoid retry storms.
**Compensating Transaction**: A transaction that undoes the effect of a previous transaction in a saga.

## Reliability

**SLA (Service Level Agreement)**: A commitment to a minimum service quality level (often availability percentage).
**SLO (Service Level Objective)**: An internal target for a service quality metric (stricter than SLA).
**SLI (Service Level Indicator)**: A measured metric that represents service quality (latency, error rate, throughput).
**MTTR (Mean Time to Recovery)**: Average time to restore service after a failure.
**MTBF (Mean Time Between Failures)**: Average time between failures.
**RTO (Recovery Time Objective)**: Maximum acceptable time to restore service after failure.
**RPO (Recovery Point Objective)**: Maximum acceptable data loss in time (how old can a recovered backup be?).
**Chaos Engineering**: Deliberately injecting failures to test system resilience.
**Graceful Degradation**: Reducing functionality under load rather than failing completely.

## Observability

**Observability**: The ability to understand a system's internal state from its external outputs (logs, metrics, traces).
**Logging**: Recording discrete events with contextual metadata for later inspection.
**Metrics**: Numeric measurements of system behavior aggregated over time (CPU, latency, error rate).
**Distributed Tracing**: Tracking a request as it flows through multiple services to identify bottlenecks and failures.
**Trace**: A record of a request's journey through a distributed system.
**Span**: A single operation within a trace (one service's handling of the request).
**Correlation ID (Trace ID)**: A unique identifier attached to a request and carried across all services for trace assembly.
**Structured Logging**: Logging in a machine-parseable format (JSON) rather than free-form strings.
**Alerting**: Notifying humans when a metric crosses a threshold.
**Dashboard**: A visual display of system health metrics in real time.

## Infrastructure & Operations

**Docker**: A platform for packaging applications and dependencies into portable containers.
**Container**: A lightweight, portable package containing an application and its runtime environment.
**Kubernetes (K8s)**: An orchestration system for deploying, scaling, and managing containerized applications.
**Pod**: The smallest deployable unit in Kubernetes; one or more containers sharing a network and storage.
**Deployment**: A Kubernetes object that manages a set of identical pods and handles rolling updates.
**CI/CD (Continuous Integration / Continuous Delivery)**: Automated pipelines that build, test, and deploy code changes.
**Blue-Green Deployment**: Running two identical environments; switch traffic from old to new in one step.
**Canary Deployment**: Routing a small percentage of traffic to a new version before full rollout.
**Rolling Deployment**: Replacing old instances with new ones incrementally.
**Infrastructure as Code (IaC)**: Managing infrastructure through machine-readable configuration files (Terraform, Pulumi).
**Auto-Scaling**: Automatically adding or removing compute resources based on load.
