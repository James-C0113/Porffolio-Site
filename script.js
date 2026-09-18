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

// ==================== TESTIMONIALS SLIDER ====================
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;
const totalSlides = dots.length;
let autoPlayInterval;

function updateSlider() {
    if (!track) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        const isActive = index === currentSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoPlay();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 6000);
}

if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-index')));
    });
});

// Start autoplay
if (totalSlides > 0) autoPlayInterval = setInterval(nextSlide, 6000);

// Pause on hover
const testimonialWrapper = document.querySelector('.testimonials-wrapper');
if (testimonialWrapper) {
    testimonialWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    testimonialWrapper.addEventListener('mouseleave', resetAutoPlay);
}

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
                body: new FormData(form)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast('Message sent successfully! I\'ll get back to you soon.', false);
                form.reset();
            } else {
                showToast('Something went wrong. Please try WhatsApp instead.', true);
            }
        } catch (error) {
            showToast('Connection error. Please try WhatsApp instead.', true);
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

    
