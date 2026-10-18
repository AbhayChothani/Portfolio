/**
 * Abhay Chothani - QA Engineer Portfolio
 * Interactive Script: Theme Switcher, Project Filter, Scroll Spy,
 * Modal Controller, Clipboard Utilities, and Form Handler.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initHeaderScroll();
  initBackToTop();
  initProjectFilters();
  initScrollAnimations();
  initDynamicYear();
  initModalListeners();
  initContactForm();
  initCustomCursor();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or detect system preference
  const savedTheme = localStorage.getItem('abhay_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  htmlRoot.setAttribute('data-theme', initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('abhay_portfolio_theme', newTheme);
      
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // Listen to OS theme changes if user has not explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('abhay_portfolio_theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      htmlRoot.setAttribute('data-theme', newTheme);
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const header = document.getElementById('header');
          const headerOffset = header ? header.offsetHeight : 70;
          const targetTop = targetEl.getBoundingClientRect().top + window.scrollY;
          const scrollToPosition = targetId === 'hero' ? 0 : targetTop - headerOffset - 12;

          window.scrollTo({
            top: Math.max(0, scrollToPosition),
            behavior: 'smooth'
          });

          // Set active link cleanly on click
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
      closeMenu();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Header Sticky & Scroll Shadow
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Scroll Spy (Active Navigation Item Highlighting)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  // Ordered list of section IDs corresponding to the navigation
  const sectionIds = ['hero', 'experience', 'projects', 'skills', 'education', 'contact'];

  function onScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Check which section occupies the upper-middle part of the mobile screen
    const fromTop = scrollY + (windowHeight / 3);

    // If user has scrolled to the bottom of the page, activate Contact
    if (scrollY + windowHeight >= docHeight - 50) {
      setActiveLink('contact');
      return;
    }

    // If near the very top of the page, activate Hero
    if (scrollY < 120) {
      setActiveLink('hero');
      return;
    }

    // Dynamically calculate bounding rectangle top for each section
    const sectionData = sectionIds.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + scrollY;
      return { id, top };
    }).filter(Boolean);

    // Determine the active section cleanly without overlapping bias
    for (let i = 0; i < sectionData.length; i++) {
      const current = sectionData[i];
      const next = sectionData[i + 1];
      const nextTop = next ? next.top : Infinity;

      if (fromTop >= current.top && fromTop < nextTop) {
        setActiveLink(current.id);
        break;
      }
    }
  }

  function setActiveLink(activeId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   5. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   6. Project Filtering System
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Scroll Reveal Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
  if (!elementsToAnimate.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elementsToAnimate.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. Clipboard Copy Utility
   -------------------------------------------------------------------------- */
window.copyToClipboard = function(text, event, element) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied "${text}" to clipboard!`, 'success');
      flashButton(element);
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
};

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied "${text}" to clipboard!`, 'success');
  } catch (err) {
    showToast('Failed to copy. Please copy manually.', 'error');
  }
  document.body.removeChild(textarea);
}

function flashButton(button) {
  if (!button) return;
  const originalColor = button.style.color;
  button.style.color = 'var(--qa-pass)';
  setTimeout(() => {
    button.style.color = originalColor;
  }, 1200);
}

/* --------------------------------------------------------------------------
   9. Toast Notifications
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Clear any existing toasts to eliminate duplicate toast blocks
  container.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  } else {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#06b6d4" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/* --------------------------------------------------------------------------
   10. Contact Form Submission & Validation Handler (Web3Forms API)
   -------------------------------------------------------------------------- */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const DEFAULT_SUCCESS_TEXT = "Thank you! Your message has been sent successfully.";

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Single clean event listener on the form submit
  form.removeEventListener('submit', handleContactSubmit);
  form.addEventListener('submit', handleContactSubmit);

  const fields = [
    { input: document.getElementById('formName'), errorEl: document.getElementById('nameError'), validator: validateName },
    { input: document.getElementById('formEmail'), errorEl: document.getElementById('emailError'), validator: validateEmail },
    { input: document.getElementById('formMessage'), errorEl: document.getElementById('messageError'), validator: validateMessage }
  ];

  fields.forEach(({ input, errorEl, validator }) => {
    if (!input) return;

    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      const feedback = document.getElementById('formFeedback');
      if (feedback && feedback.classList.contains('error')) {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
      }
    });

    input.addEventListener('blur', () => {
      const err = validator(input.value);
      if (err) {
        showFieldError(input, errorEl, err);
      }
    });
  });
}

function validateName(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Please enter your name.';
  if (trimmed.length < 2) return 'Name must be at least 2 characters.';
  return '';
}

function validateEmail(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Please enter your email address.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. name@company.com).';
  return '';
}

function validateMessage(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Please enter your message.';
  if (trimmed.length < 5) return 'Message must be at least 5 characters long.';
  return '';
}

function showFieldError(input, errorEl, message) {
  if (input) {
    input.classList.add('input-error');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearAllFieldErrors() {
  const inputs = document.querySelectorAll('#contactForm .form-input, #contactForm .form-textarea');
  inputs.forEach(input => input.classList.remove('input-error'));
  const errorEls = document.querySelectorAll('.field-error-text');
  errorEls.forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

function setButtonLoading(isLoading) {
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;

  if (isLoading) {
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
  } else {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
  }
}

window.handleContactSubmit = function(event) {
  if (event) {
    event.preventDefault();
  }

  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  // Prevent multiple concurrent submissions
  if (submitBtn && submitBtn.disabled) {
    return;
  }

  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const messageInput = document.getElementById('formMessage');

  const nameErrorEl = document.getElementById('nameError');
  const emailErrorEl = document.getElementById('emailError');
  const messageErrorEl = document.getElementById('messageError');

  // 1. Client-side field validation & clean prior notices
  clearAllFieldErrors();
  if (feedback) {
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }

  let isValid = true;
  let firstInvalid = null;

  const nameErr = validateName(nameInput ? nameInput.value : '');
  if (nameErr) {
    showFieldError(nameInput, nameErrorEl, nameErr);
    isValid = false;
    firstInvalid = firstInvalid || nameInput;
  }

  const emailErr = validateEmail(emailInput ? emailInput.value : '');
  if (emailErr) {
    showFieldError(emailInput, emailErrorEl, emailErr);
    isValid = false;
    firstInvalid = firstInvalid || emailInput;
  }

  const messageErr = validateMessage(messageInput ? messageInput.value : '');
  if (messageErr) {
    showFieldError(messageInput, messageErrorEl, messageErr);
    isValid = false;
    firstInvalid = firstInvalid || messageInput;
  }

  if (!isValid) {
    showErrorUI('Please correct the highlighted fields before submitting.');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  // 2. Explicitly turn on loading state
  setButtonLoading(true);

  // 3. Process FormData using standard URLSearchParams format
  const formData = new FormData(form);
  if (!formData.get('access_key')) {
    formData.set('access_key', '210b7e67-6752-4a5a-b28a-8d3ba0cee485');
  }
  const payload = new URLSearchParams(formData);

  // 4. Asynchronous POST request with consolidated .finally() lifecycle resolution
  fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: payload
  })
    .then(async (response) => {
      let result = null;
      try {
        result = await response.json();
      } catch (jsonErr) {
        result = null;
      }

      // Validate response resolution status code
      if (response.status === 200 && (!result || result.success !== false)) {
        form.reset();
        const successMsg = (result && result.message) ? result.message : DEFAULT_SUCCESS_TEXT;
        showSuccessUI(successMsg);
      } else {
        const errorMsg = (result && result.message)
          ? result.message
          : `Submission failed with status ${response.status}. Please check your Web3Forms access key.`;
        showErrorUI(errorMsg);
      }
    })
    .catch((error) => {
      const errorMsg = error && error.message
        ? `Network Error: ${error.message}`
        : 'Failed to send message. Please check your internet connection.';
      showErrorUI(errorMsg);
    })
    .finally(() => {
      // Consolidated finally block: instantly shuts down the loader and restores button state
      setButtonLoading(false);
    });
};

function showSuccessUI(message) {
  // Ensure button loader is stopped
  setButtonLoading(false);

  // 1. Inline feedback text (green)
  const feedback = document.getElementById('formFeedback');
  if (feedback) {
    feedback.textContent = message;
    feedback.className = 'form-feedback success';
  }

  // 2. Animated success overlay
  const overlay = document.getElementById('formSuccessOverlay');
  if (overlay) {
    overlay.removeAttribute('hidden');
    void overlay.offsetWidth; // Force reflow for keyframe animation
    overlay.classList.add('visible');
  }

  // 3. Floating toast
  if (typeof showToast === 'function') {
    showToast(message, 'success');
  }
}

function showErrorUI(message) {
  // Ensure button loader is stopped
  setButtonLoading(false);

  const feedback = document.getElementById('formFeedback');
  if (feedback) {
    feedback.textContent = message;
    feedback.className = 'form-feedback error';
  }

  if (typeof showToast === 'function') {
    showToast(message, 'error');
  }
}

window.resetContactFormUI = function() {
  setButtonLoading(false);

  const overlay = document.getElementById('formSuccessOverlay');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.setAttribute('hidden', '');
    }, 400);
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.reset();
  }

  clearAllFieldErrors();

  const feedback = document.getElementById('formFeedback');
  if (feedback) {
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }

  const nameInput = document.getElementById('formName');
  if (nameInput) {
    nameInput.focus();
  }
};

/* --------------------------------------------------------------------------
   11. Resume Action & Modal Handling
   -------------------------------------------------------------------------- */
window.triggerResumeAction = function() {
  const modal = document.getElementById('resumeModal');
  if (modal) {
    modal.removeAttribute('hidden');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    window.print();
  }
};

window.closeResumeModal = function() {
  const modal = document.getElementById('resumeModal');
  if (modal) {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, 300);
  }
};

function initModalListeners() {
  const modal = document.getElementById('resumeModal');
  if (!modal) return;

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeResumeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      window.closeResumeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   12. Dynamic Year
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   13. Custom Animated Cursor Engine (rAF Lerp Loop, Scroll Sync & Battery Sleep)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  if (!dot || !outline) return;

  // 1. Asynchronous Tracking Mechanics: Global target and animated positions
  let targetX = -100;
  let targetY = -100;
  let targetPageX = -100;
  let targetPageY = -100;

  let dotCurrentX = -100;
  let dotCurrentY = -100;

  let ringCurrentX = -100;
  let ringCurrentY = -100;

  // State flags
  let isCursorVisible = false;
  let isTouchActive = false;
  let isLoopRunning = false;
  let rafId = null;

  // Scroll tracking state
  let lastScrollX = window.scrollX || window.pageXOffset || 0;
  let lastScrollY = window.scrollY || window.pageYOffset || 0;

  // Easing coefficients: 0.2 for snappy inner dot, 0.08 for smooth fluid outer ring
  const DOT_EASING = 0.2;
  const RING_EASING = 0.08;

  // Wake loop on demand when idle
  function wakeLoop() {
    if (!isLoopRunning) {
      isLoopRunning = true;
      rafId = requestAnimationFrame(renderCursor);
    }
  }

  // 3. Interpolated Render Loop with requestAnimationFrame
  function renderCursor() {
    // 2. Dynamically factor in real-time page scroll offset during touch
    if (isTouchActive) {
      const currentScrollX = window.scrollX || window.pageXOffset || 0;
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      targetX = targetPageX - currentScrollX;
      targetY = targetPageY - currentScrollY;
    }

    // Linear interpolation calculation
    dotCurrentX += (targetX - dotCurrentX) * DOT_EASING;
    dotCurrentY += (targetY - dotCurrentY) * DOT_EASING;

    ringCurrentX += (targetX - ringCurrentX) * RING_EASING;
    ringCurrentY += (targetY - ringCurrentY) * RING_EASING;

    // Apply interpolated positions to fixed cursor elements
    dot.style.left = `${dotCurrentX}px`;
    dot.style.top = `${dotCurrentY}px`;
    outline.style.left = `${ringCurrentX}px`;
    outline.style.top = `${ringCurrentY}px`;

    // 4. Performance Safeguard: Automatic battery-saving idle sleep
    const distDot = Math.hypot(targetX - dotCurrentX, targetY - dotCurrentY);
    const distRing = Math.hypot(targetX - ringCurrentX, targetY - ringCurrentY);

    if (distDot < 0.1 && distRing < 0.1) {
      // Snap to target to prevent micro-oscillations
      dotCurrentX = targetX;
      dotCurrentY = targetY;
      ringCurrentX = targetX;
      ringCurrentY = targetY;

      dot.style.left = `${dotCurrentX}px`;
      dot.style.top = `${dotCurrentY}px`;
      outline.style.left = `${ringCurrentX}px`;
      outline.style.top = `${ringCurrentY}px`;

      isLoopRunning = false;
      return;
    }

    rafId = requestAnimationFrame(renderCursor);
  }

  // Window mousemove event: tracks desktop coordinates
  window.addEventListener('mousemove', (e) => {
    isTouchActive = false;
    targetX = e.clientX;
    targetY = e.clientY;
    targetPageX = e.pageX;
    targetPageY = e.pageY;

    if (!isCursorVisible) {
      dotCurrentX = targetX;
      dotCurrentY = targetY;
      ringCurrentX = targetX;
      ringCurrentY = targetY;
      dot.style.left = `${dotCurrentX}px`;
      dot.style.top = `${dotCurrentY}px`;
      outline.style.left = `${ringCurrentX}px`;
      outline.style.top = `${ringCurrentY}px`;

      dot.classList.add('cursor-visible');
      outline.classList.add('cursor-visible');
      isCursorVisible = true;
    }

    wakeLoop();
  }, { passive: true });

  // Touch Event Listeners: seamless support across mobile devices
  function handleTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    isTouchActive = true;

    targetX = touch.clientX;
    targetY = touch.clientY;
    targetPageX = touch.pageX;
    targetPageY = touch.pageY;
    lastScrollX = window.scrollX || window.pageXOffset || 0;
    lastScrollY = window.scrollY || window.pageYOffset || 0;

    // Instant snap to touch point on first contact
    if (!isCursorVisible) {
      dotCurrentX = targetX;
      dotCurrentY = targetY;
      ringCurrentX = targetX;
      ringCurrentY = targetY;
      dot.style.left = `${dotCurrentX}px`;
      dot.style.top = `${dotCurrentY}px`;
      outline.style.left = `${ringCurrentX}px`;
      outline.style.top = `${ringCurrentY}px`;

      dot.classList.add('cursor-visible');
      outline.classList.add('cursor-visible');
      isCursorVisible = true;
    }

    // Interactive scale feedback check
    if (e.target && e.target.closest && e.target.closest(interactiveQuery)) {
      onInteractiveEnter();
    } else {
      onInteractiveLeave();
    }

    wakeLoop();
  }

  function handleTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    isTouchActive = true;

    targetX = touch.clientX;
    targetY = touch.clientY;
    targetPageX = touch.pageX;
    targetPageY = touch.pageY;
    lastScrollX = window.scrollX || window.pageXOffset || 0;
    lastScrollY = window.scrollY || window.pageYOffset || 0;

    if (!isCursorVisible) {
      dot.classList.add('cursor-visible');
      outline.classList.add('cursor-visible');
      isCursorVisible = true;
    }

    wakeLoop();
  }

  function handleTouchEnd() {
    isTouchActive = false;
    dot.classList.remove('cursor-visible');
    outline.classList.remove('cursor-visible');
    dot.classList.remove('active-hover');
    outline.classList.remove('active-hover');
    isCursorVisible = false;

    // Wake loop so outer ring smoothly eases into resting point while fading out
    wakeLoop();
  }

  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
  window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

  // 2. Hook into window scroll event to dynamically adjust target during scroll changes
  window.addEventListener('scroll', () => {
    const currentScrollX = window.scrollX || window.pageXOffset || 0;
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    lastScrollX = currentScrollX;
    lastScrollY = currentScrollY;

    if (isTouchActive) {
      targetX = targetPageX - currentScrollX;
      targetY = targetPageY - currentScrollY;
      wakeLoop();
    }
  }, { passive: true });

  // Fade out cursor when mouse leaves browser window
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('cursor-visible');
    outline.classList.remove('cursor-visible');
    isCursorVisible = false;
  });

  // Re-enable cursor visibility when mouse enters window
  document.addEventListener('mouseenter', () => {
    dot.classList.add('cursor-visible');
    outline.classList.add('cursor-visible');
    isCursorVisible = true;
    wakeLoop();
  });

  // Hover Feedback Macro: Select all interactive elements
  const interactiveSelectors = [
    'a',
    'button',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '[role="tab"]',
    '.tool-card',
    '.project-card',
    '.metric-card',
    '.process-step-card',
    '.contact-item',
    '.status-pill',
    '.cert-item',
    '.qa-dashboard-card'
  ];
  const interactiveQuery = interactiveSelectors.join(', ');

  function onInteractiveEnter() {
    dot.classList.add('active-hover');
    outline.classList.add('active-hover');
  }

  function onInteractiveLeave() {
    dot.classList.remove('active-hover');
    outline.classList.remove('active-hover');
  }

  // Attach event listeners to all interactive elements currently in the DOM
  const interactiveElements = document.querySelectorAll(interactiveQuery);
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', onInteractiveEnter);
    el.addEventListener('mouseleave', onInteractiveLeave);
  });

  // Event delegation to catch dynamically created or modified interactive elements
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveQuery)) {
      onInteractiveEnter();
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveQuery)) {
      const related = e.relatedTarget;
      if (!related || !related.closest || !related.closest(interactiveQuery)) {
        onInteractiveLeave();
      }
    }
  });
}


