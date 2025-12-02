// ============================
// script.js (updated)
// ============================

// Mobile Carousel Functionality
let currentSlide = 0;
const totalSlides = 5; // change if you add/remove slides

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (!slides.length) return;

    // Remove active from current
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    // Next index
    currentSlide += direction;

    if (currentSlide >= totalSlides) { currentSlide = 0; }
    else if (currentSlide < 0) { currentSlide = totalSlides - 1; }

    // Add active to new
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length || slideIndex < 0 || slideIndex >= slides.length) return;

    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = slideIndex;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

// Auto-advance carousel (optional)
let autoAdvanceTimer = null;
function startAutoAdvance(interval = 5000) {
    stopAutoAdvance();
    autoAdvanceTimer = setInterval(() => { changeSlide(1); }, interval);
}
function stopAutoAdvance() {
    if (autoAdvanceTimer) { clearInterval(autoAdvanceTimer); autoAdvanceTimer = null; }
}

// Touch/Swipe functionality for mobile
let startX = 0;
let endX = 0;
function handleTouchStart(e) { startX = e.touches[0].clientX; }
function handleTouchEnd(e)   { endX   = e.changedTouches[0].clientX; handleSwipe(); }
function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) changeSlide(1);
        else changeSlide(-1);
    }
}

// Intersection Observer for reveal animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Parallax effect for floating elements
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-icon');
    parallaxElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.04);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.08}deg)`;
    });
}

// Throttled scroll update for performance
let ticking = false;
function updateParallax() {
    parallaxEffect();
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.style.background = (window.scrollY > 100) ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.8)';
});

// Create ripple effect on button click
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    // Use clientX/Y for proper position in document
    const clientX = (event.touches && event.touches[0]) ? event.touches[0].clientX : event.clientX;
    const clientY = (event.touches && event.touches[0]) ? event.touches[0].clientY : event.clientY;

    circle.style.left = `${clientX - rect.left - radius}px`;
    circle.style.top  = `${clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const existing = button.getElementsByClassName('ripple')[0];
    if (existing) existing.remove();

    button.appendChild(circle);
}

// Add ripple style element only once
(function addRippleStyleToHead(){
    if (document.getElementById('fitsensei-ripple-style')) return;
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'fitsensei-ripple-style';
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms linear;
            background-color: rgba(255, 255, 255, 0.6);
            pointer-events: none;
        }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    `;
    document.head.appendChild(rippleStyle);
})();

// DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', function() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (carouselWrapper) {
        carouselWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
        // startAutoAdvance(); // enable if you want autoplay
    }

    // Keyboard navigation for mobile carousel
    document.addEventListener('keydown', function(e) {
        if (window.innerWidth <= 768) {
            if (e.key === 'ArrowLeft') changeSlide(-1);
            else if (e.key === 'ArrowRight') changeSlide(1);
        }
    });

    // Observe elements for reveal animations
    const animateElements = document.querySelectorAll('.iphone-mockup, .hero');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Set up image loading fade-in
    const images = document.querySelectorAll('.screenshot');
    images.forEach(img => {
        img.addEventListener('load', function() { this.style.opacity = '1'; });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        if (img.complete) img.style.opacity = '1';
    });

    // Apply ripple effect to select buttons
    const buttons = document.querySelectorAll('.cta-button, .carousel-btn, .back-button, .donate-btn');
    buttons.forEach(button => {
        button.style.position = button.style.position || 'relative';
        button.style.overflow = button.style.overflow || 'hidden';
        button.addEventListener('click', createRipple);
        // touchstart for mobile so ripple triggers immediately
        button.addEventListener('touchstart', createRipple, { passive: true });
    });

    // Init carousel dots & slides to first slide when mobile
    handleResize();

    // Accessibility shortcut: Ctrl/Cmd + D opens donate page in new tab
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
            window.open('donate.html', '_blank');
        }
    });
});

// Smooth anchor scrolling for on-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Throttled resize handler (debounce)
function debounce(func, wait = 250, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Handle window resize
const handleResize = debounce(function() {
    const isMobile = window.innerWidth <= 768;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots   = document.querySelectorAll('.dot');

    if (isMobile && slides.length) {
        currentSlide = 0;
        slides.forEach((slide, index) => slide.classList.toggle('active', index === 0));
        dots.forEach((dot, index) => dot.classList.toggle('active', index === 0));
    }

    // stop/start auto-advance depending on viewport (optional)
    // if (!isMobile) stopAutoAdvance();
    // else startAutoAdvance(5000);
}, 250);

window.addEventListener('resize', handleResize);

// Parallax update loop already hooked to scroll above

// End of script.js
