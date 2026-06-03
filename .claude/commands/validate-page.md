# /validate-page — Check a portal page against conventions

Validates one or more pages against the DevArchitect template conventions.

## Usage
```
/validate-page <filename>
/validate-page all
```
Examples:
- `/validate-page 07-container-registries-nexus.html`
- `/validate-page all` — checks all existing pages

## What to check

For each page, verify:

### Structure
- [ ] `data-page-id` set correctly on `<body>`
- [ ] HEAD has all 5 CDN scripts (Tailwind, hljs CSS, hljs JS, Mermaid, style.css)
- [ ] Theme flash prevention script present
- [ ] `tailwind.config={darkMode:'class'}` set
- [ ] Correct asset path: `../assets/` (except 00-roadmap.html uses `assets/`)
- [ ] `app.js` loaded with `defer`
- [ ] Sidebar HTML: `#sidebar`, `#search-input`, `#sidebar-nav`
- [ ] Mobile header: `#mobile-header`, `#hamburger`, `#theme-toggle`
- [ ] Main: `#main-content`, `.top-bar`, `.page-content`

### Content sections
- [ ] `.page-header` with `.page-meta`, `.page-title`, `.page-subtitle`
- [ ] Correct level badge (`badge-beginner/intermediate/advanced/expert`)
- [ ] `.toc-placeholder` present
- [ ] At least one `.story-card`
- [ ] At least one `.beginner-note`
- [ ] At least one `.mermaid-wrapper` containing `.mermaid`
- [ ] At least one `.architect-note` or `.production-tip`
- [ ] At least one `.common-mistake`
- [ ] At least one `.checklist`
- [ ] At least one `.lab-box`
- [ ] `.interview-section` with `.interview-q` items using `<details>`

### Code quality
- [ ] ALL `<pre><code>` blocks wrapped in `.code-wrapper`
- [ ] ALL `h2` have `id` attribute and `class="section-title"`
- [ ] TicketFlow services mentioned (user-service, ticket-service, etc.)
- [ ] No hardcoded sidebar HTML (sidebar is injected by app.js)
- [ ] No duplicate `id` attributes

## Output format

```
FILE: 07-container-registries-nexus.html
STATUS: PASS / FAIL

FAILS:
- Missing .lab-box section
- h2 id="deploy" missing class="section-title"
- pre block at line 234 not wrapped in .code-wrapper

WARNINGS:
- Only 3 interview Q&A (recommend 5–7)
```

Report PASS/FAIL per file. List all failures. Show total pass/fail count at end.
