document.addEventListener('DOMContentLoaded', function () {
    initStepsGuides();
});

// 支持Shopify的Section重新加载
document.addEventListener('shopify:section:load', function (event) {
    initStepsGuides();
});

// 初始化所有步骤指南
function initStepsGuides() {
    const sidebarGuide = document.querySelectorAll('[id^="sidebar-guide-"]');
    sidebarGuide.forEach(guide => {
        new Next(guide);
    });

    // 如果调试需要，可以取消注释以下代码
    console.log('Steps guides initialized:', stepsGuides.length);
}

class Next {
    constructor(container) {
        // 保存容器和ID
        this.container = container;
        this.id = container.id.split('-').pop();

        // 查找元素
        this.slidesWrapper = this.container.querySelector('.progress-slides-wrapper');
        this.slides = this.container.querySelectorAll('.progress-slide');
        this.prevButton = this.container.querySelector('.progress-nav-button.prev');
        this.nextButton = this.container.querySelector('.progress-nav-button.next');
        this.indicators = this.container.querySelectorAll('.progress-indicator');
        this.overlay = this.modalContainer.querySelector('.progress-modal-overlay');
        // 绑定遮罩层点击事件
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeModal());
        }
        // 确保点击弹窗内部不会关闭
        this.modal = this.modalContainer.querySelector('.progress-modal');
        this.modal.addEventListener('click', (e) => e.stopPropagation());
        // 初始化状态
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;

        // 调试信息
        console.log(`Initializing steps guide #${this.id} with ${this.totalSlides} slides`);

        // 如果至少有一张幻灯片，则初始化
        if (this.totalSlides > 0) {
            this.init();
        }
    }
    closeModal() {
        this.modalContainer.style.display = 'none';
        document.body.style.overflow = ''; // 恢复滚动
    }


    init() {
        // 确保初始状态正确
        this.updateSlideState();

        // 绑定按钮事件
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }

        // 绑定指示器事件
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // 添加键盘导航
        this.container.setAttribute('tabindex', '0');
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // 添加触摸滑动支持
        this.enableTouchSwipe();
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideState();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlideState();
            console.log('nextSlide');

        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateSlideState();
        }
    }

    updateSlideState() {
        // 更新滑动位置
        if (this.slidesWrapper) {
            this.slidesWrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }

        // 更新指示器状态
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // 更新按钮状态
        if (this.prevButton) {
            this.prevButton.disabled = this.currentSlide === 0;
        }

        if (this.nextButton) {
            this.nextButton.disabled = this.currentSlide === this.totalSlides - 1;
        }
    }

    enableTouchSwipe() {
        if (!this.slidesWrapper) return;

        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50; // 最小滑动距离

        this.slidesWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.slidesWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;

            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }
}