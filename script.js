// ─── PAGE NAVIGATION ───────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach((link) => link.classList.remove('active'));

  const selectedPage = document.getElementById(`page-${id}`);
  if (selectedPage) selectedPage.classList.add('active');

  const activeNav = document.getElementById(`nav-${id}`);
  if (activeNav) activeNav.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.showPage = showPage;

// ─── TOAST NOTIFICATION ────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.getElementById('site-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'site-toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: '9999',
    padding: '1rem 1.6rem',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    color: type === 'success' ? '#154685' : '#fff',
    background: type === 'success' ? '#fff201' : '#e02020',
    boxShadow: '0 10px 32px rgba(17,17,17,0.18)',
    transform: 'translateY(1.5rem)',
    opacity: '0',
    transition: 'all 0.32s cubic-bezier(.22,.68,0,1.3)',
    maxWidth: '340px',
    lineHeight: '1.4',
  });
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
  });

  // Animate out after 3.5s
  setTimeout(() => {
    toast.style.transform = 'translateY(1.5rem)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// ─── CONTACT FORM ──────────────────────────────────────────────────────────────
function initContactForm() {
  const sendBtn = document.querySelector('.send-message-btn');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    const formBox = sendBtn.closest('.contact-form-box');
    const inputs = formBox.querySelectorAll('input, select, textarea');

    let firstName = '', email = '', allFilled = true;

    inputs.forEach((el) => {
      const val = el.value.trim();
      if (!val || (el.tagName === 'SELECT' && !el.value)) {
        allFilled = false;
        el.style.borderColor = '#e02020';
        el.style.background = 'rgba(224,32,32,0.04)';
      } else {
        el.style.borderColor = '';
        el.style.background = '';
        if (el.getAttribute('placeholder') === 'Juan') firstName = val;
        if (el.type === 'email') email = val;
      }
    });

    if (!allFilled) {
      showToast('Please fill in all fields before sending.', 'error');
      return;
    }

    // Basic email format check
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const emailInput = formBox.querySelector('input[type="email"]');
      if (emailInput) {
        emailInput.style.borderColor = '#e02020';
        emailInput.style.background = 'rgba(224,32,32,0.04)';
      }
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';

    setTimeout(() => {
      // Clear form
      inputs.forEach((el) => {
        el.value = '';
        el.style.borderColor = '';
        el.style.background = '';
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
      });

      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';

      const name = firstName || 'there';
      showToast(`✓ Message sent! Thanks, ${name}. We'll respond within one business day.`);
    }, 1200);
  });

  // Live reset red borders on input
  document.querySelectorAll('.contact-form-box input, .contact-form-box select, .contact-form-box textarea')
    .forEach((el) => {
      el.addEventListener('input', () => {
        el.style.borderColor = '';
        el.style.background = '';
      });
    });
}

// ─── SOCIAL BUTTONS ────────────────────────────────────────────────────────────
function initSocialButtons() {
  const socialLinks = {
    'Facebook': 'https://www.facebook.com/calamba.sti.edu',
    'LinkedIn':  'https://www.linkedin.com/school/sti-college/',
    'STI Website': 'https://sti.edu/',
  };

  document.querySelectorAll('.social-btn').forEach((btn) => {
    const label = btn.textContent.trim();
    if (socialLinks[label]) {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => {
        window.open(socialLinks[label], '_blank', 'noopener,noreferrer');
      });
    }
  });
}

// ─── GALLERY SLIDESHOW ─────────────────────────────────────────────────────────
function initGallery() {
  const slides = Array.from(document.querySelectorAll('.gallery-slide'));
  const dots   = Array.from(document.querySelectorAll('.gallery-dots button'));
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideTimer;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot,   i) => dot.classList.toggle('active',  i === currentSlide));
  };

  const restartTimer = () => {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  };

  prevBtn?.addEventListener('click', () => { showSlide(currentSlide - 1); restartTimer(); });
  nextBtn?.addEventListener('click', () => { showSlide(currentSlide + 1); restartTimer(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); restartTimer(); });
  });

  // Keyboard arrow navigation when on home page
  document.addEventListener('keydown', (e) => {
    const homePage = document.getElementById('page-home');
    if (!homePage || !homePage.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  { showSlide(currentSlide - 1); restartTimer(); }
    if (e.key === 'ArrowRight') { showSlide(currentSlide + 1); restartTimer(); }
  });

  // Touch/swipe support
  const shell = document.querySelector('.gallery-shell');
  if (shell) {
    let touchStartX = 0;
    shell.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    shell.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? showSlide(currentSlide + 1) : showSlide(currentSlide - 1);
        restartTimer();
      }
    });
  }

  showSlide(0);
  restartTimer();
}

// ─── FAQ ACCORDION ─────────────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach((question) => {
    question.addEventListener('click', () => {
      // Close other open items
      document.querySelectorAll('.faq-item.open').forEach((item) => {
        if (item !== question.parentElement) item.classList.remove('open');
      });
      question.parentElement.classList.toggle('open');
    });
  });
}

// ─── SMOOTH NAV + DATA-PAGE WIRING ─────────────────────────────────────────────
function initNav() {
  document.querySelectorAll('[data-page]').forEach((element) => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(element.dataset.page);
    });
  });
}

// ─── INIT ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFAQ();
  initGallery();
  initContactForm();
  initSocialButtons();
});

// ─── MOBILE MENU TOGGLE ───────────────────────────────────────────────────────
(function(){
  const nav = document.querySelector('nav');
  const btn = document.getElementById('mobile-menu-toggle');
  if (!nav || !btn) return;

  function closeMenu() {
    nav.classList.remove('mobile-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '☰';
  }

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.textContent = isOpen ? '×' : '☰';
  });

  nav.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();

// ─── HOME HERO SCROLL FADE + CONTENT REVEAL ───────────────────────────────────
(function () {
  const root = document.documentElement;
  const home = document.getElementById('page-home');
  const hero = document.querySelector('#page-home .hero');
  const future = document.querySelector('#page-home .home-future-strip');

  if (!home || !hero || !future) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function setVar(name, value) {
    root.style.setProperty(name, value);
  }

  function updateHomeScroll() {
    if (!home.classList.contains('active')) {
      setVar('--home-hero-wash', '0');
      setVar('--home-hero-content-opacity', '1');
      setVar('--home-hero-lift', '0px');
      setVar('--home-future-opacity', '0');
      setVar('--home-future-y', '34px');
      setVar('--home-future-scale', '0.96');
      return;
    }

    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const heroHeight = Math.max(hero.offsetHeight, 1);
    const heroProgress = clamp((scrollY - heroHeight * 0.18) / (heroHeight * 0.55), 0, 1);
    const futureProgress = clamp((scrollY - heroHeight * 0.55) / (heroHeight * 0.32), 0, 1);

    setVar('--home-hero-wash', heroProgress.toFixed(3));
    setVar('--home-hero-content-opacity', (1 - heroProgress).toFixed(3));
    setVar('--home-hero-lift', `${(-34 * heroProgress).toFixed(1)}px`);
    setVar('--home-future-opacity', futureProgress.toFixed(3));
    setVar('--home-future-y', `${(34 - 34 * futureProgress).toFixed(1)}px`);
    setVar('--home-future-scale', (0.96 + 0.04 * futureProgress).toFixed(3));
  }

  let ticking = false;
  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHomeScroll();
      ticking = false;
    });
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  document.addEventListener('DOMContentLoaded', requestUpdate);
  requestUpdate();

  const revealTargets = document.querySelectorAll('#page-home .section, #page-home .cta-banner, #page-home footer');
  revealTargets.forEach((target) => target.classList.add('reveal-ready'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }
})();

// ─── HOME PHOTO GALLERY AUTO-SCROLL ──────────────────────────────────────────
(function () {
  function initHomePhotoGallery() {
    const gallery = document.querySelector('[data-home-gallery]');
    if (!gallery || gallery.dataset.ready === 'true') return;
    gallery.dataset.ready = 'true';

    const slides = Array.from(gallery.querySelectorAll('.home-photo-slide'));
    const dots = Array.from(gallery.querySelectorAll('.home-photo-dots button'));
    const progress = gallery.querySelector('.home-photo-progress span');
    if (!slides.length) return;

    let current = 0;
    let timer = null;
    const interval = 4800;

    function restartProgress() {
      if (!progress) return;
      progress.style.animation = 'none';
      progress.offsetHeight;
      progress.style.animation = `homeGalleryProgress ${interval}ms linear infinite`;
    }

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
      restartProgress();
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(() => showSlide(current + 1), interval);
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        start();
      });
    });

    gallery.addEventListener('mouseenter', () => gallery.classList.add('is-paused'));
    gallery.addEventListener('mouseleave', () => gallery.classList.remove('is-paused'));

    let touchStartX = 0;
    gallery.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchend', (event) => {
      const diff = touchStartX - event.changedTouches[0].clientX;
      if (Math.abs(diff) > 45) {
        showSlide(current + (diff > 0 ? 1 : -1));
        start();
      }
    });

    showSlide(0);
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePhotoGallery);
  } else {
    initHomePhotoGallery();
  }
})();



// ─── THEME ICON POLISH ───────────────────────────────────────────────────────
(function(){
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  if (!btn || !root) return;

  const icons = {
    light: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 13.2A8.2 8.2 0 0 1 10.8 3a7 7 0 1 0 10.2 10.2Z" fill="currentColor"></path><path d="M17.4 3.2l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5.5-1.4Z" fill="currentColor"></path></svg>`,
    dark: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.3" fill="currentColor"></circle><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>`
  };

  function setTheme(theme){
    root.setAttribute('data-theme', theme);
    localStorage.setItem('bsit-theme', theme);
    btn.innerHTML = theme === 'dark' ? icons.dark : icons.light;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  setTheme(localStorage.getItem('bsit-theme') || root.getAttribute('data-theme') || 'light');
  btn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
