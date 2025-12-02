/* ============================
   script.js (full replacement)
   ============================ */

/* Debounce helper */
function debounce(fn, wait = 120) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* Set --nav-height CSS variable to match the actual navbar height */
function setNavHeightCSSVar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const h = Math.round(navbar.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--nav-height', `${h}px`);
}
window.addEventListener('resize', debounce(setNavHeightCSSVar, 120));
document.addEventListener('DOMContentLoaded', setNavHeightCSSVar);

/* Image fade-in and fallback handling */
function initImageLoading() {
  const imgs = document.querySelectorAll('img.screenshot');
  imgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity .45s ease';
    // show fallback text if error
    img.addEventListener('error', () => {
      const fallback = img.parentElement.querySelector('.fallback-text');
      if (fallback) { fallback.style.display = 'flex'; }
      img.style.display = 'none';
    }, { once: true, passive: true });

    if (img.complete && img.naturalWidth) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      }, { once: true, passive: true });
    }
  });
}

/* Ripple effect for buttons */
function createRipple(e) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const diameter = Math.max(rect.width, rect.height);
  const circle = document.createElement('span');

  circle.className = 'ripple';
  circle.style.width = circle.style.height = `${diameter}px`;

  const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
  const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

  circle.style.left = `${clientX - rect.left - diameter/2}px`;
  circle.style.top = `${clientY - rect.top - diameter/2}px`;

  const existing = button.getElementsByClassName('ripple')[0];
  if (existing) existing.remove();
  button.appendChild(circle);

  setTimeout(() => { if (circle && circle.parentNode) circle.parentNode.removeChild(circle); }, 650);
}

/* Initialize page interactions */
document.addEventListener('DOMContentLoaded', () => {
  setNavHeightCSSVar();
  initImageLoading();

  // Apply ripple to common buttons
  const buttons = document.querySelectorAll('.cta-button, .donate-btn, .back-button');
  buttons.forEach(btn => {
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = btn.style.overflow || 'hidden';
    btn.addEventListener('click', createRipple);
    btn.addEventListener('touchstart', createRipple, { passive: true });
  });

  // Optional: fade-in stacked mockups using IntersectionObserver
  const verticalMocks = document.querySelectorAll('.phone-mockups-vertical .iphone-mockup');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    verticalMocks.forEach((m) => {
      m.style.opacity = '0';
      m.style.transform = 'translateY(12px)';
      m.style.transition = 'opacity .6s ease, transform .6s ease';
      obs.observe(m);
    });
  } else {
    // fallback show immediately
    verticalMocks.forEach(m => { m.style.opacity = '1'; });
  }
});
