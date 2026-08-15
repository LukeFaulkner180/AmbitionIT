document.addEventListener("DOMContentLoaded", () => {
    setupContactAnimations();
    setupContactForm();
});

/*
 * Contact page scrolling animations
 */
function setupContactAnimations() {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const animationItems = [];

    function addAnimation(
        element,
        direction = "",
        delay = 0
    ) {
        if (!element) {
            return;
        }

        element.classList.add("contact-animate");

        if (direction) {
            element.classList.add(direction);
        }

        element.style.setProperty(
            "--contact-delay",
            `${delay}ms`
        );

        animationItems.push(element);
    }

    /*
     * Add animations to page sections.
     */
    addAnimation(
        document.querySelector(".contact-hero-inner")
    );

    addAnimation(
        document.querySelector(".contact-details"),
        "from-left"
    );

    addAnimation(
        document.querySelector(".contact-form-card"),
        "from-right",
        120
    );

    addAnimation(
        document.querySelector(".contact-section-heading")
    );

    document.querySelectorAll(
        ".contact-process-grid article"
    ).forEach((card, index) => {
        addAnimation(
            card,
            "",
            index * 100
        );
    });

    addAnimation(
        document.querySelector(".contact-location-panel"),
        "scale-in"
    );

    /*
     * Show content immediately when reduced-motion
     * is enabled or Intersection Observer is unavailable.
     */
    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        animationItems.forEach((item) => {
            item.classList.add("is-visible");
        });

        return;
    }

    /*
     * Show each item when it enters the viewport.
     */
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "is-visible"
                );

                currentObserver.unobserve(
                    entry.target
                );
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    animationItems.forEach((item) => {
        observer.observe(item);
    });
}

/*
 * Contact form and Formspree submission
 */
function setupContactForm() {
    const form =
        document.querySelector("#contact-form");

    const status =
        document.querySelector("#contact-form-status");

    const submitButton =
        document.querySelector("#contact-submit");

    const submitText =
        submitButton?.querySelector(
            ".contact-submit-text"
        );

    if (
        !form ||
        !status ||
        !submitButton ||
        !submitText
    ) {
        return;
    }

    form.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            /*
             * Remove previous validation styles.
             */
            form.querySelectorAll(
                ".is-invalid"
            ).forEach((field) => {
                field.classList.remove(
                    "is-invalid"
                );
            });

            /*
             * Check the required fields.
             */
            if (!form.checkValidity()) {
                const invalidFields =
                    form.querySelectorAll(":invalid");

                invalidFields.forEach((field) => {
                    field.classList.add(
                        "is-invalid"
                    );
                });

                status.textContent =
                    "Please complete the required " +
                    "fields before sending your enquiry.";

                status.className =
                    "contact-form-status " +
                    "is-visible is-error";

                form.querySelector(":invalid")?.focus();

                return;
            }

            /*
             * Show the sending state.
             */
            submitButton.disabled = true;

            submitText.textContent =
                "Sending…";

            status.textContent = "";

            status.className =
                "contact-form-status";

            try {
                /*
                 * Submit the form to Formspree.
                 */
                const response = await fetch(
                    form.action,
                    {
                        method: form.method,
                        body: new FormData(form),

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Formspree could not send the enquiry."
                    );
                }

                /*
                 * Show success and clear the form.
                 */
                status.textContent =
                    "Thank you — your enquiry has " +
                    "been sent successfully. I’ll be " +
                    "in touch as soon as possible.";

                status.className =
                    "contact-form-status " +
                    "is-visible is-success";

                form.reset();
            } catch (error) {
                console.error(error);

                /*
                 * Show an error without clearing the form.
                 */
                status.textContent =
                    "Sorry, your enquiry could not be " +
                    "sent. Please try again or email " +
                    "Ambition IT directly.";

                status.className =
                    "contact-form-status " +
                    "is-visible is-error";
            } finally {
                /*
                 * Restore the button.
                 */
                submitButton.disabled = false;

                submitText.textContent =
                    "Send My Enquiry";
            }
        }
    );

    /*
     * Remove the error style when a user
     * begins correcting a field.
     */
    form.addEventListener(
        "input",
        (event) => {
            event.target.classList.remove(
                "is-invalid"
            );
        }
    );

    form.addEventListener(
        "change",
        (event) => {
            event.target.classList.remove(
                "is-invalid"
            );
        }
    );
}