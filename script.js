// Smooth scroll with active state
// Smooth scroll with active state
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Add active state animation
        this.classList.add('button');
        setTimeout(() => this.classList.remove('button'), 200);

        // Smooth scroll
        const target = this.getAttribute('href') === '#top' 
            ? document.documentElement 
            : document.querySelector(this.getAttribute('href'));

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Navbar effect on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
    }
});

// Add fade-in animation for elements
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let isAnimating = false;
    let slideInterval;
    let pauseTimeout;

    let dragStartX = 0;
    let currentX = 0;
    let isDragging = false;

    function resetAutoSlide() {
        clearInterval(slideInterval);
        clearTimeout(pauseTimeout);
        
        // Pause selama 7 detik sebelum memulai autoslide lagi
        pauseTimeout = setTimeout(() => {
            startAutoSlide();
        }, 7000);
    }

    function dragStart(e) {
        if (isAnimating) return;
        isDragging = true;
        dragStartX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        currentX = dragStartX;

        // Siapkan semua slide yang berdekatan
        slides.forEach((slide, index) => {
            slide.style.transition = 'none';
            slide.style.opacity = '1';
            
            if (index === currentSlide) {
                slide.style.transform = 'translateX(0)';
            } else if (index === (currentSlide + 1) % slides.length) {
                slide.style.transform = 'translateX(100%)';
                slide.style.left = '0';
            } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                slide.style.transform = 'translateX(-100%)';
                slide.style.left = '0';
            }
        });
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = (clientX - dragStartX) / window.innerWidth * 100;

        // Geser semua slide secara bersamaan
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.transform = `translateX(${deltaX}%)`;
            } else if (index === (currentSlide + 1) % slides.length) {
                slide.style.transform = `translateX(${100 + deltaX}%)`;
            } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                slide.style.transform = `translateX(${-100 + deltaX}%)`;
            }
        });
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const clientX = e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX;
        const deltaX = clientX - dragStartX;
        const threshold = window.innerWidth * 0.2;

        slides.forEach(slide => {
            slide.style.transition = 'transform 0.3s ease-out';
        });

        if (Math.abs(deltaX) > threshold) {
            const targetIndex = deltaX > 0 
                ? (currentSlide - 1 + slides.length) % slides.length
                : (currentSlide + 1) % slides.length;
            
            // Animasi ke slide berikutnya/sebelumnya
            slides[currentSlide].style.transform = deltaX > 0 ? 'translateX(100%)' : 'translateX(-100%)';
            slides[targetIndex].style.transform = 'translateX(0)';
            
            // Update state dan dots
            currentSlide = targetIndex;
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });

            resetAutoSlide(); // Reset timer saat swipe berhasil
        } else {
            // Kembalikan ke posisi awal
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.style.transform = 'translateX(0)';
                } else if (index === (currentSlide + 1) % slides.length) {
                    slide.style.transform = 'translateX(100%)';
                } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                    slide.style.transform = 'translateX(-100%)';
                }
            });
        }

        // Reset opacity slides yang tidak aktif setelah transisi
        setTimeout(() => {
            slides.forEach((slide, index) => {
                if (index !== currentSlide) {
                    slide.style.opacity = '0';
                }
            });
        }, 300);
    }

    // Update event listeners with proper options
    const slider = document.querySelector('.slider');
    slider.addEventListener('mousedown', dragStart, { passive: true });
    slider.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('mousemove', dragMove, { passive: false });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mouseleave', dragEnd);

    // Prevent context menu on slider
    slider.addEventListener('contextmenu', e => e.preventDefault());

    function moveSlide(nextIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;
        resetAutoSlide();

        const nextSlide = slides[nextIndex];
        const currentSlideElement = slides[currentSlide];

        // Reset all slides
        slides.forEach(slide => {
            slide.style.transition = 'none';
            slide.style.opacity = '0';
        });

        // Set up initial positions
        requestAnimationFrame(() => {
            // Show only the two slides we're working with
            [currentSlideElement, nextSlide].forEach(slide => {
                slide.style.opacity = '1';
                slide.style.transition = 'none';
            });

            // Position slides
            currentSlideElement.style.transform = 'translateX(0)';
            nextSlide.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';

            // Start animation
            requestAnimationFrame(() => {
                const transition = 'transform 0.35s ease-out';
                [currentSlideElement, nextSlide].forEach(slide => {
                    slide.style.transition = transition;
                });

                currentSlideElement.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
                nextSlide.style.transform = 'translateX(0)';

                // Update current slide
                currentSlide = nextIndex;

                // Update indicators after position is set
                const dots = document.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.classList.remove('active');
                });
                dots[nextIndex].classList.add('active');

                setTimeout(() => {
                    isAnimating = false;
                }, 350);
            });
        });
    }

    function moveSlideComplex(targetIndex) {
        if (isAnimating || targetIndex === currentSlide) return;
        const direction = targetIndex > currentSlide ? 'next' : 'prev';
        moveSlide(targetIndex, direction);
    }

    prevBtn.onclick = () => {
        if (!isAnimating) {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            moveSlide(prevIndex, 'prev');
        }
    };

    nextBtn.onclick = () => {
        if (!isAnimating) {
            const nextIndex = (currentSlide + 1) % slides.length;
            moveSlide(nextIndex, 'next');
        }
    };

    slides.forEach((slide, index) => {
        slide.style.opacity = index === 0 ? '1' : '0';
        slide.style.transform = index === 0 ? 'translateX(0)' : 'translateX(100%)';
        
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => {
            if (!isAnimating && index !== currentSlide) {
                moveSlideComplex(index);
            }
        };
        dotsContainer.appendChild(dot);
    });

    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            if (!isAnimating && !isDragging) {
                const nextIndex = (currentSlide + 1) % slides.length;
                moveSlide(nextIndex, 'next');
            }
        }, 7000);
    }

    startAutoSlide();
}

// Theme toggle functionality
function initThemeToggle() {
    const navControls = document.createElement('div');
    navControls.className = 'nav-controls';
    
    // Move nav-menu items to nav-controls
    const navMenu = document.querySelector('.nav-menu');
    navControls.appendChild(navMenu);
    
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
        </svg>
    `;
    
    navControls.appendChild(themeToggle);
    document.querySelector('.navbar').appendChild(navControls);

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? `
            <svg viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
            </svg>
        ` : `
            <svg viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initThemeToggle();
});
