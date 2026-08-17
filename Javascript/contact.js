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
   Initialize map on page load
========================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupRealisticContactMap);
} else {
    setupRealisticContactMap();
}