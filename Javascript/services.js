document.addEventListener("DOMContentLoaded", () => {
    setupServicesPageAnimations();
});

function setupServicesPageAnimations() {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const animationItems = [];

    function addAnimationItem(
        element,
        direction = "up",
        delay = 0
    ) {
        if (!element) {
            return;
        }

        element.classList.add("services-animate");

        element.style.setProperty(
            "--services-delay",
            `${delay}ms`
        );

        if (direction === "left") {
            element.classList.add("services-from-left");
        }

        if (direction === "right") {
            element.classList.add("services-from-right");
        }

        if (direction === "scale") {
            element.classList.add("services-scale");
        }

        animationItems.push(element);
    }

    /* Main services heading */
    addAnimationItem(
        document.querySelector(".services-section-heading")
    );

    /* Main service cards */
    document.querySelectorAll(".service-page-card").forEach(
        (card, index) => {
            const delay = (index % 3) * 110;

            addAnimationItem(card, "up", delay);
        }
    );

    /* Additional services directory heading */
    addAnimationItem(
        document.querySelector(".services-directory-heading")
    );

    /* Web, IT and Digital Marketing columns */
    document.querySelectorAll(
        ".services-directory-group"
    ).forEach((group, index) => {
        addAnimationItem(
            group,
            "up",
            index * 110
        );
    });

    /* Website management section */
    addAnimationItem(
        document.querySelector(".service-detail-heading"),
        "left"
    );

    addAnimationItem(
        document.querySelector(".service-detail-content"),
        "right",
        120
    );

    /* Hosting and support panel */
    addAnimationItem(
        document.querySelector(".support-panel"),
        "scale"
    );

    /* More services section */
    addAnimationItem(
        document.querySelector(".services-coming-panel"),
        "up"
    );

    /* Final call-to-action */
    addAnimationItem(
        document.querySelector(".services-final-cta-inner"),
        "up"
    );

    /*
     * Display everything immediately when reduced motion is enabled
     * or IntersectionObserver is unavailable.
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

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    animationItems.forEach((item) => {
        observer.observe(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupITSupportAnimation();
});

function setupITSupportAnimation() {
    const animationItems = document.querySelectorAll(
        ".it-support-animate"
    );

    if (!animationItems.length) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    document.querySelectorAll(
        ".it-support-feature"
    ).forEach((feature, index) => {
        feature.style.setProperty(
            "--it-delay",
            `${(index % 2) * 110}ms`
        );
    });

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        animationItems.forEach((item) => {
            item.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    animationItems.forEach((item) => {
        observer.observe(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupITSupportAnimation();
});

function setupITSupportAnimation() {
    const supportSection = document.querySelector(
        ".it-support-section"
    );

    if (!supportSection) {
        return;
    }

    const animationItems = supportSection.querySelectorAll(
        ".it-support-animate"
    );

    const supportFeatures = supportSection.querySelectorAll(
        ".it-support-feature"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
     * Only hide the elements after JavaScript has
     * successfully found the section.
     */
    supportSection.classList.add("animations-ready");

    supportFeatures.forEach((feature, index) => {
        feature.style.setProperty(
            "--it-delay",
            `${(index % 2) * 110}ms`
        );
    });

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        animationItems.forEach((item) => {
            item.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -20px 0px"
        }
    );

    animationItems.forEach((item) => {
        observer.observe(item);
    });
}