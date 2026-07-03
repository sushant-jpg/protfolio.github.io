(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});

  const utils = {
    storage: {
      get(key, fallback = null) {
        try {
          const raw = global.localStorage.getItem(key);
          return raw === null ? fallback : JSON.parse(raw);
        } catch (error) {
          return fallback;
        }
      },
      set(key, value) {
        try {
          global.localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (error) {
          return false;
        }
      },
      remove(key) {
        try {
          global.localStorage.removeItem(key);
          return true;
        } catch (error) {
          return false;
        }
      }
    },

    debounce(func, wait = 200) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    },

    throttle(func, wait = 200) {
      let lastCall = 0;
      return (...args) => {
        const now = Date.now();
        if (now - lastCall >= wait) {
          lastCall = now;
          func(...args);
        }
      };
    },

    showToast(message, type = 'info', duration = app.config?.app?.toastDuration || 3400) {
      const existing = document.querySelector('.portfolio-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = `portfolio-toast toast-${type}`;
      toast.setAttribute('role', 'status');
      toast.innerHTML = `<span>${message}</span>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 20);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
      }, duration);
    },

    showLoader(message = app.config?.app?.loaderText || 'Loading...') {
      let loader = document.querySelector('.portfolio-loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.className = 'portfolio-loader';
        loader.innerHTML = `
          <div class="portfolio-loader__backdrop"></div>
          <div class="portfolio-loader__panel">
            <div class="portfolio-loader__spinner"></div>
            <p>${message}</p>
          </div>`;
        document.body.appendChild(loader);
      }
      loader.style.display = 'flex';
      loader.querySelector('p').textContent = message;
    },

    hideLoader() {
      const loader = document.querySelector('.portfolio-loader');
      if (loader) loader.style.display = 'none';
    },

    copyText(text) {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text);
      }
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.setAttribute('readonly', '');
      temp.style.position = 'fixed';
      temp.style.left = '-9999px';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      return Promise.resolve();
    },

    generateId(prefix = 'id') {
      return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
    },

    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    formatDate(value, style = 'short') {
      const date = new Date(value || Date.now());
      if (Number.isNaN(date.getTime())) return 'Recently';
      return new Intl.DateTimeFormat(undefined, style === 'short' ? { month: 'short', day: 'numeric', year: 'numeric' } : { dateStyle: 'full', timeStyle: 'short' }).format(date);
    },

    formatTimeAgo(value) {
      const diff = Date.now() - new Date(value || Date.now()).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    },

    isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
    },

    isValidPhone(value) {
      return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,10}$/.test(value || '');
    },

    smoothScrollTo(target, options = {}) {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (!element) return;
      const behavior = options.behavior || 'smooth';
      const top = options.top ?? element.getBoundingClientRect().top + global.scrollY - 70;
      global.scrollTo({ top, behavior });
    },

    setTheme(theme) {
      const resolved = theme || utils.getPreferredTheme();
      document.documentElement.setAttribute('data-theme', resolved);
      document.body.classList.toggle('theme-dark', resolved === 'dark');
      utils.storage.set(app.config?.darkMode?.storageKey || 'portfolio-theme', resolved);
      return resolved;
    },

    getPreferredTheme() {
      const stored = utils.storage.get(app.config?.darkMode?.storageKey || 'portfolio-theme');
      if (stored) return stored;
      return global.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      return utils.setTheme(current);
    },

    downloadFile(url, filename = 'download') {
      return fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const objectUrl = global.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = filename;
          link.click();
          global.URL.revokeObjectURL(objectUrl);
        })
        .catch(() => utils.showToast('Download failed. Please try again.', 'error'));
    },

    animateElement(element, type = 'fadeUp', duration = 500) {
      if (!element) return;
      element.style.transition = `all ${duration}ms ease`;
      element.style.opacity = '0';
      element.style.transform = type === 'fadeUp' ? 'translateY(10px)' : 'scale(0.98)';
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
      });
    },

    lazyLoadImages(root = document) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src || img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '120px 0px' });

      root.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
    },

    notify(title, message, options = {}) {
      if (!('Notification' in global) || Notification.permission === 'denied') return Promise.resolve(false);
      if (Notification.permission === 'default') {
        return Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            return new Notification(title, { body: message, ...options });
          }
          return false;
        });
      }
      return Promise.resolve(new Notification(title, { body: message, ...options }));
    }
  };

  app.utils = utils;
})(window);
