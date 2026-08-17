document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupProcessAnimations();
    setupPageLoadAnimations();
});

/* =========================
   Page Load Animations
========================= */

function setupPageLoadAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
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
            threshold: 0.12,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

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

document.addEventListener("DOMContentLoaded", () => {
    setupProjectStatisticsAnimation();
});

function setupProjectStatisticsAnimation() {
    const statisticCards = document.querySelectorAll(
        ".project-statistics > div"
    );

    if (!statisticCards.length) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        statisticCards.forEach((card) => {
            card.classList.add("is-visible");
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
            threshold: 0.25,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    statisticCards.forEach((card) => {
        observer.observe(card);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    setupAmbientBackground();
});

function setupAmbientBackground() {
    if (
        document.querySelector(".site-ambient-background")
    ) {
        return;
    }

    const ambientBackground =
        document.createElement("div");

    ambientBackground.className =
        "site-ambient-background";

    ambientBackground.setAttribute(
        "aria-hidden",
        "true"
    );

    ambientBackground.innerHTML = `
        <span class="ambient-shape ambient-shape-one"></span>
        <span class="ambient-shape ambient-shape-two"></span>
        <span class="ambient-shape ambient-shape-three"></span>
        <span class="ambient-shape ambient-shape-four"></span>
        <span class="ambient-shape ambient-shape-five"></span>
        <span class="ambient-cursor-light"></span>
    `;

    document.body.appendChild(ambientBackground);

    setupAmbientCursorLight(ambientBackground);
}

function setupAmbientCursorLight(ambientBackground) {
    const cursorLight = ambientBackground.querySelector(
        ".ambient-cursor-light"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const touchDevice = window.matchMedia(
        "(pointer: coarse)"
    ).matches;

    if (
        !cursorLight ||
        reducedMotion ||
        touchDevice
    ) {
        return;
    }

    window.addEventListener("pointermove", (event) => {
        cursorLight.style.left = `${event.clientX}px`;
        cursorLight.style.top = `${event.clientY}px`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupPageTransitions();
});

function setupPageTransitions() {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        return;
    }

    /*
     * Set the starting animation state.
     */
    document.body.classList.add(
        "page-transition-ready"
    );

    /*
     * Two animation frames ensure the browser sees
     * the hidden position before animating it in.
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add(
                "page-is-visible"
            );
        });
    });

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        /*
         * Do not animate special links.
         */
        if (
            link.target === "_blank" ||
            link.hasAttribute("download") ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:")
        ) {
            return;
        }

        const destination = new URL(
            link.href,
            window.location.href
        );

        /*
         * Leave external websites normally.
         */
        if (
            destination.origin !==
            window.location.origin
        ) {
            return;
        }

        /*
         * Allow links to sections on the current page
         * to work without transitioning the whole page.
         */
        if (
            destination.pathname ===
                window.location.pathname &&
            destination.hash
        ) {
            return;
        }

        event.preventDefault();

        document.body.classList.remove(
            "page-is-visible"
        );

        document.body.classList.add(
            "page-is-leaving"
        );

        window.setTimeout(() => {
            window.location.href =
                destination.href;
        }, 280);
    });

    /*
     * Restore the page if the browser back button
     * loads it from its page cache.
     */
    window.addEventListener("pageshow", () => {
        document.body.classList.remove(
            "page-is-leaving"
        );

        requestAnimationFrame(() => {
            document.body.classList.add(
                "page-is-visible"
            );
        });
    });
}