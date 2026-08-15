class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
                <div class="footer-container">

                    <div class="footer-top">

                        <!-- Brand section -->
                        <div class="footer-brand">
                            <a
                                href="index.html"
                                class="footer-brand-link"
                            >
                                <img
                                    src="../imgs/ambition-it-logo-transparent-cropped.png"
                                    alt="Ambition IT"
                                    class="footer-logo"
                                >

                                <span>Ambition IT</span>
                            </a>

                            <p>
                                Simple, professional websites built to
                                help businesses establish and grow their
                                online presence.
                            </p>

                            <a
                                class="footer-contact-button"
                                href="contact.html"
                            >
                                Start a Project
                            </a>

                            <div class="footer-socials">

                                <!-- Instagram -->
                                <a
                                    href="https://www.instagram.com/YOUR_USERNAME/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Ambition IT on Instagram"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="5"
                                        ></rect>

                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="4"
                                        ></circle>

                                        <circle
                                            cx="17.5"
                                            cy="6.5"
                                            r="1"
                                            class="social-icon-fill"
                                        ></circle>
                                    </svg>
                                </a>

                                <!-- Facebook -->
                                <a
                                    href="https://www.facebook.com/YOUR_USERNAME"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Ambition IT on Facebook"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.6.4-1 1-1z"
                                        ></path>
                                    </svg>
                                </a>

                                <!-- LinkedIn -->
                                <a
                                    href="https://www.linkedin.com/company/YOUR_USERNAME"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Ambition IT on LinkedIn"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="3"
                                            y="9"
                                            width="4"
                                            height="12"
                                        ></rect>

                                        <circle
                                            cx="5"
                                            cy="5"
                                            r="2"
                                        ></circle>

                                        <path
                                            d="M11 9h4v2c1-1.5 2.5-2.5 4.5-2.5
                                            3 0 4.5 2 4.5 5.5v7h-4v-6.5
                                            c0-1.5-.5-2.5-2-2.5s-3 1-3 3v6h-4z"
                                        ></path>
                                    </svg>
                                </a>

                            </div>
                        </div>

                        <!-- Company column -->
                        <div class="footer-column">
                            <h2>Company</h2>

                            <ul>
                                <li>
                                    <a href="index.html">Home</a>
                                </li>

                                <li>
                                    <a href="about.html">About Us</a>
                                </li>

                                <li>
                                    <a href="index.html#work">
                                        Our Work
                                    </a>
                                </li>

                                <li>
                                    <a href="index.html#process">
                                        Our Process
                                    </a>
                                </li>

                                <li>
                                    <a href="pricing.html">Pricing</a>
                                </li>

                                <li>
                                    <a href="contact.html">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Services column -->
                        <div class="footer-column">
                            <h2>Services</h2>

                            <ul>
                                <li>
                                    <a href="web-design.html">
                                        Web Design
                                    </a>
                                </li>

                                <li>
                                    <a href="services.html#one-page-websites">
                                        One-Page Websites
                                    </a>
                                </li>

                                <li>
                                    <a href="services.html#multi-page-websites">
                                        Multi-Page Websites
                                    </a>
                                </li>

                                <li>
                                    <a href="services.html#website-management">
                                        Website Management
                                    </a>
                                </li>

                                <li>
                                    <a href="services.html#hosting">
                                        Hosting &amp; Support
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Legal column -->
                        <div class="footer-column">
                            <h2>Legal</h2>

                            <ul>
                                <li>
                                    <a href="privacy.html">
                                        Privacy Notice
                                    </a>
                                </li>

                                <li>
                                    <a href="cookies.html">
                                        Cookie Policy
                                    </a>
                                </li>

                                <li>
                                    <a href="terms.html">
                                        Terms &amp; Conditions
                                    </a>
                                </li>

                                <li>
                                    <a href="accessibility.html">
                                        Accessibility Statement
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div class="footer-bottom">
                        <p>
                            &copy;
                            <span class="footer-year"></span>
                            Ambition IT. All rights reserved.
                        </p>
                    </div>

                </div>
            </footer>
        `;

        const yearElement =
            this.querySelector(".footer-year");

        if (yearElement) {
            yearElement.textContent =
                new Date().getFullYear();
        }
    }
}

customElements.define("site-footer", SiteFooter);