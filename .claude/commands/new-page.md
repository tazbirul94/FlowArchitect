# /new-page — Generate a single DevArchitect portal page

Generate one page for the learning portal. Read CLAUDE.md for full template and conventions.

## Usage
```
/new-page <page-id> [topic description]
```
Examples:
- `/new-page 07` — builds 07-container-registries-nexus.html
- `/new-page 09 Kubernetes fundamentals for beginners`

## What to do

1. Check CLAUDE.md for the page spec (filename, level badge, topic outline)
2. Look at `software-architect-learning-portal/pages/01-docker-fundamentals.html` as a structural reference
3. Write the full HTML file to `software-architect-learning-portal/pages/<filename>`
4. Follow ALL 13 content sections from CLAUDE.md
5. Use TicketFlow enterprise scenario throughout
6. All `h2` must have `id` and `class="section-title"` for TOC generation
7. All code blocks must be wrapped in `.code-wrapper`
8. Include at least 1 Mermaid diagram in `.mermaid-wrapper`
9. Include 5–7 interview Q&A in `.interview-section`

## Page specs by ID

| ID | File | Level | Topic |
|----|------|-------|-------|
| 00 | 00-roadmap.html | — | Visual learning roadmap (special: full-width, no sidebar structure, uses `assets/` not `../assets/`) |
| 07 | 07-container-registries-nexus.html | intermediate | Docker Hub vs Nexus vs Harbor vs ECR, image tagging (semver+SHA), image promotion, push/pull commands |
| 08 | 08-cicd.html | intermediate | GitHub Actions full pipeline, GitLab CI, Trivy scan, semantic versioning, GitOps trigger |
| 09 | 09-kubernetes-fundamentals.html | intermediate | Pods, nodes, clusters, control plane, kubelet, etcd, kubectl basics |
| 10 | 10-kubernetes-workloads.html | intermediate | Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, ReplicaSets |
| 11 | 11-kubernetes-services-load-balancing.html | advanced | ClusterIP, NodePort, LoadBalancer, ExternalName, kube-proxy, iptables |
| 12 | 12-kubernetes-ingress-api-gateway.html | advanced | Ingress controllers, NGINX ingress, TLS termination, path routing, API Gateway patterns |
| 13 | 13-kubernetes-config-secrets.html | advanced | ConfigMaps, Secrets, env vars, volume mounts, sealed secrets, external secrets operator |
| 14 | 14-kubernetes-storage.html | advanced | PV, PVC, StorageClass, dynamic provisioning, EBS/EFS on AWS, StatefulSet storage |
| 15 | 15-kubernetes-autoscaling-hpa-vpa-cluster.html | advanced | HPA, VPA, Cluster Autoscaler, KEDA, scaling metrics |
| 16 | 16-helm.html | advanced | Charts, values.yaml, templates, releases, rollbacks, Helm repos, helmfile |
| 17 | 17-argocd-gitops.html | advanced | GitOps principles, ArgoCD app-of-apps, sync policies, ApplicationSet, rollback |
| 18 | 18-observability.html | expert | Prometheus, Grafana, Loki, tracing, SLOs/SLIs/SLAs, alerting |
| 19 | 19-security.html | expert | RBAC, NetworkPolicy, PodSecurityStandards, Falco, Trivy, image scanning, secret management |
| 20 | 20-production-deployment-patterns.html | expert | Blue-green, canary, rolling, feature flags, traffic splitting |
| 21 | 21-software-architecture-thinking.html | expert | Architecture decision records, trade-offs, coupling, cohesion, CAP theorem |
| 22 | 22-system-design.html | expert | System design interview framework, load estimation, partitioning, caching strategies |
| 23 | 23-troubleshooting-playbook.html | expert | K8s debug workflows, OOMKilled, CrashLoopBackOff, ImagePullBackOff, pod eviction |
| 24 | 24-interview-questions.html | expert | 50 curated questions across Docker, K8s, architecture, system design |

## Output
Write the complete HTML file. Report filename and approximate line count when done.
