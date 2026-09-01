if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        setupEstimateBuilder();
        setupPricingAnimations();
    });
}

/*
 * EDIT PRICES HERE
 *
 * Website and add-on prices include the one-off amounts shown
 * on the page. Recurring management and service additions are
 * calculated separately in the estimate summary.
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
        ecommerce: {
            name: "E-Commerce",
            price: 350,
            monthlyPrice: 5,
            requiresPackage: "multi-page"
        },

        booking: {
            name: "Booking integration",
            price: 300,
            monthlyPrice: 8
        },

        copywriting: {
            name: "Website content support",
            price: 125,
            monthlyPrice: 0
        },

        seo: {
            name: "Enhanced SEO setup",
            price: 95,
            monthlyPrice: 0
        },

        email: {
            name: "Business email setup",
            price: 75,
            monthlyPrice: 0
        }
    },

    extraPagePrice: 75,
    extraPageMonthlyPrice: 3,

    productUploads: {
        name: "Monthly product uploads",
        monthlyPrice: 25,
        requiresAddon: "ecommerce"
    },

    annualCosts: {
        management: {
            onePageMonthly: 25,
            multiPageMonthly: 40
        },

        hosting: {
            onePageAnnual: 60,
            multiPageAnnual: 120,
            perExtraPageAnnual: 15
        }
    }
};

function clampWholeNumber(value, minimum, maximum) {
    const parsedValue = Number.parseInt(value, 10);
    const safeValue = Number.isFinite(parsedValue)
        ? parsedValue
        : minimum;

    return Math.max(minimum, Math.min(maximum, safeValue));
}

function normaliseSelection(selection = {}) {
    const packageKey = Object.hasOwn(
        pricingConfig.packages,
        selection.packageKey
    )
        ? selection.packageKey
        : "one-page";

    const extraPages = packageKey === "multi-page"
        ? clampWholeNumber(selection.extraPages, 0, 50)
        : 0;

    const requestedAddons = Array.isArray(selection.addons)
        ? selection.addons
        : [];

    const addons = [...new Set(requestedAddons)].filter((addonKey) => {
        const addon = pricingConfig.addons[addonKey];

        if (!addon) {
            return false;
        }

        return !addon.requiresPackage ||
            addon.requiresPackage === packageKey;
    });

    const productUploads = Boolean(
        selection.productUploads &&
        addons.includes(
            pricingConfig.productUploads.requiresAddon
        )
    );

    return {
        packageKey,
        extraPages,
        addons,
        productUploads
    };
}

function calculateEstimate(selection = {}, promotion = null) {
    const normalised = normaliseSelection(selection);
    const packageData =
        pricingConfig.packages[normalised.packageKey];

    let projectSubtotal =
        packageData.price +
        normalised.extraPages * pricingConfig.extraPagePrice;

    let monthlyServices =
        normalised.packageKey === "one-page"
            ? pricingConfig.annualCosts.management.onePageMonthly
            : pricingConfig.annualCosts.management.multiPageMonthly;

    monthlyServices +=
        normalised.extraPages *
        pricingConfig.extraPageMonthlyPrice;

    const includedItems = [packageData.name];

    if (normalised.extraPages > 0) {
        includedItems.push(
            `${normalised.extraPages} additional ${
                normalised.extraPages === 1 ? "page" : "pages"
            }`
        );
    }

    const selectedAddons = normalised.addons.map((addonKey) => {
        const addon = pricingConfig.addons[addonKey];

        projectSubtotal += addon.price;
        monthlyServices += addon.monthlyPrice;

        includedItems.push(
            addon.monthlyPrice > 0
                ? `${addon.name} (+£${addon.monthlyPrice}/month)`
                : addon.name
        );

        return {
            key: addonKey,
            name: addon.name,
            price: addon.price,
            monthlyPrice: addon.monthlyPrice
        };
    });

    if (normalised.productUploads) {
        monthlyServices +=
            pricingConfig.productUploads.monthlyPrice;

        includedItems.push(
            `${pricingConfig.productUploads.name} ` +
            `(+£${pricingConfig.productUploads.monthlyPrice}/month)`
        );
    }

    const validPromotion = Boolean(
        promotion &&
        promotion.packageKey === normalised.packageKey &&
        Number.isFinite(promotion.discountPercent) &&
        promotion.discountPercent > 0
    );

    const promotionDiscount = validPromotion
        ? Math.round(
            packageData.price *
            promotion.discountPercent /
            100
        )
        : 0;

    const projectTotal = Math.max(
        0,
        projectSubtotal - promotionDiscount
    );

    const hostingAnnual =
        normalised.packageKey === "one-page"
            ? pricingConfig.annualCosts.hosting.onePageAnnual
            : pricingConfig.annualCosts.hosting.multiPageAnnual +
                normalised.extraPages *
                pricingConfig.annualCosts.hosting.perExtraPageAnnual;

    const servicesAnnual = monthlyServices * 12;

    return {
        ...normalised,
        packageName: packageData.name,
        includedPages: packageData.includedPages,
        totalPages: packageData.includedPages + normalised.extraPages,
        selectedAddons,
        includedItems,
        projectSubtotal,
        promotion: validPromotion
            ? {
                code: promotion.code,
                label: promotion.label,
                discountPercent: promotion.discountPercent,
                discountAmount: promotionDiscount
            }
            : null,
        projectTotal,
        monthlyServices,
        servicesAnnual,
        hostingAnnual,
        annualTotal: servicesAnnual + hostingAnnual
    };
}

function getActivePromotion() {
    if (
        typeof window === "undefined" ||
        !window.AmbitionITPromotion ||
        typeof window.AmbitionITPromotion.isActive !== "function" ||
        !window.AmbitionITPromotion.isActive()
    ) {
        return null;
    }

    const promotion = window.AmbitionITPromotion.config;

    return {
        code: promotion.code,
        label: promotion.label,
        packageKey: promotion.packageKey,
        discountPercent: promotion.discountPercent
    };
}

function createEstimateState(estimate) {
    return {
        version: 1,
        packageKey: estimate.packageKey,
        packageName: estimate.packageName,
        includedPages: estimate.includedPages,
        extraPages: estimate.extraPages,
        totalPages: estimate.totalPages,
        addons: estimate.selectedAddons,
        productUploads: estimate.productUploads,
        includedItems: estimate.includedItems,
        costs: {
            projectSubtotal: estimate.projectSubtotal,
            promotionDiscount: estimate.promotion
                ? estimate.promotion.discountAmount
                : 0,
            projectTotal: estimate.projectTotal,
            monthlyServices: estimate.monthlyServices,
            annualServices: estimate.servicesAnnual,
            annualHosting: estimate.hostingAnnual,
            annualTotal: estimate.annualTotal
        },
        promotion: estimate.promotion
    };
}

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

    const buildTotal = document.querySelector("#build-total");
    const monthlyServicesTotal = document.querySelector(
        "#monthly-services-total"
    );
    const managementTotal = document.querySelector("#management-total");
    const hostingTotal = document.querySelector("#hosting-total");
    const annualTotal = document.querySelector("#annual-total");
    const builderManagementTotal = document.querySelector(
        "#builder-management-total"
    );
    const builderHostingTotal = document.querySelector(
        "#builder-hosting-total"
    );
    const paymentMessage = document.querySelector("#payment-message");
    const estimateItems = document.querySelector("#estimate-items");
    const resetButton = document.querySelector("#reset-estimate");
    const requestEstimateButton = document.querySelector(
        "#request-estimate"
    );
    const extraPagesInput = document.querySelector("#extra-pages");
    const decreasePages = document.querySelector("#decrease-pages");
    const increasePages = document.querySelector("#increase-pages");
    const additionalPagesOption = document.querySelector(
        "#additional-pages-option"
    );
    const ecommerceInput = document.querySelector("#ecommerce-addon");
    const ecommerceOption = document.querySelector("#ecommerce-option");
    const productUploadInput = document.querySelector(
        "#product-upload-service"
    );
    const productUploadOption = document.querySelector(
        "#product-upload-option"
    );
    const ecommerceTerms = document.querySelector("#ecommerce-terms");
    const productUploadTerms = document.querySelector(
        "#product-upload-terms"
    );
    const availabilityMessage = document.querySelector(
        "#estimate-availability-message"
    );
    const promotionSaving = document.querySelector("#promotion-saving");
    const promotionLabel = document.querySelector("#promotion-label");
    const promotionAmount = document.querySelector("#promotion-amount");

    let latestEstimateState = null;

    function selectedPackageKey() {
        const selectedPackage = form.querySelector(
            'input[name="package"]:checked'
        );

        return selectedPackage
            ? selectedPackage.value
            : "one-page";
    }

    function updateOptionAvailability() {
        const multiPageSelected =
            selectedPackageKey() === "multi-page";

        additionalPagesOption.hidden = !multiPageSelected;
        additionalPagesOption.style.display =
            multiPageSelected ? "" : "none";

        ecommerceOption.hidden = !multiPageSelected;
        ecommerceOption.style.display =
            multiPageSelected ? "" : "none";

        if (!multiPageSelected) {
            extraPagesInput.value = 0;
            ecommerceInput.checked = false;
        }

        ecommerceInput.disabled = !multiPageSelected;
        ecommerceOption.classList.toggle(
            "is-unavailable",
            !multiPageSelected
        );
        ecommerceOption.setAttribute(
            "aria-disabled",
            String(!multiPageSelected)
        );

        const ecommerceSelected = Boolean(
            multiPageSelected && ecommerceInput.checked
        );

        productUploadOption.hidden = !ecommerceSelected;
        productUploadInput.disabled = !ecommerceSelected;
        ecommerceTerms.hidden = !ecommerceSelected;

        if (!ecommerceSelected) {
            productUploadInput.checked = false;
        }

        productUploadTerms.hidden =
            !productUploadInput.checked;

        if (!multiPageSelected) {
            availabilityMessage.textContent =
                "Additional multi-page options will appear when " +
                "a multi-page website is selected.";
        } else if (!ecommerceSelected) {
            availabilityMessage.textContent =
                "Select e-commerce to add the optional " +
                "monthly product upload service.";
        } else {
            availabilityMessage.textContent =
                "E-commerce includes up to 20 initial simple products.";
        }
    }

    function readSelection() {
        return {
            packageKey: selectedPackageKey(),
            extraPages: extraPagesInput.value,
            addons: Array.from(
                form.querySelectorAll(
                    'input[name="addon"]:checked:not(:disabled)'
                )
            ).map((input) => input.value),
            productUploads: Boolean(
                productUploadInput.checked &&
                !productUploadInput.disabled
            )
        };
    }

    function updateEstimate() {
        updateOptionAvailability();

        const estimate = calculateEstimate(
            readSelection(),
            getActivePromotion()
        );

        extraPagesInput.value = estimate.extraPages;
        buildTotal.textContent = money.format(estimate.projectTotal);
        monthlyServicesTotal.textContent =
            `${money.format(estimate.monthlyServices)}/month`;
        managementTotal.textContent = money.format(
            estimate.servicesAnnual
        );
        hostingTotal.textContent = money.format(
            estimate.hostingAnnual
        );
        annualTotal.textContent = money.format(estimate.annualTotal);
        builderManagementTotal.textContent =
            `${money.format(estimate.monthlyServices)}/month · ` +
            `${money.format(estimate.servicesAnnual)}/year`;
        builderHostingTotal.textContent =
            `${money.format(estimate.hostingAnnual)}/year`;

        promotionSaving.hidden = !estimate.promotion;

        if (estimate.promotion) {
            promotionLabel.textContent = estimate.promotion.label;
            promotionAmount.textContent =
                `−${money.format(estimate.promotion.discountAmount)}`;
        }

        if (estimate.projectTotal <= 999) {
            paymentMessage.textContent =
                "This project would be payable upfront " +
                "because the estimated project cost is " +
                "£999 or less.";
        } else {
            const firstPayment = estimate.projectTotal / 2;

            paymentMessage.textContent =
                `Estimated payment plan: ` +
                `${money.format(firstPayment)} upfront and ` +
                `${money.format(firstPayment)} when the ` +
                `project is complete.`;
        }

        estimateItems.replaceChildren(
            ...estimate.includedItems.map((name) => {
                const listItem = document.createElement("li");
                listItem.textContent = name;
                return listItem;
            })
        );

        latestEstimateState = createEstimateState(estimate);

        const encodedEstimate = encodeURIComponent(
            JSON.stringify(latestEstimateState)
        );

        requestEstimateButton.href =
            `/pages/contact.html?estimate=${encodedEstimate}` +
            "#project-form";
    }

    form.addEventListener("change", updateEstimate);
    extraPagesInput.addEventListener("input", updateEstimate);

    decreasePages.addEventListener("click", () => {
        extraPagesInput.value = Math.max(
            0,
            clampWholeNumber(extraPagesInput.value, 0, 50) - 1
        );
        updateEstimate();
    });

    increasePages.addEventListener("click", () => {
        extraPagesInput.value = Math.min(
            50,
            clampWholeNumber(extraPagesInput.value, 0, 50) + 1
        );
        updateEstimate();
    });

    document.querySelectorAll("[data-select-package]").forEach((button) => {
        button.addEventListener("click", () => {
            const packageInput = form.querySelector(
                `input[value="${button.dataset.selectPackage}"]`
            );

            if (!packageInput) {
                return;
            }

            packageInput.checked = true;
            updateEstimate();

            document.querySelector("#instant-estimate").scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    resetButton.addEventListener("click", () => {
        form.reset();
        updateEstimate();
    });

    requestEstimateButton.addEventListener("click", () => {
        if (!latestEstimateState) {
            return;
        }

        try {
            window.sessionStorage.setItem(
                "ambition-it-estimate",
                JSON.stringify(latestEstimateState)
            );
        } catch (error) {
            console.warn(
                "The estimate could not be saved in this browser session.",
                error
            );
        }
    });

    const requestedPromotion = new URLSearchParams(
        window.location.search
    ).get("promotion");
    const activePromotion = getActivePromotion();

    if (
        requestedPromotion &&
        activePromotion &&
        requestedPromotion === activePromotion.code
    ) {
        const onePageInput = form.querySelector(
            'input[name="package"][value="one-page"]'
        );

        if (onePageInput) {
            onePageInput.checked = true;
        }
    }

    updateEstimate();
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        pricingConfig,
        normaliseSelection,
        calculateEstimate,
        createEstimateState
    };
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
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    animationItems.forEach((item) => {
        observer.observe(item);
    });
}
