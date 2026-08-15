document.addEventListener("DOMContentLoaded", () => {
    setupServicesPageAnimations();
});

function setupServicesPageAnimations() {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const animationItems = [];

    const addItem = (element, direction = "up", delay = 0) => {
        if (!element) return;

        element.classList.add("services-animate");
        element.style.setProperty("--services-delay", `${delay}ms`);

        if (direction === "left") element.classList.add("services-from-left");
        if (direction === "right") element.classList.add("services-from-right");
        if (direction === "scale") element.classList.add("services-scale");

        animationItems.push(element);
    };

    addItem(document.querySelector(".services-section-heading"));

    document.querySelectorAll(".service-page-card").forEach((card, index) => {
        addItem(card, "up", (index % 3) * 110);
    });

    addItem(document.querySelector(".service-detail-heading"), "left");
    addItem(document.querySelector(".service-detail-content"), "right", 120);
    addItem(document.querySelector(".support-panel"), "scale");
    addItem(document.querySelector(".services-coming-panel"), "up");
    addItem(document.querySelector(".services-final-cta-inner"), "up");

    if (reducedMotion || !("IntersectionObserver" in window)) {
        animationItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    animationItems.forEach((item) => observer.observe(item));
}