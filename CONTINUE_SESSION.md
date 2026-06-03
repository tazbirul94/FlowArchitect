# DevArchitect Portal — Session Handoff Prompt

Paste this entire prompt at the start of the next session.

---

## Context

Building a static HTML software architect learning portal at:
`C:/Users/mhaque/Downloads/Myself/Coding/FlowArchitect/software-architect-learning-portal/`

No backend. No build step. Open `index.html` in browser directly.

## What exists (DO NOT regenerate)

```
software-architect-learning-portal/
├── index.html                    ✅ Complete landing page
├── assets/
│   ├── style.css                 ✅ Complete (dark/light, all components, UX improvements)
│   └── app.js                    ✅ Complete (sidebar, search, TOC, copy buttons, back-to-top)
└── pages/
    ├── 01-docker-fundamentals.html  ✅ Done
    ├── 02-docker-commands.html      ✅ Done
    ├── 03-dockerfile.html           ✅ Done
    ├── 04-docker-compose.html       ✅ Done
    ├── 05-docker-networking.html    ✅ Done
    ├── 06-docker-volumes.html       ✅ Done
```

## What needs to be built (in order)

### Batch 3
- `00-roadmap.html`
- `pages/07-container-registries-nexus.html`
- `pages/08-cicd.html`

### Batch 4
- `pages/09-kubernetes-fundamentals.html`
- `pages/10-kubernetes-workloads.html`

### Batch 5 (most complex — may need one page at a time)
- `pages/11-kubernetes-services-load-balancing.html`
- `pages/12-kubernetes-ingress-api-gateway.html`

### Batch 6
- `pages/13-kubernetes-config-secrets.html`
- `pages/14-kubernetes-storage.html`
- `pages/15-kubernetes-autoscaling-hpa-vpa-cluster.html`

### Batch 7
- `pages/16-helm.html`
- `pages/17-argocd-gitops.html`

### Batch 8
- `pages/18-observability.html`
- `pages/19-security.html`
- `pages/20-production-deployment-patterns.html`

### Batch 9
- `pages/21-software-architecture-thinking.html`
- `pages/22-system-design.html`

### Batch 10
- `pages/23-troubleshooting-playbook.html`
- `pages/24-interview-questions.html`

---

## Page template (use for EVERY page)

### HEAD boilerplate
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

### Body shell (identical for all pages)
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
    <!-- PAGE HEADER + TOC PLACEHOLDER + ALL SECTIONS HERE -->
  </div>
</main>
<script src="../assets/app.js" defer></script>
</body>
</html>
```

### Page header pattern
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

### Required CSS classes (already in style.css)
- `.story-card` + `.story-card-label` — real-world story
- `.beginner-note` + `.beginner-note-label` — simple explanation
- `.architect-note` + `.architect-note-label` — design thinking
- `.production-tip` + `.production-tip-label` — production advice
- `.common-mistake` + `.common-mistake-label` — mistakes and fixes
- `.lab-box` + `.lab-box-label` — hands-on lab
- `.mermaid-wrapper` — wraps `<div class="mermaid">` diagrams
- `.decision-table` — comparison tables
- `.checklist` — production checklists
- `.interview-section` + `.interview-q` — Q&A with `<details>`
- `.code-wrapper` — wraps ALL `<pre><code>` blocks (required for copy buttons)
- `.os-tabs` → `.os-tab-buttons` → `.os-tab-btn[data-tab]` + `.os-tab-panel[data-tab]`
- `.toc-placeholder` — app.js injects TOC here automatically
- All `h2` must have `id` attributes (app.js uses them for TOC + anchor links)

### Level badges
- `badge-beginner` — pages 01–04
- `badge-intermediate` — pages 05–10
- `badge-advanced` — pages 11–17
- `badge-expert` — pages 18–24

---

## Enterprise scenario (use in every page)

All examples use the **TicketFlow** enterprise ticketing platform:
- `user-service` (Node.js)
- `ticket-service` (Spring Boot Java)
- `payment-service` (Python)
- `order-service` (Go)
- `notification-service` (Node.js)
- `api-gateway` (NGINX)
- Registry: Nexus at `nexus.ticketflow.io:5000`
- Kubernetes cluster on AWS EKS
- CI/CD: GitHub Actions → Nexus → Helm → Argo CD
- Monitoring: Prometheus + Grafana + Loki

---

## Per-page content structure (mandatory for every page)

1. Story card (real-world analogy)
2. Beginner explanation (`.beginner-note`)
3. Technical explanation
4. Mermaid diagram
5. Enterprise scenario (TicketFlow example)
6. Code examples (all in `.code-wrapper`)
7. OS tabs where commands differ (Windows vs Linux/macOS)
8. `<details>` "Behind the scenes"
9. Common mistakes (`.common-mistake`)
10. Architect notes (`.architect-note`)
11. Production checklist (`.checklist`)
12. Hands-on lab (`.lab-box`)
13. Interview questions (`.interview-section` + `.interview-q`)

---

## Execution instructions

Use **parallel sub-agents** for each batch. Launch all pages in a batch simultaneously in one message.

Start with: **"proceed with Batch 3 in parallel"**

Batch 3 pages:

**00-roadmap.html** (`data-page-id="00"`) — Visual learning roadmap. No sidebar — full-width layout. Shows the 9-level learning path with progress indicators. Links to all 25 pages. Visual timeline. Level badges. Topic cards grid. Note: this page uses `assets/style.css` (not `../assets/style.css`) and `assets/app.js`.

**07-container-registries-nexus.html** (`data-page-id="07"`) — Container Registries & Nexus. Badge: intermediate. Covers: Docker Hub vs Nexus vs Harbor vs ECR vs ACR vs GCR, registry auth, image tagging strategy (semver + git SHA + latest trap), image promotion (dev→staging→prod), Nexus setup walkthrough, push/pull commands, Mermaid: CI pushes to Nexus → Argo CD pulls. Enterprise scenario. Lab: push image to local Nexus. 6 interview Q&A.

**08-cicd.html** (`data-page-id="08"`) — CI/CD Pipelines. Badge: intermediate. Covers: GitHub Actions full pipeline YAML (build→test→scan→push to Nexus→update Helm values→GitOps trigger), GitLab CI equivalent, Jenkins pipeline, Azure DevOps. Mermaid: end-to-end pipeline flow. Trivy scan stage. Semantic versioning in CI. Common mistakes: pushing :latest only. Lab: full GitHub Actions workflow. 7 interview Q&A.
