# FlowArchitect — DevArchitect Learning Portal

## What this is
Static HTML learning portal. No backend, no build step. Open `index.html` in browser.
Path: `software-architect-learning-portal/`

## 24 pages — current status
```
00-roadmap.html                          ✅ Done
01-docker-fundamentals.html              ✅ Done
02-docker-commands.html                  ✅ Done
03-dockerfile.html                       ✅ Done
04-docker-compose.html                   ✅ Done
05-docker-networking.html                ✅ Done
06-docker-volumes.html                   ✅ Done
07-container-registries-nexus.html       ✅ Done
08-cicd.html                             ✅ Done
09-kubernetes-fundamentals.html          ✅ Done
10-kubernetes-workloads.html             ✅ Done
11-kubernetes-services-load-balancing.html ✅ Done
12-kubernetes-ingress-api-gateway.html   ✅ Done
13-kubernetes-config-secrets.html        ✅ Done
14-kubernetes-storage.html               ✅ Done
15-kubernetes-autoscaling-hpa-vpa-cluster.html ✅ Done
16-helm.html                             ✅ Done
17-argocd-gitops.html                    ✅ Done
18-observability.html                    ✅ Done
19-security.html                         ✅ Done
20-production-deployment-patterns.html   ✅ Done
21-software-architecture-thinking.html   ✅ Done
22-system-design.html                    ✅ Done
23-troubleshooting-playbook.html         ✅ Done
24-interview-questions.html              ✅ Done
```

## Shared assets (complete — do not regenerate)
- `assets/style.css` — all component styles
- `assets/app.js` — sidebar, search, TOC, copy buttons, theme, nav

## Page template (mandatory for every page)

### HEAD
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGE TITLE — DevArchitect</title>
  <script>if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class'}</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body data-page-id="NN" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

### BODY SHELL
```html
<aside id="sidebar">
  <div class="logo">
    <div style="font-size:1.25rem;font-weight:800;color:white;">DevArchitect</div>
    <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:2px;">Beginner → Architect</div>
  </div>
  <input type="text" id="search-input" placeholder="Search topics... (Ctrl+K)">
  <nav id="sidebar-nav"></nav>
</aside>
<div id="mobile-header">
  <button id="hamburger">☰</button>
  <span style="font-weight:700;">DevArchitect</span>
  <button id="theme-toggle">🌙</button>
</div>
<main id="main-content">
  <div class="top-bar">
    <span class="breadcrumb">SECTION → PAGE NAME</span>
    <button id="theme-toggle">🌙</button>
  </div>
  <div class="page-content">
    <!-- content here -->
  </div>
</main>
<script src="../assets/app.js" defer></script>
</body>
</html>
```

### PAGE HEADER
```html
<div class="page-header">
  <div class="page-meta">
    <span class="level-badge badge-LEVEL">LEVEL</span>
    <span class="tag">⏱ NN min read</span>
    <span class="tag">Epic N</span>
  </div>
  <h1 class="page-title">PAGE TITLE</h1>
  <p class="page-subtitle">ONE LINE DESCRIPTION.</p>
</div>
<div class="toc-placeholder"></div>
```

## Level badges
- `badge-beginner` — pages 01–04
- `badge-intermediate` — pages 05–10
- `badge-advanced` — pages 11–17
- `badge-expert` — pages 18–24

## Required content sections (every page, in order)
1. `<h2 class="section-title">` — The Story (`story-card`)
2. Beginner explanation (`beginner-note`)
3. Technical explanation
4. Mermaid diagram (`.mermaid-wrapper` > `.mermaid`)
5. Enterprise scenario (TicketFlow)
6. Code examples (all in `.code-wrapper`)
7. OS tabs where commands differ
8. `<details>` "Behind the scenes"
9. Common mistakes (`.common-mistake`)
10. Architect notes (`.architect-note`)
11. Production checklist (`.checklist`)
12. Hands-on lab (`.lab-box`)
13. Interview Q&A (`.interview-section` + `.interview-q` with `<details>`)

## CSS classes (all in style.css)
- `.story-card` + `.story-card-label`
- `.beginner-note` + `.beginner-note-label`
- `.architect-note` + `.architect-note-label`
- `.production-tip` + `.production-tip-label`
- `.common-mistake` + `.common-mistake-label`
- `.lab-box` + `.lab-box-label`
- `.mermaid-wrapper`
- `.decision-table`
- `.checklist`
- `.interview-section` + `.interview-q`
- `.code-wrapper` (wraps ALL `<pre><code>` blocks)
- `.os-tabs` → `.os-tab-buttons` → `.os-tab-btn[data-tab]` + `.os-tab-panel[data-tab]`
- `.toc-placeholder`
- ALL `h2` need `id` and class `section-title`

## Enterprise scenario — TicketFlow
Every page uses this company:
- `user-service` (Node.js), `ticket-service` (Spring Boot), `payment-service` (Python)
- `order-service` (Go), `notification-service` (Node.js), `api-gateway` (NGINX)
- Registry: Nexus at `nexus.ticketflow.io:5000`
- K8s on AWS EKS
- CI/CD: GitHub Actions → Nexus → Helm → Argo CD
- Monitoring: Prometheus + Grafana + Loki

## Skills (slash commands)
- `/build-portal` — **ORCHESTRATOR**: auto-detect pending pages → build all batches → validate (full auto)
- `/build-portal next` — build only the next pending batch
- `/new-page <id>` — generate one portal page
- `/batch <N>` — generate multiple pages in parallel
- `/validate-page <file|all>` — check page against conventions
- `/portal-status` — show what's built vs pending

## Notes
- 00-roadmap.html uses `assets/style.css` (not `../assets/`) and `assets/app.js` — it lives at portal root level
- Run pages in parallel batches using sub-agents for speed
- Do NOT regenerate style.css or app.js

---

# System Design Academy Portal

## What this is
Second portal — concept-driven system design learning. Static HTML, no build step.
Path: `system-design-academy-portal/`

## Structure
```
system-design-academy-portal/
  index.html              — landing page (inline script, no app.js)
  assets/
    style.css             — all CSS (extends DevArchitect base + new components)
    app.js                — sidebar, theme, search, level tabs, TOC, nav, etc.
  concepts/
    load-balancer.html    ✅ Done
    caching.html          ✅ Done
    [others pending]
```

## New CSS components (academy-specific, in assets/style.css)
- `.level-tabs` → `.level-tab-buttons` → `.level-tab-btn[data-level]` + `.level-tab-panel[data-level]`
- `.enterprise-card` + `.enterprise-card-label` + `.enterprise-card-company`
- `.tradeoff-table` (striped, `.good` / `.bad` cells)
- `.story-section` + `.story-label` + `.story-scenario/problem/solution/outcome`
- `.interview-prep` → `.interview-one-liner`, `.interview-structured`, `.interview-followups`, `.interview-mistakes`
- `.concept-meta-bar` → `.concept-meta-item` → `.meta-label` + `.meta-value`
- `.diagram-card` + `.diagram-title`
- `.analogy-box` + `.analogy-label`
- `.badge-all-levels`

## Concept page template (mandatory structure — 9 sections)
1. Page header with `.concept-meta-bar` + `.page-title` + `.page-subtitle` + badges
2. `<h2 id="definition">` — `.analogy-box` + why-it-matters paragraph
3. `<h2 id="story">` — `.story-section` with 4 sub-divs
4. `<h2 id="learn">` — `.level-tabs` with 4 panels (beginner/intermediate/advanced/expert)
5. `<h2 id="enterprise">` — `.enterprise-card`
6. `<h2 id="mistakes">` — 3× `.common-mistake`
7. `<h2 id="interview">` — `.interview-prep`
8. `<h2 id="tradeoffs">` — `.decision-table`
9. Related concepts flex card row

## Concept page HEAD
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CONCEPT NAME — System Design Academy</title>
  <script>if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class'}</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body data-page-id="CONCEPT-ID" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

## Concept page script (at bottom, before app.js)
```html
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
```

## Concept filename map (app.js NAV_ITEMS — must match exactly)
| Concept | File |
|---|---|
| Load Balancer | load-balancer.html |
| API Gateway | api-gateway.html |
| CDN | cdn.html |
| REST | rest.html |
| GraphQL | graphql.html |
| gRPC | grpc.html |
| Caching | caching.html |
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

## Skills (slash commands)
- `/build-academy` — **ORCHESTRATOR**: auto-detect pending concepts → build all batches (A–G, 4 parallel agents each) → validate → report
- `/build-academy next` — build only next pending batch
- `/new-concept <name>` — generate one concept page
- `/academy-status` — show built vs pending, next batch
- `/validate-concept <file|all>` — check concept page against 9-section conventions

## Notes
- Do NOT regenerate assets/style.css or assets/app.js
- index.html uses inline script (not app.js) — sidebar is hardcoded HTML
- Concept pages use `../assets/app.js` defer + inline level-tab script above it
- All 28 filenames in NAV_ITEMS must match exactly — see table above
