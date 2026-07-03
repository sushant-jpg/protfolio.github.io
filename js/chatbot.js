(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});
  const utils = app.utils;
  const config = app.config;

  let messages = [];
  let isGenerating = false;
  let abortController = null;

  function getConversationHistory() {
    return messages.map((message) => ({ role: message.role, content: message.content })).slice(-8);
  }

  function appendMessage(message, role = 'assistant') {
    const item = { role, content: message, timestamp: Date.now() };
    messages.push(item);
    utils.storage.set(config.storageKeys.chatHistory, messages);
    renderMessages();
  }

  function renderMessages() {
    const container = document.getElementById('chatbotMessages');
    if (!container) return;
    container.innerHTML = messages.map((message) => `
      <div class="ai-chatbot__msg ai-chatbot__msg--${message.role === 'user' ? 'user' : 'bot'}">${message.content}</div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  }

  function setBusy(isBusy) {
    isGenerating = isBusy;
    const sendButton = document.getElementById('chatbotSend');
    if (sendButton) {
      sendButton.disabled = isBusy;
      sendButton.innerHTML = isBusy ? '<i class="fas fa-spinner fa-spin"></i>' : '<i class="fas fa-paper-plane"></i>';
    }
  }

  function generateLocalResponse(prompt) {
    const normalized = prompt.toLowerCase();
    const projects = app.projects?.projectData || [];

    function formatProject(project) {
      return `${project.title}: ${project.description}`;
    }

    function listProjects(items) {
      return items.length
        ? items.map((project) => `• ${formatProject(project)}`).join('\n')
        : 'No matching projects were found.';
    }

    if (normalized.includes('cv') || normalized.includes('resume') || normalized.includes('curriculum vitae') || normalized.includes('download my cv') || normalized.includes('provide me cv')) {
      return 'You can download the CV from the About section download button, or email sushantbhandari101@gmail.com for a direct copy. The download link is available in the profile area.';
    }

    const matches = projects.filter((project) => {
      const text = `${project.title} ${project.description} ${project.category} ${project.tags?.join(' ')}`.toLowerCase();
      return normalized.includes(project.title.toLowerCase()) || normalized.includes(project.category.toLowerCase()) || project.tags?.some((tag) => normalized.includes(tag.toLowerCase()));
    });

    if (normalized.includes('ecommerce') || normalized.includes('e-commerce')) {
      const items = projects.filter((project) => project.category === 'ecommerce');
      return items.length
        ? `E-commerce project${items.length > 1 ? 's' : ''}:
${listProjects(items)}`
        : 'There are no ecommerce projects listed right now.';
    }

    if (normalized.includes('security') || normalized.includes('secure') || normalized.includes('auth')) {
      const items = projects.filter((project) => project.category === 'security');
      return items.length
        ? `Security-focused project${items.length > 1 ? 's' : ''}:
${listProjects(items)}`
        : 'There are no security projects listed right now.';
    }

    if (matches.length === 1 && normalized.includes('project')) {
      return `Here is the project you asked for:\n${formatProject(matches[0])}`;
    }

    if (normalized.includes('project')) {
      return `Here are the portfolio projects currently showcased:\n${listProjects(projects)}\nAsk me for a specific project or category, like \"show me ecommerce projects\".`;
    }

    if (normalized.includes('skill') || normalized.includes('technology') || normalized.includes('tech')) {
      return 'I specialize in full stack development, cybersecurity, responsive design, JavaScript, Node.js, React, Python, and cloud integration.';
    }
    if (normalized.includes('contact') || normalized.includes('email') || normalized.includes('hire')) {
      return 'You can reach me via email at sushantbhandari101@gmail.com, GitHub at github.com/sushant-jpg, or LinkedIn through my profile.';
    }
    if (normalized.includes('about') || normalized.includes('who are you') || normalized.includes('introduce')) {
      return 'I am an AI assistant for Sushant Bhandari’s portfolio. I help visitors learn about projects, skills, and contact options quickly.';
    }
    return 'I am ready to help. Ask me about projects, skills, contact methods, or anything related to this portfolio.';
  }

  async function generateReply(prompt) {
    if (!config.chat.enabled) return 'The chatbot is unavailable right now.';
    if (!config.openRouter || !config.openRouter.apiKey?.trim()) {
      utils.showToast('AI key not configured. Using built-in assistant responses.', 'info');
      return generateLocalResponse(prompt);
    }

    const payload = {
      model: config.openRouter.model,
      messages: [
        { role: 'system', content: config.chat.promptTemplates.intro },
        ...getConversationHistory(),
        { role: 'user', content: prompt }
      ],
      stream: false
    };

    abortController = new AbortController();
    try {
      const response = await fetch(config.openRouter.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openRouter.apiKey}`
        },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Chatbot API error:', response.status, errorBody);
        return 'The AI service returned an error. Please try again later.';
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || 'I could not generate a response right now.';
    } catch (error) {
      if (error.name === 'AbortError') return 'Generation stopped.';
      console.error('Chatbot request failed:', error);
      return 'The AI service is unavailable right now. Please try again later.';
    } finally {
      abortController = null;
    }
  }

  async function sendChat() {
    const input = document.getElementById('chatbotInput');
    if (!input || isGenerating) return;
    const prompt = input.value.trim();
    if (!prompt) return;

    appendMessage(prompt, 'user');
    input.value = '';
    setBusy(true);

    try {
      const reply = await generateReply(prompt);
      if (reply) {
        appendMessage(reply, 'assistant');
      }
    } finally {
      setBusy(false);
    }
  }

  function stopGeneration() {
    abortController?.abort();
    setBusy(false);
  }

  function toggleChat(open) {
    const panel = document.getElementById('chatbotPanel');
    if (!panel) return;
    const shouldOpen = open ?? !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', shouldOpen);
    if (shouldOpen) {
      document.getElementById('chatbotInput')?.focus();
    }
  }

  function init() {
    const panel = document.getElementById('chatbotPanel');
    const toggle = document.getElementById('chatbotToggle');
    const close = document.getElementById('chatbotClose');
    const send = document.getElementById('chatbotSend');
    const input = document.getElementById('chatbotInput');
    if (!panel) return;

    const storedMessages = utils.storage.get(config.storageKeys.chatHistory, []);
    messages = storedMessages.length ? storedMessages : [
      { role: 'assistant', content: 'Hi! I’m your AI assistant. Ask about projects, skills, or contact info.', timestamp: Date.now() }
    ];
    renderMessages();

    toggle?.addEventListener('click', () => toggleChat());
    close?.addEventListener('click', () => toggleChat(false));
    send?.addEventListener('click', () => sendChat());
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendChat();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') toggleChat(false);
    });
  }

  app.chatbot = { init, sendChat, stopGeneration, toggleChat };
})(window);
