/* ==========================================
   STACKLY EDUCATION
   STUDENT DASHBOARD JAVASCRIPT
   Navigation + Profile + Animations
========================================== */

(function () {
    "use strict";

    /* ==========================================
       1. CONFIGURATION
    ========================================== */

    const CONFIG = {
        mobileBreakpoint: 1050,
        homePage: "student.html",
        loginPage: "login.html",
        logoutPage: "index.html",
        menuOpenClass: "stackly-student-sidebar-open",
        bodyLockClass: "stackly-student-menu-active"
    };

    const SELECTORS = {
        sidebar: "#stacklyStudentSidebar",
        overlay: "#stacklyStudentOverlay",
        menuToggle: "#stacklyStudentMenuToggle",
        menuClose: "#stacklyStudentSidebarClose",
        email: "#stacklyStudentEmailAddress",
        studentName: "#stacklyStudentName",
        logout: "#stacklyStudentLogout",
        navLinks: ".stackly-student-nav-link",
        notification: ".stackly-student-header-icon"
    };

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    /* ==========================================
       2. STUDENT ACCOUNT HELPERS
    ========================================== */

    function getStoredValue(keys) {
        for (const key of keys) {
            try {
                const value = localStorage.getItem(key);

                if (value && value.trim()) {
                    return value.trim();
                }
            } catch (error) {
                console.warn(
                    "Stackly: Unable to access saved account information."
                );

                return "";
            }
        }

        return "";
    }

    function getStudentEmail() {
        const emailKeys = [
            "loginEmail",
            "stacklyEduLoginEmail",
            "stacklyStudentLoginEmail",
            "stacklyStudentEmail",
            "studentEmail",
            "userEmail"
        ];

        const email = getStoredValue(emailKeys);

        // Only display values that resemble an email address.
        const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return validEmailPattern.test(email) ? email : "";
    }

    function getStudentName(email) {
        if (!email || !email.includes("@")) {
            return "Student";
        }

        const username = email.split("@")[0];

        const formattedName = username
            .replace(/[._-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .split(" ")
            .filter(Boolean)
            .map(function (word) {
                return word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase();
            })
            .join(" ");

        return formattedName || "Student";
    }

    /* ==========================================
       3. DISPLAY STUDENT ACCOUNT INFORMATION
    ========================================== */

    function updateStudentAccount() {
        const emailElement = $(SELECTORS.email);
        const nameElement = $(SELECTORS.studentName);

        const email = getStudentEmail();
        const studentName = getStudentName(email);

        if (emailElement) {
            emailElement.textContent = email || "No email available";

            emailElement.title = email
                ? "Student email: " + email
                : "Student email is not available";
        }

        if (nameElement) {
            nameElement.textContent = studentName;
        }

        // Update the browser tab title.
        if (email) {
            document.title =
                studentName + " | Student Dashboard | Stackly Education";
        }
    }

    /* ==========================================
       4. MOBILE SIDEBAR ELEMENTS
    ========================================== */

    const sidebar = $(SELECTORS.sidebar);
    const overlay = $(SELECTORS.overlay);
    const menuToggle = $(SELECTORS.menuToggle);
    const menuClose = $(SELECTORS.menuClose);

    function isMobileView() {
        return window.matchMedia(
            "(max-width: " + CONFIG.mobileBreakpoint + "px)"
        ).matches;
    }

    function openSidebar() {
        if (!sidebar || !overlay || !isMobileView()) {
            return;
        }

        sidebar.classList.add(CONFIG.menuOpenClass);

        // Remove hidden so the overlay can receive clicks.
        overlay.hidden = false;

        document.body.classList.add(CONFIG.bodyLockClass);

        sidebar.setAttribute("aria-hidden", "false");
        overlay.setAttribute("aria-hidden", "false");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
        }

        // Move keyboard focus into the open menu.
        if (menuClose) {
            menuClose.focus({ preventScroll: true });
        }
    }

    function closeSidebar(restoreFocus = false) {
        if (!sidebar || !overlay) {
            return;
        }

        sidebar.classList.remove(CONFIG.menuOpenClass);
        overlay.hidden = true;

        document.body.classList.remove(CONFIG.bodyLockClass);

        sidebar.setAttribute("aria-hidden", isMobileView() ? "true" : "false");
        overlay.setAttribute("aria-hidden", "true");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");

            if (restoreFocus && isMobileView()) {
                menuToggle.focus({ preventScroll: true });
            }
        }
    }

    function initializeMobileMenu() {
        if (!sidebar || !overlay) {
            return;
        }

        if (menuToggle) {
            menuToggle.addEventListener("click", function () {
                const isOpen = sidebar.classList.contains(
                    CONFIG.menuOpenClass
                );

                if (isOpen) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        }

        if (menuClose) {
            menuClose.addEventListener("click", function () {
                closeSidebar(true);
            });
        }

        // Clicking outside the sidebar closes it.
        overlay.addEventListener("click", function () {
            closeSidebar(true);
        });

        // Escape key closes the mobile navigation.
        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                sidebar.classList.contains(CONFIG.menuOpenClass)
            ) {
                closeSidebar(true);
            }
        });

        // Close the menu when navigating to a sidebar link.
        $$(SELECTORS.navLinks, sidebar).forEach(function (link) {
            link.addEventListener("click", function () {
                if (isMobileView()) {
                    closeSidebar();
                }
            });
        });

        // Reset the sidebar when crossing the responsive breakpoint.
        let previousMobileState = isMobileView();

        window.addEventListener("resize", function () {
            const currentMobileState = isMobileView();

            if (currentMobileState !== previousMobileState) {
                closeSidebar();

                previousMobileState = currentMobileState;
            }
        });

        // Set the initial accessible state.
        closeSidebar();
    }

    /* ==========================================
       5. ACTIVE SIDEBAR NAVIGATION
    ========================================== */

    function initializeActiveNavigation() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath
            .split("/")
            .pop()
            .toLowerCase() || CONFIG.homePage;

        $$(SELECTORS.navLinks).forEach(function (link) {
            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            const linkPage = href
                .split("/")
                .pop()
                .split("?")[0]
                .toLowerCase();

            const isActive = linkPage === currentPage;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    /* ==========================================
       6. LOGOUT
    ========================================== */

    function initializeLogout() {
        const logoutButton = $(SELECTORS.logout);

        if (!logoutButton) {
            return;
        }

        logoutButton.addEventListener("click", function (event) {
            /*
             * Clear only session-related keys belonging to this app.
             * Do not remove unrelated website preferences.
             */
            const sessionKeys = [
                "loginEmail",
                "loginRole",
                "stacklyEduLoginEmail",
                "stacklyEduLoginRole",
                "stacklyStudentLoginEmail",
                "stacklyStudentLoggedIn",
                "stacklyStudentRemember",
                "stacklyEduLoggedIn"
            ];

            try {
                sessionKeys.forEach(function (key) {
                    localStorage.removeItem(key);
                });

                // Also clear session-scoped data, if used by the app.
                sessionStorage.removeItem("loginEmail");
                sessionStorage.removeItem("loginRole");
            } catch (error) {
                console.warn(
                    "Stackly: Some session information could not be cleared."
                );
            }

            // Allow normal navigation to index.html.
            // No alert interrupts the logout experience.
        });
    }

    /* ==========================================
       7. NOTIFICATION LINK
    ========================================== */

    function initializeNotifications() {
        const notificationLink = $(SELECTORS.notification);

        if (!notificationLink) {
            return;
        }

        notificationLink.addEventListener("click", function () {
            // Notifications currently navigate to the supplied
            // 404-student.html placeholder page.
            // Replace this behavior when a real notifications page exists.
        });
    }

    /* ==========================================
       8. AOS SCROLL ANIMATIONS
    ========================================== */

    function initializeAnimations() {
        if (typeof AOS === "undefined") {
            return;
        }

        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            offset: 65,
            delay: 0,
            mirror: false,
            disable: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        });

        // Refresh positions after images and fonts load.
        window.addEventListener("load", function () {
            AOS.refresh();
        });
    }

    /* ==========================================
       9. INITIALIZE DASHBOARD
    ========================================== */

    function initializeStudentDashboard() {
        updateStudentAccount();
        initializeMobileMenu();
        initializeActiveNavigation();
        initializeLogout();
        initializeNotifications();
        initializeAnimations();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeStudentDashboard,
            { once: true }
        );
    } else {
        initializeStudentDashboard();
    }

})();



document.addEventListener("DOMContentLoaded", function () {
    const emailKeys = [
        "loginEmail",
        "stacklyStudentLoginEmail",
        "stacklyStudentEmail",
        "studentEmail"
    ];

    let email = "";

    for (const key of emailKeys) {
        const storedEmail = localStorage.getItem(key);

        if (storedEmail && storedEmail.includes("@")) {
            email = storedEmail.trim();
            break;
        }
    }

    const emailElements = [
        "stacklyProfileEmail",
        "stacklyProfileEmailDetail"
    ];

    emailElements.forEach(function (id) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = email || "Email not available";
        }
    });

    const headerEmail = document.getElementById(
        "stacklyStudentEmailAddress"
    );

    if (headerEmail && email) {
        headerEmail.textContent = email;
        headerEmail.title = email;
    }

    // Use the email prefix as a fallback display name.
    if (email) {
        const nameFromEmail = email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, function (letter) {
                return letter.toUpperCase();
            });

        const nameElements = [
            "stacklyProfileName",
            "stacklyProfileFullName"
        ];

        nameElements.forEach(function (id) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = nameFromEmail;
            }
        });
    }

    if (window.AOS) {
        AOS.init({
            duration: 850,
            once: true,
            offset: 60,
            easing: "ease-out-cubic"
        });
    }
});