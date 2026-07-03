(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});
  const utils = app.utils;

  const projectData = [
    {
      title: 'MyHealthMate',
      category: 'web',
      description: 'Food safety dashboard with nutrition scan guidance and profile tracking.',
      tags: ['React', 'Node.js', 'Security'],
      image: 'images/profile.jpg',
      liveDemo: 'https://sushant-jpg.github.io/myheltmate.github.io/',
      github: 'https://github.com/sushant-jpg/myheltmate.github.io'
    },
    {
      title: 'FreshMart',
      category: 'ecommerce',
      description: 'Modern grocery storefront with filtering, cart, and a secure checkout flow.',
      tags: ['JavaScript', 'CSS', 'UI'],
      image: 'images/profile.jpg',
      liveDemo: 'https://sushant-jpg.github.io/ecom.github.io/',
      github: 'https://github.com/sushant-jpg/ecom.github.io'
    },
    {
      title: 'SecureAuth Lab',
      category: 'security',
      description: 'A playground for authentication patterns, secure form handling, and XSS prevention.',
      tags: ['Security', 'Auth', 'Web'],
      image: 'images/profile.jpg',
      liveDemo: '#contact',
      github: 'https://github.com/sushant-jpg'
    }
  ];

  const certificateData = [
    { name: 'Full Stack Development', issuer: 'Coursera' },
    { name: 'React Certification', issuer: 'FreeCodeCamp' },
    { name: 'Node.js Mastery', issuer: 'Udemy' },
    { name: 'Cybersecurity Fundamentals', issuer: 'Coursera' }
  ];

  const techStackData = [
    { name: 'Python', icon: '🐍' },
    { name: 'JavaScript', icon: '📜' },
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'MongoDB', icon: '🍃' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Cybersecurity', icon: '🔒' },
    { name: 'Network Security', icon: '🛡️' }
  ];

  let filteredProjects = [...projectData];
  let currentPage = 1;
  let activeCategory = 'all';
  let activeSort = 'recent';
  let searchQuery = '';

  function sortProjects(items) {
    const sorted = [...items];
    if (activeSort === 'name') return sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (activeSort === 'category') return sorted.sort((a, b) => a.category.localeCompare(b.category));
    return sorted;
  }

  function filterProjects(items) {
    return items.filter((project) => {
      const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
      const matchesSearch = !searchQuery || `${project.title} ${project.description} ${project.tags.join(' ')}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  function renderProjects() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    const pageSize = app.config?.app?.projectsPageSize || 6;
    const start = (currentPage - 1) * pageSize;
    const visible = filteredProjects.slice(start, start + pageSize);

    if (!visible.length) {
      grid.innerHTML = '<div class="project-card"><p>No projects match this filter.</p></div>';
      return;
    }

    grid.innerHTML = visible.map((project) => `
      <article class="project-card" data-category="${project.category}">
        <div class="project-logo">
          <img data-src="${project.image}" alt="${project.title}" class="project-logo-img" />
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
        <div class="project-links">
          <button class="project-link project-details" data-project="${project.title}">Details</button>
          <a href="${project.liveDemo}" target="_blank" class="project-link">Live Demo</a>
          <a href="${project.github}" target="_blank" class="project-link">GitHub</a>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('img[data-src]').forEach((img) => img.setAttribute('src', img.dataset.src));
    grid.querySelectorAll('.project-details').forEach((button) => button.addEventListener('click', (event) => {
      const title = event.currentTarget.dataset.project;
      const project = projectData.find((entry) => entry.title === title);
      showProjectModal(project);
    }));

    utils.lazyLoadImages(document);
  }

  function renderCertificates() {
    const container = document.querySelector('.certificates-grid');
    if (!container) return;
    container.innerHTML = certificateData.map((certificate) => `
      <div class="certificate-card">
        <i class="fas fa-certificate"></i>
        <h3>${certificate.name}</h3>
        <p>${certificate.issuer}</p>
      </div>
    `).join('');
  }

  function renderTechStack() {
    const container = document.querySelector('.techstack-grid');
    if (!container) return;
    container.innerHTML = techStackData.map((item) => `
      <div class="tech-item">
        <div>${item.icon}</div>
        <h3>${item.name}</h3>
      </div>
    `).join('');
  }

  function createControls() {
    const section = document.querySelector('#portfolio .container');
    if (!section || document.querySelector('.portfolio-controls')) return;
    const controls = document.createElement('div');
    controls.className = 'portfolio-controls';
    controls.innerHTML = `
      <div class="portfolio-controls__group">
        <input type="search" class="portfolio-search" placeholder="Search projects" aria-label="Search projects" />
      </div>
      <div class="portfolio-controls__group">
        <select class="portfolio-category">
          <option value="all">All Categories</option>
          <option value="web">Web</option>
          <option value="ecommerce">Ecommerce</option>
          <option value="security">Security</option>
        </select>
        <select class="portfolio-sort">
          <option value="recent">Recent</option>
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
      </div>`;
    section.insertBefore(controls, section.children[2]);

    controls.querySelector('.portfolio-search').addEventListener('input', (event) => {
      searchQuery = event.target.value.trim();
      currentPage = 1;
      applyFilters();
    });

    controls.querySelector('.portfolio-category').addEventListener('change', (event) => {
      activeCategory = event.target.value;
      currentPage = 1;
      applyFilters();
    });

    controls.querySelector('.portfolio-sort').addEventListener('change', (event) => {
      activeSort = event.target.value;
      applyFilters();
    });
  }

  function applyFilters() {
    filteredProjects = sortProjects(filterProjects(projectData));
    renderProjects();
  }

  function showProjectModal(project) {
    if (!project) return;
    let modal = document.querySelector('.project-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'project-modal';
      modal.innerHTML = `
        <div class="project-modal__backdrop"></div>
        <div class="project-modal__content"></div>`;
      document.body.appendChild(modal);
      modal.querySelector('.project-modal__backdrop').addEventListener('click', () => modal.remove());
    }
    modal.querySelector('.project-modal__content').innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      <div class="project-links">
        <a href="${project.liveDemo}" target="_blank" class="project-link">Live Demo</a>
        <a href="${project.github}" target="_blank" class="project-link">GitHub</a>
      </div>`;
    modal.classList.add('is-open');
  }

  function init() {
    createControls();
    renderProjects();
    renderCertificates();
    renderTechStack();
    applyFilters();
    document.querySelectorAll('.tech-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.textContent.trim().toLowerCase();
        activeCategory = value.includes('node') ? 'web' : value.includes('java') ? 'security' : 'all';
        searchQuery = value;
        currentPage = 1;
        applyFilters();
        utils.showToast(`Filtering projects for ${button.textContent.trim()}`, 'info');
      });
    });
  }

  app.projects = { init, projectData, certificateData, techStackData };
})(window);
