(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});
  const utils = app.utils;
  const config = app.config;

  function initializeModules() {
    app.navigation?.init?.();
    app.projects?.init?.();
    app.contact?.init?.();
    app.comments?.init?.();
    app.chatbot?.init?.();
    app.firebase?.initializeFirebase?.();
  }

  function initializeTheme() {
    const theme = utils.getPreferredTheme();
    utils.setTheme(theme);
    document.documentElement.classList.add('theme-ready');
  }

  function initializeLoader() {
    utils.showLoader(config.app.loaderText);
    global.setTimeout(() => utils.hideLoader(), 800);
  }

  function initializeKeyboardShortcuts() {
    global.addEventListener('keydown', (event) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        document.getElementById('chatbotInput')?.focus();
      }
      if (event.key.toLowerCase() === 'd' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        utils.toggleTheme();
      }
    });
  }

  function initializeAnalytics() {
    if (!config.app.analyticsEnabled) return;
    global.addEventListener('click', (event) => {
      const target = event.target.closest('a, button');
      if (target) {
        global.__portfolioEventLog = global.__portfolioEventLog || [];
        global.__portfolioEventLog.push({ type: 'interaction', label: target.textContent?.trim() || target.tagName });
      }
    });
  }

  function initializePerformanceMonitor() {
    if (!global.performance?.mark) return;
    performance.mark('portfolio:ready');
  }

  function initializeErrorHandler() {
    global.addEventListener('error', (event) => {
      console.error('Portfolio error', event.error || event.message);
    });
  }

  function initializeGlobalEventBus() {
    app.events = new EventTarget();
  }

  function initializeLazyLoad() {
    utils.lazyLoadImages(document);
  }

  function initializeVersionChecker() {
    const stored = utils.storage.get(config.storageKeys.seenVersion, null);
    if (stored !== config.version) {
      utils.showToast(`Portfolio v${config.version} loaded successfully.`, 'success');
      utils.storage.set(config.storageKeys.seenVersion, config.version);
    }
  }

  function init() {
    initializeTheme();
    initializeLoader();
    initializeKeyboardShortcuts();
    initializeAnalytics();
    initializePerformanceMonitor();
    initializeErrorHandler();
    initializeGlobalEventBus();
    initializeLazyLoad();
    initializeVersionChecker();
    initializeModules();
  }

  if (document.readyState === 'loading') {
    global.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  app.app = { init };
})(window);
