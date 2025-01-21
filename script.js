document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: false,

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },

        on: {
            afterInit: (e) => {
                const activeSlide = e.slides[e.activeIndex];
                activeSlide.classList.add('swiper-slide-seen');
            },
            slideChangeTransitionEnd: (e) => {
                const activeSlide = e.slides[e.activeIndex];
                activeSlide.classList.add('swiper-slide-seen');
                window.location.hash = activeSlide.id;
                window.history.replaceState(null, null, window.location.hash);

                // if the current slide is slide 5 or later, add an "active" class to the feeedback button (#btn-feedback)
                const btnFeedback = document.querySelector('#btn-feedback');
                if (e.activeIndex >= 4) {
                    btnFeedback.classList.add('active');
                } else {
                    btnFeedback.classList.remove('active');
                }
            },
        },
    });

    // event listener to add "active" class to the feedback form (#form-feedback) when clicked

    const btnFeedback = document.querySelector('#btn-feedback');
    const formFeedback = document.querySelector('#form-feedback');

    btnFeedback.addEventListener('click', () => {
        formFeedback.classList.add('active');
    });

    // event listener to remove "active" class from the feedback form (#form-feedback) when close button (#btn-close) is clicked

    const btnClose = document.querySelector('#btn-close');

    btnClose.addEventListener('click', () => {
        formFeedback.classList.remove('active');
    });

    // map left/right arrow keys to prev/next slide
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            swiper.slidePrev();
        } else if (e.key === 'ArrowRight') {
            swiper.slideNext();
        }
    });

    // function to check for anchor link and, if exists, slide to it

    function slideToAnchor() {
        // Get the anchor link from the URL (hash)
        const anchor = window.location.hash;

        // If an anchor exists
        if (anchor) {
            // Remove the '#' from the anchor link to get the slide ID
            const targetId = anchor.substring(1);

            // Find the slide with the matching ID
            const targetSlide = document.getElementById(targetId);

            // If the slide exists, get its index and use Swiper to slide to it
            if (targetSlide) {
                const targetIndex = Array.from(targetSlide.parentElement.children).indexOf(targetSlide);

                // Slide to the corresponding index
                swiper.slideTo(targetIndex);
            }
        }
    }

    // Call the function
    slideToAnchor();

    // call the function on hash change
    window.addEventListener('hashchange', slideToAnchor);

    const btnStart = document.querySelector('#btn-start');

    btnStart.addEventListener('click', () => {
        swiper.slideNext();
    });
});
