document.addEventListener("DOMContentLoaded", setupOurWorkAnimations);
document.addEventListener("DOMContentLoaded", setupNumberCounters);

function setupNumberCounters() {
    const counterElements = document.querySelectorAll("[data-count-target]");

    if (!counterElements.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        counterElements.forEach((el) => {
            const numberSpan = el.querySelector(".count-number");
            if (numberSpan) numberSpan.textContent = "15,000";
        });
        return;
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const numberSpan = entry.target.querySelector(".count-number");
            if (!numberSpan) return;

            animateCounter(numberSpan, 0, 15000, 2000);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    counterElements.forEach((el) => counterObserver.observe(el));
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + range * progress);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

function setupOurWorkAnimations() {
    const page = document.querySelector("main");
    const items = document.querySelectorAll(".work-reveal");
    if (!page || !items.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".work-fact").forEach((item, index) => {
        item.style.setProperty("--work-delay", `${index * 80}ms`);
    });

    document.querySelectorAll(".work-story-card, .work-coming-card").forEach((item, index) => {
        item.style.setProperty("--work-delay", `${(index % 3) * 100}ms`);
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    page.classList.add("work-animations-ready");

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });

    items.forEach((item) => observer.observe(item));
}