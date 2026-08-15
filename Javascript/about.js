document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = [];

    const add = (element, direction = "", delay = 0) => {
        if (!element) return;
        element.classList.add("about-animate");
        if (direction) element.classList.add(direction);
        element.style.setProperty("--about-delay", `${delay}ms`);
        items.push(element);
    };

    add(document.querySelector(".about-hero-copy"), "from-left");
    add(document.querySelector(".about-hero-card"), "scale-in", 150);
    add(document.querySelector(".about-story-heading"), "from-left");
    add(document.querySelector(".about-story-copy"), "from-right", 100);
    add(document.querySelector(".about-location-image"), "scale-in");
    add(document.querySelector(".about-location-copy"), "from-right", 100);
    add(document.querySelector(".about-section-heading"));
    document.querySelectorAll(".coverage-card").forEach((card, index) => add(card, "", (index % 4) * 75));
    add(document.querySelector(".about-values-panel"), "scale-in");
    add(document.querySelector(".about-final-inner"));

    if (reducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });

    items.forEach((item) => observer.observe(item));
});