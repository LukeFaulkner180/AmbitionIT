document.addEventListener("DOMContentLoaded", () => {
    setupWebDesignAnimations();
});

function setupWebDesignAnimations() {
    const items = document.querySelectorAll(".wd-reveal");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".wd-benefit, .wd-build-card").forEach((card, index) => {
        card.style.setProperty("--wd-delay", `${(index % 4) * 90}ms`);
    });

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
    }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });

    items.forEach((item) => observer.observe(item));
}