document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.querySelector('#form-feedback');
    const feedbackBtns = document.querySelectorAll('.btn-feedback');
    const feedbackBottomBtn = document.querySelector('#btn-feedback-bottom');
    const formBackdrop = document.querySelector('#form-backdrop');
    const feedbackCloseBtn = document.querySelector('#btn-close');
    let feedbackFormOpen = false;

    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: false,
        pagination: { el: '.swiper-pagination' },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        on: {
            afterInit: (e) => e.slides[e.activeIndex].classList.add('swiper-slide-seen'),
            slideChangeTransitionStart: (e) => feedbackBottomBtn.classList.toggle('active', e.activeIndex >= 4 && e.activeIndex != 15),
            slideChangeTransitionEnd: (e) => {
                const activeSlide = e.slides[e.activeIndex];
                activeSlide.classList.add('swiper-slide-seen');
                if (activeSlide.classList.contains('slide-16')) morphHue();
                // window.location.hash = activeSlide.id;
                // const hash = `#${activeSlide.id}`;
                // if (window.location.hash !== hash) window.history.replaceState(null, null, hash);
            },
        },
    });

    // slowly morph the hue of the background image of .slide-16

    const slide16 = document.querySelector('.slide-16');
    let hue = 0;

    const morphHue = () => {
        hue = (hue + 0.25) % 360;
        slide16.style.filter = `hue-rotate(${hue}deg)`;
        requestAnimationFrame(morphHue);
    };

    // map left/right arrow keys to prev/next slide

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') swiper.slidePrev();
        if (e.key === 'ArrowRight') swiper.slideNext();
    });

    // feedback form UI

    const feedbackFormHandler = (isOpen) => {
        feedbackFormOpen = isOpen;
        feedbackFormOpen ? feedbackForm.classList.add('active') : feedbackForm.classList.remove('active');
        feedbackFormOpen ? formBackdrop.classList.add('active') : formBackdrop.classList.remove('active');

        if (feedbackFormOpen) {
            // after a timeout of 500ms, focus on the first input
            setTimeout(() => feedbackForm.querySelector('#name').focus(), 500);
        } else {
            document.activeElement.blur();
        }
    };

    // for each feedbackBtns, add a click event listener to open the feedback form

    feedbackBtns.forEach((btn) => {
        btn.addEventListener('click', () => feedbackFormHandler(true));
    });

    formBackdrop.addEventListener('click', () => feedbackFormHandler(false));
    feedbackCloseBtn.addEventListener('click', () => feedbackFormHandler(false));

    // function to check for anchor link and, if exists, slide to it

    const slideToAnchor = () => {
        const anchor = window.location.hash.slice(1); // Remove '#'
        if (anchor) {
            const targetSlide = document.getElementById(anchor);
            if (targetSlide) {
                const targetIndex = Array.from(targetSlide.parentElement.children).indexOf(targetSlide);
                swiper.slideTo(targetIndex);
            }
        }
    };

    // slideToAnchor();

    // window.addEventListener('hashchange', slideToAnchor);

    document.querySelector('#btn-start').addEventListener('click', () => swiper.slideNext());
});
