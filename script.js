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

    // feedback form

    const form = document.getElementById('feedback-form');
    const status = document.getElementById('status-message');

    async function handleSubmit(event) {
        event.preventDefault();

        const allInputs = form.querySelectorAll('input, textarea, button');
        const hpValue = form.querySelector('#b_e7f83e702318920efe670e9b1_597f4b8abc').value;
        const nameValue = form.querySelector('#name').value;
        const emailValue = form.querySelector('#email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mailchimpConsent = form.querySelector('#mailchimp-consent').checked;
        const data = new FormData(event.target);

        // Jeremy: xnnjnjza | Steve: mgvovvgd
        const formSpreeAction = 'https://formspree.io/f/mgvovvgd';
        const mailChimpAction = 'https://gmail.us21.list-manage.com/subscribe/post-json?u=e7f83e702318920efe670e9b1&amp;id=597f4b8abc&amp;f_id=0056f5e6f0';

        console.log(event.target.action);

        if (!nameValue) {
            status.innerHTML = 'Please enter your name';
            return;
        }

        if (!emailRegex.test(emailValue)) {
            status.innerHTML = 'Please enter a valid email address';
            return;
        }

        // disable the form while we wait for the response
        allInputs.forEach((el) => (el.disabled = true));

        // FormSpree submission
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    // status.innerHTML = 'Thanks for your submission!';
                    // form.reset();
                    console.log('FormSpree response:', response);
                } else {
                    response.json().then((data) => {
                        status.innerHTML = 'Oops! There was a problem submitting your form';
                        allInputs.forEach((el) => (el.disabled = false));
                        console.log('FormSpree error:', data);
                        return;
                    });
                }
            })
            .catch((error) => {
                status.innerHTML = 'Oops! There was a problem submitting your form';
                allInputs.forEach((el) => (el.disabled = false));
            });

        // MailChimp submission
        if (mailchimpConsent) {
            mailChimpAction += '&EMAIL=' + encodeURIComponent(emailValue) + '&group[2198]=32&b_e7f83e702318920efe670e9b1_597f4b8abc=' + encodeURIComponent(hpValue) + '&c=displayMailChimpStatus';

            // Inject a script with the output from the post action
            // i.e. If all goes well, the post action should output "displayMailChimpStatus({"result":"success","msg":"Thank you for subscribing!"})"
            const script = document.createElement('script');
            script.src = mailChimpAction;

            // insert script tag into the DOM
            const ref = window.document.getElementsByTagName('script')[0];
            ref.parentNode.insertBefore(script, ref);

            console.log('MailChimp action:', mailChimpAction);

            // After the script is loaded (and executed), remove it
            script.onload = () => {
                script.remove();
            };
        }
    }

    // Process the form action output arguments from MailChimp
    window.displayMailChimpStatus = (response) => {
        // Make sure the data is in the right format
        if (!response.result || !response.msg) return;

        // Check if the message contains "thank you" (case insensitive)
        const thankYouRegex = /thank you/i;
        const containsThankYou = thankYouRegex.test(response.msg);

        // Choose an appropriate action based on the presence of "thank you"
        if (containsThankYou) {
            // Display a custom status message
            status.innerHTML = 'To complete the subscription process, please click the confirmation link in the email we just sent.';
        } else {
            // Output the raw endpoint status message
            status.innerHTML = response.msg;
        }

        // If successful, set the appropriate class to the form;
        // otherwise, re-enable all form inputs and reset the form class
        if (response.result === 'success') {
        } else {
            allInputs.forEach((input) => (input.disabled = false));
        }
    };
    form.addEventListener('submit', handleSubmit);
});
