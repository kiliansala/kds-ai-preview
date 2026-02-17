/**
 * KDS Documentation - Interactive JavaScript
 * Handles tabs, playground, code copying, and navigation
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFrameworkTabs();
  initPlayground();
  initCheckboxPlayground();
  initTogglePlayground();
  initTooltipPlayground();
  initCopyButtons();
  initNavigation();
  initSyntaxHighlighting();
});

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
 * Initialize sidebar navigation
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.docs-nav-link:not(.docs-nav-link-disabled)');
  const allPages = document.querySelectorAll('.docs-page, .docs-component');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Get target from href (for getting started pages) or data-component (for components)
      let targetId;
      if (link.dataset.component) {
        targetId = `component-${link.dataset.component}`;
      } else {
        targetId = link.getAttribute('href').substring(1); // Remove # from href
      }

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Hide all pages and show target
      allPages.forEach(page => {
        page.style.display = 'none';
      });
      targetElement.style.display = 'block';

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Re-highlight code blocks on the new page
      setTimeout(() => {
        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
      }, 50);
    });
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
