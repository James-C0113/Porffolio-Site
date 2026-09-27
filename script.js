// ==================== LOADER ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 2000);
});

// ==================== NAVIGATION ====================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');

// Theme preference
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') document.documentElement.dataset.theme = 'light';

function updateThemeToggle() {
    if (!themeToggle) return;
    const isLight = document.documentElement.dataset.theme === 'light';
    themeToggle.setAttribute('aria-pressed', isLight);
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.innerHTML = `<i class="fas fa-${isLight ? 'moon' : 'sun'}" aria-hidden="true"></i>`;
}

function updateThemeIcons() {
    const isLight = document.documentElement.dataset.theme === 'light';
    document.querySelectorAll('img[data-light-src][data-dark-src]').forEach(img => {
        img.src = isLight ? img.dataset.lightSrc : img.dataset.darkSrc;
    });
}

updateThemeToggle();
updateThemeIcons();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.dataset.theme === 'light';
        document.documentElement.dataset.theme = isLight ? 'dark' : 'light';
        localStorage.setItem('portfolio-theme', isLight ? 'dark' : 'light');
        updateThemeToggle();
        updateThemeIcons();
    });
}

// Scroll effect
window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        const isActive = menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ==================== INTERSECTION OBSERVER ====================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '-50px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal, .fade-left, .fade-right, .stagger').forEach(el => {
    revealObserver.observe(el);
});

// ==================== SKILL BARS ====================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-progress').forEach(bar => {
    skillObserver.observe(bar);
});

// ==================== SKILL GROUP TOGGLE ====================
const showMoreSkillsBtn = document.getElementById('showMoreSkills');
const skillGroups = document.querySelectorAll('.skill-group');

if (showMoreSkillsBtn && skillGroups.length > 2) {
    let isExpanded = false;
    const hiddenGroups = Array.from(skillGroups).slice(2);

    const updateSkillsToggle = () => {
        hiddenGroups.forEach(group => {
            group.classList.toggle('is-collapsed', !isExpanded);
        });

        showMoreSkillsBtn.setAttribute('aria-expanded', String(isExpanded));
        const text = showMoreSkillsBtn.querySelector('.show-more-text');
        const icon = showMoreSkillsBtn.querySelector('i');

        if (text) text.textContent = isExpanded ? 'Show Less' : 'Show More';
        if (icon) icon.classList.toggle('fa-chevron-up', isExpanded);
        if (icon) icon.classList.toggle('fa-chevron-down', !isExpanded);
    };

    updateSkillsToggle();
    showMoreSkillsBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        updateSkillsToggle();
    });
}

// ==================== PROJECT MODAL ====================
const projectModalData = {
    llmvault: {
        title: 'LLMVault',
        tags: ['LLM Security', 'Cyber Lab'],
        summary: 'A practical LLM security lab focused on prompt injection, RAG abuse, agent misuse, and data leakage risks through realistic training scenarios.',
        stack: ['Python', 'Flask', 'Ollama'],
        liveUrl: 'https://james-vault.vercel.app/',
        githubUrl: 'https://github.com/jamescarter/llm-vault',
        image: 'project-image-one'
    },
    htmlcreator: {
        title: 'HTML Creator',
        tags: ['HTML', 'Web Design'],
        summary: 'A fast HTML generation workspace for creating organized, responsive pages with reusable sections and clean semantic layouts.',
        stack: ['HTML', 'CSS', 'JavaScript'],
        liveUrl: 'https://html-creator-next.vercel.app/',
        githubUrl: 'https://github.com/jamescarter/html-creator',
        image: 'project-image-two'
    },
    commerceapi: {
        title: 'Multi-Vendor Commerce API',
        tags: ['Marketplace', 'Payments'],
        summary: 'A marketplace backend for vendor management, inventory control, order orchestration, and secure buyer-seller workflows.',
        stack: ['Python', 'FastAPI', 'AWS'],
        liveUrl: 'https://e-commerce-client-ten-sigma.vercel.app',
        githubUrl: 'https://github.com/jamescarter/marketplace-api',
        image: 'project-image-three'
    },
    datapulse: {
        title: 'DataPulse Analytics',
        tags: ['Analytics', 'Dashboard'],
        summary: 'An insight dashboard for monitoring revenue trends, conversion metrics, and key operational signals through a clear executive interface.',
        stack: ['React', 'Charts', 'Node'],
        liveUrl: '#',
        githubUrl: 'https://github.com/jamescarter/data-pulse',
        image: 'project-image-four'
    },
    promptflow: {
        title: 'PromptFlow Studio',
        tags: ['AI', 'Automation'],
        summary: 'A workflow studio for building AI task chains, reusable prompts, and operational automations across internal and client-facing processes.',
        stack: ['Python', 'OpenAI', 'FastAPI'],
        liveUrl: '#',
        githubUrl: 'https://github.com/jamescarter/prompt-flow',
        image: 'project-image-five'
    },
    clientflow: {
        title: 'ClientFlow CRM',
        tags: ['CRM', 'Workflow'],
        summary: 'A client operations platform built to centralize deals, workflows, onboarding steps, and communication tracking for service businesses.',
        stack: ['Next.js', 'PostgreSQL', 'Auth'],
        liveUrl: '#',
        githubUrl: 'https://github.com/jamescarter/client-flow-crm',
        image: 'project-image-six'
    }
};

const projectModal = document.getElementById('projectModal');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalSummary = document.getElementById('projectModalSummary');
const projectModalImage = document.getElementById('projectModalImage');
const projectModalDemo = document.getElementById('projectModalDemo');
const projectModalGithub = document.getElementById('projectModalGithub');

function openProjectModal(projectKey) {
    const project = projectModalData[projectKey];
    if (!project || !projectModal) return;

    projectModalTitle.textContent = project.title;
    projectModalSummary.textContent = project.summary;
    projectModalImage.className = `project-modal-image ${project.image}`;

    if (projectModalDemo) {
        projectModalDemo.href = project.liveUrl || '#';
        projectModalDemo.style.display = project.liveUrl ? 'inline-flex' : 'none';
    }

    if (projectModalGithub) {
        projectModalGithub.href = project.githubUrl || '#';
        projectModalGithub.style.display = project.githubUrl ? 'inline-flex' : 'none';
    }

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.portfolio-video-card').forEach(card => {
    const projectKey = card.dataset.project;
    if (!projectKey) return;

    card.addEventListener('click', () => openProjectModal(projectKey));
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProjectModal(projectKey);
        }
    });
});

if (projectModal) {
    projectModal.addEventListener('click', (event) => {
        if (event.target.matches('[data-close-modal="true"]') || event.target === projectModal) {
            closeProjectModal();
        }
    });

    const modalCloseButton = document.querySelector('.project-modal-close');
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeProjectModal);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

// ==================== NUMBER COUNTER ====================
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.getAttribute('data-count')) || 0;
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeProgress * target);
                
                entry.target.textContent = current + '+';
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    entry.target.textContent = target + '+';
                }
            };
            
            requestAnimationFrame(updateCount);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(num => {
    countObserver.observe(num);
});

// ==================== FORM SUBMISSION ====================
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();
        
        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', true);
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', true);
            return;
        }
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        }
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: new FormData(form)
            });

            let data = { success: false };
            try {
                data = await response.json();
            } catch {
                data = { success: false };
            }

            if (response.ok && data.success) {
                showToast('Message sent successfully! I\'ll get back to you soon.', false);
                form.reset();
            } else {
                const errorMessage = data?.message || data?.error || 'Something went wrong while sending the message.';
                showToast(errorMessage, true);
            }
        } catch (error) {
            const message = location.protocol === 'file:'
                ? 'Please open this site through a local server or live website before sending.'
                : 'Connection error. Please try WhatsApp instead.';
            showToast(message, true);
        }
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
        }
    });
}

function showToast(message, isError = false) {
    if (!toast || !toastMessage) return;
    const icon = toast.querySelector('i');
    toastMessage.textContent = message;
    toast.classList.toggle('error', isError);
    if (icon) icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
});

// ==================== ACTIVE NAV LINK ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50%'
});

sections.forEach(section => navObserver.observe(section));

// ==================== PARALLAX FOR HERO ORBS ====================
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.hero-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

    
