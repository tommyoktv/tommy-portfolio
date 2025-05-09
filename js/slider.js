document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    let isAnimating = false;

    function updateSlider(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const previousSlide = currentSlide;
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

        // Reset active states
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');

        // Position slides
        slides[previousSlide].style.transform = `translateX(${-direction * 100}%)`;
        slides[currentSlide].style.transform = `translateX(${direction > 0 ? 100 : -100}%)`;
        
        // Force reflow
        slides[currentSlide].offsetHeight;

        // Add transition
        slides.forEach(slide => slide.style.transition = 'transform 0.5s ease');
        slides[previousSlide].style.transform = 'translateX(0)';
        slides[currentSlide].style.transform = 'translateX(0)';

        // Reset after animation
        setTimeout(() => {
            slides.forEach(slide => slide.style.transition = 'none');
            isAnimating = false;
        }, 500);
    }

    // Navigation controls
    document.querySelector('.prev').addEventListener('click', () => updateSlider(-1));
    document.querySelector('.next').addEventListener('click', () => updateSlider(1));

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isAnimating || index === currentSlide) return;
            const direction = index > currentSlide ? 1 : -1;
            updateSlider(direction);
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            // Trigger previous slide
            const prevBtn = document.querySelector('.slider-nav.prev');
            prevBtn && prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            // Trigger next slide
            const nextBtn = document.querySelector('.slider-nav.next');
            nextBtn && nextBtn.click();
        }
    });
});