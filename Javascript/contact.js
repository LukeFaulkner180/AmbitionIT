/* =========================
   Realistic East Anglia map
========================= */

async function setupRealisticContactMap() {
    const locationContent = document.querySelector(
        ".contact-location-panel > div:last-child"
    );

    if (!locationContent) {
        return;
    }

    /*
     * Remove the previous illustrated map if it exists.
     */
    const oldMap = locationContent.querySelector(
        ".contact-uk-map"
    );

    if (oldMap) {
        oldMap.remove();
    }

    /*
     * Create the interactive map container.
     */
    const mapElement = document.createElement("div");

    mapElement.id = "contact-uk-map";
    mapElement.className = "contact-uk-map";

    mapElement.setAttribute(
        "role",
        "region"
    );

    mapElement.setAttribute(
        "aria-label",
        "Interactive map showing East Anglia and Ambition IT in Stowmarket"
    );

    locationContent.insertAdjacentElement(
        "afterbegin",
        mapElement
    );

    addRealisticMapStyles();

    try {
        await loadLeafletAssets();

        createLeafletMap(mapElement);
    } catch (error) {
        console.error(
            "The contact map could not be loaded.",
            error
        );

        mapElement.innerHTML = `
            <div class="contact-map-fallback">
                <strong>Based in Stowmarket, Suffolk</strong>

                <span>
                    Supporting businesses across East Anglia
                    and remotely.
                </span>
            </div>
        `;
    }
}

function createLeafletMap(mapElement) {
    const map = L.map(
        mapElement,
        {
            scrollWheelZoom: false,
            zoomControl: true,
            attributionControl: true
        }
    ).setView(
        [53.4, -2.2],
        5
    );

    /*
     * Real OpenStreetMap tiles.
     */
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map);

    /*
     * Approximate East Anglia service-area boundary.
     */
    const eastAngliaBoundary = [
        [52.98, 0.20],
        [52.95, 0.95],
        [52.83, 1.58],
        [52.55, 1.78],
        [52.18, 1.66],
        [51.83, 1.28],
        [51.68, 0.72],
        [51.82, 0.04],
        [52.10, -0.18],
        [52.53, -0.18],
        [52.84, -0.02]
    ];

    const eastAnglia = L.polygon(
        eastAngliaBoundary,
        {
            color: "#111111",
            weight: 3,

            fillColor: "#ffffff",
            fillOpacity: 0.58,

            dashArray: "7 6"
        }
    ).addTo(map);

    eastAnglia.bindPopup(`
        <strong>Suffolk & East Anglia</strong>
        Our service area.
    `);

    /*
     * Correct the map size after page animations finish.
     */
    window.setTimeout(() => {
        map.invalidateSize();
    }, 300);

    window.addEventListener("resize", () => {
        map.invalidateSize();
    });
}

/* =========================
   Load Leaflet
========================= */

function loadLeafletAssets() {
    if (window.L) {
        return Promise.resolve();
    }

    if (
        !document.querySelector("#leaflet-styles")
    ) {
        const stylesheet =
            document.createElement("link");

        stylesheet.id = "leaflet-styles";
        stylesheet.rel = "stylesheet";

        stylesheet.href =
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

        stylesheet.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";

        stylesheet.crossOrigin = "";

        document.head.appendChild(stylesheet);
    }

    return new Promise((resolve, reject) => {
        const existingScript =
            document.querySelector("#leaflet-script");

        if (existingScript) {
            existingScript.addEventListener(
                "load",
                resolve,
                {
                    once: true
                }
            );

            existingScript.addEventListener(
                "error",
                reject,
                {
                    once: true
                }
            );

            return;
        }

        const script =
            document.createElement("script");

        script.id = "leaflet-script";

        script.src =
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

        script.integrity =
            "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";

        script.crossOrigin = "";

        script.addEventListener(
            "load",
            resolve,
            {
                once: true
            }
        );

        script.addEventListener(
            "error",
            reject,
            {
                once: true
            }
        );

        document.head.appendChild(script);
    });
}

/* =========================
   Map styling
========================= */

function addRealisticMapStyles() {
    if (
        document.querySelector(
            "#realistic-contact-map-styles"
        )
    ) {
        return;
    }

    const styles =
        document.createElement("style");

    styles.id =
        "realistic-contact-map-styles";

    styles.textContent = `
        #contact-uk-map {
            width: 100%;
            height: 390px;
            padding: 0;

            overflow: hidden;

            background-color: #181818;
            border: 1px solid #333333;
            border-radius: 25px;

            isolation: isolate;
        }

        #contact-uk-map .leaflet-tile-pane {
            filter:
                grayscale(1)
                contrast(0.92)
                brightness(0.92);
        }

        #contact-uk-map .leaflet-control-zoom {
            overflow: hidden;
            border: 0;

            border-radius: 12px;
            box-shadow: 0 5px 18px rgba(0, 0, 0, 0.2);
        }

        #contact-uk-map .leaflet-control-zoom a {
            color: #111111;
            background-color: #ffffff;
            border: 0;
        }

        #contact-uk-map
        .leaflet-control-attribution {
            color: #555555;
            font-size: 9px;

            background-color:
                rgba(255, 255, 255, 0.88);
        }

        #contact-uk-map
        .leaflet-control-attribution a {
            color: #111111;
        }

        .contact-map-pin {
            width: 18px;
            height: 18px;

            background-color: #111111;
            border: 4px solid #ffffff;
            border-radius: 50%;

            box-shadow:
                0 0 0 8px rgba(17, 17, 17, 0.2),
                0 5px 15px rgba(0, 0, 0, 0.3);

            animation:
                contact-map-pin-pulse
                2.2s ease-in-out infinite;
        }

        .contact-map-popup
        .leaflet-popup-content-wrapper {
            color: #ffffff;
            background-color: #111111;

            border-radius: 12px;

            box-shadow:
                0 12px 28px rgba(0, 0, 0, 0.25);
        }

        .contact-map-popup
        .leaflet-popup-tip {
            background-color: #111111;
        }

        .contact-map-popup
        .leaflet-popup-content {
            margin: 13px 16px;
            line-height: 1.45;
        }

        .contact-map-popup strong {
            display: block;
            margin-bottom: 2px;
        }

        .contact-map-fallback {
            display: flex;
            min-height: 390px;
            padding: 30px;

            align-items: center;
            justify-content: center;
            flex-direction: column;

            color: #aaaaaa;
            line-height: 1.7;
            text-align: center;
        }

        .contact-map-fallback strong {
            color: #ffffff;
        }

        @keyframes contact-map-pin-pulse {
            50% {
                box-shadow:
                    0 0 0 14px rgba(17, 17, 17, 0.08),
                    0 5px 15px rgba(0, 0, 0, 0.3);
            }
        }

        @media (max-width: 620px) {
            #contact-uk-map {
                height: 330px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .contact-map-pin {
                animation: none;
            }
        }
    `;

    document.head.appendChild(styles);
}

/* =========================
   Pricing estimate hand-off
========================= */

function readPricingEstimate() {
    const parameters = new URLSearchParams(
        window.location.search
    );
    const encodedEstimate = parameters.get("estimate");

    let estimate = null;

    if (encodedEstimate) {
        try {
            estimate = JSON.parse(encodedEstimate);
        } catch (error) {
            console.warn("The estimate link could not be read.", error);
        }
    }

    if (!estimate && encodedEstimate) {
        try {
            const savedEstimate = window.sessionStorage.getItem(
                "ambition-it-estimate"
            );

            if (savedEstimate) {
                estimate = JSON.parse(savedEstimate);
            }
        } catch (error) {
            console.warn(
                "The saved estimate could not be read.",
                error
            );
        }
    }

    const validCosts = Boolean(
        estimate &&
        estimate.costs &&
        Number.isFinite(estimate.costs.projectSubtotal) &&
        Number.isFinite(estimate.costs.projectTotal) &&
        Number.isFinite(estimate.costs.monthlyServices) &&
        Number.isFinite(estimate.costs.annualServices) &&
        Number.isFinite(estimate.costs.annualHosting) &&
        Number.isFinite(estimate.costs.annualTotal)
    );

    if (
        !estimate ||
        estimate.version !== 1 ||
        typeof estimate.packageName !== "string" ||
        !Array.isArray(estimate.includedItems) ||
        !validCosts
    ) {
        return null;
    }

    const promotionIsCurrent = Boolean(
        estimate.promotion &&
        window.AmbitionITPromotion &&
        typeof window.AmbitionITPromotion.isActive === "function" &&
        window.AmbitionITPromotion.isActive() &&
        window.AmbitionITPromotion.config.code ===
            estimate.promotion.code
    );

    if (estimate.promotion && !promotionIsCurrent) {
        estimate.costs.projectTotal =
            estimate.costs.projectSubtotal;
        estimate.costs.promotionDiscount = 0;
        estimate.promotion = null;
    }

    return estimate;
}

function setupPricingEstimateHandoff() {
    const estimate = readPricingEstimate();
    const preview = document.querySelector(
        "#contact-estimate-preview"
    );

    if (!estimate || !preview) {
        return;
    }

    const money = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0
    });

    const includedItems = estimate.includedItems.filter(
        (item) => typeof item === "string" && item.trim()
    );
    const estimateItems = document.querySelector(
        "#contact-estimate-items"
    );

    estimateItems.replaceChildren(
        ...includedItems.map((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem;
        })
    );

    document.querySelector(
        "#contact-estimate-project-total"
    ).textContent = money.format(estimate.costs.projectTotal);

    document.querySelector(
        "#contact-estimate-monthly-total"
    ).textContent =
        `${money.format(estimate.costs.monthlyServices)}/month`;

    document.querySelector(
        "#contact-estimate-hosting-total"
    ).textContent =
        `${money.format(estimate.costs.annualHosting)}/year`;

    const promotionMessage = document.querySelector(
        "#contact-estimate-promotion"
    );

    if (
        estimate.promotion &&
        Number.isFinite(estimate.promotion.discountAmount)
    ) {
        promotionMessage.hidden = false;
        promotionMessage.textContent =
            `${estimate.promotion.label}: ` +
            `${money.format(estimate.promotion.discountAmount)} saved`;
    }

    const addonNames = Array.isArray(estimate.addons)
        ? estimate.addons
            .map((addon) => addon && addon.name)
            .filter(Boolean)
        : [];

    const fieldValues = {
        "#estimate-package": estimate.packageName,
        "#estimate-pages": String(estimate.totalPages),
        "#estimate-addons": addonNames.length
            ? addonNames.join(", ")
            : "None selected",
        "#estimate-product-uploads": estimate.productUploads
            ? "Yes — up to five simple products per month"
            : "No",
        "#estimate-project-total": money.format(
            estimate.costs.projectTotal
        ),
        "#estimate-monthly-services":
            `${money.format(estimate.costs.monthlyServices)}/month`,
        "#estimate-annual-services":
            `${money.format(estimate.costs.annualServices)}/year`,
        "#estimate-annual-hosting":
            `${money.format(estimate.costs.annualHosting)}/year`,
        "#estimate-annual-total":
            `${money.format(estimate.costs.annualTotal)}/year`,
        "#estimate-promotion": estimate.promotion
            ? `${estimate.promotion.label} — ` +
                `${money.format(estimate.promotion.discountAmount)} saved`
            : "No promotion"
    };

    Object.entries(fieldValues).forEach(([selector, value]) => {
        const field = document.querySelector(selector);

        if (field) {
            field.value = value;
        }
    });

    const newWebsiteOption = document.querySelector(
        'input[name="service"][value="new-website"]'
    );

    if (newWebsiteOption) {
        newWebsiteOption.checked = true;
    }

    const budgetField = document.querySelector("#project-budget");
    const projectTotal = estimate.costs.projectTotal;

    if (budgetField) {
        if (projectTotal < 500) {
            budgetField.value = "under-500";
        } else if (projectTotal <= 999) {
            budgetField.value = "500-999";
        } else if (projectTotal <= 2499) {
            budgetField.value = "1000-2499";
        } else {
            budgetField.value = "2500-plus";
        }
    }

    const messageField = document.querySelector("#project-message");

    if (messageField) {
        messageField.placeholder =
            "Tell me about your business and anything else " +
            "I should know about this estimate.";
    }

    preview.hidden = false;
}

/* =========================
   Formspark contact form
========================= */

function setupFormsparkContactForm() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#contact-form-status");

    if (!form || !status) {
        return;
    }

    const submitButton = form.querySelector(".contact-submit");
    const submitLabel = form.querySelector(".contact-submit-label");
    const defaultSubmitText = submitLabel
        ? submitLabel.textContent
        : "Send My Enquiry";

    const showStatus = (message, type) => {
        status.textContent = message;
        status.classList.remove("is-error", "is-success", "is-sending");
        status.classList.add("is-visible", `is-${type}`);
    };

    const clearStatus = () => {
        status.textContent = "";
        status.classList.remove(
            "is-visible",
            "is-error",
            "is-success",
            "is-sending"
        );
    };

    form.addEventListener("input", (event) => {
        if (event.target.matches("input, select, textarea")) {
            event.target.classList.remove("is-invalid");
        }

        if (status.classList.contains("is-error")) {
            clearStatus();
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const invalidFields = form.querySelectorAll(":invalid");

        form.querySelectorAll(".is-invalid").forEach((field) => {
            field.classList.remove("is-invalid");
        });

        if (invalidFields.length) {
            invalidFields.forEach((field) => {
                field.classList.add("is-invalid");
            });

            showStatus(
                "Please complete all required fields before sending your enquiry.",
                "error"
            );

            invalidFields[0].focus();
            return;
        }

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        delete payload["_email.subject"];
        delete payload["_email.from"];
        delete payload["_email.template.title"];

        Object.entries(payload).forEach(([fieldName, value]) => {
            if (
                fieldName.startsWith("estimate_") &&
                !value
            ) {
                delete payload[fieldName];
            }
        });

        payload.consent = formData.has("consent")
            ? "Agreed"
            : "Not agreed";

        payload._email = {
            from: "Ambition IT Website",
            subject: `New website enquiry from ${payload.name}`,
            template: {
                title: "New Ambition IT enquiry"
            }
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.setAttribute("aria-busy", "true");
        }

        if (submitLabel) {
            submitLabel.textContent = "Sending Enquiry...";
        }

        showStatus("Your enquiry is being sent securely...", "sending");

        try {
            const response = await fetch(form.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Formspark returned ${response.status}.`);
            }

            form.reset();
            showStatus(
                "Thank you. Your enquiry has been sent successfully, and I’ll be in touch soon.",
                "success"
            );
            status.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } catch (error) {
            console.error("The contact form could not be submitted.", error);
            showStatus(
                "Sorry, your enquiry could not be sent. Please try again or email ambitionit.business@gmail.com.",
                "error"
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.removeAttribute("aria-busy");
            }

            if (submitLabel) {
                submitLabel.textContent = defaultSubmitText;
            }
        }
    });
}

/* =========================
   Initialize contact page
========================= */

function initializeContactPage() {
    setupRealisticContactMap();
    setupPricingEstimateHandoff();
    setupFormsparkContactForm();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeContactPage);
} else {
    initializeContactPage();
}
