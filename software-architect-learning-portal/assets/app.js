/**
 * app.js — DevArchitect Learning Portal
 * Single shared script for index.html and all pages/*.html
 */

// ---------------------------------------------------------------------------
// 1. NAV_ITEMS — complete navigation structure
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  {
    group: "Foundation",
    items: [
      { id: "00", title: "Learning Roadmap", file: "00-roadmap.html" }
    ]
  },
  {
    group: "Docker",
    items: [
      { id: "01", title: "Docker Fundamentals",           file: "01-docker-fundamentals.html" },
      { id: "02", title: "Docker Commands",               file: "02-docker-commands.html" },
      { id: "03", title: "Dockerfile & Images",           file: "03-dockerfile.html" },
      { id: "04", title: "Docker Compose",                file: "04-docker-compose.html" },
      { id: "05", title: "Docker Networking",             file: "05-docker-networking.html" },
      { id: "06", title: "Docker Volumes",                file: "06-docker-volumes.html" },
      { id: "07", title: "Container Registries & Nexus",  file: "07-container-registries-nexus.html" }
    ]
  },
  {
    group: "CI/CD",
    items: [
      { id: "08", title: "CI/CD Pipelines", file: "08-cicd.html" }
    ]
  },
  {
    group: "Kubernetes",
    items: [
      { id: "09", title: "K8s Fundamentals",              file: "09-kubernetes-fundamentals.html" },
      { id: "10", title: "K8s Workloads",                 file: "10-kubernetes-workloads.html" },
      { id: "11", title: "Services & Load Balancing",     file: "11-kubernetes-services-load-balancing.html" },
      { id: "12", title: "Ingress & API Gateway",         file: "12-kubernetes-ingress-api-gateway.html" },
      { id: "13", title: "Config & Secrets",              file: "13-kubernetes-config-secrets.html" },
      { id: "14", title: "Storage (PV/PVC)",              file: "14-kubernetes-storage.html" },
      { id: "15", title: "Autoscaling & Resilience",      file: "15-kubernetes-autoscaling-hpa-vpa-cluster.html" }
    ]
  },
  {
    group: "Platform Engineering",
    items: [
      { id: "16", title: "Helm",               file: "16-helm.html" },
      { id: "17", title: "Argo CD & GitOps",   file: "17-argocd-gitops.html" }
    ]
  },
  {
    group: "Production",
    items: [
      { id: "18", title: "Observability",          file: "18-observability.html" },
      { id: "19", title: "Security",               file: "19-security.html" },
      { id: "20", title: "Deployment Patterns",    file: "20-production-deployment-patterns.html" }
    ]
  },
  {
    group: "Architecture",
    items: [
      { id: "21", title: "Architecture Thinking",  file: "21-software-architecture-thinking.html" },
      { id: "22", title: "System Design",          file: "22-system-design.html" }
    ]
  },
  {
    group: "Reference",
    items: [
      { id: "23", title: "Troubleshooting Playbook", file: "23-troubleshooting-playbook.html" },
      { id: "24", title: "Interview Questions",      file: "24-interview-questions.html" }
    ]
  }
];

// ---------------------------------------------------------------------------
// Helper: resolve path prefix depending on where this page lives
// index.html  → pages are at  pages/<file>
// pages/*.html → pages are at  ./<file>  (same directory)
// ---------------------------------------------------------------------------

function getPathPrefix() {
  const path = window.location.pathname;
  // Normalise Windows backslashes and decode URI
  const normalised = decodeURIComponent(path).replace(/\\/g, '/');
  // If the file lives inside a /pages/ segment, no prefix needed
  if (normalised.includes('/pages/')) {
    return '';
  }
  // Otherwise we are at the root (index.html or similar)
  return 'pages/';
}

// Return just the filename component of the current URL
function currentFilename() {
  const path = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] || 'index.html';
}

// ---------------------------------------------------------------------------
// 2. Sidebar rendering
// ---------------------------------------------------------------------------

function renderSidebar() {
  const container = document.getElementById('sidebar-nav');
  if (!container) return;

  const prefix = getPathPrefix();
  const activeName = currentFilename();

  // Build logo (links back to index.html)
  const logo = document.createElement('a');
  logo.className = 'sidebar-logo';
  logo.href = decodeURIComponent(window.location.pathname).replace(/\\/g, '/').includes('/pages/') ? '../index.html' : 'index.html';
  logo.style.cssText = 'display:block;text-decoration:none;cursor:pointer;';
  logo.innerHTML = `
    <span class="sidebar-logo-title">DevArchitect</span>
    <span class="sidebar-logo-subtitle">Beginner → Architect</span>
  `;
  container.appendChild(logo);

  // Build nav groups
  NAV_ITEMS.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'nav-group';

    const titleEl = document.createElement('div');
    titleEl.className = 'nav-group-title';
    titleEl.textContent = group.group;
    titleEl.style.cursor = 'pointer';
    titleEl.addEventListener('click', () => {
      groupEl.classList.toggle('collapsed');
      try {
        const state = JSON.parse(localStorage.getItem('navCollapsed') || '{}');
        state[group.group] = groupEl.classList.contains('collapsed');
        localStorage.setItem('navCollapsed', JSON.stringify(state));
      } catch(e) {}
    });
    groupEl.appendChild(titleEl);

    const itemsEl = document.createElement('div');
    itemsEl.className = 'nav-group-items';

    const visited = getVisitedPages();

    group.items.forEach(item => {
      const a = document.createElement('a');
      a.className = 'nav-item';
      const isInPages = decodeURIComponent(window.location.pathname).replace(/\\/g, '/').includes('/pages/');
      a.href = item.file === '00-roadmap.html'
        ? (isInPages ? '../00-roadmap.html' : '00-roadmap.html')
        : prefix + item.file;
      a.dataset.file = item.file;

      const numSpan = document.createElement('span');
      numSpan.className = 'nav-item-number';
      numSpan.textContent = item.id;

      const titleSpan = document.createElement('span');
      titleSpan.className = 'nav-item-title';
      titleSpan.textContent = item.title;

      a.appendChild(numSpan);
      a.appendChild(titleSpan);

      if (item.file === activeName) {
        a.classList.add('active');
      }

      // Show checkmark for visited pages (excluding current)
      if (visited.includes(item.file) && item.file !== activeName) {
        const check = document.createElement('span');
        check.className = 'nav-item-check';
        check.textContent = '✓';
        check.setAttribute('aria-label', 'Visited');
        a.appendChild(check);
      }

      itemsEl.appendChild(a);
    });

    groupEl.appendChild(itemsEl);
    try {
      const state = JSON.parse(localStorage.getItem('navCollapsed') || '{}');
      if (state[group.group] === true) groupEl.classList.add('collapsed');
    } catch(e) {}
    container.appendChild(groupEl);
  });
}

// ---------------------------------------------------------------------------
// 3. Theme (dark / light)
// ---------------------------------------------------------------------------

function applyTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  syncThemeIcon();
}

function syncThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  syncThemeIcon();
  // Re-render mermaid diagrams so they adopt the new theme colours
  reinitMermaid();
}

// ---------------------------------------------------------------------------
// 4. Search / filter sidebar
// ---------------------------------------------------------------------------

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  // Optionally create a clear button if the HTML doesn't already include one
  let clearBtn = document.getElementById('search-clear');
  if (!clearBtn) {
    clearBtn = document.createElement('button');
    clearBtn.id = 'search-clear';
    clearBtn.className = 'search-clear-btn';
    clearBtn.setAttribute('aria-label', 'Clear search');
    clearBtn.textContent = '✕';
    clearBtn.style.display = 'none';
    input.parentNode.insertBefore(clearBtn, input.nextSibling);
  }

  function filterNav(query) {
    const q = query.trim().toLowerCase();
    clearBtn.style.display = q ? 'inline-block' : 'none';

    const groups = document.querySelectorAll('#sidebar-nav .nav-group');
    groups.forEach(group => {
      const items = group.querySelectorAll('.nav-item');
      let anyVisible = false;

      items.forEach(item => {
        const titleSpan = item.querySelector('.nav-item-title');
        if (!titleSpan) return;

        const originalText = titleSpan.dataset.originalText || titleSpan.textContent;
        // Store original text on first run so we can restore it
        if (!titleSpan.dataset.originalText) {
          titleSpan.dataset.originalText = originalText;
        }

        if (!q) {
          titleSpan.innerHTML = escapeHtml(originalText);
          item.style.display = '';
          anyVisible = true;
          return;
        }

        const lowerOriginal = originalText.toLowerCase();
        const idx = lowerOriginal.indexOf(q);

        if (idx !== -1) {
          // Highlight match
          const before = escapeHtml(originalText.slice(0, idx));
          const match  = escapeHtml(originalText.slice(idx, idx + q.length));
          const after  = escapeHtml(originalText.slice(idx + q.length));
          titleSpan.innerHTML = `${before}<mark>${match}</mark>${after}`;
          item.style.display = '';
          anyVisible = true;
        } else {
          titleSpan.innerHTML = escapeHtml(originalText);
          item.style.display = 'none';
        }
      });

      // Hide entire group if nothing matched
      group.style.display = anyVisible ? '' : 'none';
    });
  }

  input.addEventListener('keyup', () => filterNav(input.value));
  input.addEventListener('input', () => filterNav(input.value));

  clearBtn.addEventListener('click', () => {
    input.value = '';
    filterNav('');
    input.focus();
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// 5. Copy code buttons
// ---------------------------------------------------------------------------

function initCopyButtons() {
  const wrappers = document.querySelectorAll('.code-wrapper');
  wrappers.forEach(wrapper => {
    const pre = wrapper.querySelector('pre');
    if (!pre) return;
    const codeEl = pre.querySelector('code') || pre;

    // Detect language from <code class="language-xxx"> and set data-lang
    if (codeEl && codeEl.className) {
      const langMatch = codeEl.className.match(/\blanguage-(\S+)/);
      if (langMatch) {
        wrapper.dataset.lang = langMatch[1];
      } else if (!wrapper.dataset.lang) {
        wrapper.dataset.lang = 'code';
      }
    } else if (!wrapper.dataset.lang) {
      wrapper.dataset.lang = 'code';
    }

    // Avoid double-injecting
    if (wrapper.querySelector('.copy-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.textContent = 'Copy';

    btn.addEventListener('click', () => {
      const text = codeEl.textContent;

      function onCopied() {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onCopied).catch(() => {
          fallbackCopy(text);
          onCopied();
        });
      } else {
        fallbackCopy(text);
        onCopied();
      }
    });

    wrapper.style.position = 'relative';
    wrapper.appendChild(btn);
  });
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
  } catch (_) {
    // Silent fail — clipboard unavailable
  }
  document.body.removeChild(ta);
}

// ---------------------------------------------------------------------------
// 6. OS tabs
// ---------------------------------------------------------------------------

function initOSTabs() {
  const preferred = localStorage.getItem('preferredOS') || null;

  function activateTab(container, tabId) {
    container.querySelectorAll('.os-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    container.querySelectorAll('.os-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.tab === tabId);
    });
  }

  document.querySelectorAll('.os-tabs').forEach(container => {
    // Apply saved preference if a matching panel exists
    if (preferred) {
      const hasPanel = container.querySelector(`.os-tab-panel[data-tab="${preferred}"]`);
      if (hasPanel) {
        activateTab(container, preferred);
      }
    }

    container.querySelectorAll('.os-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        activateTab(container, tabId);
        localStorage.setItem('preferredOS', tabId);
      });
    });
  });
}

// ---------------------------------------------------------------------------
// 7. Mermaid initialization
// ---------------------------------------------------------------------------

function initMermaid() {
  if (typeof mermaid === 'undefined') return;
  const isDark = document.documentElement.classList.contains('dark');
  mermaid.initialize({
    startOnLoad: true,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'system-ui, sans-serif',
    flowchart: { curve: 'basis', padding: 20 },
  });
}

function reinitMermaid() {
  if (typeof mermaid === 'undefined') return;
  const isDark = document.documentElement.classList.contains('dark');
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'system-ui, sans-serif',
    flowchart: { curve: 'basis', padding: 20 },
  });
  // Re-process any mermaid elements that have already been rendered
  // Reset them so mermaid can re-render with the new theme
  document.querySelectorAll('.mermaid[data-processed]').forEach(el => {
    // Restore original source if saved, otherwise use current textContent
    if (el.dataset.mermaidSrc) {
      el.removeAttribute('data-processed');
      el.innerHTML = el.dataset.mermaidSrc;
    }
  });
  // Save source before first render (hook into existing elements)
  document.querySelectorAll('.mermaid:not([data-processed])').forEach(el => {
    if (!el.dataset.mermaidSrc) {
      el.dataset.mermaidSrc = el.textContent.trim();
    }
  });
  try {
    mermaid.init(undefined, '.mermaid');
  } catch (_) {
    // Fail silently if no mermaid elements on page
  }
}

// ---------------------------------------------------------------------------
// 8. Highlight.js initialization
// ---------------------------------------------------------------------------

function initHighlightJS() {
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }
}

// ---------------------------------------------------------------------------
// 9. Mobile sidebar toggle
// ---------------------------------------------------------------------------

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  if (!hamburger || !sidebar) return;

  // Ensure overlay element exists
  let overlay = document.getElementById('sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  // Clicking overlay closes sidebar
  overlay.addEventListener('click', closeSidebar);

  // Click outside sidebar closes it (fallback for non-overlay scenarios)
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== hamburger &&
        e.target !== overlay) {
      closeSidebar();
    }
  });

  // Escape key closes sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

// ---------------------------------------------------------------------------
// 10. Details / summary smooth animation + indicator
// ---------------------------------------------------------------------------

function initDetailsAnimation() {
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    // Set initial indicator
    if (!summary.dataset.indicator) {
      summary.dataset.indicator = details.open ? '▼' : '▶';
    }

    summary.addEventListener('click', () => {
      // Defer so the open attribute has been toggled
      requestAnimationFrame(() => {
        summary.dataset.indicator = details.open ? '▼' : '▶';
      });
    });
  });
}

// ---------------------------------------------------------------------------
// 11. Active nav highlighting (also called inside renderSidebar; this handles
//     cases where sidebar HTML was pre-rendered in the HTML source)
// ---------------------------------------------------------------------------

function highlightActiveNav() {
  const activeName = currentFilename();
  let activeEl = null;

  document.querySelectorAll('#sidebar-nav .nav-item').forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    if (hrefFile === activeName) {
      a.classList.add('active');
      activeEl = a;
    }
  });

  if (activeEl) {
    activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

// ---------------------------------------------------------------------------
// 12. Reading progress bar
// ---------------------------------------------------------------------------

function initProgressBar() {
  let bar = document.getElementById('progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'progress-bar';
    bar.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'height:3px',
      'width:0%',
      'background:var(--accent, #3b82f6)',
      'z-index:9999',
      'transition:width 0.1s linear',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(bar);
  }

  let rafPending = false;

  function updateBar() {
    rafPending = false;
    const scrollable = document.body.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
      bar.style.width = '100%';
      return;
    }
    const pct = Math.min(100, (window.scrollY / scrollable) * 100);
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateBar);
    }
  }, { passive: true });

  // Initial render
  updateBar();
}

// ---------------------------------------------------------------------------
// 13. Keyboard shortcuts
// ---------------------------------------------------------------------------

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const tag = (document.activeElement || {}).tagName || '';
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    // Ctrl+K / Cmd+K — focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('search-input');
      if (input) input.focus();
      return;
    }

    // Escape — clear search and close mobile sidebar
    if (e.key === 'Escape') {
      const input = document.getElementById('search-input');
      if (input && document.activeElement === input) {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.blur();
        return;
      }
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        return;
      }
    }

    // Alt+T — toggle theme (skip if inside an input to avoid conflicts)
    if (e.altKey && e.key === 't' && !inInput) {
      e.preventDefault();
      toggleTheme();
      return;
    }
  });

  // Wire up the theme toggle button
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

// ---------------------------------------------------------------------------
// 14. Prev / next page navigation
// ---------------------------------------------------------------------------

function injectPageNav() {
  const body = document.body;
  const pageId = body.dataset.pageId;
  if (!pageId) return; // Not a content page

  const pageContent = document.querySelector('.page-content');
  if (!pageContent) return;

  // Flatten all items across groups
  const allItems = NAV_ITEMS.reduce((acc, group) => acc.concat(group.items), []);
  const currentIndex = allItems.findIndex(item => item.id === pageId);
  if (currentIndex === -1) return;

  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const next = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  // Avoid duplicate injection
  if (pageContent.querySelector('.page-nav')) return;

  const prefix = getPathPrefix();

  const nav = document.createElement('div');
  nav.className = 'page-nav';

  if (prev) {
    const a = document.createElement('a');
    a.href = prefix + prev.file;
    a.className = 'prev-page';
    a.textContent = `← Previous: ${prev.title}`;
    nav.appendChild(a);
  } else {
    // Empty placeholder to keep flexbox alignment
    const span = document.createElement('span');
    nav.appendChild(span);
  }

  if (next) {
    const a = document.createElement('a');
    a.href = prefix + next.file;
    a.className = 'next-page';
    a.textContent = `Next: ${next.title} →`;
    nav.appendChild(a);
  } else {
    const span = document.createElement('span');
    nav.appendChild(span);
  }

  pageContent.appendChild(nav);
}

// ---------------------------------------------------------------------------
// 15. Visited pages tracking (localStorage)
// ---------------------------------------------------------------------------

function getVisitedPages() {
  try {
    return JSON.parse(localStorage.getItem('visitedPages') || '[]');
  } catch (_) {
    return [];
  }
}

function markCurrentPageVisited() {
  const filename = currentFilename();
  if (!filename || filename === 'index.html') return;
  try {
    const visited = getVisitedPages();
    if (!visited.includes(filename)) {
      visited.push(filename);
      localStorage.setItem('visitedPages', JSON.stringify(visited));
    }
  } catch (_) {
    // localStorage unavailable — fail silently
  }
}

// ---------------------------------------------------------------------------
// 16. Table of Contents builder
// ---------------------------------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // strip punctuation
    .trim()
    .replace(/\s+/g, '-');
}

function buildTableOfContents() {
  const headings = document.querySelectorAll('h2.section-title');
  if (!headings.length) return;

  // 1. Ensure every h2.section-title has an id
  headings.forEach(h => {
    if (!h.id) {
      // Use only text content (ignore any anchor child already inside)
      const rawText = Array.from(h.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join('') || h.textContent;
      h.id = slugify(rawText);
    }

    // 2. Add anchor link to heading (shown on hover via CSS)
    if (!h.querySelector('.anchor-link')) {
      const anchor = document.createElement('a');
      anchor.className = 'anchor-link';
      anchor.href = '#' + h.id;
      anchor.setAttribute('aria-label', 'Section link');
      anchor.textContent = '#';
      h.appendChild(anchor);
    }
  });

  // 3. Build TOC HTML
  const listItems = Array.from(headings).map(h => {
    const labelText = Array.from(h.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent)
      .join('').trim() || h.id;
    return `<li><a href="#${h.id}">${escapeHtml(labelText)}</a></li>`;
  }).join('');

  const tocHtml = `
    <nav class="toc-box" aria-label="On this page">
      <div class="toc-box-title">On This Page</div>
      <ul class="toc-list">${listItems}</ul>
    </nav>`;

  // 4. Inject into .toc-placeholder, or after .page-header
  const placeholder = document.querySelector('.toc-placeholder');
  if (placeholder) {
    placeholder.innerHTML = tocHtml;
  } else {
    const header = document.querySelector('.page-header');
    if (header) {
      header.insertAdjacentHTML('afterend', tocHtml);
    }
  }

  // 5. IntersectionObserver for active TOC link highlighting
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (!tocLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            link.classList.toggle('toc-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '0px 0px -60% 0px', threshold: 0 }
  );

  headings.forEach(h => observer.observe(h));
}

// ---------------------------------------------------------------------------
// 17. Back-to-top button
// ---------------------------------------------------------------------------

function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  let rafPending = false;

  function updateVisibility() {
    rafPending = false;
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateVisibility);
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial check
  updateVisibility();
}

// ---------------------------------------------------------------------------
// 18. Init sequence
// ---------------------------------------------------------------------------

// Apply theme immediately (before DOMContentLoaded) to prevent flash
applyTheme();

document.addEventListener('DOMContentLoaded', () => {
  markCurrentPageVisited();  // Track this page as visited (before sidebar renders)
  applyTheme();              // Re-sync icon after DOM is ready
  renderSidebar();           // Inject sidebar HTML (uses visited pages)
  initMermaid();             // Setup Mermaid with correct theme
  initHighlightJS();         // Syntax highlight code blocks
  initCopyButtons();         // Add copy buttons + language labels to code blocks
  initOSTabs();              // Setup OS tab switching with saved preference
  initMobileMenu();          // Hamburger toggle + overlay + outside-click close
  initSearch();              // Search filter with highlight
  initProgressBar();         // Reading progress bar at top
  initKeyboardShortcuts();   // Ctrl+K, Escape, Alt+T
  injectPageNav();           // Prev/next page links
  highlightActiveNav();      // Mark active page in sidebar + scroll into view
  initDetailsAnimation();    // Summary indicator arrows
  buildTableOfContents();    // In-page TOC + section anchors + active highlighting
  initBackToTop();           // Floating back-to-top button
});
