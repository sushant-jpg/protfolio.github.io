(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});
  const utils = app.utils;

  function initStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', global.scrollY > 20);
      document.body.classList.toggle('scrolled', global.scrollY > 20);
    };
    onScroll();
    global.addEventListener('scroll', utils.throttle(onScroll, 80), { passive: true });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const section = document.querySelector(hash);
        if (!section) return;
        event.preventDefault();
        utils.smoothScrollTo(section);
        global.history.pushState(null, '', hash);
      });
    });
  }

  function initScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!navLinks.length || !sections.length) return;

    const updateActive = utils.throttle(() => {
      let current = sections[0]?.id;
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= 140) current = section.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }, 120);

    updateActive();
    global.addEventListener('scroll', updateActive, { passive: true });
  }

  function initBackToTop() {
    let button = document.getElementById('backToTop');
    if (!button) {
      button = document.createElement('button');
      button.id = 'backToTop';
      button.className = 'back-to-top';
      button.setAttribute('aria-label', 'Back to top');
      button.innerHTML = '<i class="fas fa-arrow-up"></i>';
      document.body.appendChild(button);
    }
    button.addEventListener('click', () => utils.smoothScrollTo(document.body));
    const toggle = utils.throttle(() => {
      button.classList.toggle('visible', global.scrollY > 500);
    }, 100);
    toggle();
    global.addEventListener('scroll', toggle, { passive: true });
  }

  function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      document.body.prepend(bar);
    }
    const update = utils.throttle(() => {
      const scrollTop = global.scrollY;
      const height = document.documentElement.scrollHeight - global.innerHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;
    }, 100);
    update();
    global.addEventListener('scroll', update, { passive: true });
  }

  function initMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    if (!navMenu || !navbar) return;

    let toggle = document.querySelector('.mobile-menu-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'mobile-menu-toggle';
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
      toggle.setAttribute('aria-label', 'Toggle navigation');
      navbar.appendChild(toggle);
    }

    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      toggle.classList.toggle('is-open');
    });

    navMenu.querySelectorAll('a').forEach((item) => item.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      toggle.classList.remove('is-open');
    }));
  }

  function initKeyboardNavigation() {
    global.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        document.querySelector('.nav-menu')?.classList.remove('is-open');
        document.querySelector('.mobile-menu-toggle')?.classList.remove('is-open');
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('chatbotToggle')?.click();
      }
    });
  }

  function initHeaderAnimation() {
    const hero = document.querySelector('.home-section');
    if (!hero) return;
    const update = utils.throttle(() => {
      const ratio = Math.min(global.scrollY / 250, 1);
      hero.style.setProperty('--header-shift', `${ratio * 20}px`);
    }, 80);
    update();
    global.addEventListener('scroll', update, { passive: true });
  }

  function initIntersectionObserver() {
    const revealItems = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in global) || !revealItems.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach((item) => observer.observe(item));
  }

  function initPortfolioTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    if (!buttons.length || !contents.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.tab;
        buttons.forEach((btn) => btn.classList.toggle('active', btn === button));
        contents.forEach((content) => content.classList.toggle('active', content.id === `${target}-tab`));
      });
    });
  }

  function initStatsAnimation() {
    const numbers = document.querySelectorAll('.stat-number');
    if (!numbers.length || !('IntersectionObserver' in global)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = Number(entry.target.dataset.target || entry.target.textContent || 0);
        const duration = 1400;
        const start = Number(entry.target.textContent || 0);
        const startTime = performance.now();
        const step = (timestamp) => {
          const progress = Math.min((timestamp - startTime) / duration, 1);
          entry.target.textContent = Math.floor(start + (target - start) * progress);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    numbers.forEach((number) => observer.observe(number));
  }

  function initTypedHero() {
    const target = document.getElementById('typed-text');
    if (!target || !global.Typed) return;
    new global.Typed('#typed-text', {
      strings: ['Full Stack Developer.', 'Cybersecurity Enthusiast.', 'Building secure, modern web apps.'],
      typeSpeed: 45,
      backSpeed: 35,
      backDelay: 1200,
      loop: true,
      smartBackspace: true
    });
  }

  function initCleanScroll() {
    const section = document.querySelector('.clean-scroll');
    const line = document.getElementById('clean-scroll-line');
    if (!section || !line) return;

    const roles = ['Web Developer', 'Designer', 'Programmer', 'Ethical Hacker', 'AI Enthusiast'];
    let index = 0;
    let lastScrollY = global.scrollY;

    const showNextRole = () => {
      line.classList.remove('reveal-in');
      line.classList.add('clean-out');
      setTimeout(() => {
        index = (index + 1) % roles.length;
        line.textContent = roles[index];
        line.classList.remove('clean-out');
        line.classList.add('reveal-in');
      }, 350);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          line.textContent = roles[index];
          line.classList.add('reveal-in');
        }
      });
    }, { threshold: 0.35 });
    observer.observe(section);

    section.addEventListener('click', showNextRole);
    global.addEventListener('scroll', utils.throttle(() => {
      const currentY = global.scrollY;
      if (Math.abs(currentY - lastScrollY) > 50) {
        const rect = section.getBoundingClientRect();
        const inView = rect.top < global.innerHeight * 0.7 && rect.bottom > global.innerHeight * 0.3;
        if (inView) showNextRole();
        lastScrollY = currentY;
      }
    }, 140));
  }

  function init() {
    initStickyNavbar();
    initSmoothScroll();
    initScrollSpy();
    initBackToTop();
    initScrollProgress();
    initMobileMenu();
    initKeyboardNavigation();
    initHeaderAnimation();
    initIntersectionObserver();
    initPortfolioTabs();
    initStatsAnimation();
    initTypedHero();
    initCleanScroll();
  }

  app.navigation = { init };
})(window);
