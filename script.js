// Navigation Active State
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Portfolio Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

// Animate Statistics
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize stats animation
animateStats();

// Typed.js hero typing effect
const typedTarget = document.getElementById('typed-text');
if (typedTarget && window.Typed) {
    new Typed('#typed-text', {
        strings: [
            'Full Stack Developer.',
            'Cybersecurity Enthusiast.',
            'Building secure, modern web apps.'
        ],
        typeSpeed: 50,
        backSpeed: 40,
        backDelay: 1200,
        smartBackspace: true,
        loop: true
    });
}

// Scroll reveal for clean fade + slide-up
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // reveal once
        }
    });
}, { threshold: 0.2 });

revealElements.forEach(el => revealObserver.observe(el));

// Clean scroll headline animation
const roleLines = [
    "Web Developer",
    "Designer",
    "Programmer",
    "Ethical Hacker",
    "AI Enthusiast"
];

const cleanSection = document.querySelector(".clean-scroll");
const cleanLineEl = document.getElementById("clean-scroll-line");
let roleIndex = 0;
let roleAnimating = false;
let lastScrollY = window.scrollY;

function showRoleLine() {
    if (!cleanLineEl) return;
    cleanLineEl.textContent = roleLines[roleIndex];
    cleanLineEl.classList.remove("clean-out");
    void cleanLineEl.offsetWidth; // force reflow
    cleanLineEl.classList.add("reveal-in");
    roleAnimating = false;
}

function nextRoleLine() {
    if (roleAnimating || !cleanLineEl) return;
    roleAnimating = true;
    cleanLineEl.classList.remove("reveal-in");
    cleanLineEl.classList.add("clean-out");
    setTimeout(() => {
        roleIndex = (roleIndex + 1) % roleLines.length;
        showRoleLine();
    }, 480); // match cleanOut duration
}

if (cleanSection && cleanLineEl) {
    const cleanObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showRoleLine();
                }
            });
        },
        { threshold: 0.4 }
    );
    cleanObserver.observe(cleanSection);

    window.addEventListener("scroll", () => {
        const currentY = window.scrollY;
        if (Math.abs(currentY - lastScrollY) > 40) {
            const rect = cleanSection.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
            if (inView) nextRoleLine();
            lastScrollY = currentY;
        }
    });

    cleanSection.addEventListener("click", () => nextRoleLine());
}

// AI Chatbot interactions (front-end only)
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');

function appendMessage(text, from = 'bot') {
    if (!chatbotMessages) return;
    const div = document.createElement('div');
    div.className = `ai-chatbot__msg ai-chatbot__msg--${from}`;
    div.textContent = text;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function botReply(userText) {
    const text = userText.toLowerCase();
    let reply;

    if (text.includes('project') || text.includes('portfolio')) {
        reply = "Check the Portfolio section for live demos and GitHub links. Want a specific project link?";
    } else if (text.includes('skill') || text.includes('tech') || text.includes('stack')) {
        reply = "I work with JavaScript/TypeScript, React, Node.js, Python, and security-focused practices.";
    } else if (text.includes('contact') || text.includes('email') || text.includes('linkedin')) {
        reply = "You can reach me via the Contact section, email sushantbhandari101@gmail.com, or LinkedIn.";
    } else if (text.includes('ai') || text.includes('chat') || text.includes('bot')) {
        reply = "Hi! I’m your AI assistant—happy to guide you through the site or share highlights.";
    } else {
        const canned = [
            "I can help with projects, skills, or contact info.",
            "Need links? I can share portfolio, GitHub, or LinkedIn.",
            "Curious about a demo? I can point you to the projects section.",
            "I’m here to help. What would you like to explore next?"
        ];
        reply = canned[Math.floor(Math.random() * canned.length)];
    }

    setTimeout(() => appendMessage(reply, 'bot'), 420);
}

function sendChat() {
    if (!chatbotInput) return;
    const text = chatbotInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    chatbotInput.value = '';
    botReply(text);
}

function toggleChat(open) {
    if (!chatbotPanel) return;
    const shouldOpen = open ?? !chatbotPanel.classList.contains('is-open');
    if (shouldOpen) {
        chatbotPanel.classList.add('is-open');
        if (chatbotInput) chatbotInput.focus();
    } else {
        chatbotPanel.classList.remove('is-open');
    }
}

// Toggle from floating icon and close button
if (chatbotToggle && chatbotPanel) {
    chatbotToggle.addEventListener('click', () => toggleChat());
}
if (chatbotClose && chatbotPanel) {
    chatbotClose.addEventListener('click', () => toggleChat(false));
}
if (chatbotSend) {
    chatbotSend.addEventListener('click', sendChat);
}
if (chatbotInput) {
    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendChat();
        }
    });
}

// Profile image: try local photo, fall back to inline placeholder
const profileImg = document.getElementById('profileImage');
if (profileImg) {
    const targetSrc = profileImg.dataset.photo;
    const placeholderSrc = profileImg.getAttribute('src') || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23111a3a" width="400" height="400"/><text x="50%25" y="55%25" fill="%238b5cf6" font-size="120" font-family="Segoe UI, sans-serif" font-weight="700" text-anchor="middle">SB</text></svg>';

    if (targetSrc) {
        profileImg.src = targetSrc;
    }

    profileImg.addEventListener('error', () => {
        profileImg.src = placeholderSrc;
    }, { once: true });
}

// Sample Projects Data - Replace with your actual projects
const projects = [
    {
        title: "MyHealthMate",
        description: "Food safety dashboard with nutrition scan and guidance",
        logo: "🍎",
        logoImg: "images/myhealthmate-logo.svg",
        liveDemo: "https://sushant-jpg.github.io/myheltmate.github.io/",
        github: "https://github.com/sushant-jpg/myheltmate.github.io"
    },
    {
        title: "FreshMart",
        description: "E-commerce grocery site with categories and cart",
        logo: "🛒",
        liveDemo: "https://sushant-jpg.github.io/ecom.github.io/",
        github: "https://github.com/sushant-jpg/ecom.github.io"
    },
    // Add more projects above as needed
];

// Render Projects
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => {
        const logoContent = project.logoImg
            ? `<img src="${project.logoImg}" alt="${project.title} logo" class="project-logo-img">`
            : project.logo;

        return `
        <div class="project-card">
            <div class="project-logo">${logoContent}</div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-links">
                <a href="${project.liveDemo}" target="_blank" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
                <a href="${project.github}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> GitHub
                </a>
            </div>
        </div>
    `;
    }).join('');
}

// Sample Certificates Data
const certificates = [
    { name: "Full Stack Development", issuer: "Coursera" },
    { name: "React Certification", issuer: "FreeCodeCamp" },
    { name: "Node.js Mastery", issuer: "Udemy" },
    { name: "Cybersecurity Fundamentals", issuer: "Coursera" }
];

// Render Certificates
function renderCertificates() {
    const certificatesGrid = document.querySelector('.certificates-grid');
    if (!certificatesGrid) return;

    certificatesGrid.innerHTML = certificates.map(cert => `
        <div class="certificate-card">
            <i class="fas fa-certificate" style="font-size: 3rem; color: var(--primary-purple); margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-white); margin-bottom: 0.5rem;">${cert.name}</h3>
            <p style="color: var(--text-gray);">${cert.issuer}</p>
        </div>
    `).join('');
}

// Sample Tech Stack Data
const techStack = [
    { name: "Python", icon: "🐍" },
    { name: "JavaScript", icon: "📜" },
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "MongoDB", icon: "🍃" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Cybersecurity", icon: "🔒" },
    { name: "Network Security", icon: "🛡️" }
];

// Render Tech Stack
function renderTechStack() {
    const techstackGrid = document.querySelector('.techstack-grid');
    if (!techstackGrid) return;

    techstackGrid.innerHTML = techStack.map(tech => `
        <div class="tech-item">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${tech.icon}</div>
            <h3 style="color: var(--text-white);">${tech.name}</h3>
        </div>
    `).join('');
}

// Initialize all renders
renderProjects();
renderCertificates();
renderTechStack();

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // You can integrate with a backend service here
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Comment Form Handling
const commentForm = document.getElementById('commentForm');
if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // You can integrate with a backend service here
        alert('Thank you for your comment!');
        commentForm.reset();
    });
}

// Download CV Button
const downloadCV = document.getElementById('downloadCV');
if (downloadCV) {
    downloadCV.addEventListener('click', (e) => {
        e.preventDefault();
        const cvUrl = 'images/sushantbhandari-cv.jpg';
        // lightweight existence check before triggering download
        fetch(cvUrl, { method: 'HEAD' })
            .then((res) => {
                if (!res.ok) throw new Error('missing');
                const link = document.createElement('a');
                link.href = cvUrl;
                link.download = 'Sushant_Bhandari_CV.jpg';
                link.click();
            })
            .catch(() => {
                alert('CV file not found. Please add images/sushantbhandari-cv.jpg to the project.');
            });
    });
}

// Update active nav on page load
updateActiveNav();

