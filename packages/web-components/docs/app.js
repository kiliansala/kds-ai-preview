/**
 * KDS Documentation - Interactive JavaScript
 * Handles tabs, playground, code copying, and navigation
 */

import { marked } from 'marked';
import introMd from '../../../docs/INTRO.md?raw';
import architectureMd from '../../../docs/ARCHITECTURE.md?raw';
import developmentMd from '../../../docs/DEVELOPMENT.md?raw';
import accessibilityMd from '../../../docs/ACCESSIBILITY.md?raw';
import roadmapMd from '../../../ROADMAP.md?raw';

// Modules are deferred — DOM is already parsed when this runs
function init() {
  // Navigation first — must work even if playground inits fail
  initNavigation();
  initMarkdownPages();
  initTabs();
  initFrameworkTabs();
  initCopyButtons();
  initSyntaxHighlighting();

  // Playground inits are non-critical — isolate failures
  const playgrounds = [
    initPlayground,
    initCheckboxPlayground,
    initTogglePlayground,
    initTooltipPlayground,
    initBadgePlayground,
    initButtonGroupPlayground,
    initInputFieldPlayground,
  ];
  for (const fn of playgrounds) {
    try { fn(); } catch (err) { console.error(`[KDS] ${fn.name} failed:`, err); }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Page IDs used in the sidebar navigation
const MD_PAGE_IDS = new Set(['readme', 'architecture', 'development', 'accessibility', 'roadmap']);

// Marked renderer: strip heading IDs to avoid conflicts with sidebar page IDs
marked.use({
  renderer: {
    heading({ text, depth }) {
      return `<h${depth}>${text}</h${depth}>\n`;
    }
  }
});

/**
 * Render markdown pages from .md source files
 */
function initMarkdownPages() {
  const pages = [
    { id: 'readme-md', content: introMd },
    { id: 'architecture-md', content: architectureMd },
    { id: 'development-md', content: developmentMd },
    { id: 'accessibility-md', content: accessibilityMd },
    { id: 'roadmap-md', content: roadmapMd },
  ];

  pages.forEach(({ id, content }) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = marked.parse(content);
    fixMarkdownLinks(container);
    if (window.Prism) Prism.highlightAllUnder(container);
  });
}

/**
 * Fix links inside rendered markdown:
 * - Internal .md file links → map to sidebar navigation
 * - Unknown relative links → open in new tab or disable
 */
function fixMarkdownLinks(container) {
  // Map from .md filenames to page IDs
  const mdToPage = {
    'README.md': 'readme',
    'docs/ARCHITECTURE.md': 'architecture',
    'docs/DEVELOPMENT.md': 'development',
    'docs/ACCESSIBILITY.md': 'accessibility',
    'ROADMAP.md': 'roadmap',
    'ARCHITECTURE.md': 'architecture',
    'DEVELOPMENT.md': 'development',
    'ACCESSIBILITY.md': 'accessibility',
  };

  container.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');

    // Internal anchor that matches a page ID → trigger nav
    if (href.startsWith('#') && MD_PAGE_IDS.has(href.slice(1))) {
      a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(`.docs-nav-link[href="${href}"]`)?.click();
      });
      return;
    }

    // .md file reference → map to page nav
    const pageId = mdToPage[href] || mdToPage[href.replace(/^.*\//, '')];
    if (pageId) {
      a.setAttribute('href', '#' + pageId);
      a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(`.docs-nav-link[href="#${pageId}"]`)?.click();
      });
      return;
    }

    // External link → open in new tab
    if (href.startsWith('http')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      return;
    }

    // Other relative links → disable (they'd 404 in the browser)
    if (!href.startsWith('#')) {
      a.removeAttribute('href');
      a.style.cursor = 'default';
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';
    }
  });
}

/**
 * Initialize main tabs (Overview, Variants, Tokens, Usage, API)
 */
function initTabs() {
  const tabs = document.querySelectorAll('.docs-tab');
  const tabContents = document.querySelectorAll('.docs-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active content
      tabContents.forEach(content => {
        if (content.dataset.tabContent === targetTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

/**
 * Initialize framework tabs (Web Component, React, Angular, Blazor)
 */
function initFrameworkTabs() {
  const frameworkTabs = document.querySelectorAll('.docs-framework-tab');
  const frameworkContents = document.querySelectorAll('.docs-framework-content');

  frameworkTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetFramework = tab.dataset.framework;

      // Update active tab
      frameworkTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active content
      frameworkContents.forEach(content => {
        if (content.dataset.frameworkContent === targetFramework) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

/**
 * Helper function to create an SVG icon element
 */
function createIconSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('slot', 'icon');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('fill', 'currentColor');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z');

  svg.appendChild(path);
  return svg;
}

/**
 * Update the playground code snippet to reflect current button state
 */
function updatePlaygroundCode(button) {
  const codeElement = document.getElementById('playground-code');
  if (!codeElement) return;

  // Get current attributes
  const size = button.getAttribute('size') || 'md';
  const hierarchy = button.getAttribute('hierarchy') || 'primary';
  const iconPosition = button.getAttribute('icon-position') || 'none';
  const destructive = button.hasAttribute('destructive');
  const disabled = button.hasAttribute('disabled');
  const ariaLabel = button.getAttribute('aria-label');

  // Build attributes string
  let attributes = `size="${size}" hierarchy="${hierarchy}"`;

  if (iconPosition !== 'none') {
    attributes += ` icon-position="${iconPosition}"`;
  }

  if (destructive) {
    attributes += ' destructive';
  }

  if (disabled) {
    attributes += ' disabled';
  }

  // Build content
  let content = '';

  if (iconPosition === 'only') {
    // Icon-only button
    attributes += ` aria-label="${ariaLabel || 'Button'}"`;
    content = '\n  <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">\n    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>\n  </svg>\n';
  } else if (iconPosition === 'leading' || iconPosition === 'trailing') {
    // Button with icon and text
    const iconSVG = '\n  <svg slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">\n    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>\n  </svg>';
    content = iconSVG + '\n  Button Text\n';
  } else {
    // Text-only button
    content = 'Button Text';
  }

  // Generate complete HTML (without escaping - let the browser handle it)
  const html = `<kds-button ${attributes}>${content}</kds-button>`;

  // Update code element
  codeElement.textContent = html;

  // Re-highlight syntax
  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(codeElement);
  }
}

/**
 * Initialize interactive playground
 */
function initPlayground() {
  const button = document.getElementById('playground-button');
  if (!button) return;

  const sizeSelect = document.getElementById('playground-size');
  const hierarchySelect = document.getElementById('playground-hierarchy');
  const iconSelect = document.getElementById('playground-icon');
  const destructiveCheckbox = document.getElementById('playground-destructive');
  const disabledCheckbox = document.getElementById('playground-disabled');

  // Initialize code snippet
  updatePlaygroundCode(button);

  // Size change
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      button.setAttribute('size', e.target.value);
      updatePlaygroundCode(button);
    });
  }

  // Hierarchy change
  if (hierarchySelect) {
    hierarchySelect.addEventListener('change', (e) => {
      button.setAttribute('hierarchy', e.target.value);
      updatePlaygroundCode(button);
    });
  }

  // Icon position change
  if (iconSelect) {
    iconSelect.addEventListener('change', (e) => {
      const iconPosition = e.target.value;

      // Update attribute (use kebab-case)
      button.setAttribute('icon-position', iconPosition);

      // Remove all existing icons
      const existingIcons = button.querySelectorAll('[slot="icon"]');
      existingIcons.forEach(icon => icon.remove());

      // Handle text for icon-only mode
      if (iconPosition === 'only') {
        button.setAttribute('aria-label', 'Button');
        // Remove text nodes but keep the component structure
        Array.from(button.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.remove();
          }
        });
      } else if (iconPosition !== 'none') {
        // Ensure button has text
        const hasText = Array.from(button.childNodes).some(
          node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
        );
        if (!hasText) {
          button.appendChild(document.createTextNode('Button Text'));
        }
      }

      // Add icon if needed
      if (iconPosition !== 'none') {
        const icon = createIconSVG();
        button.appendChild(icon);
      }

      // Update code snippet
      updatePlaygroundCode(button);
    });
  }

  // Destructive change
  if (destructiveCheckbox) {
    destructiveCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        button.setAttribute('destructive', '');
      } else {
        button.removeAttribute('destructive');
      }
      updatePlaygroundCode(button);
    });
  }

  // Disabled change
  if (disabledCheckbox) {
    disabledCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        button.setAttribute('disabled', '');
      } else {
        button.removeAttribute('disabled');
      }
      updatePlaygroundCode(button);
    });
  }

  // Add click event to playground button
  button.addEventListener('kds-button-click', () => {
    console.log('Playground button clicked!');
  });
}

/**
 * Update the checkbox playground code snippet to reflect current state
 */
function updateCheckboxPlaygroundCode(checkbox) {
  const codeElement = document.getElementById('checkbox-playground-code');
  if (!codeElement) return;

  // Get current attributes
  const size = checkbox.getAttribute('size') || 'md';
  const checked = checkbox.hasAttribute('checked');
  const indeterminate = checkbox.hasAttribute('indeterminate');
  const disabled = checkbox.hasAttribute('disabled');
  const error = checkbox.hasAttribute('error');

  // Build attributes string
  let attributes = `size="${size}"`;

  if (checked) {
    attributes += ' checked';
  }

  if (indeterminate) {
    attributes += ' indeterminate';
  }

  if (disabled) {
    attributes += ' disabled';
  }

  if (error) {
    attributes += ' error';
  }

  // Get label text
  const labelText = Array.from(checkbox.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .join(' ') || 'Checkbox Label';

  // Generate complete HTML
  const html = `<kds-checkbox ${attributes}>${labelText}</kds-checkbox>`;

  // Update code element
  codeElement.textContent = html;

  // Re-highlight syntax
  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(codeElement);
  }
}

/**
 * Initialize checkbox playground
 */
function initCheckboxPlayground() {
  const checkbox = document.getElementById('playground-checkbox');
  if (!checkbox) return;

  const sizeSelect = document.getElementById('playground-checkbox-size');
  const checkedCheckbox = document.getElementById('playground-checkbox-checked');
  const indeterminateCheckbox = document.getElementById('playground-checkbox-indeterminate');
  const disabledCheckbox = document.getElementById('playground-checkbox-disabled');
  const errorCheckbox = document.getElementById('playground-checkbox-error');

  // Initialize code snippet
  updateCheckboxPlaygroundCode(checkbox);

  // Size change
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      checkbox.setAttribute('size', e.target.value);
      updateCheckboxPlaygroundCode(checkbox);
    });
  }

  // Checked state change
  if (checkedCheckbox) {
    checkedCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        checkbox.setAttribute('checked', '');
      } else {
        checkbox.removeAttribute('checked');
      }
      // If checked, remove indeterminate
      if (e.target.checked && indeterminateCheckbox) {
        indeterminateCheckbox.checked = false;
        checkbox.removeAttribute('indeterminate');
      }
      updateCheckboxPlaygroundCode(checkbox);
    });
  }

  // Indeterminate state change
  if (indeterminateCheckbox) {
    indeterminateCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        checkbox.setAttribute('indeterminate', '');
        // If indeterminate, also check it
        checkbox.setAttribute('checked', '');
        if (checkedCheckbox) {
          checkedCheckbox.checked = true;
        }
      } else {
        checkbox.removeAttribute('indeterminate');
      }
      updateCheckboxPlaygroundCode(checkbox);
    });
  }

  // Disabled state change
  if (disabledCheckbox) {
    disabledCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        checkbox.setAttribute('disabled', '');
      } else {
        checkbox.removeAttribute('disabled');
      }
      updateCheckboxPlaygroundCode(checkbox);
    });
  }

  // Error state change
  if (errorCheckbox) {
    errorCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        checkbox.setAttribute('error', '');
      } else {
        checkbox.removeAttribute('error');
      }
      updateCheckboxPlaygroundCode(checkbox);
    });
  }

  // Add change event to playground checkbox
  checkbox.addEventListener('kds-checkbox-change', (e) => {
    console.log('Playground checkbox changed!', e.detail.checked);
  });
}

/**
 * Update the toggle playground code snippet
 */
function updateTogglePlaygroundCode(toggle) {
  const codeElement = document.getElementById('toggle-playground-code');
  if (!codeElement) return;

  const size = toggle.getAttribute('size') || 'sm';
  const pressed = toggle.hasAttribute('pressed');
  const disabled = toggle.hasAttribute('disabled');

  let attributes = `size="${size}"`;

  if (pressed) {
    attributes += ' pressed';
  }

  if (disabled) {
    attributes += ' disabled';
  }

  const html = `<kds-toggle ${attributes}>Toggle Label</kds-toggle>`;
  codeElement.textContent = html;

  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(codeElement);
  }
}

/**
 * Initialize toggle playground
 */
function initTogglePlayground() {
  const toggle = document.getElementById('playground-toggle');
  if (!toggle) return;

  const sizeSelect = document.getElementById('playground-toggle-size');
  const pressedCheckbox = document.getElementById('playground-toggle-pressed');
  const disabledCheckbox = document.getElementById('playground-toggle-disabled');

  updateTogglePlaygroundCode(toggle);

  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      toggle.setAttribute('size', e.target.value);
      updateTogglePlaygroundCode(toggle);
    });
  }

  if (pressedCheckbox) {
    pressedCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        toggle.setAttribute('pressed', '');
      } else {
        toggle.removeAttribute('pressed');
      }
      updateTogglePlaygroundCode(toggle);
    });
  }

  if (disabledCheckbox) {
    disabledCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        toggle.setAttribute('disabled', '');
      } else {
        toggle.removeAttribute('disabled');
      }
      updateTogglePlaygroundCode(toggle);
    });
  }

  toggle.addEventListener('kds-toggle-change', (e) => {
    console.log('Playground toggle changed!', e.detail.pressed);
    // Sync the pressed checkbox with the actual toggle state
    if (pressedCheckbox) {
      pressedCheckbox.checked = e.detail.pressed;
    }
    updateTogglePlaygroundCode(toggle);
  });
}

/**
 * Initialize copy-to-clipboard functionality
 */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.docs-copy-button');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const targetId = button.dataset.copy;
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      const textToCopy = targetElement.textContent;

      try {
        await navigator.clipboard.writeText(textToCopy);

        // Visual feedback
        const originalHTML = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
          </svg>
          Copied!
        `;

        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = originalHTML;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    });
  });
}

/**
 * Initialize sidebar navigation using event delegation
 */
function initNavigation() {
  const sidebar = document.querySelector('.docs-sidebar');
  if (!sidebar) return;

  sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('.docs-nav-link:not(.docs-nav-link-disabled)');
    if (!link) return;
    e.preventDefault();

    // Get target from data-component (components) or href (getting started pages)
    const targetId = link.dataset.component
      ? `component-${link.dataset.component}`
      : link.getAttribute('href')?.substring(1);

    const targetElement = targetId && document.getElementById(targetId);
    if (!targetElement) return;

    // Update active nav link
    sidebar.querySelectorAll('.docs-nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Hide all pages and show target
    document.querySelectorAll('.docs-page, .docs-component').forEach(page => {
      page.style.display = 'none';
    });
    targetElement.style.display = 'block';

    // Scroll to top
    const mainEl = document.querySelector('.docs-main');
    if (mainEl) mainEl.scrollTop = 0;
    window.scrollTo({ top: 0 });

    // Re-highlight code blocks on the new page
    setTimeout(() => {
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
      }
    }, 50);
  });
}

/**
 * Initialize Prism syntax highlighting
 */
function initSyntaxHighlighting() {
  // Prism is loaded from CDN, just trigger highlighting
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }

  // Re-highlight when tabs change
  const tabs = document.querySelectorAll('.docs-tab, .docs-framework-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
      }, 50);
    });
  });
}

/**
 * Update the tooltip playground code snippet
 */
function updateTooltipPlaygroundCode(tooltip) {
  const codeElement = document.getElementById('tooltip-playground-code');
  if (!codeElement) return;

  const theme = tooltip.getAttribute('theme') || 'light';
  const arrow = tooltip.getAttribute('arrow') || 'none';
  const text = tooltip.getAttribute('text') || 'This is a tooltip';
  const supportingText = tooltip.getAttribute('supporting-text');

  let attributes = `text="${text}"`;

  if (theme !== 'light') {
    attributes += `\n  theme="${theme}"`;
  }

  if (arrow !== 'none') {
    attributes += `\n  arrow="${arrow}"`;
  }

  if (supportingText) {
    attributes += `\n  supporting-text="${supportingText}"`;
  }

  const html = `<kds-tooltip ${attributes}></kds-tooltip>`;
  codeElement.textContent = html;

  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(codeElement);
  }
}

/**
 * Initialize tooltip playground
 */
function initTooltipPlayground() {
  const tooltip = document.getElementById('playground-tooltip');
  if (!tooltip) return;

  const themeSelect = document.getElementById('playground-tooltip-theme');
  const arrowSelect = document.getElementById('playground-tooltip-arrow');
  const supportingCheckbox = document.getElementById('playground-tooltip-supporting');

  updateTooltipPlaygroundCode(tooltip);

  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      tooltip.setAttribute('theme', e.target.value);
      updateTooltipPlaygroundCode(tooltip);
    });
  }

  if (arrowSelect) {
    arrowSelect.addEventListener('change', (e) => {
      tooltip.setAttribute('arrow', e.target.value);
      updateTooltipPlaygroundCode(tooltip);
    });
  }

  if (supportingCheckbox) {
    supportingCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        tooltip.setAttribute('supporting-text', 'Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand the meaning, function or alt-text of an element.');
      } else {
        tooltip.removeAttribute('supporting-text');
      }
      updateTooltipPlaygroundCode(tooltip);
    });
  }
}

/**
 * Update the badge playground code snippet
 */
function updateBadgePlaygroundCode(badge) {
  const codeElement = document.getElementById('badge-playground-code');
  if (!codeElement) return;

  const size = badge.getAttribute('size') || 'sm';
  const color = badge.getAttribute('color') || 'primary';
  const icon = badge.getAttribute('icon') || 'false';

  let attributes = `size="${size}" color="${color}"`;

  if (icon !== 'false') {
    attributes += ` icon="${icon}"`;
  }

  const html = `<kds-badge ${attributes}>Badge Text</kds-badge>`;
  codeElement.textContent = html;

  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(codeElement);
  }
}

/**
 * Initialize badge playground
 */
function initBadgePlayground() {
  const badge = document.getElementById('playground-badge');
  if (!badge) return;

  const sizeSelect = document.getElementById('playground-badge-size');
  const colorSelect = document.getElementById('playground-badge-color');
  const iconSelect = document.getElementById('playground-badge-icon');

  updateBadgePlaygroundCode(badge);

  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      badge.setAttribute('size', e.target.value);
      updateBadgePlaygroundCode(badge);
    });
  }

  if (colorSelect) {
    colorSelect.addEventListener('change', (e) => {
      badge.setAttribute('color', e.target.value);
      updateBadgePlaygroundCode(badge);
    });
  }

  if (iconSelect) {
    iconSelect.addEventListener('change', (e) => {
      badge.setAttribute('icon', e.target.value);
      updateBadgePlaygroundCode(badge);
    });
  }

  badge.addEventListener('kds-badge-dismiss', () => {
    console.log('Playground badge dismissed!');
  });
}

/**
 * Update the button group playground code snippet
 */
function updateButtonGroupPlaygroundCode() {
  const codeElement = document.getElementById('button-group-playground-code');
  if (!codeElement) return;

  const item1 = document.getElementById('playground-bg-item-1');
  const item2 = document.getElementById('playground-bg-item-2');
  const item3 = document.getElementById('playground-bg-item-3');
  if (!item1) return;

  const icon = item1.getAttribute('icon') || 'none';
  const disabled3 = item3 && item3.hasAttribute('disabled');

  let itemContent;
  if (icon === 'only') {
    itemContent = `\n  <svg slot="icon" ...></svg>\n`;
  } else if (icon === 'leading') {
    itemContent = `\n    <svg slot="icon" ...></svg>\n    Option\n  `;
  } else {
    itemContent = 'Option';
  }

  const ariaAttr = icon === 'only' ? ' aria-label="Action"' : '';
  const iconAttr = icon !== 'none' ? ` icon="${icon}"` : '';
  const disabledAttr = disabled3 ? ' disabled' : '';

  let html = `<kds-button-group aria-label="Options">`;
  html += `\n  <kds-button-group-item${iconAttr} selected${ariaAttr}>${itemContent}</kds-button-group-item>`;
  html += `\n  <kds-button-group-item${iconAttr}${ariaAttr}>${itemContent}</kds-button-group-item>`;
  html += `\n  <kds-button-group-item${iconAttr}${disabledAttr}${ariaAttr}>${itemContent}</kds-button-group-item>`;
  html += `\n</kds-button-group>`;

  codeElement.textContent = html;

  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(codeElement);
  }
}

/**
 * Initialize button group playground
 */
function initButtonGroupPlayground() {
  const group = document.getElementById('playground-button-group');
  if (!group) return;

  const iconSelect = document.getElementById('playground-bg-icon');
  const disabledCheckbox = document.getElementById('playground-bg-disabled');
  const items = [
    document.getElementById('playground-bg-item-1'),
    document.getElementById('playground-bg-item-2'),
    document.getElementById('playground-bg-item-3')
  ];

  updateButtonGroupPlaygroundCode();

  if (iconSelect) {
    iconSelect.addEventListener('change', (e) => {
      const iconValue = e.target.value;
      items.forEach(item => {
        if (item) {
          item.setAttribute('icon', iconValue);
          if (iconValue === 'only') {
            // Remove text content and add icon
            item.textContent = '';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('slot', 'icon');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.setAttribute('viewBox', '0 0 20 20');
            svg.setAttribute('fill', 'none');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M10 4.167v11.666M4.167 10h11.666');
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', '1.67');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            svg.appendChild(path);
            item.appendChild(svg);
            item.setAttribute('aria-label', 'Action');
          } else {
            // Remove icons, restore text
            const icons = item.querySelectorAll('[slot="icon"]');
            icons.forEach(ic => ic.remove());
            item.removeAttribute('aria-label');

            if (iconValue === 'leading') {
              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              svg.setAttribute('slot', 'icon');
              svg.setAttribute('width', '20');
              svg.setAttribute('height', '20');
              svg.setAttribute('viewBox', '0 0 20 20');
              svg.setAttribute('fill', 'none');
              const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              circle.setAttribute('cx', '10');
              circle.setAttribute('cy', '10');
              circle.setAttribute('r', '7.5');
              circle.setAttribute('stroke', 'currentColor');
              circle.setAttribute('stroke-width', '1.5');
              svg.appendChild(circle);
              item.prepend(svg);
            }

            // Ensure text content
            const hasText = Array.from(item.childNodes).some(
              node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );
            if (!hasText && iconValue !== 'only') {
              item.appendChild(document.createTextNode('Option ' + (items.indexOf(item) + 1)));
            }
          }
        }
      });
      updateButtonGroupPlaygroundCode();
    });
  }

  if (disabledCheckbox) {
    disabledCheckbox.addEventListener('change', (e) => {
      const item3 = items[2];
      if (item3) {
        if (e.target.checked) {
          item3.setAttribute('disabled', '');
        } else {
          item3.removeAttribute('disabled');
        }
      }
      updateButtonGroupPlaygroundCode();
    });
  }

  // Handle item clicks for selection
  group.addEventListener('kds-button-group-item-click', (e) => {
    const clickedItem = e.target;
    items.forEach(item => {
      if (item) {
        if (item === clickedItem) {
          item.setAttribute('selected', '');
        } else {
          item.removeAttribute('selected');
        }
      }
    });
    console.log('Button group item clicked:', e.detail);
    updateButtonGroupPlaygroundCode();
  });
}

/**
 * Update the input field playground code snippet
 */
function updateInputFieldPlaygroundCode() {
  const codeEl = document.getElementById('input-playground-code');
  if (!codeEl) return;

  const input = document.getElementById('playground-input-field');
  if (!input) return;

  const type      = input.getAttribute('type') || 'default';
  const label     = input.getAttribute('label') || '';
  const hint      = input.getAttribute('hint') || '';
  const leadingTx = input.getAttribute('leading-text') || '';
  const hasLeadingIcon = input.hasAttribute('leading-icon');
  const hasHelpIcon    = input.hasAttribute('help-icon');
  const isDestructive  = input.hasAttribute('destructive');
  const isDisabled     = input.hasAttribute('disabled');

  let attrs = `\n  label="${label}"`;
  if (type !== 'default') attrs += `\n  type="${type}"`;
  if (type === 'leading-text' && leadingTx) attrs += `\n  leading-text="${leadingTx}"`;
  attrs += `\n  placeholder="olivia@untitledui.com"`;
  if (hint) attrs += `\n  hint="${hint}"`;
  if (hasLeadingIcon) attrs += `\n  leading-icon`;
  if (hasHelpIcon)    attrs += `\n  help-icon`;
  if (isDestructive)  attrs += `\n  destructive`;
  if (isDisabled)     attrs += `\n  disabled`;

  codeEl.textContent = `<kds-input-field${attrs}\n></kds-input-field>`;

  if (typeof Prism !== 'undefined') {
    Prism.highlightElement(codeEl);
  }
}

/**
 * Initialize input field playground
 */
function initInputFieldPlayground() {
  const input = document.getElementById('playground-input-field');
  if (!input) return;

  const typeSelect      = document.getElementById('playground-input-type');
  const labelInput      = document.getElementById('playground-input-label');
  const hintInput       = document.getElementById('playground-input-hint');
  const leadingTxInput  = document.getElementById('playground-input-leading-text');
  const leadingIconCb   = document.getElementById('playground-input-leading-icon');
  const helpIconCb      = document.getElementById('playground-input-help-icon');
  const destructiveCb   = document.getElementById('playground-input-destructive');
  const disabledCb      = document.getElementById('playground-input-disabled');

  // Sync initial label value (component HTML already has label="Email" but ensure it matches control)
  if (labelInput && labelInput.value) input.setAttribute('label', labelInput.value);

  updateInputFieldPlaygroundCode();

  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      const newType = e.target.value;
      input.setAttribute('type', newType);

      // Remove any previously injected demo slot content
      input.querySelectorAll('[data-playground-slot]').forEach(el => el.remove());

      if (newType === 'leading-text' && leadingTxInput && leadingTxInput.value) {
        input.setAttribute('leading-text', leadingTxInput.value);
      }

      if (newType === 'leading-dropdown') {
        const btn = document.createElement('button');
        btn.setAttribute('slot', 'leading-dropdown');
        btn.setAttribute('data-playground-slot', '');
        btn.setAttribute('type', 'button');
        btn.style.cssText = 'display:flex;align-items:center;gap:6px;padding:10px 12px;border:none;background:none;cursor:pointer;font-size:14px;color:#414651;white-space:nowrap;';
        btn.innerHTML = '🇺🇸 +1 <svg viewBox="0 0 16 16" fill="none" style="width:12px;height:12px;flex-shrink:0"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        input.appendChild(btn);
      }

      if (newType === 'trailing-dropdown') {
        const btn = document.createElement('button');
        btn.setAttribute('slot', 'trailing-dropdown');
        btn.setAttribute('data-playground-slot', '');
        btn.setAttribute('type', 'button');
        btn.style.cssText = 'display:flex;align-items:center;gap:6px;padding:10px 12px;border:none;background:none;cursor:pointer;font-size:14px;color:#414651;white-space:nowrap;';
        btn.innerHTML = 'USD <svg viewBox="0 0 16 16" fill="none" style="width:12px;height:12px;flex-shrink:0"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        input.appendChild(btn);
      }

      updateInputFieldPlaygroundCode();
    });
  }

  if (labelInput) {
    labelInput.addEventListener('input', (e) => {
      input.setAttribute('label', e.target.value);
      updateInputFieldPlaygroundCode();
    });
  }

  if (hintInput) {
    hintInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val) input.setAttribute('hint', val);
      else input.removeAttribute('hint');
      updateInputFieldPlaygroundCode();
    });
  }

  if (leadingTxInput) {
    leadingTxInput.addEventListener('input', (e) => {
      input.setAttribute('leading-text', e.target.value);
      updateInputFieldPlaygroundCode();
    });
  }

  if (leadingIconCb) {
    leadingIconCb.addEventListener('change', (e) => {
      if (e.target.checked) input.setAttribute('leading-icon', '');
      else input.removeAttribute('leading-icon');
      updateInputFieldPlaygroundCode();
    });
  }

  if (helpIconCb) {
    helpIconCb.addEventListener('change', (e) => {
      if (e.target.checked) input.setAttribute('help-icon', '');
      else input.removeAttribute('help-icon');
      updateInputFieldPlaygroundCode();
    });
  }

  if (destructiveCb) {
    destructiveCb.addEventListener('change', (e) => {
      if (e.target.checked) input.setAttribute('destructive', '');
      else input.removeAttribute('destructive');
      updateInputFieldPlaygroundCode();
    });
  }

  if (disabledCb) {
    disabledCb.addEventListener('change', (e) => {
      if (e.target.checked) input.setAttribute('disabled', '');
      else input.removeAttribute('disabled');
      updateInputFieldPlaygroundCode();
    });
  }

  input.addEventListener('kds-help-click', () => {
    console.log('Playground: help icon clicked');
  });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Add smooth scroll behavior
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Console welcome message
 */
console.log('%cKDS Component Library', 'font-size: 20px; font-weight: bold; color: #7F56D9;');
console.log('%cInteractive Documentation v0.1.0', 'font-size: 14px; color: #667085;');
console.log('');
console.log('Built with:');
console.log('• LIT 3.x for web components');
console.log('• Figma as Single Source of Truth (SSOT)');
console.log('• MCP for automated extraction');
console.log('• Design tokens (DTCG spec)');
console.log('');
console.log('Learn more: https://github.com/kapsch/kds-ai-preview');
