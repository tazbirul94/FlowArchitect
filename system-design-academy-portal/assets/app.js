/**
 * app.js — System Design Academy Portal
 * Single shared script for index.html and all concepts/*.html
 */

// ---------------------------------------------------------------------------
// 1. NAV_ITEMS — complete navigation structure
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  {
    group: "Foundation",
    items: [
      { id: "index", title: "Academy Home", file: "index.html", root: true },
    ]
  },
  {
    group: "Networking",
    items: [
      { id: "load-balancer", title: "Load Balancer", file: "load-balancer.html" },
      { id: "api-gateway", title: "API Gateway", file: "api-gateway.html" },
      { id: "cdn", title: "CDN", file: "cdn.html" },
    ]
  },
  {
    group: "APIs",
    items: [
      { id: "rest", title: "REST", file: "rest.html" },
      { id: "graphql", title: "GraphQL", file: "graphql.html" },
      { id: "grpc", title: "gRPC", file: "grpc.html" },
    ]
  },
  {
    group: "Data",
    items: [
      { id: "caching", title: "Caching", file: "caching.html" },
      { id: "databases", title: "Databases", file: "databases.html" },
      { id: "sql-vs-nosql", title: "SQL vs NoSQL", file: "sql-vs-nosql.html" },
      { id: "indexing", title: "Indexing", file: "indexing.html" },
      { id: "sharding", title: "Sharding", file: "sharding.html" },
      { id: "replication", title: "Replication", file: "replication.html" },
    ]
  },
  {
    group: "Security",
    items: [
      { id: "authentication", title: "Authentication", file: "authentication.html" },
      { id: "authorization", title: "Authorization", file: "authorization.html" },
      { id: "oauth", title: "OAuth", file: "oauth.html" },
      { id: "jwt", title: "JWT", file: "jwt.html" },
    ]
  },
  {
    group: "Messaging",
    items: [
      { id: "message-queues", title: "Message Queues", file: "message-queues.html" },
      { id: "pub-sub", title: "Pub/Sub", file: "pub-sub.html" },
      { id: "event-driven", title: "Event-Driven Architecture", file: "event-driven-architecture.html" },
      { id: "kafka", title: "Kafka Streaming", file: "kafka-streaming.html" },
    ]
  },
  {
    group: "Reliability",
    items: [
      { id: "circuit-breaker", title: "Circuit Breaker", file: "circuit-breaker.html" },
      { id: "rate-limiting", title: "Rate Limiting", file: "rate-limiting.html" },
      { id: "retry", title: "Retry & Idempotency", file: "retry-idempotency.html" },
      { id: "cap-theorem", title: "CAP Theorem", file: "cap-theorem.html" },
    ]
  },
  {
    group: "Architecture",
    items: [
      { id: "microservices", title: "Microservices", file: "microservices.html" },
      { id: "monolith", title: "Monolith", file: "monolith.html" },
      { id: "cqrs", title: "CQRS", file: "cqrs.html" },
      { id: "saga", title: "Saga Pattern", file: "saga.html" },
    ]
  }
];

// ---------------------------------------------------------------------------
// Helper: resolve path prefix depending on where this page lives
// index.html  → concepts are at  concepts/<file>
// concepts/*.html → concept files are at  ./<file>  (same directory)
// ---------------------------------------------------------------------------

function isInConcepts() {
  const path = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
  return path.includes('/concepts/');
}

function getPathPrefix() {
  return isInConcepts() ? '' : 'concepts/';
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

  const activeName = currentFilename();
  const inConcepts = isInConcepts();

  // Build logo (links back to index.html)
  const logo = document.createElement('a');
  logo.className = 'sidebar-logo';
  logo.href = inConcepts ? '../index.html' : 'index.html';
  logo.style.cssText = 'display:block;text-decoration:none;cursor:pointer;';
  logo.innerHTML = `
    <span class="sidebar-logo-title">System Design Academy</span>
    <span class="sidebar-logo-subtitle">Concept by Concept</span>
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
        const state = JSON.parse(localStorage.getItem('sdaNavCollapsed') || '{}');
        state[group.group] = groupEl.classList.contains('collapsed');
        localStorage.setItem('sdaNavCollapsed', JSON.stringify(state));
      } catch(e) {}
    });
    groupEl.appendChild(titleEl);

    const itemsEl = document.createElement('div');
    itemsEl.className = 'nav-group-items';

    const visited = getVisitedPages();

    group.items.forEach(item => {
      const a = document.createElement('a');
      a.className = 'nav-item';

      if (item.root) {
        // Root item (index.html) — always link to portal root
        a.href = inConcepts ? '../index.html' : 'index.html';
      } else {
        a.href = inConcepts ? item.file : 'concepts/' + item.file;
      }
      a.dataset.file = item.file;

      const idSpan = document.createElement('span');
      idSpan.className = 'nav-item-number';
      // Show a short label or icon for root item, concept id otherwise
      idSpan.textContent = item.root ? '⌂' : '';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'nav-item-title';
      titleSpan.textContent = item.title;

      a.appendChild(idSpan);
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
      const state = JSON.parse(localStorage.getItem('sdaNavCollapsed') || '{}');
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
  const btns = document.querySelectorAll('.theme-toggle, #theme-toggle');
  const isDark = document.documentElement.classList.contains('dark');
  btns.forEach(btn => {
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  syncThemeIcon();
  reinitMermaid();
}

// ---------------------------------------------------------------------------
// 4. Search / filter sidebar
// ---------------------------------------------------------------------------

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

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
// 7. Level tabs
// ---------------------------------------------------------------------------

function initLevelTabs() {
  const preferred = localStorage.getItem('preferredLevel') || null;

  function activateLevelTab(container, level) {
    container.querySelectorAll('.level-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.level === level);
    });
    container.querySelectorAll('.level-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.level === level);
    });
  }

  document.querySelectorAll('.level-tabs').forEach(container => {
    const buttons = container.querySelectorAll('.level-tab-btn[data-level]');
    const panels  = container.querySelectorAll('.level-tab-panel[data-level]');
    if (!buttons.length || !panels.length) return;

    // Apply saved preference if a matching panel exists
    if (preferred) {
      const hasPanel = container.querySelector(`.level-tab-panel[data-level="${preferred}"]`);
      if (hasPanel) {
        activateLevelTab(container, preferred);
      } else {
        // Fall back to first panel
        activateLevelTab(container, buttons[0].dataset.level);
      }
    } else {
      // Default: activate first panel
      activateLevelTab(container, buttons[0].dataset.level);
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        activateLevelTab(container, level);
        localStorage.setItem('preferredLevel', level);
      });
    });
  });
}

// ---------------------------------------------------------------------------
// 8. Mermaid initialization
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
  document.querySelectorAll('.mermaid[data-processed]').forEach(el => {
    if (el.dataset.mermaidSrc) {
      el.removeAttribute('data-processed');
      el.innerHTML = el.dataset.mermaidSrc;
    }
  });
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
// 9. Highlight.js initialization
// ---------------------------------------------------------------------------

function initHighlightJS() {
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }
}

// ---------------------------------------------------------------------------
// 10. Mobile sidebar toggle
// ---------------------------------------------------------------------------

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  if (!hamburger || !sidebar) return;

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

  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== hamburger &&
        e.target !== overlay) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

// ---------------------------------------------------------------------------
// 11. Details / summary smooth animation + indicator
// ---------------------------------------------------------------------------

function initDetailsAnimation() {
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    if (!summary.dataset.indicator) {
      summary.dataset.indicator = details.open ? '▼' : '▶';
    }

    summary.addEventListener('click', () => {
      requestAnimationFrame(() => {
        summary.dataset.indicator = details.open ? '▼' : '▶';
      });
    });
  });
}

// ---------------------------------------------------------------------------
// 12. Active nav highlighting
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
// 13. Reading progress bar
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

  updateBar();
}

// ---------------------------------------------------------------------------
// 14. Keyboard shortcuts
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

    // Alt+T — toggle theme
    if (e.altKey && e.key === 't' && !inInput) {
      e.preventDefault();
      toggleTheme();
      return;
    }
  });

  // Wire up all theme toggle buttons
  document.querySelectorAll('.theme-toggle, #theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

// ---------------------------------------------------------------------------
// 15. Prev / next page navigation
// ---------------------------------------------------------------------------

function injectPageNav() {
  const body = document.body;
  const pageId = body.dataset.pageId;
  if (!pageId) return;

  const pageContent = document.querySelector('.page-content');
  if (!pageContent) return;

  // Flatten all non-root items across groups
  const allItems = NAV_ITEMS.reduce((acc, group) => {
    return acc.concat(group.items.filter(i => !i.root));
  }, []);

  const currentIndex = allItems.findIndex(item => item.id === pageId);
  if (currentIndex === -1) return;

  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const next = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  if (pageContent.querySelector('.page-nav')) return;

  const inConcepts = isInConcepts();

  function conceptHref(item) {
    return inConcepts ? item.file : 'concepts/' + item.file;
  }

  const nav = document.createElement('div');
  nav.className = 'page-nav';

  if (prev) {
    const a = document.createElement('a');
    a.href = conceptHref(prev);
    a.className = 'prev-page';
    a.textContent = `← Previous: ${prev.title}`;
    nav.appendChild(a);
  } else {
    nav.appendChild(document.createElement('span'));
  }

  if (next) {
    const a = document.createElement('a');
    a.href = conceptHref(next);
    a.className = 'next-page';
    a.textContent = `Next: ${next.title} →`;
    nav.appendChild(a);
  } else {
    nav.appendChild(document.createElement('span'));
  }

  pageContent.appendChild(nav);
}

// ---------------------------------------------------------------------------
// 16. Visited pages tracking (localStorage)
// ---------------------------------------------------------------------------

function getVisitedPages() {
  try {
    return JSON.parse(localStorage.getItem('sdaVisitedPages') || '[]');
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
      localStorage.setItem('sdaVisitedPages', JSON.stringify(visited));
    }
  } catch (_) {
    // localStorage unavailable — fail silently
  }
}

// ---------------------------------------------------------------------------
// 17. Table of Contents builder
// ---------------------------------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function buildTableOfContents() {
  const headings = document.querySelectorAll('h2.section-title');
  if (!headings.length) return;

  headings.forEach(h => {
    if (!h.id) {
      const rawText = Array.from(h.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join('') || h.textContent;
      h.id = slugify(rawText);
    }

    if (!h.querySelector('.anchor-link')) {
      const anchor = document.createElement('a');
      anchor.className = 'anchor-link';
      anchor.href = '#' + h.id;
      anchor.setAttribute('aria-label', 'Section link');
      anchor.textContent = '#';
      h.appendChild(anchor);
    }
  });

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

  const placeholder = document.querySelector('.toc-placeholder');
  if (placeholder) {
    placeholder.innerHTML = tocHtml;
  } else {
    const header = document.querySelector('.page-header');
    if (header) {
      header.insertAdjacentHTML('afterend', tocHtml);
    }
  }

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
// 18. Back-to-top button
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

  updateVisibility();
}

// ---------------------------------------------------------------------------
// 19. Init sequence
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
  initLevelTabs();           // Setup level tab switching with saved preference
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
