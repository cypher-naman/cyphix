// script.js
// Add interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add click animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Add parallax effect to floating elements
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;
        
        const floatingElements = document.querySelectorAll('.floating-icon');
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.015;
            const x = (mouseX - 50) * speed;
            const y = (mouseY - 50) * speed;
            element.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Parallax effect for iPhone
        const iPhone = document.querySelector('.iphone-mockup');
        if (iPhone) {
            const xMove = (mouseX - 50) * 0.01;
            const yMove = (mouseY - 50) * 0.01;
            iPhone.style.transform = `rotate(-5deg) translate(${xMove}px, ${yMove}px)`;
        }
    });
});