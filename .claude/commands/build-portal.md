# /build-portal — Orchestrator: auto-implement all pending portal pages

Fully automated pipeline: detect pending pages → build in parallel batches → validate → report.

## Usage
```
/build-portal              # build ALL pending pages (full auto)
/build-portal next         # build only the next pending batch
/build-portal next 2       # build next 2 batches
/build-portal status       # just show status, no building
```

## Orchestrator pipeline

### Step 1 — Discover pending pages
Run `/portal-status` (or glob `software-architect-learning-portal/pages/*.html`) to get the list of built vs pending files.

### Step 2 — Determine batches to build
Map pending page IDs to their batch groups:

| Batch | Pages | Max parallel agents |
|-------|-------|---------------------|
| 3 | 00, 07, 08 | 3 |
| 4 | 09, 10 | 2 |
| 5 | 11, 12 | 2 (complex — launch sequentially if one fails) |
| 6 | 13, 14, 15 | 3 |
| 7 | 16, 17 | 2 |
| 8 | 18, 19, 20 | 3 |
| 9 | 21, 22 | 2 |
| 10 | 23, 24 | 2 |

Only build batches that have at least one pending page. Skip fully-built batches.

### Step 3 — Build each batch (parallel within batch, sequential across batches)

For each batch to build:
1. Launch one **write** sub-agent per pending page in that batch — all in ONE message (parallel)
2. Wait for all agents in the batch to complete
3. Run `/validate-page` on each newly built file
4. If any page FAILS validation: fix issues inline or re-run that page's agent
5. Move to next batch

### Step 4 — Sub-agent briefing (use this exact format per page)

```
You are building one HTML page for the DevArchitect learning portal.

PROJECT ROOT: C:/Users/mhaque/Downloads/Myself/Coding/FlowArchitect

YOUR FILE: software-architect-learning-portal/pages/<FILENAME>
PAGE ID: <NN>
LEVEL BADGE: badge-<LEVEL>
BREADCRUMB: <SECTION> → <PAGE TITLE>

TOPIC OUTLINE:
<topic outline from the page specs below>

MANDATORY RULES — read these before writing:
1. Read CLAUDE.md at the project root for the full HTML template
2. Read software-architect-learning-portal/pages/01-docker-fundamentals.html as a structural reference
3. Follow ALL 13 content sections (story, beginner note, technical, mermaid, enterprise scenario, code examples, OS tabs, behind-the-scenes details, common mistakes, architect note, checklist, lab box, interview Q&A)
4. Use TicketFlow services in ALL examples: user-service (Node.js), ticket-service (Spring Boot), payment-service (Python), order-service (Go), notification-service (Node.js), api-gateway (NGINX), Registry: nexus.ticketflow.io:5000, K8s on AWS EKS
5. Every h2 MUST have id attribute AND class="section-title"
6. Every <pre><code> block MUST be wrapped in <div class="code-wrapper">
7. At least 1 Mermaid diagram inside <div class="mermaid-wrapper"><div class="mermaid">...</div></div>
8. 5–7 interview Q&A inside .interview-section using <details class="interview-q">
9. Write COMPLETE HTML — no placeholders, no TODO comments, no truncation
10. Correct asset path: ../assets/style.css and ../assets/app.js (EXCEPT 00-roadmap.html which uses assets/ without ../)

Write the complete file. Report filename and line count when done.
```

### Step 5 — Page specs (include relevant section in each agent brief)

**Page 00** — `00-roadmap.html`, no level badge, full-width layout
Special: uses `assets/style.css` (not `../assets/`), uses `assets/app.js` (not `../assets/`).
Content: Visual 9-level learning path. Cards grid for all 24 pages grouped by section. Level badges on each card. Links to all pages. Progress overview. No sidebar needed — full-width index-style page.

**Page 07** — `07-container-registries-nexus.html`, badge-intermediate
Content: Docker Hub vs Nexus vs Harbor vs ECR vs ACR vs GCR comparison table. Registry auth (docker login). Image tagging strategy: semver (1.2.3) + git SHA + latest trap. Image promotion pipeline (dev→staging→prod). Nexus setup walkthrough. Push/pull commands with TicketFlow. Mermaid: CI pushes to Nexus → K8s pulls on deploy. Lab: push user-service image to local Nexus. 6 interview Q&A.

**Page 08** — `08-cicd.html`, badge-intermediate
Content: GitHub Actions full pipeline YAML (build→test→trivy scan→push to nexus.ticketflow.io:5000→update Helm values.yaml→ArgoCD sync trigger). GitLab CI equivalent. Semantic versioning in CI (git tag + SHA). Common mistake: pushing :latest only. Mermaid: end-to-end pipeline flow. Lab: full GitHub Actions workflow for ticket-service. 7 interview Q&A.

**Page 09** — `09-kubernetes-fundamentals.html`, badge-intermediate
Content: What K8s solves (container orchestration). Cluster architecture: control plane (API server, etcd, scheduler, controller-manager) + worker nodes (kubelet, kube-proxy, container runtime). Pod concept. Namespace. kubectl basics (get, describe, logs, exec, apply, delete). Mermaid: cluster architecture diagram. TicketFlow on EKS. Lab: deploy user-service Pod, inspect it. 6 interview Q&A.

**Page 10** — `10-kubernetes-workloads.html`, badge-intermediate
Content: Deployment (rolling update, rollback, replicas). ReplicaSet (why you don't use it directly). StatefulSet (stable network identity, ordered scaling — for databases). DaemonSet (one pod per node — for log collectors like Fluentd). Job + CronJob. Mermaid: workload type decision tree. TicketFlow examples for each type. Lab: deploy ticket-service as Deployment with 3 replicas. 6 interview Q&A.

**Page 11** — `11-kubernetes-services-load-balancing.html`, badge-advanced
Content: ClusterIP (default, internal only). NodePort (exposes on node IP). LoadBalancer (cloud LB, used for api-gateway). ExternalName (DNS alias). Service discovery via DNS (user-service.default.svc.cluster.local). kube-proxy + iptables/ipvs. Headless services (StatefulSets). Mermaid: service types comparison. TicketFlow: how payment-service calls ticket-service. Lab: expose user-service. 7 interview Q&A.

**Page 12** — `12-kubernetes-ingress-api-gateway.html`, badge-advanced
Content: Why Ingress (one LB for many services). NGINX Ingress controller setup. Path-based routing (/api/users → user-service, /api/tickets → ticket-service). Host-based routing. TLS termination with cert-manager + Let's Encrypt. Rate limiting annotations. API Gateway pattern vs Ingress. Mermaid: ingress routing diagram. TicketFlow: full ingress config. Lab: configure ingress for all TicketFlow services. 7 interview Q&A.

**Page 13** — `13-kubernetes-config-secrets.html`, badge-advanced
Content: ConfigMap (non-sensitive config, env vars, mounted as files). Secret (base64, not encrypted by default). Sealed Secrets (Bitnami). External Secrets Operator (pull from AWS Secrets Manager). env vs envFrom vs volumeMount. RBAC for secret access. Common mistake: committing secrets to git. Mermaid: secret rotation flow. TicketFlow: DB credentials for ticket-service. Lab: mount config + secret. 6 interview Q&A.

**Page 14** — `14-kubernetes-storage.html`, badge-advanced
Content: Volumes vs PersistentVolumes. PVC lifecycle. StorageClass + dynamic provisioning. Access modes (RWO, ROX, RWX). AWS EBS (RWO) vs EFS (RWX). StatefulSet + PVC template. Volume expansion. Mermaid: PV/PVC/StorageClass relationship. TicketFlow: PostgreSQL for ticket-service with EBS. Lab: deploy stateful PostgreSQL. 6 interview Q&A.

**Page 15** — `15-kubernetes-autoscaling-hpa-vpa-cluster.html`, badge-advanced
Content: HPA (CPU/memory metrics, custom metrics via KEDA). VPA (right-sizing, modes: Off/Auto/Recreate). Cluster Autoscaler (node provisioning). KEDA (event-driven scaling: queue depth, HTTP reqs). Cooldown periods. Common mistake: HPA + VPA conflict. Mermaid: scaling decision flow. TicketFlow: HPA for ticket-service during peak load. Lab: configure HPA with custom metric. 6 interview Q&A.

**Page 16** — `16-helm.html`, badge-advanced
Content: Chart structure (Chart.yaml, values.yaml, templates/, helpers). Templating syntax ({{ .Values.image.tag }}). Release management (install, upgrade, rollback, uninstall). Helm repos (ArtifactHub, custom Nexus repo). helmfile for multi-chart deployments. Chart versioning. Common mistake: hardcoding values. Mermaid: Helm release lifecycle. TicketFlow: Helm chart for user-service. Lab: create and deploy chart. 7 interview Q&A.

**Page 17** — `17-argocd-gitops.html`, badge-advanced
Content: GitOps principles (git as single source of truth). ArgoCD architecture (app controller, repo server, API server). Application manifest. App-of-Apps pattern. ApplicationSet (cluster generator, git generator). Sync policies (automated, self-heal, prune). Health checks. Rollback via git revert. Mermaid: GitOps flow (git push → ArgoCD → K8s). TicketFlow: full ArgoCD setup. Lab: deploy via ArgoCD. 7 interview Q&A.

**Page 18** — `18-observability.html`, badge-expert
Content: Three pillars (metrics, logs, traces). Prometheus (scrape, PromQL, recording rules, alerting rules). Grafana (dashboards, data sources, alerting). Loki (log aggregation, LogQL). Jaeger/Tempo (distributed tracing). SLO/SLI/SLA definitions + error budget. Alertmanager routes. Mermaid: observability stack architecture. TicketFlow: P95 latency SLO for payment-service. Lab: write PromQL query. 7 interview Q&A.

**Page 19** — `19-security.html`, badge-expert
Content: RBAC (Role, ClusterRole, RoleBinding). NetworkPolicy (deny all, allow specific). Pod Security Standards (restricted/baseline/privileged). Image scanning with Trivy (in CI). Falco (runtime threat detection). Secret management best practices. Non-root containers. Read-only root filesystem. Mermaid: defense-in-depth layers. TicketFlow: RBAC for CI service account. Lab: write NetworkPolicy. 7 interview Q&A.

**Page 20** — `20-production-deployment-patterns.html`, badge-expert
Content: Rolling update (default K8s, zero-downtime). Blue-green (full duplicate env, instant cutover). Canary (percentage traffic split). Feature flags (decoupled release from deploy). A/B testing vs canary. Traffic splitting with NGINX ingress / Istio weight annotations. Rollback strategies. Mermaid: each pattern flow diagram. TicketFlow: canary deploy for payment-service v2. Lab: implement canary. 7 interview Q&A.

**Page 21** — `21-software-architecture-thinking.html`, badge-expert
Content: ADRs (Architecture Decision Records — format, when to write, examples). Trade-off analysis framework. Coupling vs cohesion. Conway's Law. CAP theorem (consistency, availability, partition tolerance — pick 2). PACELC. Event-driven vs request-response trade-offs. Monolith vs microservices decision matrix. Mermaid: CAP theorem diagram. TicketFlow: ADR for choosing event-driven for notification-service. Lab: write an ADR. 6 interview Q&A.

**Page 22** — `22-system-design.html`, badge-expert
Content: System design interview framework (clarify → estimate → high-level → deep dive → trade-offs). Load estimation (DAU, QPS, storage math). Horizontal vs vertical scaling. Database sharding strategies. Caching layers (CDN, Redis, application cache). Message queues (Kafka, RabbitMQ) — when to use. API rate limiting patterns. Mermaid: generic scalable architecture. TicketFlow: design TicketFlow from scratch walkthrough. Lab: design a URL shortener. 7 interview Q&A.

**Page 23** — `23-troubleshooting-playbook.html`, badge-expert
Content: Systematic debug methodology (observe → isolate → hypothesize → test → fix). Pod states and what they mean. CrashLoopBackOff (causes + fix). OOMKilled (causes + fix). ImagePullBackOff (causes + fix). Pending pods (resource starvation, affinity). Service not routing (endpoint check). Node NotReady. kubectl debug commands reference. Mermaid: troubleshooting decision tree. TicketFlow: 5 real incident scenarios. Lab: debug broken deployment. 7 interview Q&A.

**Page 24** — `24-interview-questions.html`, badge-expert
Content: 50 curated Q&A grouped by topic. Docker (10 Q). Kubernetes (15 Q). CI/CD + GitOps (8 Q). Architecture + System Design (10 Q). Observability + Security (7 Q). Each in <details class="interview-q"> with detailed answer. Include difficulty tag (junior/mid/senior). Mermaid: topic coverage map. No lab needed. Tips section: how to structure interview answers (STAR method for architecture questions).

### Step 6 — Post-build validation

After each batch completes:
```
Run /validate-page on each new file.
Report: N passed, N failed.
If failures: list them with specific issues.
Fix failures before moving to next batch (re-run agent with fix instructions).
```

### Step 7 — Final report

```
BUILD COMPLETE
==============
Built: N pages
Validated: N/N passed
Failed: 0 (or list)

Portal progress: ██████████████████████ N/25 (N%)

All pages at: software-architect-learning-portal/pages/
Open index.html in browser to verify.
```

## Error handling

- Agent writes empty/truncated file → re-run with explicit "write COMPLETE file, minimum 300 lines"
- Validation fails on `.code-wrapper` → patch file directly using Edit tool
- Mermaid diagram missing → patch inline
- Never skip a batch due to one failing page — fix and continue

## Token efficiency rules

- Do NOT read all existing pages before building — only read `01-docker-fundamentals.html` as reference
- Do NOT re-read CLAUDE.md inside this orchestrator — it is already loaded
- Pass specs inline to each agent (no agent should need to discover specs on its own)
- Use parallel agents — never build pages sequentially when batch allows parallel
