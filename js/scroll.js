let scrollTimer;

function showScrollbar() {
    document.body.classList.add('is-scrolling');
    
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
    }, 1500);
}

// Basic scroll detection
window.addEventListener('scroll', showScrollbar, { passive: true });

// Mouse wheel detection
window.addEventListener('wheel', showScrollbar, { passive: true });

// Track mouse position
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth - e.clientX <= 20) {
        showScrollbar();
    }
}, { passive: true });
