# /validate-concept — Check an academy concept page against conventions

## Usage
```
/validate-concept <filename>
/validate-concept all
```
Examples:
- `/validate-concept rest.html`
- `/validate-concept all`

## What to check (grep-based — do NOT read full files)

### Structure checks (grep for presence)
- `data-page-id` on body
- All 5 CDN scripts: tailwindcss.com, highlight.js CSS, highlight.js JS, mermaid, style.css
- `darkMode:'class'` tailwind config
- `../assets/style.css` (not assets/style.css)
- `../assets/app.js` with `defer`
- `id="sidebar"`, `id="sidebar-nav"`, `id="search-input"`
- `id="mobile-header"`, `id="hamburger"`
- `id="main-content"`, `class="top-bar"`, `class="page-content"`
- Inline level-tab script before app.js

### Content section checks (grep for class presence)
- `.concept-meta-bar`
- `.page-title`, `.page-subtitle`
- `.toc-placeholder`
- `.analogy-box`
- `.story-section`
- `.level-tabs` with `data-level="beginner"` and `data-level="expert"`
- `.enterprise-card`
- `.common-mistake` (at least 3)
- `.interview-prep`
- `.decision-table`
- `.mermaid-wrapper`
- `.tradeoff-table`

### Code quality checks (grep)
- `<pre>` NOT preceded by `code-wrapper` → FAIL
- `<h2` without `section-title` → FAIL
- Duplicate `id=` → WARN

## Output format

```
FILE: rest.html
STATUS: PASS / FAIL

FAILS:
- Missing .tradeoff-table
- h2 id="learn" missing class="section-title"
- pre block not wrapped in .code-wrapper

WARNINGS:
- No .toc-placeholder found
```

Report PASS/FAIL per file. Total count at end.
