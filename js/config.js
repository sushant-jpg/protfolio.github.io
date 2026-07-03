(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});

  const config = {
    appName: 'Sushant Portfolio',
    version: '2.0.0',
    environment: global.location?.hostname === 'localhost' ? 'development' : 'production',
    repoUrl: 'https://github.com/sushant-jpg',
    openRouter: {
      apiKey: '',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'openai/gpt-4o-mini',
      timeout: 45000
    },
    firebase: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    },
    app: {
      defaultTheme: 'dark',
      toastDuration: 3400,
      loaderText: 'Preparing portfolio experience...',
      debounceDelay: 180,
      throttleDelay: 120,
      commentsPageSize: 6,
      projectsPageSize: 6,
      analyticsEnabled: true
    },
    darkMode: {
      storageKey: 'portfolio-theme',
      className: 'theme-dark'
    },
    storageKeys: {
      comments: 'portfolio-comments',
      contactMessages: 'portfolio-contact-messages',
      chatHistory: 'portfolio-chat-history',
      theme: 'portfolio-theme',
      seenVersion: 'portfolio-version',
      notifications: 'portfolio-notifications'
    },
    chat: {
      enabled: true,
      maxMessages: 120,
      suggestions: [
        'Tell me about your projects',
        'Show me your skills',
        'How can I contact you?'
      ],
      promptTemplates: {
        intro: 'You are a helpful portfolio assistant for Sushant Bhandari.',
        project: 'Explain the portfolio projects in a concise and engaging way.',
        contact: 'Provide the best ways to reach the portfolio owner.'
      }
    },
    comments: {
      allowGuest: true,
      moderationMode: false,
      pageSize: 6,
      sortBy: 'newest'
    }
  };

  app.config = config;
  app.version = config.version;
})(window);
