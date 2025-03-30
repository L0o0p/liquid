class StepsGuide {
    constructor(container) {
        this.container = container;
        this.slideContainer = container.querySelector('.steps-guide__slides');
        this.slides = container.querySelectorAll('.steps-guide__slide');
        this.prevButton = container.querySelector('.steps-guide__prev');
        this.nextButton = container.querySelector('.steps-guide__next');
        this.indicators = container.querySelectorAll('.steps-guide__indicator');

        this.currentIndex = 0;
        this.slidesCount = this.slides.length;

        this.init();
    }

    init() {
        // 添加事件监听器
        this.prevButton.addEventListener('click', () => this.goToSlide(this.currentIndex - 1));
        this.nextButton.addEventListener('click', () => this.goToSlide(this.currentIndex + 1));

        // 为指示器添加点击事件
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // 触摸滑动支持
        this.enableTouchSwipe();

        // 设置可访问性
        this.setupAccessibility();
    }

    goToSlide(index) {
        // 规范化索引（循环滚动）
        if (index < 0) {
            index = this.slidesCount - 1;
        } else if (index >= this.slidesCount) {
            index = 0;
        }

        // 更新当前索引
        this.currentIndex = index;

        // 更新滑块位置
        this.slideContainer.style.transform = `translateX(-${index * 100}%)`;

        // 更新活动指示器
        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        // 更新轮播slide的active类
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    enableTouchSwipe() {
        let startX, moveX, threshold = 100;

        this.slideContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.slideContainer.addEventListener('touchmove', (e) => {
            if (!startX) return;
            moveX = e.touches[0].clientX;

            // 阻止页面滚动
            // e.preventDefault();
        }, { passive: true });

        this.slideContainer.addEventListener('touchend', () => {
            if (!startX || !moveX) return;

            const diff = startX - moveX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // 向左滑 -> 下一张
                    this.goToSlide(this.currentIndex + 1);
                } else {
                    // 向右滑 -> 上一张
                    this.goToSlide(this.currentIndex - 1);
                }
            }

            // 重置
            startX = null;
            moveX = null;
        }, { passive: true });
    }

    setupAccessibility() {
        // 设置轮播的ARIA属性
        this.slideContainer.setAttribute('aria-roledescription', 'carousel');
        this.slideContainer.setAttribute('aria-live', 'polite');

        // 设置每个slide的ARIA属性
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${index + 1} of ${this.slidesCount}`);
        });
    }
}

// 初始化所有的步骤指南组件
document.addEventListener('DOMContentLoaded', () => {
    const stepsGuides = document.querySelectorAll('.steps-guide');
    stepsGuides.forEach(guide => {
        new StepsGuide(guide);
    });
});