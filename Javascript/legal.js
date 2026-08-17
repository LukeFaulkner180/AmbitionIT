/*
 * Ambition IT legal page
 * Handles scroll animations and active section navigation.
 */

document.documentElement.classList.add(
    "legal-animations-ready"
);

document.addEventListener("DOMContentLoaded", () => {
    setupLegalAnimations();
    setupLegalSectionNavigation();
});


/*
 * Reveal elements as they enter the screen.
 */
function setupLegalAnimations() {
    const revealItems =
        document.querySelectorAll(".legal-reveal");

    if (!revealItems.length) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
     * Show everything immediately when the visitor has
     * requested reduced motion or IntersectionObserver
     * is unavailable.
     */
    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealItems.forEach((item) => {
            item.classList.add("is-visible");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealItems.forEach((item, index) => {
        /*
         * Adds a small staggered delay without allowing
         * later elements to wait too long.
         */
        const delay = Math.min(index * 55, 180);

        item.style.setProperty(
            "--legal-delay",
            `${delay}ms`
        );

        revealObserver.observe(item);
    });
}


/*
 * Highlights the appropriate link in the sticky
 * "On this page" navigation while scrolling.
 */
function setupLegalSectionNavigation() {
    const sideLinks =
        document.querySelectorAll(".legal-side-nav a");

    const sections =
        document.querySelectorAll(".legal-section");

    if (!sideLinks.length || !sections.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const activeSection =
                    `#${entry.target.id}`;

                sideLinks.forEach((link) => {
                    const linkMatchesSection =
                        link.getAttribute("href") ===
                        activeSection;

                    link.classList.toggle(
                        "is-active",
                        linkMatchesSection
                    );
                });
            });
        },
        {
            threshold: 0,
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });


    /*
     * Immediately update the active state when a visitor
     * clicks one of the navigation links.
     */
    sideLinks.forEach((link) => {
        link.addEventListener("click", () => {
            sideLinks.forEach((currentLink) => {
                currentLink.classList.remove(
                    "is-active"
                );
            });

            link.classList.add("is-active");
        });
    });
}