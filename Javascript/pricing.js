document.addEventListener("DOMContentLoaded", () => {
    setupEstimateBuilder();
    setupPricingAnimations();
});

/*
 * EDIT PRICES HERE
 *
 * Website and add-on prices are one-off.
 * Management and hosting are calculated automatically
 * from the total number of pages.
 */
const pricingConfig = {
    packages: {
        "one-page": {
            name: "One-page website",
            price: 250,
            includedPages: 1
        },

        "multi-page": {
            name: "Multi-page website",
            price: 500,
            includedPages: 5
        }
    },

    addons: {
        blog: {
            name: "E-Commerce",
            price: 350
        },

        booking: {
            name: "Booking integration",
            price: 300
        },

        copywriting: {
            name: "Website content support",
            price: 125
        },

        seo: {
            name: "Enhanced SEO setup",
            price: 95
        },

        email: {
            name: "Business email setup",
            price: 75
        }
    },

    extraPagePrice: 75,

    annualCosts: {
        management: {
            onePageMonthly: 25,
            multiPageMonthly: 40,
            pagesSixToEightMonthly: 8,
            pagesAfterEightMonthly: 3
        },

        hosting: {
            onePageAnnual: 60,
            multiPageAnnual: 120,
            perExtraPageAnnual: 15
        }
    }
};

function setupEstimateBuilder() {
    const form = document.querySelector("#estimate-form");

    if (!form) {
        return;
    }

    const money = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0
    });

    const buildTotal =
        document.querySelector("#build-total");

    const managementTotal =
        document.querySelector("#management-total");

    const hostingTotal =
        document.querySelector("#hosting-total");

    const annualTotal =
        document.querySelector("#annual-total");

    const builderManagementTotal =
        document.querySelector("#builder-management-total");

    const builderHostingTotal =
        document.querySelector("#builder-hosting-total");

    const paymentMessage =
        document.querySelector("#payment-message");

    const estimateItems =
        document.querySelector("#estimate-items");

    const resetButton =
        document.querySelector("#reset-estimate");

    const extraPagesInput =
        document.querySelector("#extra-pages");

    const decreasePages =
        document.querySelector("#decrease-pages");

    const increasePages =
        document.querySelector("#increase-pages");

    const additionalPagesOption =
        document.querySelector("#additional-pages-option");

    function updateAdditionalPagesVisibility() {
        const selectedPackage = form.querySelector(
            'input[name="package"]:checked'
        );

        if (!selectedPackage || !additionalPagesOption) {
            return;
        }

        const multiPageSelected =
            selectedPackage.value === "multi-page";

        additionalPagesOption.hidden =
            !multiPageSelected;

        additionalPagesOption.style.display =
            multiPageSelected ? "" : "none";

        if (!multiPageSelected) {
            extraPagesInput.value = 0;
        }
    }

    function updateEstimate() {
        const selectedPackage = form.querySelector(
            'input[name="package"]:checked'
        );

        if (!selectedPackage) {
            return;
        }

        const packageData =
            pricingConfig.packages[selectedPackage.value];

        /*
         * Make sure the extra-page quantity remains
         * between zero and fifty.
         */
        const extraPages = Math.max(
            0,
            Math.min(
                50,
                Number.parseInt(extraPagesInput.value, 10) || 0
            )
        );

        extraPagesInput.value = extraPages;

        const totalPages =
            packageData.includedPages + extraPages;

        /*
         * Calculate the one-off website cost.
         */
        let projectTotal =
            packageData.price +
            extraPages * pricingConfig.extraPagePrice;

        /*
         * Automatically calculate annual management
         * and hosting from the total number of pages.
         */
        let managementMonthly;
        let hostingAnnual;

        if (selectedPackage.value === "one-page") {
            managementMonthly =
                pricingConfig.annualCosts.management
                    .onePageMonthly;

            hostingAnnual =
                pricingConfig.annualCosts.hosting
                    .onePageAnnual;
        } else {
            const pagesSixToEight =
                Math.min(extraPages, 3);

            const pagesAfterEight =
                Math.max(extraPages - 3, 0);

            managementMonthly =
                pricingConfig.annualCosts.management
                    .multiPageMonthly +
                pagesSixToEight *
                    pricingConfig.annualCosts.management
                        .pagesSixToEightMonthly +
                pagesAfterEight *
                    pricingConfig.annualCosts.management
                        .pagesAfterEightMonthly;

            hostingAnnual =
                pricingConfig.annualCosts.hosting
                    .multiPageAnnual +
                extraPages *
                    pricingConfig.annualCosts.hosting
                        .perExtraPageAnnual;
        }

        const managementAnnual =
            managementMonthly * 12;

        const includedItems = [
            packageData.name
        ];

        if (extraPages > 0) {
            includedItems.push(
                `${extraPages} additional ${
                    extraPages === 1 ? "page" : "pages"
                }`
            );
        }

        /*
         * Add the selected optional features.
         */
        form.querySelectorAll(
            'input[name="addon"]:checked'
        ).forEach((input) => {
            const selectedAddon =
                pricingConfig.addons[input.value];

            if (!selectedAddon) {
                return;
            }

            projectTotal += selectedAddon.price;
            includedItems.push(selectedAddon.name);
        });

        /*
         * Update the visible prices.
         */
        buildTotal.textContent =
            money.format(projectTotal);

        managementTotal.textContent =
            money.format(managementAnnual);

        hostingTotal.textContent =
            money.format(hostingAnnual);

        annualTotal.textContent =
            money.format(
                managementAnnual + hostingAnnual
            );

        builderManagementTotal.textContent =
            `${money.format(managementMonthly)}/month · ` +
            `${money.format(managementAnnual)}/year`;

        builderHostingTotal.textContent =
            `${money.format(hostingAnnual)}/year`;

        /*
         * Apply the correct payment terms.
         */
        if (projectTotal <= 999) {
            paymentMessage.textContent =
                "This project would be payable upfront " +
                "because the estimated project cost is " +
                "£999 or less.";
        } else {
            const firstPayment = projectTotal / 2;

            paymentMessage.textContent =
                `Estimated payment plan: ` +
                `${money.format(firstPayment)} upfront and ` +
                `${money.format(firstPayment)} when the ` +
                `project is complete.`;
        }

        /*
         * Display everything included in the estimate.
         */
        estimateItems.replaceChildren(
            ...includedItems.map((name) => {
                const listItem =
                    document.createElement("li");

                listItem.textContent = name;

                return listItem;
            })
        );
    }

    /*
     * Update whenever a package or add-on changes.
     */
    form.addEventListener("change", (event) => {
        if (event.target.name === "package") {
            updateAdditionalPagesVisibility();
        }

        updateEstimate();
    });

    extraPagesInput.addEventListener(
        "input",
        updateEstimate
    );

    /*
     * Extra-page minus button.
     */
    decreasePages.addEventListener("click", () => {
        const currentAmount =
            Number.parseInt(extraPagesInput.value, 10) || 0;

        extraPagesInput.value =
            Math.max(0, currentAmount - 1);

        updateEstimate();
    });

    /*
     * Extra-page plus button.
     */
    increasePages.addEventListener("click", () => {
        const currentAmount =
            Number.parseInt(extraPagesInput.value, 10) || 0;

        extraPagesInput.value =
            Math.min(50, currentAmount + 1);

        updateEstimate();
    });

    /*
     * Package buttons at the top of the page.
     */
    document.querySelectorAll(
        "[data-select-package]"
    ).forEach((button) => {
        button.addEventListener("click", () => {
            const packageInput = form.querySelector(
                `input[value="${button.dataset.selectPackage}"]`
            );

            if (!packageInput) {
                return;
            }

            packageInput.checked = true;

            updateAdditionalPagesVisibility();
            updateEstimate();

            document
                .querySelector("#instant-estimate")
                .scrollIntoView({
                    behavior: "smooth"
                });
        });
    });

    /*
     * Reset the calculator.
     */
    resetButton.addEventListener("click", () => {
        form.reset();
        updateAdditionalPagesVisibility();
        updateEstimate();
    });

    /*
     * Show the starting estimate when the page loads.
     */
    updateAdditionalPagesVisibility();
    updateEstimate();
}

function setupPricingAnimations() {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const animationItems = [];

    function addAnimation(
        element,
        modifier = "",
        delay = 0
    ) {
        if (!element) {
            return;
        }

        element.classList.add("price-animate");

        if (modifier) {
            element.classList.add(modifier);
        }

        element.style.setProperty(
            "--price-delay",
            `${delay}ms`
        );

        animationItems.push(element);
    }

    addAnimation(
        document.querySelector(".pricing-hero-inner")
    );

    addAnimation(
        document.querySelector(".pricing-heading")
    );

    document.querySelectorAll(
        ".package-card"
    ).forEach((card, index) => {
        addAnimation(card, "", index * 100);
    });

    addAnimation(
        document.querySelector(".builder-heading")
    );

    document.querySelectorAll(
        ".estimate-group"
    ).forEach((group, index) => {
        addAnimation(
            group,
            "price-from-left",
            index * 80
        );
    });

    addAnimation(
        document.querySelector(".estimate-summary"),
        "price-scale",
        120
    );

    addAnimation(
        document.querySelector(".payment-panel")
    );

    addAnimation(
        document.querySelector(".pricing-final-inner")
    );

    /*
     * Display everything immediately when reduced-motion
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