---
concept-name: load-balancer
category: Infrastructure
difficulty-range: All Levels
related-concepts: API Gateway, Service Discovery, Microservices, Fault Tolerance, Circuit Breaker
last-updated: 2026-05-28
generated-by: human
reviewed: true
---

# Load Balancer

## Metadata
- **Category**: Infrastructure
- **One-Line Definition**: Distributes incoming network traffic across multiple servers so no single server gets overwhelmed.
- **Simple Analogy**: A maître d' at a restaurant who sees which tables are free and seats each new guest at the least-busy table — so no single waiter is running while others are idle.
- **Why It Matters**: Without a load balancer, all traffic hits one server. When that server gets busy, response times climb. When it crashes, the whole system goes down. A load balancer splits work across many servers and routes around failures automatically. It's the reason a single website can serve millions of users.
- **Related Concepts**: [API Gateway](../infrastructure/api-gateway.md), [Service Discovery](../infrastructure/service-discovery.md), [Microservices](../architecture/microservices.md), [Fault Tolerance](../architecture/fault-tolerance.md), [Circuit Breaker](../reliability/circuit-breaker.md)

---

## Short Story

### Scenario
A popular e-commerce startup launched a flash sale for Black Friday. Their checkout page ran on a single server. The engineering team was confident — the server handled 5,000 concurrent users in load testing.

### The Problem
At 9:00 AM on sale day, 80,000 users hit the site simultaneously. The single server's CPU hit 100% within 30 seconds. Response times went from 200ms to 45 seconds. Checkout started timing out. The server crashed at 9:07 AM. The company lost an estimated $2M in sales in two hours.

### The Solution
The team added three more servers and placed a load balancer in front of them. The load balancer received all incoming traffic and distributed requests across all four servers using a round-robin algorithm — sending request 1 to Server A, request 2 to Server B, request 3 to Server C, request 4 to Server D, and then repeating.

### What Changed
The next flash sale handled 120,000 concurrent users without degradation. When Server B had a memory leak and became slow, the load balancer detected it via health checks and stopped sending traffic there. Engineers fixed it without any user impact.

---

## Enterprise Use Case

### Company Type
Large-scale e-commerce (think Amazon scale regional setup)

### Context
A major retail platform processes 50,000 requests/second on peak days. They run 200+ application server instances across three availability zones. Traffic patterns spike 10x during seasonal events. The system must maintain 99.99% uptime per their SLA.

### How It's Used
1. AWS Application Load Balancer (ALB) sits in front of all application servers
2. Health checks run every 5 seconds per instance — any instance returning 5xx errors for 10 seconds is removed from the rotation
3. Sticky sessions are disabled for stateless application tier (session state lives in Redis)
4. Weighted routing sends 90% of traffic to stable instances, 10% to canary deployment for new releases
5. Layer 7 routing directs `/api/checkout` traffic to high-memory instances and `/api/search` to high-CPU instances
6. Auto-scaling policy triggers when average CPU across instances exceeds 70% for 3 minutes — new instances register automatically with the load balancer

### Business Impact
Before: Single-region single-ALB setup caused 15-minute outages during us-east-1 incidents (twice in 2024, $8M impact each).
After: Multi-region active-active with global load balancing via Route 53 + regional ALBs. Regional failure now causes automatic traffic shift. No outage in 18 months. Checkout error rate under 0.01%.

### Lessons
1. **Health checks must match your app's actual health** — checking port 80 is open is not enough. Use `/health` endpoints that verify DB connectivity and cache reachability. Shallow health checks let broken servers stay in rotation.
2. **Session affinity (sticky sessions) creates hot spots** — if one server has 30% of sticky sessions and crashes, those users lose state. Move session state to Redis and eliminate stickiness.
3. **Layer 7 routing unlocks cost optimization** — splitting traffic by path lets you right-size instances per workload. Search gets CPU-optimized, checkout gets memory-optimized. Significant cost savings at scale.

---

## UI Template Idea

### Template Type
Scaling Simulator (Template 5) + Architecture Flow Diagram (Template 2)

### Screen Description
Split view: top half shows a live architecture diagram with one load balancer box connected to 2-8 server boxes. Server boxes display a heat map (green = low load, yellow = moderate, red = high). Bottom half shows real-time metrics: requests/sec, avg latency, error rate, active server count. A traffic slider on the left controls incoming requests/sec from 100 to 100,000.

### User Interactions
- Drag traffic slider → watch load redistribute across servers
- Click "Kill Server 2" → that server turns red/offline, load balancer instantly redistributes to remaining servers
- Toggle routing algorithm (Round-Robin, Least Connections, IP Hash) → watch traffic distribution pattern change
- Click "Add Server" → new box appears, load automatically redistributes
- Toggle "Enable Health Check" → delayed health check scenario shows dead server still receiving traffic briefly

### Learning Outcome
Learner understands that load balancers are active traffic managers (not just passive distributors), that routing algorithms affect distribution fairness, and that health checks are the mechanism that makes fault tolerance possible.

---

## Tutorial Path

### Beginner Explanation
Imagine a call center with 10 support agents. If all calls went to Agent 1, they'd be overwhelmed while the other nine sit idle. The solution is a receptionist who routes each incoming call to the next available agent.

A **load balancer** is that receptionist for web servers. When a user opens your app, their request goes to the load balancer first. The load balancer then decides which server to send that request to, based on which servers are available and how busy they are.

Without a load balancer, adding more servers doesn't help — traffic still hammers the one server users know about. The load balancer gives you one address that users hit, while hiding the fact that there are many servers behind it.

**Key Terms**:
- **Server instance**: One copy of your application running on one machine.
- **Round-robin**: Sending requests to servers in turn (1→2→3→1→2→3...) — the simplest routing strategy.
- **Health check**: A periodic ping to each server to verify it's alive and responding correctly.

**Diagram Idea**: One box labeled "Internet Traffic" → one box labeled "Load Balancer" → three boxes in a row labeled "Server A", "Server B", "Server C". Arrows from Load Balancer to each server showing distributed traffic.

---

### Intermediate Explanation
A load balancer operates at Layer 4 (TCP) or Layer 7 (HTTP) of the network stack. The difference matters for what routing decisions it can make.

**Layer 4 (TCP/UDP)** — routes based on IP address and port. Fast but blind to request content.

**Layer 7 (HTTP/HTTPS)** — inspects request headers, URLs, and cookies. Can route `/api/video` to video servers and `/api/payment` to payment servers. More flexible and the standard for modern web applications.

**Request Flow**:
1. Client sends `GET /products` to `api.example.com`
2. DNS resolves to the load balancer's IP address
3. Load balancer receives the request
4. Load balancer selects a healthy backend server (using routing algorithm)
5. Load balancer forwards the request to the selected server
6. Server processes the request and responds to the load balancer
7. Load balancer returns the response to the client

**Common Configurations**:
- **Round-Robin**: Each server gets one request in turn. Simple, effective when servers have equal capacity.
- **Least Connections**: New request goes to the server with the fewest active connections. Better for variable request durations.
- **Weighted Round-Robin**: Faster servers get more requests (Server A: weight 3, Server B: weight 1 → A gets 3× the traffic).
- **IP Hash**: Client's IP determines server assignment. Ensures the same user always hits the same server (useful for session state, but creates hot spots).

**Failure Scenario**: Server 2 crashes mid-flight. Its health check fails (5 consecutive checks return no response). Load balancer marks it as unhealthy and removes it from rotation. The 12 requests that were in-flight to Server 2 fail (the clients receive errors). New requests route to Servers 1, 3, and 4. Clients that retry see success. Total impact: 12 failed requests, ~50ms of elevated latency during rebalancing.

---

### Advanced Explanation
At scale, load balancers themselves become points of failure and performance bottlenecks.

**Active-Passive HA**: Two load balancers — one active, one standby. Keepalive messages detect failure. Failover in 1-5 seconds. Simple but the active handles 100% of traffic.

**Active-Active HA**: Two load balancers sharing traffic. DNS round-robins between them. Better utilization, more complex health check coordination. Used by most high-traffic deployments.

**Trade-Off Table**:

| Approach | Pros | Cons | Best For |
|---|---|---|---|
| Round-Robin | Simple, even distribution, zero state | Ignores server load; slow servers still get equal share | Homogeneous servers, short-lived requests |
| Least Connections | Adapts to server load; better for variable request durations | Requires connection state tracking in load balancer | Long-lived connections, mixed workloads |
| IP Hash | Stateful routing, same client → same server | Hot spots if popular IP ranges overload one server; breaks with NAT | Session-dependent apps (without Redis) |
| Weighted | Right-sizes traffic to server capacity | Manual configuration; needs updating when adding servers | Heterogeneous server fleet |
| Random | Simple, no state | Less even distribution at low traffic volumes | Low-stakes, uniform workloads |

**Scale Considerations**:
- At 1K req/sec: Single load balancer, any algorithm works, performance non-issue
- At 100K req/sec: Single load balancer CPU becomes measurable. SSL termination is the biggest cost. Consider hardware LB or dedicated SSL offloading.
- At 1M req/sec: Load balancer itself must be distributed. DNS-based global load balancing (Route 53, Cloudflare). Regional load balancers + DSR (Direct Server Return) to bypass return path through LB.

**When NOT to Use a Load Balancer**:
- **Single-instance development environments**: Adds latency and complexity for no benefit.
- **Stateful legacy systems that can't be horizontally scaled**: Load balancing without horizontal scalability is theater.
- **Very low traffic applications** (< 100 req/min): Operational overhead isn't worth it. A single well-monitored server is simpler.

**Performance Notes**: SSL/TLS termination at the load balancer costs ~0.5ms per request but saves that cost on each backend server. At 100K TLS handshakes/sec, dedicated SSL hardware or offloading to a CDN is materially cheaper.

---

### Expert Explanation
At enterprise scale, load balancing is a multi-layer strategy, not a single component.

**Enterprise Considerations**:

- **Multi-region**: Global load balancing uses DNS-based routing (latency-based, geolocation, failover policies). Route 53, Cloudflare, or GCP's Global Load Balancing. Regional load balancers handle intra-region distribution. Traffic must not cross regions unnecessarily — latency and data residency costs.
- **Compliance**: GDPR requires that EU user data not leave the EU. Load balancer routing rules must enforce regional stickiness for EU-origin traffic. Healthcare (HIPAA) has similar data residency requirements for PHI. Load balancer configuration must be auditable — routing rules in version control, changes reviewed.
- **Security posture**: Load balancer is the first line of defense. WAF (Web Application Firewall) integrates at L7. DDoS mitigation (AWS Shield, Cloudflare) at load balancer layer. mTLS between load balancer and backend for zero-trust architecture. Load balancer TLS policy must be up to date (TLS 1.2 minimum, TLS 1.3 preferred).
- **Cost model**: Managed load balancers (AWS ALB: ~$0.008/LCU-hour) vs self-managed NGINX (compute cost + engineering overhead). At 10B monthly requests, ALB ~$800/month. NGINX on equivalent instances ~$300/month compute but $50K+/year engineering overhead. Most teams choose managed.
- **Team ownership**: Network or platform engineering team owns load balancer config. Application teams request routing rules via PR process. Changes are terraformed — no console clicks. Runbook defines who can approve emergency routing changes at 2 AM.

**Migration Path**: Migrating from no load balancer to load balancer without downtime:
1. Stand up load balancer alongside existing single server
2. Update DNS TTL to 60 seconds (from 3600) — prepare for fast cutover
3. Add original server as backend on load balancer
4. Switch DNS to point to load balancer
5. Monitor for 30 minutes — roll back if error rate increases
6. Add additional server instances behind load balancer
7. Restore DNS TTL to 300-900 seconds

**Vendor Evaluation**:
| Option | Build (NGINX/HAProxy) | Buy (SaaS) | Managed (Cloud) |
|---|---|---|---|
| Cost | Low infra, high ops | High per-unit | Medium, scales predictably |
| Control | Full | Limited | Good |
| Ops overhead | High (patching, HA config) | None | Low |
| Advanced routing | Manual config | Varies by vendor | Layer 7 routing built-in |

**Production Operations Checklist**:
- [ ] Health check endpoints verified (not just port check)
- [ ] Alerting on 5xx rate > 1% for 2 minutes
- [ ] Alerting on healthy host count < 2
- [ ] SSL certificate expiry monitoring (alert at 30 days)
- [ ] Load balancer access logs enabled and shipped to SIEM
- [ ] Routing rules in version control (Terraform/Pulumi)
- [ ] Runbook for emergency traffic cutover documented
- [ ] Failover tested in staging environment (quarterly)

---

## Common Mistakes

1. **Shallow health checks**: Checking that port 80 responds is not enough. A server can accept connections but be broken (DB connection pool exhausted, downstream service unreachable). Health check endpoints must validate internal dependencies.

2. **Sticky sessions without externalized session state**: IP Hash routing to maintain session state is fragile. Server crashes lose sessions. Scaling up or down breaks affinity. Move session state to Redis or another shared store and eliminate sticky sessions.

3. **Single load balancer as a single point of failure**: Engineers add load balancers to eliminate SPOF on app servers, then leave the load balancer itself as a SPOF. Production systems need HA load balancer configurations (Active-Passive minimum, Active-Active for high-traffic).

---

## Interview Talking Points

### One-Line Answer
A load balancer distributes incoming traffic across multiple servers to improve performance and prevent any single server from becoming a bottleneck or single point of failure.

### Structured Answer (2 minutes)
> "A load balancer sits in front of a pool of servers and distributes incoming requests across them. It solves two problems: scale and availability. Without one, all traffic hits a single server — you can't add more servers without changing where clients point. With a load balancer, you scale horizontally by just adding more servers behind it. For example, Netflix uses load balancers to distribute video streaming requests across thousands of servers, routing based on geography and server health. The main trade-off is between simple algorithms like round-robin — easy but ignores server load — and smarter algorithms like least-connections, which adapt but require tracking state."

### Follow-Up Questions to Expect
- "What's the difference between L4 and L7 load balancing?"
- "How does a load balancer know when a server is unhealthy?"
- "What happens to in-flight requests when a server goes down?"
- "How would you load balance WebSocket connections?"
- "What's the difference between a load balancer and an API gateway?"

### Common Interview Mistakes
- Saying "round-robin is always fine" — interviewers expect awareness that algorithm choice depends on workload characteristics
- Forgetting that the load balancer itself can be a SPOF — always mention HA configuration in production context

---

## Trade-Offs Summary

| Dimension | Benefit | Cost |
|---|---|---|
| Performance | Removes bottleneck, enables horizontal scale | Small latency added per hop (~0.5-2ms) |
| Complexity | One entry point, simple client config | Added infra component to manage and monitor |
| Cost | Cheap relative to larger servers | Load balancer + health check infra cost |
| Consistency | Requests can hit any server (stateless friendly) | Stateful apps require session management strategy |
| Scalability | Linear horizontal scale possible | Load balancer itself requires HA at high traffic |

---

## Diagram Idea

### Component Diagram
```
[Internet / Clients]
        |
        ▼
  [Load Balancer]
   (health checks)
   /     |     \
  ▼      ▼      ▼
[App1] [App2] [App3]
  |      |      |
  └──────┴──────┘
         |
         ▼
    [Database]
```

### Sequence Diagram
```
Client → Load Balancer: HTTP GET /products
Load Balancer → Health Check: Is App2 healthy? → Yes
Load Balancer → App2: Forward HTTP GET /products
App2 → Database: SELECT * FROM products WHERE ...
Database → App2: result set
App2 → Load Balancer: HTTP 200 + body
Load Balancer → Client: HTTP 200 + body
```

### Failure Diagram
```
[Internet / Clients]
        |
        ▼
  [Load Balancer]
   Health check: App2 → FAIL (5 consecutive)
   Action: Remove App2 from rotation
   /              \
  ▼                ▼
[App1]  [App2❌]  [App3]
  Active  Inactive  Active
```

---

## Agent Execution Prompt

```
CONCEPT: Load Balancer
CATEGORY: Infrastructure
LEVEL: [Beginner | Intermediate | Advanced | Expert | All]
TEMPLATE: Load CONCEPT_TEMPLATE.md
CONTEXT: Load shared-context/terminology.md

TASK: Generate the [LEVEL] section for Load Balancer.

OUTPUT FORMAT:
- Follow CONCEPT_TEMPLATE.md exactly
- Use plain language for Beginner (restaurant/maître d' analogy preferred)
- For Advanced: trade-off table required, scale considerations at 1K/100K/1M req/sec
- For Expert: multi-region, compliance (GDPR data residency), security (WAF, mTLS), cost model
- Include real tools: AWS ALB, NGINX, HAProxy
- 200-500 words per section

CONSTRAINTS:
- Do not load other concept files
- Do not generate code
- Reference related concepts by name only (no content from them)
```
