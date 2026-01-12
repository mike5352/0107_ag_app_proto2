// Roulette Image Carousel - Drag to browse 10 images
class RouletteCarousel {
    constructor() {
        this.container = document.getElementById('roulette-container');
        this.track = document.getElementById('roulette-track');

        if (!this.container || !this.track) return;

        this.images = this.track.querySelectorAll('.roulette-img');
        this.totalImages = this.images.length;
        this.currentIndex = 0;

        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        this.imageWidth = this.container.offsetWidth;

        this.init();
    }

    init() {
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.touchStart(e));
        this.container.addEventListener('touchmove', (e) => this.touchMove(e));
        this.container.addEventListener('touchend', () => this.touchEnd());

        // Mouse events
        this.container.addEventListener('mousedown', (e) => this.touchStart(e));
        this.container.addEventListener('mousemove', (e) => this.touchMove(e));
        this.container.addEventListener('mouseup', () => this.touchEnd());
        this.container.addEventListener('mouseleave', () => {
            if (this.isDragging) this.touchEnd();
        });

        // Prevent context menu on long press
        this.container.addEventListener('contextmenu', (e) => e.preventDefault());

        // Handle window resize
        window.addEventListener('resize', () => {
            this.imageWidth = this.container.offsetWidth;
            this.setPositionByIndex();
        });

        // Set initial position
        this.setPositionByIndex();
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    touchStart(e) {
        this.isDragging = true;
        this.startX = this.getPositionX(e);
        this.track.style.transition = 'none';

        // Hide hint after first interaction
        const hint = this.container.querySelector('.drag-hint');
        if (hint) {
            hint.style.opacity = '0';
            setTimeout(() => hint.style.display = 'none', 300);
        }
    }

    touchMove(e) {
        if (!this.isDragging) return;

        const currentPosition = this.getPositionX(e);
        const diff = currentPosition - this.startX;
        this.currentTranslate = this.prevTranslate + diff;

        this.setSliderPosition();
    }

    touchEnd() {
        this.isDragging = false;

        const movedBy = this.currentTranslate - this.prevTranslate;

        // Determine direction and snap to next/prev image with infinite loop
        if (movedBy < -50) {
            // Swiped left - go to next image
            this.currentIndex++;
            // Loop to first image if at the end
            if (this.currentIndex >= this.totalImages) {
                this.currentIndex = 0;
            }
        } else if (movedBy > 50) {
            // Swiped right - go to previous image
            this.currentIndex--;
            // Loop to last image if at the beginning
            if (this.currentIndex < 0) {
                this.currentIndex = this.totalImages - 1;
            }
        }

        this.setPositionByIndex();
    }

    setPositionByIndex() {
        this.currentTranslate = this.currentIndex * -this.imageWidth;
        this.prevTranslate = this.currentTranslate;
        this.track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.setSliderPosition();
    }

    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new RouletteCarousel();
});
