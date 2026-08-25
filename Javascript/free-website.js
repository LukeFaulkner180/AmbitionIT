document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#free-website-form");
    const status = document.querySelector("#free-form-status");
    if (!form || !status) return;
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); status.textContent = "Please complete all required fields."; status.className = "free-form-status is-error"; return; }
        const button = form.querySelector(".free-submit");
        button.disabled = true; button.querySelector("span").textContent = "Sending application…"; status.textContent = "";
        try {
            const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
            if (!response.ok) throw new Error("Submission failed");
            form.reset(); status.textContent = "Thank you — your application has been sent. Ambition IT will be in touch if we need more information."; status.className = "free-form-status is-success";
        } catch (error) {
            status.innerHTML = 'Your application could not be sent. Please try again or email <a href="mailto:ambitionit.business@gmail.com">ambitionit.business@gmail.com</a>.'; status.className = "free-form-status is-error";
        } finally { button.disabled = false; button.querySelector("span").textContent = "Submit my application"; }
    });
});

