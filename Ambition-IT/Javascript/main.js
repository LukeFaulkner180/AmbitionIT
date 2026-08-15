document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupProcessAnimations();
});

/* =========================
   Mobile Navigation
========================= */

function setupMobileMenu() {
    const menuButton =
        document.querySelector(".menu-toggle");

    const navigationLinks =
        document.querySelector("#navigation-links");

    if (!menuButton || !navigationLinks) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const menuIsOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        const newMenuState = !menuIsOpen;

        menuButton.setAttribute(
            "aria-expanded",
            String(newMenuState)
        );

        menuButton.classList.toggle(
            "is-open",
            newMenuState
        );

        navigationLinks.classList.toggle(
            "is-open",
            newMenuState
        );
    });
}

/* =========================
   Process Section Animation
========================= */

function setupProcessAnimations() {
    const processSection =
        document.querySelector(".process-section");

    if (!processSection) {
        return;
    }

    processSection.classList.add(
        "process-animations-ready"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
     * Show everything immediately when the visitor
     * prefers reduced motion.
     */
    if (reducedMotion) {
        processSection.classList.add("is-visible");
        return;
    }

    /*
     * Fallback for browsers without IntersectionObserver.
     */
    if (!("IntersectionObserver" in window)) {
        processSection.classList.add("is-visible");
        return;
    }

    const processObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");

                /*
                 * Stop observing after the animation runs.
                 */
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18
        }
    );

    processObserver.observe(processSection);
}