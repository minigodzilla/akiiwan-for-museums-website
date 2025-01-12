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
      },
    },
  });

  // Immediately Invoked Function Expression to check for anchor link
  (function () {
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
  })();

  const btnStart = document.querySelector('#btn-start');

  btnStart.addEventListener('click', () => {
    swiper.slideNext();
  });
});
