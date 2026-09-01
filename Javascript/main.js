/* Edit the offer dates or set enabled to false here. */
const ambitionPromotionConfig = Object.freeze({
    enabled: true,
    code: "ONEPAGE10",
    label: "10% one-page website offer",
    packageKey: "one-page",
    discountPercent: 10,
    startDate: "2026-09-01T00:00:00+01:00",
    endDate: "2026-09-30T23:59:59+01:00",
    displayStartDate: "1 September 2026",
    displayEndDate: "30 September 2026"
});

window.AmbitionITPromotion = Object.freeze({
    config: ambitionPromotionConfig,

    isActive(date = new Date()) {
        const startsAt = new Date(
            ambitionPromotionConfig.startDate
        );
        const endsAt = new Date(
            ambitionPromotionConfig.endDate
        );

        return Boolean(
            ambitionPromotionConfig.enabled &&
            date >= startsAt &&
            date <= endsAt
        );
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupProcessAnimations();
    setupPageLoadAnimations();
    setupWebsitePromotion();
});

/* =========================
   Limited-time promotion
========================= */

function setupWebsitePromotion() {
    if (!window.AmbitionITPromotion.isActive()) {
        return;
    }

    const pagesWithoutPopup = [
        "/pages/pricing.html",
        "/pages/contact.html"
    ];

    if (pagesWithoutPopup.includes(window.location.pathname)) {
        return;
    }

    const dismissalKey =
        `ambition-it-promotion-${ambitionPromotionConfig.code}`;

    try {
        if (window.sessionStorage.getItem(dismissalKey) === "dismissed") {
            return;
        }
    } catch (error) {
        console.warn(
            "Promotion dismissal preference could not be read.",
            error
        );
    }

    const overlay = document.createElement("div");
    overlay.className = "promotion-overlay";
    overlay.setAttribute("role", "presentation");

    overlay.innerHTML = `
        <section
            class="promotion-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="promotion-title"
            aria-describedby="promotion-description"
        >
            <button
                class="promotion-close"
                type="button"
                aria-label="Close website offer"
            >
                <span aria-hidden="true">×</span>
            </button>

            <p class="promotion-eyebrow">Limited-time website offer</p>

            <h2 id="promotion-title">
                Buy a one-page website.
                <span>Save 10%.</span>
            </h2>

            <p id="promotion-description">
                Buy a one-page website between
                ${ambitionPromotionConfig.displayStartDate} and
                ${ambitionPromotionConfig.displayEndDate} and receive
                10% off the website build price.
            </p>

            <div class="promotion-price" aria-label="Promotional price">
                <span>Website build</span>
                <div><s>£250</s><strong>£225</strong></div>
            </div>

            <a
                class="promotion-button"
                href="/pages/pricing.html?promotion=${ambitionPromotionConfig.code}#instant-estimate"
            >
                Buy a one-page website
                <span aria-hidden="true">→</span>
            </a>

            <small>
                Hosting and optional ongoing services are priced separately.
                A final quotation is confirmed before work begins.
            </small>
        </section>
    `;

    const closeButton = overlay.querySelector(".promotion-close");
    const offerButton = overlay.querySelector(".promotion-button");
    const focusableElements = [closeButton, offerButton];
    const previouslyFocused = document.activeElement;

    function rememberDismissal() {
        try {
            window.sessionStorage.setItem(
                dismissalKey,
                "dismissed"
            );
        } catch (error) {
            console.warn(
                "Promotion dismissal preference could not be saved.",
                error
            );
        }
    }

    function closePromotion({ restoreFocus = true } = {}) {
        rememberDismissal();
        overlay.classList.remove("is-visible");
        document.body.classList.remove("promotion-is-open");

        window.setTimeout(() => {
            overlay.remove();

            if (
                restoreFocus &&
                previouslyFocused instanceof HTMLElement
            ) {
                previouslyFocused.focus();
            }
        }, 240);
    }

    closeButton.addEventListener("click", () => {
        closePromotion();
    });

    offerButton.addEventListener("click", () => {
        rememberDismissal();
    });

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closePromotion();
        }
    });

    overlay.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePromotion();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    document.body.appendChild(overlay);

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    window.setTimeout(() => {
        overlay.classList.add("is-visible");
        document.body.classList.add("promotion-is-open");
        closeButton.focus();
    }, reducedMotion ? 200 : 1200);
}

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

    function menuIsOpen() {
        return menuButton.getAttribute("aria-expanded") === "true";
    }

    function setMenuState(isOpen, returnFocus = false) {
        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        menuButton.classList.toggle(
            "is-open",
            isOpen
        );

        navigationLinks.classList.toggle(
            "is-open",
            isOpen
        );

        if (returnFocus) {
            menuButton.focus();
        }
    }

    menuButton.addEventListener("click", () => {
        setMenuState(!menuIsOpen());
    });

    navigationLinks.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuIsOpen()) {
            setMenuState(false, true);
        }
    });

    document.addEventListener("pointerdown", (event) => {
        if (
            menuIsOpen() &&
            !menuButton.contains(event.target) &&
            !navigationLinks.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1100 && menuIsOpen()) {
            setMenuState(false);
        }
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
