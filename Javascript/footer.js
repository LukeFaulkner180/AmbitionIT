class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
                <div class="footer-container">
                    <div class="footer-top">

                        <!-- Brand section -->
                        <div class="footer-brand">
                            <a
                                href="/"
                                class="footer-brand-link"
                            >
                                <img
                                    src="/imgs/ambition-it-logo-transparent-cropped.png"
                                    alt="Ambition IT"
                                    class="footer-logo"
                                >

                                <span>Ambition IT</span>
                            </a>

                            <p>
                                Simple, professional websites built to help
                                businesses establish and grow their online
                                presence.
                            </p>

                            <!-- Start a Project button -->
                            <a
                                class="footer-project-button"
                                href="/pages/contact.html"
                                style="
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    width: fit-content;
                                    min-height: 48px;
                                    padding: 13px 24px;
                                    color: #111111;
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 0.95rem;
                                    font-weight: 700;
                                    line-height: 1;
                                    text-decoration: none;
                                    background-color: #ffffff;
                                    border: 2px solid #ffffff;
                                    border-radius: 999px;
                                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
                                    cursor: pointer;
                                    transition:
                                        color 0.25s ease,
                                        background-color 0.25s ease,
                                        box-shadow 0.25s ease,
                                        transform 0.25s ease;
                                "
                                onmouseenter="
                                    this.style.color='#ffffff';
                                    this.style.backgroundColor='transparent';
                                    this.style.transform='translateY(-3px)';
                                    this.style.boxShadow='0 12px 28px rgba(0,0,0,0.3)';
                                "
                                onmouseleave="
                                    this.style.color='#111111';
                                    this.style.backgroundColor='#ffffff';
                                    this.style.transform='translateY(0)';
                                    this.style.boxShadow='0 8px 24px rgba(0,0,0,0.22)';
                                "
                            >
                                Start a Project
                            </a>

                            <!-- Social media icons -->
                            <div
                                class="footer-socials"
                                aria-label="Ambition IT social media"
                            >

                                <!-- Instagram -->
                                <a
                                    href="https://www.instagram.com/ambitionit_suffolk/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit Ambition IT on Instagram"
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
                                    href="https://www.facebook.com/profile.php?id=61585691250352"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit Ambition IT on Facebook"
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

                            </div>
                        </div>

                        <!-- Company links -->
                        <nav
                            class="footer-column"
                            aria-label="Company links"
                        >
                            <h2>Company</h2>

                            <ul>
                                <li>
                                    <a href="/">
                                        Home
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/about.html">
                                        About Us
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/our-work.html">
                                        Our Work
                                    </a>
                                </li>

                                <li>
                                    <a href="https://portal.ambition-it.co.uk/login">
                                        Client Hub
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/free-website.html">
                                        Free Website Programme
                                    </a>
                                </li>

                                <li>
                                    <a href="/#process">
                                        Our Process
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/pricing.html">
                                        Pricing
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/contact.html">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </nav>

                        <!-- Service links -->
                        <nav
                            class="footer-column"
                            aria-label="Service links"
                        >
                            <h2>Services</h2>

                            <ul>
                                <li>
                                    <a href="/pages/web-design.html">
                                        Web Design
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/services.html#one-page-websites">
                                        One-Page Websites
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/services.html#multi-page-websites">
                                        Multi-Page Websites
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/services.html#management">
                                        Website Management
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/services.html#support">
                                        Hosting &amp; Support
                                    </a>
                                </li>
                            </ul>
                        </nav>

                        <!-- Legal links -->
                        <nav
                            class="footer-column"
                            aria-label="Legal links"
                        >
                            <h2>Legal</h2>

                            <ul>
                                <li>
                                    <a href="/pages/legal.html#privacy">
                                        Privacy Notice
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/legal.html#cookies">
                                        Cookie Policy
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/legal.html#terms">
                                        Terms &amp; Conditions
                                    </a>
                                </li>

                                <li>
                                    <a href="/pages/legal.html#accessibility">
                                        Accessibility Statement
                                    </a>
                                </li>
                            </ul>
                        </nav>

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

if (!customElements.get("site-footer")) {
    customElements.define(
        "site-footer",
        SiteFooter
    );
}
