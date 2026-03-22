// ========================================
// Fawad Homaan Portfolio - Main JavaScript
// ========================================

// Initialize AOS Animation Library
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// ========================================
// Dark Mode Toggle with LocalStorage
// ========================================
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', currentTheme === 'dark');

// Function to toggle theme
function toggleTheme() {
    html.classList.toggle('dark');
    const theme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

// Event listeners for theme toggles
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
}

// ========================================
// Mobile Menu Toggle
// ========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // Animate hamburger icon
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// ========================================
// Sticky Navbar Effect
// ========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
        navbar.classList.replace('py-4', 'py-2');
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.classList.replace('py-2', 'py-4');
    }
});

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Typing Animation for Hero Section
// ========================================
const typingTextElement = document.getElementById('typing-text');
const roles = [
    'Frontend Developer',
    'IT/Webmaster',
    'Computer Science Student',
    'Language Instructor'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRoles() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeRoles, typingSpeed);
}

// Start typing animation on page load
document.addEventListener('DOMContentLoaded', typeRoles);

// ========================================
// Scroll to Top Button
// ========================================
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.remove('opacity-0', 'invisible');
        scrollToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        scrollToTopBtn.classList.add('opacity-0', 'invisible');
        scrollToTopBtn.classList.remove('opacity-100', 'visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// Active Navigation Link Highlighter
// ========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('text-blue-500');
                link.classList.add('hover:text-blue-500');
            });
            
            if (navLink) {
                navLink.classList.remove('hover:text-blue-500');
                navLink.classList.add('text-blue-500');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ========================================
// Contact Form Handler (Formspree Integration)
// ========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        // Let Formspree handle the submission normally
        // We'll just add validation and UI feedback
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Simple validation
        if (!name || !email || !message) {
            e.preventDefault(); // Prevent submission
            showNotification('Please fill in all fields', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault(); // Prevent submission
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitButton.disabled = true;
        
        // Let Formspree handle the actual submission via AJAX
        e.preventDefault();
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                const errorData = await response.json();
                showNotification(errorData.error || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('Network error. Please check your connection and try again.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
        
        return false;
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 translate-x-full opacity-0 z-50 max-w-sm ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 hover:opacity-75">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('translate-x-0', 'opacity-100');
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========================================
// Skill Bar Animation on Scroll
// ========================================
const skillBars = document.querySelectorAll('.skill-bar-fill');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
            skillBarObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillBars.forEach(bar => {
    skillBarObserver.observe(bar);
});

// ========================================
// Dynamic Year in Footer
// ========================================
const yearElement = document.getElementById('current-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ========================================
// Parallax Effect for Hero Section
// ========================================
const heroSection = document.getElementById('home');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroSection && scrolled < heroSection.offsetHeight) {
        const parallaxElements = heroSection.querySelectorAll('.animate-float');
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }
});

// ========================================
// Image Lazy Loading Enhancement
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ========================================
// Performance Optimization - Debounce Function
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Add Loading Animation
// ========================================
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, index * 50);
        });
    }, 100);
});

// ========================================
// Console Easter Egg
// ========================================
console.log('%c👋 Hello, Developer!', 'color: #3b82f6; font-size: 24px; font-weight: bold;');
console.log('%c💼 Looking at my portfolio code? That\'s awesome!', 'color: #8b5cf6; font-size: 16px;');
console.log('%c🚀 Built with HTML, CSS, JavaScript & Tailwind CSS', 'color: #10b981; font-size: 14px;');
console.log('%c📧 Want to connect? Reach out at Fawadhomaan@gmail.com', 'color: #f59e0b; font-size: 14px;');

// ========================================
// End of JavaScript
// ========================================
