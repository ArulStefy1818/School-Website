
/* ==========================================
   STACKLY EDUCATION
   LOGIN + SIGN UP JAVASCRIPT
   Email Storage Fix
   Signup -> Login Form
   Role-Based Dashboard Redirect
   Custom Role Dropdowns
   Form Validation + Messages
========================================== */

(function () {
    "use strict";

    /* ==========================================
       1. ELEMENTS AND CONFIGURATION
    ========================================== */

    const page = document.querySelector(".stackly-auth-page");

    if (!page) return;

    const loginForm = document.getElementById("stacklyLoginForm");
    const signupForm = document.getElementById("stacklySignupForm");
    const forgotForm = document.getElementById("stacklyForgotForm");

    const tabsContainer = page.querySelector(".stackly-auth-tabs");
    const tabs = page.querySelectorAll("[data-auth-tab]");

    const STORAGE_KEYS = {
        loginEmail: "loginEmail",
        educationLoginEmail: "stacklyEduLoginEmail",
        adminEmail: "stacklyAdminEmail",
        rememberedEmail: "stacklyEduRememberedEmail"
    };

    const dashboards = {
        admin: "admin.html",
        staff: "staff.html",
        student: "student.html"
    };

    const roleLabels = {
        admin: "Admin",
        staff: "Staff",
        student: "Student"
    };

    const forms = {
        login: loginForm,
        signup: signupForm,
        forgot: forgotForm
    };

    /* ==========================================
       2. STORAGE HELPERS
    ========================================== */

    function saveLoginEmail(email) {
        try {
            localStorage.setItem(STORAGE_KEYS.loginEmail, email);
            localStorage.setItem(
                STORAGE_KEYS.educationLoginEmail,
                email
            );
            localStorage.setItem(STORAGE_KEYS.adminEmail, email);

            return true;
        } catch (error) {
            return false;
        }
    }

    function saveRememberedEmail(email) {
        try {
            if (email) {
                localStorage.setItem(
                    STORAGE_KEYS.rememberedEmail,
                    email
                );
            } else {
                localStorage.removeItem(
                    STORAGE_KEYS.rememberedEmail
                );
            }
        } catch (error) {
            // Continue without Remember Me storage.
        }
    }

    function getRememberedEmail() {
        try {
            return (
                localStorage.getItem(
                    STORAGE_KEYS.rememberedEmail
                ) || ""
            ).trim();
        } catch (error) {
            return "";
        }
    }

    function normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    /* ==========================================
       3. FORM MESSAGE HELPERS
    ========================================== */

    function getMessageElement(form) {
        if (!form) return null;

        let element = form.querySelector(
            ".stackly-auth-form-message"
        );

        if (!element) {
            element = document.createElement("div");
            element.className = "stackly-auth-form-message";
            element.setAttribute("role", "status");
            element.setAttribute("aria-live", "polite");
            element.hidden = true;
            form.appendChild(element);
        }

        return element;
    }

    function showMessage(form, text, type = "info") {
        const element = getMessageElement(form);

        if (!element) return;

        element.textContent = text;
        element.className =
            "stackly-auth-form-message is-" + type;
        element.hidden = false;
    }

    function clearMessage(form) {
        if (!form) return;

        const element = form.querySelector(
            ".stackly-auth-form-message"
        );

        if (!element) return;

        element.textContent = "";
        element.className = "stackly-auth-form-message";
        element.hidden = true;
    }

    function clearAllMessages() {
        Object.values(forms).forEach(clearMessage);
    }

    function showFieldError(form, text, field) {
        showMessage(form, text, "error");

        if (!field || field.disabled) return;

        if (field.type === "hidden") {
            const trigger = page.querySelector(
                '[data-role-trigger="' + field.id + '"]'
            );

            if (trigger) trigger.focus();
            return;
        }

        field.focus();
    }

    /* ==========================================
       4. VALIDATION HELPERS
    ========================================== */

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
            String(email || "").trim()
        );
    }

    function validateName(name) {
        return /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u
            .test(String(name || "").trim());
    }

    function validatePassword(password) {
        return typeof password === "string" &&
            password.length >= 6;
    }

    /* ==========================================
       5. CUSTOM ROLE DROPDOWN HELPERS
    ========================================== */

    function closeAllDropdowns(except = null) {
        page.querySelectorAll(
            ".stackly-auth-select-wrap"
        ).forEach(function (wrapper) {
            if (wrapper === except) return;

            const trigger = wrapper.querySelector(
                "[data-role-trigger]"
            );

            const dropdown = wrapper.querySelector(
                ".stackly-auth-dropdown"
            );

            if (!trigger || !dropdown) return;

            trigger.setAttribute("aria-expanded", "false");
            dropdown.hidden = true;
        });
    }

    function setSelectedRole(inputId, role) {
        const input = document.getElementById(inputId);

        const trigger = page.querySelector(
            '[data-role-trigger="' + inputId + '"]'
        );

        if (!input || !trigger || !roleLabels[role]) return;

        input.value = role;

        const label = trigger.querySelector(
            ".stackly-auth-select-value"
        );

        if (label) {
            label.textContent = roleLabels[role];
            label.classList.add("has-value");
        }

        const wrapper = trigger.closest(
            ".stackly-auth-select-wrap"
        );

        if (!wrapper) return;

        wrapper.querySelectorAll(
            "[data-role-value]"
        ).forEach(function (option) {
            const selected = option.dataset.roleValue === role;

            option.classList.toggle("is-selected", selected);
            option.setAttribute(
                "aria-selected",
                String(selected)
            );
        });
    }

    /* ==========================================
       6. FORM SWITCHING
    ========================================== */

    function switchForm(formName, options = {}) {
        if (!forms[formName]) return;

        closeAllDropdowns();

        if (!options.keepMessages) {
            clearAllMessages();
        }

        Object.entries(forms).forEach(function ([name, form]) {
            if (!form) return;

            const active = name === formName;

            form.hidden = !active;
            form.classList.toggle("is-active", active);
        });

        const selectedTab =
            formName === "forgot" ? "login" : formName;

        tabs.forEach(function (tab) {
            const active =
                tab.dataset.authTab === selectedTab;

            tab.classList.toggle("is-active", active);

            if (tab.hasAttribute("aria-selected")) {
                tab.setAttribute(
                    "aria-selected",
                    String(active)
                );
            }
        });

        if (tabsContainer) {
            tabsContainer.hidden = formName === "forgot";

            tabsContainer.classList.toggle(
                "signup-active",
                formName === "signup"
            );
        }

        if (formName === "forgot") {
            const loginEmail = document.getElementById(
                "stacklyLoginEmail"
            );

            const forgotEmail = document.getElementById(
                "stacklyForgotEmail"
            );

            if (loginEmail && forgotEmail) {
                forgotEmail.value = loginEmail.value.trim();
            }
        }

        requestAnimationFrame(function () {
            const activeForm = forms[formName];

            const firstInput = activeForm?.querySelector(
                'input:not([type="hidden"]):not([type="checkbox"]):not([type="submit"]):not([type="password"])'
            ) || activeForm?.querySelector(
                'input:not([type="hidden"]):not([type="checkbox"]):not([type="submit"])'
            );

            if (firstInput) {
                firstInput.focus({ preventScroll: true });
            }
        });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const formName = tab.dataset.authTab;

            if (forms[formName]) {
                switchForm(formName);
            }
        });
    });

    /* ==========================================
       7. ROLE DROPDOWNS
    ========================================== */

    page.querySelectorAll(
        "[data-role-trigger]"
    ).forEach(function (trigger) {
        const wrapper = trigger.closest(
            ".stackly-auth-select-wrap"
        );

        if (!wrapper) return;

        const dropdown = wrapper.querySelector(
            ".stackly-auth-dropdown"
        );

        const inputId = trigger.dataset.roleTrigger;

        const hiddenInput = document.getElementById(inputId);

        if (!dropdown || !hiddenInput) return;

        dropdown.hidden = true;
        trigger.setAttribute("aria-expanded", "false");

        trigger.addEventListener("click", function () {
            const isOpen =
                trigger.getAttribute("aria-expanded") === "true";

            closeAllDropdowns(isOpen ? null : wrapper);

            trigger.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            dropdown.hidden = isOpen;
        });

        dropdown.querySelectorAll(
            "[data-role-value]"
        ).forEach(function (option) {
            option.setAttribute("role", "option");
            option.setAttribute("tabindex", "0");
            option.setAttribute("aria-selected", "false");

            function selectOption() {
                const role = option.dataset.roleValue;

                if (!roleLabels[role]) return;

                setSelectedRole(inputId, role);
                closeAllDropdowns();

                clearMessage(
                    inputId === "stacklyLoginRole"
                        ? loginForm
                        : signupForm
                );
            }

            option.addEventListener("click", function () {
                selectOption();
            });

            option.addEventListener("keydown", function (event) {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    selectOption();
                    trigger.focus();
                }
            });
        });

        trigger.addEventListener("keydown", function (event) {
            if (
                event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                const isOpen =
                    trigger.getAttribute("aria-expanded") === "true";

                if (!isOpen) trigger.click();

                const firstOption = dropdown.querySelector(
                    "[data-role-value]"
                );

                if (firstOption) firstOption.focus();
            }
        });

        dropdown.addEventListener("keydown", function (event) {
            const options = Array.from(
                dropdown.querySelectorAll("[data-role-value]")
            );

            const index = options.indexOf(document.activeElement);

            if (event.key === "Escape") {
                event.preventDefault();
                closeAllDropdowns();
                trigger.focus();
            } else if (
                event.key === "ArrowDown" &&
                options.length
            ) {
                event.preventDefault();
                options[(index + 1) % options.length].focus();
            } else if (
                event.key === "ArrowUp" &&
                options.length
            ) {
                event.preventDefault();

                options[
                    (index - 1 + options.length) % options.length
                ].focus();
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (
            !event.target.closest(
                ".stackly-auth-select-wrap"
            )
        ) {
            closeAllDropdowns();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeAllDropdowns();
        }
    });

    /* ==========================================
       8. PASSWORD VISIBILITY
    ========================================== */

    page.querySelectorAll(
        "[data-password-toggle]"
    ).forEach(function (button) {
        button.addEventListener("click", function () {
            const input = document.getElementById(
                button.dataset.passwordToggle
            );

            if (!input) return;

            const show = input.type === "password";

            input.type = show ? "text" : "password";

            button.innerHTML = show
                ? '<i class="fa-regular fa-eye-slash" aria-hidden="true"></i>'
                : '<i class="fa-regular fa-eye" aria-hidden="true"></i>';

            button.setAttribute(
                "aria-label",
                show ? "Hide password" : "Show password"
            );

            button.setAttribute("aria-pressed", String(show));
        });
    });

    /* ==========================================
       9. DASHBOARD REDIRECT
    ========================================== */

    function redirectToDashboard(role) {
        const destination = dashboards[role];

        if (!destination) {
            showMessage(
                loginForm,
                "Please select a valid account role.",
                "error"
            );
            return;
        }

        showMessage(
            loginForm,
            "Login successful! Redirecting to your dashboard...",
            "success"
        );

        window.setTimeout(function () {
            window.location.href = destination;
        }, 700);
    }

    /* ==========================================
       10. LOGIN FORM
    ========================================== */

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            clearMessage(loginForm);
            closeAllDropdowns();

            const roleInput = document.getElementById(
                "stacklyLoginRole"
            );

            const emailInput = document.getElementById(
                "stacklyLoginEmail"
            );

            const passwordInput = document.getElementById(
                "stacklyLoginPassword"
            );

            const rememberInput = document.getElementById(
                "stacklyRememberMe"
            );

            if (
                !roleInput ||
                !emailInput ||
                !passwordInput
            ) {
                showMessage(
                    loginForm,
                    "A required login field is missing from the page.",
                    "error"
                );
                return;
            }

            const role = roleInput.value;
            const email = normalizeEmail(emailInput.value);
            const password = passwordInput.value;

            if (!role || !roleLabels[role]) {
                showFieldError(
                    loginForm,
                    "Please select your role: Admin, Staff, or Student.",
                    roleInput
                );
                return;
            }

            if (!email) {
                showFieldError(
                    loginForm,
                    "Please enter your email address.",
                    emailInput
                );
                return;
            }

            if (!validateEmail(email)) {
                showFieldError(
                    loginForm,
                    "Please enter a valid email address.",
                    emailInput
                );
                return;
            }

            if (!password) {
                showFieldError(
                    loginForm,
                    "Please enter your password.",
                    passwordInput
                );
                return;
            }

            if (!validatePassword(password)) {
                showFieldError(
                    loginForm,
                    "Your password must contain at least 6 characters.",
                    passwordInput
                );
                return;
            }

            /*
             * Save the email for dashboard display.
             * Never save the password.
             *
             * These keys match admin.js.
             */

            saveLoginEmail(email);

            if (rememberInput && rememberInput.checked) {
                saveRememberedEmail(email);
            } else {
                saveRememberedEmail("");
            }

            redirectToDashboard(role);
        });
    }

    /* ==========================================
       11. SIGNUP FORM
       Signup details are not stored.
       The email and role are passed to the login
       form only for the current page session.
    ========================================== */

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            clearMessage(signupForm);
            closeAllDropdowns();

            const nameInput = document.getElementById(
                "stacklySignupName"
            );

            const roleInput = document.getElementById(
                "stacklySignupRole"
            );

            const emailInput = document.getElementById(
                "stacklySignupEmail"
            );

            const passwordInput = document.getElementById(
                "stacklySignupPassword"
            );

            const confirmInput = document.getElementById(
                "stacklyConfirmPassword"
            );

            const termsInput = document.getElementById(
                "stacklyTerms"
            );

            if (
                !nameInput ||
                !roleInput ||
                !emailInput ||
                !passwordInput ||
                !confirmInput
            ) {
                showMessage(
                    signupForm,
                    "A required signup field is missing from the page.",
                    "error"
                );
                return;
            }

            const name = nameInput.value.trim();
            const role = roleInput.value;
            const email = normalizeEmail(emailInput.value);
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;

            if (!name) {
                showFieldError(
                    signupForm,
                    "Please enter your full name.",
                    nameInput
                );
                return;
            }

            if (!validateName(name)) {
                showFieldError(
                    signupForm,
                    "Please enter a valid name using letters, spaces, hyphens, or apostrophes.",
                    nameInput
                );
                return;
            }

            if (!role || !roleLabels[role]) {
                showFieldError(
                    signupForm,
                    "Please select your account role.",
                    roleInput
                );
                return;
            }

            if (!email) {
                showFieldError(
                    signupForm,
                    "Please enter your email address.",
                    emailInput
                );
                return;
            }

            if (!validateEmail(email)) {
                showFieldError(
                    signupForm,
                    "Please enter a valid email address, such as name@example.com.",
                    emailInput
                );
                return;
            }

            if (!password) {
                showFieldError(
                    signupForm,
                    "Please create a password.",
                    passwordInput
                );
                return;
            }

            if (!validatePassword(password)) {
                showFieldError(
                    signupForm,
                    "Password must contain at least 6 characters.",
                    passwordInput
                );
                return;
            }

            if (!confirmPassword) {
                showFieldError(
                    signupForm,
                    "Please confirm your password.",
                    confirmInput
                );
                return;
            }

            if (password !== confirmPassword) {
                showFieldError(
                    signupForm,
                    "Passwords do not match. Please try again.",
                    confirmInput
                );
                return;
            }

            if (termsInput && !termsInput.checked) {
                showMessage(
                    signupForm,
                    "Please agree to the school's terms and privacy policy.",
                    "error"
                );

                termsInput.focus();
                return;
            }

            // Fill the login form without saving signup details.
            const loginEmail = document.getElementById(
                "stacklyLoginEmail"
            );

            const loginPassword = document.getElementById(
                "stacklyLoginPassword"
            );

            if (loginEmail) {
                loginEmail.value = email;
            }

            if (loginPassword) {
                loginPassword.value = "";
            }

            setSelectedRole("stacklyLoginRole", role);

            switchForm("login", { keepMessages: true });

            showMessage(
                loginForm,
                "Signup details validated. Your email and role have been filled in. Please enter your password to continue.",
                "success"
            );

            passwordInput.value = "";
            confirmInput.value = "";
        });
    }

    /* ==========================================
       12. FORGOT PASSWORD
    ========================================== */

    if (forgotForm) {
        forgotForm.addEventListener("submit", function (event) {
            event.preventDefault();

            clearMessage(forgotForm);

            const emailInput = document.getElementById(
                "stacklyForgotEmail"
            );

            if (!emailInput) {
                showMessage(
                    forgotForm,
                    "The email field is missing from the page.",
                    "error"
                );
                return;
            }

            const email = normalizeEmail(emailInput.value);

            if (!email) {
                showFieldError(
                    forgotForm,
                    "Please enter your registered email address.",
                    emailInput
                );
                return;
            }

            if (!validateEmail(email)) {
                showFieldError(
                    forgotForm,
                    "Please enter a valid email address.",
                    emailInput
                );
                return;
            }

            showMessage(
                forgotForm,
                "Password recovery is not connected yet. A secure backend and email service are required.",
                "info"
            );
        });
    }

    /* ==========================================
       13. RESTORE REMEMBERED EMAIL
    ========================================== */

    const rememberedEmail = getRememberedEmail();

    const loginEmailField = document.getElementById(
        "stacklyLoginEmail"
    );

    const rememberInput = document.getElementById(
        "stacklyRememberMe"
    );

    if (rememberedEmail && loginEmailField) {
        loginEmailField.value = rememberedEmail;

        if (rememberInput) {
            rememberInput.checked = true;
        }
    }

    /* ==========================================
       14. COPYRIGHT YEAR
    ========================================== */

    const yearElement = document.getElementById(
        "stacklyAuthYear"
    );

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* ==========================================
       15. INITIAL FORM
    ========================================== */

    switchForm("login");

})();
