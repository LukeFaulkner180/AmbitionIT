document.addEventListener("DOMContentLoaded", () => {
    /*
     * =========================================
     * CHANGE THE PROGRESS BAR HERE
     * =========================================
     *
     * percentage:
     * The final progress percentage.
     *
     * animationDuration:
     * How long the progress animation takes.
     * 4000 milliseconds = 4 seconds.
     *
     * animationDelay:
     * How long it waits before starting.
     */
    const progressSettings = {
        percentage: 25,
        animationDuration: 5000,
        animationDelay: 900
    };

    const progressFill =
        document.querySelector("#progress-fill");

    const progressNumber =
        document.querySelector("#progress-number");

    const progressTrack =
        document.querySelector("#progress-track");

    const comingPage =
        document.querySelector(".coming-page");

    if (
        !progressFill ||
        !progressNumber ||
        !progressTrack
    ) {
        return;
    }

    /*
     * Keep the final percentage between 0 and 100.
     */
    const targetPercentage = Math.max(
        0,
        Math.min(
            100,
            progressSettings.percentage
        )
    );

    progressTrack.setAttribute(
        "aria-valuenow",
        String(targetPercentage)
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    /*
     * =========================================
     * CURSOR SPOTLIGHT
     * =========================================
     *
     * This runs only on computers with a mouse.
     * It is automatically disabled on touchscreens.
     */
    if (
        !reducedMotion &&
        finePointer &&
        comingPage
    ) {
        comingPage.addEventListener(
            "pointerenter",
            () => {
                comingPage.style.setProperty(
                    "--spotlight-opacity",
                    "1"
                );
            }
        );

        comingPage.addEventListener(
            "pointermove",
            (event) => {
                const pageBounds =
                    comingPage.getBoundingClientRect();

                const pointerX =
                    event.clientX - pageBounds.left;

                const pointerY =
                    event.clientY - pageBounds.top;

                comingPage.style.setProperty(
                    "--mouse-x",
                    `${pointerX}px`
                );

                comingPage.style.setProperty(
                    "--mouse-y",
                    `${pointerY}px`
                );
            }
        );

        comingPage.addEventListener(
            "pointerleave",
            () => {
                comingPage.style.setProperty(
                    "--spotlight-opacity",
                    "0"
                );
            }
        );
    }

    /*
     * Display the final progress immediately if
     * reduced-motion is enabled.
     */
    if (reducedMotion) {
        progressFill.style.width =
            `${targetPercentage}%`;

        progressNumber.textContent =
            `${targetPercentage}%`;

        return;
    }

    /*
     * =========================================
     * ANIMATED PROGRESS BAR
     * =========================================
     */
    window.setTimeout(() => {
        const startTime =
            performance.now();

        function updateProgress(currentTime) {
            const elapsedTime =
                currentTime - startTime;

            const animationProgress = Math.min(
                elapsedTime /
                    progressSettings.animationDuration,
                1
            );

            /*
             * Ease-out animation:
             * starts quickly and slows smoothly.
             */
            const easedProgress =
                1 -
                Math.pow(
                    1 - animationProgress,
                    3
                );

            const currentPercentage =
                targetPercentage * easedProgress;

            progressFill.style.width =
                `${currentPercentage}%`;

            progressNumber.textContent =
                `${Math.round(currentPercentage)}%`;

            if (animationProgress < 1) {
                window.requestAnimationFrame(
                    updateProgress
                );
            }
        }

        window.requestAnimationFrame(
            updateProgress
        );
    }, progressSettings.animationDelay);
});