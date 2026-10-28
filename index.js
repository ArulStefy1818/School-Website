
/* ==========================================
   STACKLY EDUCATION WEBSITE
   COMPLETE JAVASCRIPT
   Mobile Menu + Video Slider + AOS
========================================== */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* =====================================
           INITIALIZE AOS ANIMATIONS
        ===================================== */

        if (typeof AOS !== "undefined") {
            AOS.init({
                duration: 950,
                easing: "ease-out-cubic",
                once: true,
                offset: 70,
                delay: 0,
                mirror: false,
                anchorPlacement: "top-bottom"
            });
        }

        /* =====================================
           MOBILE NAVIGATION ELEMENTS
        ===================================== */

        const body = document.body;

        const menuButton = document.getElementById(
            "stacklyEduMenuButton"
        );

        const menuClose = document.getElementById(
            "stacklyEduMenuClose"
        );

        const mobileMenu = document.getElementById(
            "stacklyEduMobileMenu"
        );

        const menuOverlay = document.getElementById(
            "stacklyEduOverlay"
        );

        /* Check whether mobile menu HTML exists */

        if (
            menuButton &&
            menuClose &&
            mobileMenu &&
            menuOverlay
        ) {

            const mobileLinks = mobileMenu.querySelectorAll(
                ".stackly-edu-mobile-links a"
            );

            let previousFocus = null;

            /* Set initial accessibility state */

            menuButton.setAttribute("aria-expanded", "false");

            mobileMenu.setAttribute("aria-hidden", "true");
            mobileMenu.inert = true;

            menuOverlay.setAttribute("aria-hidden", "true");

            /* Open mobile menu */

            function openStacklyEduMenu() {

                if (
                    body.classList.contains(
                        "stackly-edu-menu-active"
                    )
                ) {
                    return;
                }

                previousFocus = document.activeElement;

                body.classList.add(
                    "stackly-edu-menu-active"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

                mobileMenu.inert = false;

                mobileMenu.setAttribute(
                    "aria-hidden",
                    "false"
                );

                menuOverlay.setAttribute(
                    "aria-hidden",
                    "false"
                );

                menuClose.focus();

            }

            /* Close mobile menu */

            function closeStacklyEduMenu(
                restoreFocus = true
            ) {

                if (
                    !body.classList.contains(
                        "stackly-edu-menu-active"
                    )
                ) {
                    return;
                }

                body.classList.remove(
                    "stackly-edu-menu-active"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenu.setAttribute(
                    "aria-hidden",
                    "true"
                );

                mobileMenu.inert = true;

                menuOverlay.setAttribute(
                    "aria-hidden",
                    "true"
                );

                if (restoreFocus) {
                    menuButton.focus();
                } else if (
                    previousFocus &&
                    typeof previousFocus.focus === "function"
                ) {
                    previousFocus.focus();
                }

            }

            /* Hamburger button */

            menuButton.addEventListener(
                "click",
                openStacklyEduMenu
            );

            /* Exit / close button */

            menuClose.addEventListener(
                "click",
                function () {
                    closeStacklyEduMenu(true);
                }
            );

            /* Click outside menu */

            menuOverlay.addEventListener(
                "click",
                function () {
                    closeStacklyEduMenu(true);
                }
            );

            /* Close after selecting a navigation link */

            mobileLinks.forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {
                        closeStacklyEduMenu(false);
                    }
                );

            });

            /* Close with Escape key */

            document.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Escape" &&
                        body.classList.contains(
                            "stackly-edu-menu-active"
                        )
                    ) {
                        closeStacklyEduMenu(true);
                    }

                }
            );

            /* Keep keyboard focus inside the mobile menu */

            mobileMenu.addEventListener(
                "keydown",
                function (event) {

                    if (event.key !== "Tab") {
                        return;
                    }

                    const focusableElements = Array.from(
                        mobileMenu.querySelectorAll(
                            'a[href], button:not([disabled]), ' +
                            '[tabindex]:not([tabindex="-1"])'
                        )
                    ).filter(function (element) {

                        return (
                            element.getClientRects().length > 0 &&
                            !element.hasAttribute("disabled")
                        );

                    });

                    if (!focusableElements.length) {
                        return;
                    }

                    const firstElement =
                        focusableElements[0];

                    const lastElement =
                        focusableElements[
                            focusableElements.length - 1
                        ];

                    if (
                        event.shiftKey &&
                        document.activeElement === firstElement
                    ) {

                        event.preventDefault();
                        lastElement.focus();

                    } else if (
                        !event.shiftKey &&
                        document.activeElement === lastElement
                    ) {

                        event.preventDefault();
                        firstElement.focus();

                    }

                }
            );

            /* Close menu when switching to desktop layout */

            const desktopMedia = window.matchMedia(
                "(min-width: 951px)"
            );

            function handleDesktopLayout(event) {

                if (event.matches) {
                    closeStacklyEduMenu(false);
                }

            }

            if (desktopMedia.addEventListener) {

                desktopMedia.addEventListener(
                    "change",
                    handleDesktopLayout
                );

            } else {

                desktopMedia.addListener(
                    handleDesktopLayout
                );

            }

        }


        /* =====================================
           THREE-VIDEO HERO SLIDER
        ===================================== */

        const hero = document.querySelector(
            ".stackly-edu-hero"
        );

        if (!hero) {
            return;
        }

        const videos = Array.from(
            hero.querySelectorAll(".stackly-edu-video")
        );

        const videoDots = Array.from(
            hero.querySelectorAll(".stackly-edu-video-dot")
        );

        const nextButton = document.getElementById(
            "stacklyEduVideoNext"
        );

        const heroContent = document.getElementById(
            "stacklyEduHeroContent"
        );

        if (!videos.length) {
            return;
        }

        /* =====================================
           VIDEO SLIDER SETTINGS
        ===================================== */

        const VIDEO_INTERVAL = 7000;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let currentVideo = 0;
        let videoTimer = null;
        let sliderInitialized = false;

        /* =====================================
           CLEAR VIDEO TIMER
        ===================================== */

        function clearStacklyEduTimer() {

            if (videoTimer !== null) {

                window.clearTimeout(videoTimer);

                videoTimer = null;

            }

        }

        /* =====================================
           PAUSE ALL VIDEOS
        ===================================== */

        function pauseStacklyEduVideos() {

            videos.forEach(function (video) {
                video.pause();
            });

        }

        /* =====================================
           PLAY CURRENT VIDEO
        ===================================== */

        function playCurrentStacklyEduVideo() {

            const video = videos[currentVideo];

            if (!video || document.hidden) {
                return;
            }

            video.muted = true;
            video.playsInline = true;

            const playPromise = video.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(function () {
                    /*
                     * Browser autoplay restrictions may prevent
                     * playback. The slider controls remain usable.
                     */
                });

            }

        }

        /* =====================================
           RESTART HERO CONTENT ANIMATION
        ===================================== */

        function restartStacklyEduHeroAnimation() {

            if (!heroContent || reducedMotion.matches) {
                return;
            }

            heroContent.style.animation = "none";

            void heroContent.offsetWidth;

            heroContent.style.animation = "";

        }

        /* =====================================
           UPDATE VIDEO DOTS
        ===================================== */

        function updateStacklyEduVideoDots() {

            videoDots.forEach(function (dot, index) {

                const isActive = index === currentVideo;

                dot.classList.toggle(
                    "stackly-edu-dot-active",
                    isActive
                );

                dot.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

        }

        /* =====================================
           START AUTOMATIC SLIDER
        ===================================== */

        function startStacklyEduTimer() {

            clearStacklyEduTimer();

            if (
                reducedMotion.matches ||
                document.hidden ||
                videos.length < 2
            ) {
                return;
            }

            videoTimer = window.setTimeout(
                function () {

                    showStacklyEduVideo(
                        currentVideo + 1
                    );

                },
                VIDEO_INTERVAL
            );

        }

        /* =====================================
           SHOW SELECTED BACKGROUND VIDEO
        ===================================== */

        function showStacklyEduVideo(index) {

            if (!videos.length) {
                return;
            }

            clearStacklyEduTimer();

            currentVideo =
                (index + videos.length) % videos.length;

            videos.forEach(function (video, videoIndex) {

                const isActive =
                    videoIndex === currentVideo;

                video.classList.toggle(
                    "stackly-edu-video-active",
                    isActive
                );

                if (isActive) {

                    video.muted = true;
                    video.playsInline = true;

                    /*
                     * Load the video when it becomes active.
                     */

                    if (video.readyState === 0) {
                        video.load();
                    }

                } else {

                    video.pause();

                }

            });

            updateStacklyEduVideoDots();

            /*
             * Play the selected video.
             */

            playCurrentStacklyEduVideo();

            /*
             * Replay the hero content entrance animation
             * when visitors change videos manually.
             */

            if (sliderInitialized) {
                restartStacklyEduHeroAnimation();
            }

            sliderInitialized = true;

            /*
             * Schedule the next video.
             */

            startStacklyEduTimer();

        }

        /* =====================================
           VIDEO DOT CLICK EVENTS
        ===================================== */

        videoDots.forEach(function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    const requestedIndex = Number(
                        dot.getAttribute("data-video-index")
                    );

                    showStacklyEduVideo(
                        Number.isInteger(requestedIndex)
                            ? requestedIndex
                            : index
                    );

                }
            );

        });

        /* =====================================
           NEXT VIDEO BUTTON
        ===================================== */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function () {

                    showStacklyEduVideo(
                        currentVideo + 1
                    );

                }
            );

        }

        /* =====================================
           PAUSE WHEN PAGE IS HIDDEN
        ===================================== */

        document.addEventListener(
            "visibilitychange",
            function () {

                if (document.hidden) {

                    clearStacklyEduTimer();

                    pauseStacklyEduVideos();

                } else {

                    playCurrentStacklyEduVideo();

                    startStacklyEduTimer();

                }

            }
        );

        /* =====================================
           HANDLE REDUCED-MOTION PREFERENCE
        ===================================== */

        function handleStacklyEduMotionChange() {

            clearStacklyEduTimer();

            if (reducedMotion.matches) {

                /*
                 * Keep the current video visible without
                 * automatically switching to another video.
                 */

                pauseStacklyEduVideos();

            } else {

                playCurrentStacklyEduVideo();

                startStacklyEduTimer();

            }

        }

        if (reducedMotion.addEventListener) {

            reducedMotion.addEventListener(
                "change",
                handleStacklyEduMotionChange
            );

        } else if (reducedMotion.addListener) {

            reducedMotion.addListener(
                handleStacklyEduMotionChange
            );

        }

        /* =====================================
           INITIALIZE FIRST VIDEO
        ===================================== */

        showStacklyEduVideo(0);

    });

})();


/* ==========================================
   STACKLY EDUCATION FOOTER NEWSLETTER
   Validation + Success Message + Auto Clear
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const newsletterForm = document.getElementById(
        "stacklyEduNewsletterForm"
    );

    const newsletterEmail = document.getElementById(
        "stacklyEduNewsletterEmail"
    );

    const newsletterMessage = document.getElementById(
        "stacklyEduNewsletterMessage"
    );

    if (!newsletterForm || !newsletterEmail || !newsletterMessage) {
        return;
    }

    let messageTimer;

    function showNewsletterMessage(message, type) {
        clearTimeout(messageTimer);

        newsletterMessage.textContent = message;
        newsletterMessage.className =
            "stackly-edu-footer-newsletter-message " + type;

        newsletterMessage.style.display = "block";

        messageTimer = setTimeout(function () {
            newsletterMessage.textContent = "";
            newsletterMessage.className =
                "stackly-edu-footer-newsletter-message";

            newsletterMessage.style.display = "none";
        }, 4000);
    }

    newsletterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = newsletterEmail.value.trim();

        // Empty email validation
        if (email === "") {
            newsletterEmail.focus();

            showNewsletterMessage(
                "Please enter your email address.",
                "error"
            );

            return;
        }

        // Email format validation
        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

        if (!emailPattern.test(email)) {
            newsletterEmail.focus();

            showNewsletterMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }

        // Success message
        showNewsletterMessage(
            "Thank you for subscribing successfully!",
            "success"
        );

        // Clear the email field
        newsletterForm.reset();
    });
});


/* ==========================================
   STACKLY EDUCATION
   ACTIVE NAVIGATION LINK HIGHLIGHT
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const currentPage = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    const navLinks = document.querySelectorAll(
        ".stackly-edu-nav a[href], " +
        ".stackly-edu-mobile-links a[href]"
    );

    navLinks.forEach(function (link) {
        const href = link.getAttribute("href");

        // Skip anchor links and external links
        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("http")
        ) {
            return;
        }

        const linkPage = href.split("/").pop().toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("stackly-edu-active");

            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("stackly-edu-active");

            link.removeAttribute("aria-current");
        }
    });
});


(function () {
    "use strict";

    const section = document.getElementById(
        "stacklyEduTestimonials"
    );

    if (!section) return;

    const slider = section.querySelector(
        ".stackly-edu-testimonials-slider"
    );

    const track = section.querySelector(
        ".stackly-edu-testimonials-track"
    );

    const cards = Array.from(
        section.querySelectorAll(
            ".stackly-edu-testimonial-card"
        )
    );

    const dots = Array.from(
        section.querySelectorAll(
            ".stackly-edu-testimonial-dot"
        )
    );

    if (!slider || !track || !cards.length || !dots.length) {
        return;
    }

    let currentPage = 0;
    let cardsPerPage = 3;
    let resizeTimer;

    function updateSlider() {
        const width = window.innerWidth;

        if (width <= 650) {
            cardsPerPage = 1;
        } else if (width <= 1000) {
            cardsPerPage = 2;
        } else {
            cardsPerPage = 3;
        }

        const totalPages = Math.ceil(
            cards.length / cardsPerPage
        );

        currentPage = Math.min(
            currentPage,
            totalPages - 1
        );

        dots.forEach(function (dot, index) {
            dot.hidden = index >= totalPages;

            dot.classList.toggle(
                "is-active",
                index === currentPage
            );

            dot.setAttribute(
                "aria-pressed",
                index === currentPage ? "true" : "false"
            );
        });

        const firstCard = cards[
            currentPage * cardsPerPage
        ];

        if (!firstCard) return;

        const offset =
            firstCard.offsetLeft - cards[0].offsetLeft;

        track.style.transform =
            "translateX(-" + offset + "px)";
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            currentPage = index;
            updateSlider();
        });
    });

    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            updateSlider();
        }, 120);
    });

    updateSlider();

})();



/* ==========================================
   STACKLY EDUCATION
   STUDENT APPLICATION FORM
   Validation + Dropdowns + Status Messages
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("stacklyEduApplicationForm");
    const status = document.getElementById("stacklyEduApplicationStatus");

    if (!form || !status) {
        console.error(
            "Application form or status element not found. Check the HTML IDs."
        );
        return;
    }

    form.noValidate = true;

    const nameIds = [
        "stacklyEduFirstName",
        "stacklyEduLastName",
        "stacklyEduFatherName",
        "stacklyEduMotherName"
    ];

    const requiredDropdowns = [
        "program",
        "gradeLevel",
        "studyMode",
        "admissionGrade"
    ];

    const namePattern = /^[\p{L}][\p{L}\p{M}\s'-]*$/u;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let messageTimer = null;
    let resetReason = "manual";

    /* ==========================================
       STATUS MESSAGES
    ========================================== */

    function showMessage(message, type = "info", duration = 5000) {
        window.clearTimeout(messageTimer);

        status.textContent = message;
        status.className = "stackly-edu-application-status is-" + type;

        // Override CSS rules that may keep the message hidden.
        status.style.setProperty("display", "block", "important");
        status.style.setProperty("visibility", "visible", "important");
        status.style.setProperty("opacity", "1", "important");

        status.setAttribute(
            "role",
            type === "error" ? "alert" : "status"
        );
        status.setAttribute("aria-live", "polite");

        if (duration > 0) {
            messageTimer = window.setTimeout(hideMessage, duration);
        }

        // Scroll the message into view without interrupting the form.
        requestAnimationFrame(function () {
            status.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });
    }

    function hideMessage() {
        window.clearTimeout(messageTimer);
        messageTimer = null;

        status.textContent = "";
        status.className = "stackly-edu-application-status";
        status.style.setProperty("display", "none", "important");
        status.style.removeProperty("visibility");
        status.style.removeProperty("opacity");
    }

    /* ==========================================
       FIELD ERRORS
    ========================================== */

    function setFieldError(field, message) {
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");

        let error = field.parentElement.querySelector(
            ":scope > .stackly-edu-field-error"
        );

        if (!error) {
            error = document.createElement("small");
            error.className = "stackly-edu-field-error";
            error.style.cssText =
                "display:block;color:#d93025;font-size:13px;margin-top:6px;";
            field.insertAdjacentElement("afterend", error);
        }

        error.textContent = message;
    }

    function clearFieldError(field) {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");

        const error = field.parentElement?.querySelector(
            ":scope > .stackly-edu-field-error"
        );

        if (error) error.remove();
    }

    function clearAllErrors() {
        form.querySelectorAll(".is-invalid").forEach(function (field) {
            field.classList.remove("is-invalid");
            field.removeAttribute("aria-invalid");
        });

        form.querySelectorAll(".stackly-edu-field-error").forEach(
            function (error) {
                error.remove();
            }
        );

        form.querySelectorAll(".stackly-edu-js-select").forEach(
            function (dropdown) {
                clearDropdownError(dropdown);
            }
        );
    }

    /* ==========================================
       CUSTOM DROPDOWN HELPERS
    ========================================== */

    function dropdownParts(dropdown) {
        return {
            trigger: dropdown.querySelector(
                ".stackly-edu-js-select-trigger"
            ),
            menu: dropdown.querySelector(
                ".stackly-edu-js-select-menu"
            ),
            display: dropdown.querySelector(
                ".stackly-edu-js-select-value"
            ),
            input: dropdown.querySelector('input[type="hidden"]'),
            error: dropdown.querySelector(
                ".stackly-edu-js-select-error"
            )
        };
    }

    function dropdownValue(dropdown) {
        const parts = dropdownParts(dropdown);
        return parts.input ? parts.input.value.trim() : "";
    }

    function closeDropdown(dropdown) {
        const parts = dropdownParts(dropdown);

        dropdown.classList.remove("is-open");

        if (parts.menu) parts.menu.hidden = true;

        if (parts.trigger) {
            parts.trigger.setAttribute("aria-expanded", "false");
        }
    }

    function closeAllDropdowns(except) {
        form.querySelectorAll(".stackly-edu-js-select").forEach(
            function (dropdown) {
                if (dropdown !== except) closeDropdown(dropdown);
            }
        );
    }

    function openDropdown(dropdown) {
        const parts = dropdownParts(dropdown);

        if (!parts.trigger || !parts.menu) return;

        closeAllDropdowns(dropdown);

        dropdown.classList.add("is-open");
        parts.menu.hidden = false;
        parts.trigger.setAttribute("aria-expanded", "true");
    }

    function setDropdownError(dropdown, message) {
        dropdown.classList.add("is-invalid");

        const parts = dropdownParts(dropdown);

        if (parts.error) {
            parts.error.textContent = message;
            parts.error.style.display = "block";
        }

        if (parts.trigger) {
            parts.trigger.setAttribute("aria-invalid", "true");
        }
    }

    function clearDropdownError(dropdown) {
        dropdown.classList.remove("is-invalid");

        const parts = dropdownParts(dropdown);

        if (parts.error) {
            parts.error.textContent = "";
            parts.error.style.display = "none";
        }

        if (parts.trigger) {
            parts.trigger.removeAttribute("aria-invalid");
        }
    }

    function resetDropdown(dropdown) {
        const parts = dropdownParts(dropdown);

        if (parts.input) parts.input.value = "";

        if (parts.display) {
            parts.display.textContent =
                dropdown.dataset.placeholder ||
                parts.trigger?.dataset.placeholder ||
                "Choose an option";
        }

        dropdown.querySelectorAll(".stackly-edu-js-option").forEach(
            function (option) {
                option.classList.remove("is-selected");
                option.setAttribute("aria-selected", "false");
            }
        );

        clearDropdownError(dropdown);
        closeDropdown(dropdown);
    }

    function chooseOption(dropdown, option) {
        const parts = dropdownParts(dropdown);
        const value = option.dataset.value;

        if (value === undefined || value === "") return;

        if (parts.input) {
            parts.input.value = value;
            parts.input.dispatchEvent(
                new Event("change", { bubbles: true })
            );
        }

        if (parts.display) {
            parts.display.textContent =
                option.dataset.label || option.textContent.trim();
        }

        dropdown.querySelectorAll(".stackly-edu-js-option").forEach(
            function (item) {
                const selected = item === option;

                item.classList.toggle("is-selected", selected);
                item.setAttribute(
                    "aria-selected",
                    selected ? "true" : "false"
                );
            }
        );

        clearDropdownError(dropdown);
        closeDropdown(dropdown);
    }

    /* ==========================================
       INITIALIZE DROPDOWNS
    ========================================== */

    form.querySelectorAll(".stackly-edu-js-select").forEach(
        function (dropdown) {
            const parts = dropdownParts(dropdown);

            if (!parts.trigger || !parts.menu) {
                console.error("Dropdown trigger or menu is missing:", dropdown);
                return;
            }

            parts.menu.hidden = true;
            parts.trigger.setAttribute("aria-expanded", "false");

            if (parts.trigger.tagName === "BUTTON") {
                parts.trigger.type = "button";
            }

            parts.trigger.addEventListener("click", function (event) {
                event.preventDefault();

                if (dropdown.classList.contains("is-open")) {
                    closeDropdown(dropdown);
                } else {
                    openDropdown(dropdown);
                }
            });

            dropdown.querySelectorAll(".stackly-edu-js-option").forEach(
                function (option) {
                    option.addEventListener("click", function (event) {
                        event.preventDefault();
                        chooseOption(dropdown, option);
                    });
                }
            );
        }
    );

    document.addEventListener("click", function (event) {
        if (
            !event.target.closest(".stackly-edu-js-select")
        ) {
            closeAllDropdowns();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeAllDropdowns();
    });

    /* ==========================================
       VALIDATE INDIVIDUAL FIELDS
    ========================================== */

    function validateField(field) {
        if (
            ["hidden", "checkbox", "radio", "submit", "reset", "button"]
                .includes(field.type)
        ) {
            return true;
        }

        clearFieldError(field);

        const value = field.value.trim();

        if (field.required && !value) {
            setFieldError(field, "This field is required.");
            return false;
        }

        if (!value) return true;

        if (nameIds.includes(field.id)) {
            if (!namePattern.test(value)) {
                setFieldError(
                    field,
                    "Enter a valid name using letters, spaces, hyphens or apostrophes."
                );
                return false;
            }

            if (value.replace(/[\s'-]/g, "").length < 2) {
                setFieldError(field, "Please enter at least 2 letters.");
                return false;
            }
        }

        if (field.id === "stacklyEduPhone" && !/^\d{10}$/.test(value)) {
            setFieldError(
                field,
                "Enter a valid 10-digit phone number without spaces or symbols."
            );
            return false;
        }

        if (field.id === "stacklyEduEmail") {
            if (
                !emailPattern.test(value) ||
                value.length > 254 ||
                value.split("@")[0].length > 64
            ) {
                setFieldError(
                    field,
                    "Enter a valid email address, such as name@example.com."
                );
                return false;
            }
        }

        if (
            field.id === "stacklyEduDateOfBirth" &&
            field.type === "date"
        ) {
            const selectedDate = new Date(value + "T00:00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (
                Number.isNaN(selectedDate.getTime()) ||
                selectedDate > today
            ) {
                setFieldError(
                    field,
                    "Date of birth cannot be in the future."
                );
                return false;
            }
        }

        if (field.id === "stacklyEduQualification") {
            const year = Number(value);

            if (!Number.isInteger(year) || year < 1990 || year > 2100) {
                setFieldError(field, "Enter a year between 1990 and 2100.");
                return false;
            }
        }

        if (!field.checkValidity()) {
            setFieldError(
                field,
                field.validationMessage || "Please check this field."
            );
            return false;
        }

        return true;
    }

    /* ==========================================
       VALIDATE COMPLETE FORM
    ========================================== */

    function validateForm() {
        clearAllErrors();

        let valid = true;
        let firstInvalid = null;

        const fields = form.querySelectorAll(
            "input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='submit']):not([type='reset']):not([type='button']), textarea, select"
        );

        fields.forEach(function (field) {
            if (!validateField(field)) {
                valid = false;
                if (!firstInvalid) firstInvalid = field;
            }
        });

        requiredDropdowns.forEach(function (name) {
            const input = form.querySelector(
                'input[type="hidden"][name="' + name + '"]'
            );

            if (!input) {
                console.error("Missing required dropdown input:", name);
                valid = false;
                return;
            }

            const dropdown = input.closest(".stackly-edu-js-select");

            if (!dropdown) {
                console.error("Missing dropdown wrapper for:", name);
                valid = false;
                return;
            }

            if (!dropdownValue(dropdown)) {
                const label = dropdown.closest(
                    ".stackly-edu-application-field"
                )?.querySelector("label");

                const labelText = label
                    ? label.textContent.replace(/\*/g, "").trim()
                    : name;

                setDropdownError(
                    dropdown,
                    "Please choose " + labelText.toLowerCase() + "."
                );

                valid = false;

                if (!firstInvalid) {
                    firstInvalid = dropdownParts(dropdown).trigger;
                }
            }
        });

        form.querySelectorAll('input[type="checkbox"][required]').forEach(
            function (checkbox) {
                if (!checkbox.checked) {
                    checkbox.classList.add("is-invalid");
                    checkbox.setAttribute("aria-invalid", "true");

                    valid = false;
                    if (!firstInvalid) firstInvalid = checkbox;
                }
            }
        );

        const fileInput = document.getElementById("stacklyEduDocuments");

        if (fileInput && fileInput.files.length > 0) {
            const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png"
            ];
            const maxSize = 5 * 1024 * 1024;

            for (const file of fileInput.files) {
                const extension = file.name.split(".").pop().toLowerCase();

                if (
                    !allowedExtensions.includes(extension) ||
                    !allowedTypes.includes(file.type)
                ) {
                    setFieldError(
                        fileInput,
                        "Upload PDF, JPG or PNG files only."
                    );
                    valid = false;
                    if (!firstInvalid) firstInvalid = fileInput;
                    break;
                }

                if (file.size > maxSize) {
                    setFieldError(
                        fileInput,
                        "Each file must be 5 MB or smaller."
                    );
                    valid = false;
                    if (!firstInvalid) firstInvalid = fileInput;
                    break;
                }
            }
        }

        if (firstInvalid) {
            firstInvalid.focus({ preventScroll: true });
            firstInvalid.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        return valid;
    }

    /* ==========================================
       LIVE VALIDATION
    ========================================== */

    form.querySelectorAll("input, textarea, select").forEach(
        function (field) {
            field.addEventListener("input", function () {
                if (field.classList.contains("is-invalid")) {
                    validateField(field);
                }
            });

            field.addEventListener("change", function () {
                if (field.type === "checkbox") {
                    field.classList.remove("is-invalid");
                    field.removeAttribute("aria-invalid");
                } else if (field.classList.contains("is-invalid")) {
                    validateField(field);
                }
            });

            field.addEventListener("blur", function () {
                if (
                    field.type !== "hidden" &&
                    field.type !== "checkbox" &&
                    field.type !== "file" &&
                    (field.value.trim() || field.required)
                ) {
                    validateField(field);
                }
            });
        }
    );

    /* ==========================================
       FORM SUBMISSION
    ========================================== */

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage();

        if (!validateForm()) {
            showMessage(
                "Please complete all required fields and correct the highlighted errors.",
                "error",
                6000
            );
            return;
        }

        /*
          DEMO SUCCESS:
          This validates the form and clears it locally.
          Connect a backend/API to actually save applications.
        */

        resetReason = "submit";
        form.reset();

        form.querySelectorAll(".stackly-edu-js-select").forEach(
            resetDropdown
        );

        clearAllErrors();

        // Show the message after resetting all form controls.
        showMessage(
            "Your application has been validated successfully!",
            "success",
            6000
        );
    });

    /* ==========================================
       CLEAR FORM BUTTON
    ========================================== */

    form.addEventListener("reset", function () {
        // Capture the reason now; the callback runs after the reset.
        const reason = resetReason;
        resetReason = "manual";

        window.setTimeout(function () {
            clearAllErrors();

            form.querySelectorAll(".stackly-edu-js-select").forEach(
                resetDropdown
            );

            if (reason === "submit") {
                // Do not overwrite the submission success message.
                return;
            }

            showMessage(
                "The form has been cleared successfully.",
                "info",
                4000
            );
        }, 0);
    });

    /* ==========================================
       INITIALIZE
    ========================================== */

    hideMessage();

});



/* ==========================================
   STACKLY EDUCATION
   GET IN TOUCH FORM VALIDATION
   Required Fields + Name + Email + Subject
   Success Message + Auto Clear
========================================== */

(function () {
    "use strict";

    function initStacklyEduGetInTouch() {
        const form = document.querySelector(
            ".stackly-edu-getintouch-form"
        );

        if (!form || form.dataset.validationReady === "true") {
            return;
        }

        const nameInput = form.querySelector(
            "#stacklyEduContactName"
        );

        const emailInput = form.querySelector(
            "#stacklyEduContactEmail"
        );

        const subjectInput = form.querySelector(
            "#stacklyEduContactSubject"
        );

        const messageInput = form.querySelector(
            "#stacklyEduContactMessage"
        );

        if (
            !nameInput ||
            !emailInput ||
            !subjectInput ||
            !messageInput
        ) {
            return;
        }

        form.dataset.validationReady = "true";

        let feedbackTimer;
        let fadeTimer;

        /* ======================================
           CREATE FEEDBACK MESSAGE
        ====================================== */

        const feedback = document.createElement("div");

        feedback.className = "stackly-edu-getintouch-feedback";
        feedback.setAttribute("role", "status");
        feedback.setAttribute("aria-live", "polite");
        feedback.hidden = true;

        Object.assign(feedback.style, {
            display: "none",
            padding: "13px 16px",
            marginBottom: "18px",
            borderRadius: "9px",
            fontSize: "14px",
            fontWeight: "600",
            lineHeight: "1.6",
            transition: "opacity 0.3s ease"
        });

        form.insertBefore(feedback, form.firstChild);

        /* ======================================
           SHOW FEEDBACK MESSAGE
        ====================================== */

        function hideFeedbackImmediately() {
            clearTimeout(feedbackTimer);
            clearTimeout(fadeTimer);

            feedback.style.opacity = "1";
            feedback.style.display = "none";
            feedback.hidden = true;
        }

        function showFeedback(type, text) {
            clearTimeout(feedbackTimer);
            clearTimeout(fadeTimer);

            feedback.textContent = text;
            feedback.hidden = false;
            feedback.style.display = "block";
            feedback.style.opacity = "1";

            if (type === "success") {
                feedback.style.background = "#e8f7ee";
                feedback.style.color = "#176b3a";
                feedback.style.border = "1px solid #b8e5c8";
            } else {
                feedback.style.background = "#fff0ef";
                feedback.style.color = "#b42318";
                feedback.style.border = "1px solid #f3c1bd";
            }

            feedback.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

            const duration = type === "success" ? 4000 : 5000;

            feedbackTimer = setTimeout(function () {
                feedback.style.opacity = "0";

                fadeTimer = setTimeout(function () {
                    feedback.style.display = "none";
                    feedback.hidden = true;
                    feedback.style.opacity = "1";
                }, 300);
            }, duration);
        }

        /* ======================================
           VALIDATION PATTERNS
        ====================================== */

        // Name: alphabetic characters, spaces, apostrophes,
        // periods and hyphens.
        const namePattern =
            /^[\p{L}][\p{L}\p{M}\s.'’-]*$/u;

        // Email: standard email format check.
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        // Subject: alphabetic characters and spaces ONLY.
        // Numbers and punctuation are not allowed.
        const subjectPattern =
            /^[\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+)*$/u;

        /* ======================================
           REQUIRED FIELD VALIDATION
        ====================================== */

        function validateRequired(input, errorMessage) {
            if (!input.value.trim()) {
                showFeedback("error", errorMessage);
                input.focus();
                return false;
            }

            return true;
        }

        /* ======================================
           FORM SUBMISSION
        ====================================== */

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            // 1. Check required fields.

            if (!validateRequired(
                nameInput,
                "Please enter your name."
            )) {
                return;
            }

            if (!validateRequired(
                emailInput,
                "Please enter your email address."
            )) {
                return;
            }

            if (!validateRequired(
                subjectInput,
                "Please enter the subject."
            )) {
                return;
            }

            if (!validateRequired(
                messageInput,
                "Please write your message."
            )) {
                return;
            }

            // 2. Validate name.

            if (!namePattern.test(name)) {
                showFeedback(
                    "error",
                    "Name must contain letters only, with spaces, apostrophes, periods, or hyphens allowed."
                );

                nameInput.focus();
                return;
            }

            // 3. Validate email.

            if (
                !emailPattern.test(email) ||
                emailInput.validity.typeMismatch
            ) {
                showFeedback(
                    "error",
                    "Please enter a valid email address, such as name@example.com."
                );

                emailInput.focus();
                return;
            }

            // 4. Validate subject: alphabetic characters only.

            if (!subjectPattern.test(subject)) {
                showFeedback(
                    "error",
                    "Subject must contain alphabetic characters and spaces only. Numbers and special characters are not allowed."
                );

                subjectInput.focus();
                return;
            }

            // 5. Validate message length.

            if (message.length < 10) {
                showFeedback(
                    "error",
                    "Please enter a message containing at least 10 characters."
                );

                messageInput.focus();
                return;
            }

            /* ==================================
               SUCCESS
            ================================== */

            showFeedback(
                "success",
                "Thank you! Your message has passed validation."
            );

            // Clear every form field.
            form.reset();
        });

        /* ======================================
           CLEAR FEEDBACK WHEN USER EDITS FIELDS
        ====================================== */

        [
            nameInput,
            emailInput,
            subjectInput,
            messageInput
        ].forEach(function (input) {
            input.addEventListener("input", function () {
                hideFeedbackImmediately();
            });
        });
    }

    /* ==========================================
       INITIALIZE SAFELY
    ========================================== */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initStacklyEduGetInTouch
        );
    } else {
        initStacklyEduGetInTouch();
    }
})();



/* ==========================================
   STACKLY EDUCATION - PAGE LOADER
   Smooth Progress + Animated Exit
========================================== */

(function () {
    "use strict";

    const loader = document.getElementById("stacklyEduLoader");

    // Stop if the loader HTML does not exist.
    if (!loader) return;

    const progressBar = document.getElementById(
        "stacklyEduLoaderProgress"
    );

    const percentage = document.getElementById(
        "stacklyEduLoaderPercent"
    );

    const message = document.getElementById(
        "stacklyEduLoaderMessage"
    );

    let progress = 0;
    let finished = false;
    let progressTimer = null;

    const messages = [
        { limit: 25, text: "Preparing your learning space..." },
        { limit: 50, text: "Gathering learning resources..." },
        { limit: 75, text: "Getting everything ready..." },
        { limit: 99, text: "Almost ready to inspire you..." }
    ];

    /* UPDATE LOADING PROGRESS */
    function updateProgress(value) {
        progress = Math.min(100, Math.max(progress, value));

        if (progressBar) {
            progressBar.style.width = progress + "%";
        }

        if (percentage) {
            percentage.textContent = Math.round(progress) + "%";
        }

        if (message && progress < 100) {
            const currentMessage = messages.find(function (item) {
                return progress <= item.limit;
            });

            if (currentMessage) {
                message.textContent = currentMessage.text;
            }
        }
    }

    /* STOP PROGRESS TIMER */
    function stopProgressTimer() {
        if (progressTimer !== null) {
            window.clearInterval(progressTimer);
            progressTimer = null;
        }
    }

    /* FINISH LOADING */
    function finishLoading() {
        if (finished) return;

        finished = true;
        stopProgressTimer();

        updateProgress(100);

        if (message) {
            message.textContent = "Welcome to Stackly Education!";
        }

        // Allow the completed state to be visible briefly.
        window.setTimeout(function () {
            loader.classList.add("stackly-edu-loader-hidden");
            loader.setAttribute("aria-hidden", "true");

            // Remove the loader after its exit animation.
            window.setTimeout(function () {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 1700);

        }, 1350);
    }

    /* ANIMATE PROGRESS WITHOUT REACHING 100% EARLY */
    progressTimer = window.setInterval(function () {
        if (finished) {
            stopProgressTimer();
            return;
        }

        if (progress < 90) {
            updateProgress(
                Math.min(90, progress + Math.max(1, (90 - progress) * 0.07))
            );
        }
    }, 100);

    /* WAIT UNTIL ALL PAGE RESOURCES HAVE LOADED */
    if (document.readyState === "complete") {
        finishLoading();
    } else {
        window.addEventListener("load", finishLoading, {
            once: true
        });
    }

})();
