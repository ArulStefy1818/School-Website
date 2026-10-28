/* ==========================================
   STACKLY EDUCATION
   STAFF DASHBOARD - COMPLETE JAVASCRIPT
   Email Display + AOS + Mobile Sidebar
   Date + Footer + Task Checkbox Handling
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================
       01. INITIALIZE AOS ANIMATIONS
    ========================================== */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            once: true,
            offset: 65,
            easing: "ease-out-cubic"
        });
    }

    /* ==========================================
       02. DISPLAY CURRENT DATE
    ========================================== */

    const dateElement = document.getElementById(
        "stacklyStaffCurrentDate"
    );

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    /* ==========================================
       03. DISPLAY FOOTER YEAR
    ========================================== */

    const yearElement = document.getElementById(
        "stacklyAdminYear"
    );

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* ==========================================
       04. LOGGED-IN STAFF EMAIL DISPLAY

       Matches the keys used by your login.js:
       loginEmail
       stacklyEduLoginEmail
       stacklyAdminEmail

       Never reads or displays a password.
    ========================================== */

    const emailElement = document.getElementById(
        "stacklyStaffEmailAddress"
    );

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            String(email || "").trim()
        );
    }

    function getLoggedInStaffEmail() {
        /*
         * Check the exact storage keys used by login.js.
         * loginEmail is checked first because your login
         * script saves it on every successful login.
         */

        const emailKeys = [
            "loginEmail",
            "stacklyEduLoginEmail",
            "stacklyAdminEmail"
        ];

        try {
            for (const key of emailKeys) {
                const storedEmail = localStorage.getItem(key);

                if (
                    storedEmail &&
                    isValidEmail(storedEmail)
                ) {
                    return storedEmail.trim();
                }
            }
        } catch (error) {
            console.warn(
                "Unable to access saved login email:",
                error
            );
        }

        /*
         * Optional compatibility with dashboards that
         * store user details as a JSON object.
         */

        const userKeys = [
            "stacklyEduUser",
            "stacklyEducationUser",
            "stacklyStaffUser",
            "loggedInUser",
            "currentUser",
            "stacklyCurrentUser",
            "user",
            "staffUser"
        ];

        try {
            for (const key of userKeys) {
                const savedUser = localStorage.getItem(key);

                if (!savedUser) {
                    continue;
                }

                let user;

                try {
                    user = JSON.parse(savedUser);
                } catch (error) {
                    continue;
                }

                if (!user || typeof user !== "object") {
                    continue;
                }

                const email =
                    user.email ||
                    user.loginEmail ||
                    user.userEmail ||
                    user.staffEmail;

                if (
                    typeof email === "string" &&
                    isValidEmail(email)
                ) {
                    return email.trim();
                }
            }
        } catch (error) {
            console.warn(
                "Unable to read saved user information:",
                error
            );
        }

        return "";
    }

    function displayStaffEmail() {
        if (!emailElement) {
            console.warn(
                'Email element not found. Add id="stacklyStaffEmailAddress" ' +
                "to the staff email element in staff.html."
            );
            return;
        }

        const email = getLoggedInStaffEmail();

        if (email) {
            emailElement.textContent = email;
            emailElement.title = email;
            emailElement.setAttribute("aria-label", email);
        } else {
            emailElement.textContent = "Email not available";
            emailElement.removeAttribute("title");
            emailElement.removeAttribute("aria-label");

            console.warn(
                "No valid email found. Confirm that login.js saves " +
                "the email before redirecting to staff.html."
            );
        }
    }

    displayStaffEmail();

    /* ==========================================
       05. SIDEBAR ELEMENTS
    ========================================== */

    const body = document.body;

    const sidebar = document.getElementById(
        "stacklyAdminSidebar"
    );

    const overlay = document.getElementById(
        "stacklyAdminOverlay"
    );

    const menuButton = document.getElementById(
        "stacklyAdminMenuToggle"
    );

    const closeButton = document.getElementById(
        "stacklyAdminSidebarClose"
    );

    const mobileView = window.matchMedia(
        "(max-width: 900px)"
    );

    let closeTimer;

    /* ==========================================
       06. OPEN MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {
        if (!sidebar || !overlay || !menuButton) {
            return;
        }

        window.clearTimeout(closeTimer);

        overlay.hidden = false;

        body.classList.add("stackly-admin-menu-active");

        overlay.setAttribute("aria-hidden", "false");
        sidebar.setAttribute("aria-hidden", "false");
        menuButton.setAttribute("aria-expanded", "true");

        if (closeButton) {
            closeButton.focus();
        }
    }

    /* ==========================================
       07. CLOSE MOBILE SIDEBAR
    ========================================== */

    function closeSidebar(returnFocus = false) {
        if (!sidebar || !menuButton) {
            return;
        }

        body.classList.remove("stackly-admin-menu-active");

        menuButton.setAttribute("aria-expanded", "false");

        sidebar.setAttribute(
            "aria-hidden",
            mobileView.matches ? "true" : "false"
        );

        if (overlay) {
            overlay.setAttribute("aria-hidden", "true");

            window.clearTimeout(closeTimer);

            closeTimer = window.setTimeout(function () {
                if (
                    !body.classList.contains(
                        "stackly-admin-menu-active"
                    )
                ) {
                    overlay.hidden = true;
                }
            }, 380);
        }

        if (returnFocus && mobileView.matches) {
            menuButton.focus();
        }
    }

    /* ==========================================
       08. MOBILE MENU BUTTON
    ========================================== */

    if (menuButton) {
        menuButton.addEventListener("click", function () {
            const isOpen = body.classList.contains(
                "stackly-admin-menu-active"
            );

            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    /* ==========================================
       09. SIDEBAR CLOSE BUTTON
    ========================================== */

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            closeSidebar(true);
        });
    }

    /* ==========================================
       10. OVERLAY CLICK
    ========================================== */

    if (overlay) {
        overlay.addEventListener("click", function () {
            closeSidebar(true);
        });
    }

    /* ==========================================
       11. CLOSE MENU WITH ESCAPE
    ========================================== */

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            body.classList.contains("stackly-admin-menu-active")
        ) {
            closeSidebar(true);
        }
    });

    /* ==========================================
       12. CLOSE MENU AFTER NAVIGATION
    ========================================== */

    if (sidebar) {
        sidebar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (mobileView.matches) {
                    closeSidebar();
                }
            });
        });
    }

    /* ==========================================
       13. RESPONSIVE SIDEBAR STATE
    ========================================== */

    function handleViewportChange() {
        if (!sidebar) {
            return;
        }

        if (!mobileView.matches) {
            window.clearTimeout(closeTimer);

            body.classList.remove("stackly-admin-menu-active");

            if (overlay) {
                overlay.hidden = true;
                overlay.setAttribute("aria-hidden", "true");
            }

            sidebar.setAttribute("aria-hidden", "false");

            if (menuButton) {
                menuButton.setAttribute("aria-expanded", "false");
            }
        } else if (
            !body.classList.contains("stackly-admin-menu-active")
        ) {
            sidebar.setAttribute("aria-hidden", "true");

            if (overlay) {
                overlay.hidden = true;
                overlay.setAttribute("aria-hidden", "true");
            }
        }
    }

    if (typeof mobileView.addEventListener === "function") {
        mobileView.addEventListener(
            "change",
            handleViewportChange
        );
    } else {
        mobileView.addListener(handleViewportChange);
    }

    handleViewportChange();

    /* ==========================================
       14. TASK CHECKBOX ACCESSIBILITY
    ========================================== */

    document.querySelectorAll(
        ".stackly-staff-task input[type='checkbox']"
    ).forEach(function (checkbox) {
        checkbox.setAttribute(
            "aria-checked",
            String(checkbox.checked)
        );

        checkbox.addEventListener("change", function () {
            checkbox.setAttribute(
                "aria-checked",
                String(checkbox.checked)
            );
        });
    });

    /* ==========================================
       15. REFRESH AOS AFTER PAGE LOAD
    ========================================== */

    window.addEventListener("load", function () {
        if (typeof AOS !== "undefined") {
            AOS.refresh();
        }
    });

});

/* ==========================================
   16. SIDEBAR ACTIVE NAVIGATION HIGHLIGHT
========================================== */

const sidebarNavLinks = document.querySelectorAll(
    "#stacklyAdminSidebar .stackly-admin-nav-link"
);

function normalizePageName(path) {
    const pageName = path.split("/").pop().toLowerCase();
    return pageName || "index.html";
}

function updateActiveNavigation() {
    const currentPage = normalizePageName(
        window.location.pathname
    );

    sidebarNavLinks.forEach(function (link) {
        const linkPage = normalizePageName(
            new URL(link.href, window.location.href).pathname
        );

        const isActive = linkPage === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

/* Highlight the current page when it loads. */
updateActiveNavigation();

/* Update the highlight when a navigation link is clicked. */
sidebarNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        const targetPage = normalizePageName(
            new URL(link.href, window.location.href).pathname
        );

        sidebarNavLinks.forEach(function (navLink) {
            const navPage = normalizePageName(
                new URL(navLink.href, window.location.href).pathname
            );

            const isActive = navPage === targetPage;

            navLink.classList.toggle("active", isActive);

            if (isActive) {
                navLink.setAttribute("aria-current", "page");
            } else {
                navLink.removeAttribute("aria-current");
            }
        });
    });
});


/* =========================================================
   STACKLY EDUCATION
   MY STUDENTS PAGE - PROFESSIONAL JAVASCRIPT
   Features:
   - Custom Class & Status Dropdowns
   - Live Student Search
   - Combined Filtering
   - CSV Export
   - Keyboard Accessibility
   - Empty State Management
   - Responsive Dropdown Handling
========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* ================================================
           ELEMENT REFERENCES
        ================================================ */

        const directory = document.querySelector(
            ".stackly-students-directory"
        );

        if (!directory) return;

        const searchInput = document.getElementById(
            "stacklyStudentsSearch"
        );

        const studentsGrid = document.getElementById(
            "stacklyStudentsGrid"
        );

        const emptyState = document.getElementById(
            "stacklyStudentsEmpty"
        );

        const exportButton = document.getElementById(
            "stacklyStudentsExport"
        );

        const dropdowns = Array.from(
            directory.querySelectorAll(
                ".stackly-students-custom-dropdown"
            )
        );

        const studentCards = Array.from(
            studentsGrid.querySelectorAll(
                ".stackly-students-profile-card"
            )
        );

        /* ================================================
           FILTER STATE
        ================================================ */

        const filters = {
            class: "all",
            status: "all",
            search: ""
        };

        /* ================================================
           HELPER FUNCTIONS
        ================================================ */

        function normalizeText(value) {
            return String(value || "")
                .trim()
                .toLowerCase();
        }

        function getDropdown(type) {
            return dropdowns.find(function (dropdown) {
                return dropdown.dataset.dropdown === type;
            });
        }

        function getSelectedValue(type) {
            const dropdown = getDropdown(type);

            if (!dropdown) return "all";

            const selectedOption = dropdown.querySelector(
                ".stackly-students-dropdown-option.selected"
            );

            return selectedOption
                ? selectedOption.dataset.value
                : "all";
        }

        /* ================================================
           CUSTOM DROPDOWN: OPEN / CLOSE
        ================================================ */

        function closeDropdown(dropdown, restoreFocus) {
            if (!dropdown) return;

            const trigger = dropdown.querySelector(
                ".stackly-students-dropdown-trigger"
            );

            const menu = dropdown.querySelector(
                ".stackly-students-dropdown-menu"
            );

            if (!trigger || !menu) return;

            trigger.setAttribute("aria-expanded", "false");
            dropdown.classList.remove("is-open");
            menu.hidden = true;

            if (restoreFocus) {
                trigger.focus();
            }
        }

        function closeAllDropdowns(exceptDropdown) {
            dropdowns.forEach(function (dropdown) {
                if (dropdown !== exceptDropdown) {
                    closeDropdown(dropdown, false);
                }
            });
        }

        function openDropdown(dropdown) {
            if (!dropdown) return;

            const trigger = dropdown.querySelector(
                ".stackly-students-dropdown-trigger"
            );

            const menu = dropdown.querySelector(
                ".stackly-students-dropdown-menu"
            );

            if (!trigger || !menu) return;

            closeAllDropdowns(dropdown);

            menu.hidden = false;
            dropdown.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
        }

        dropdowns.forEach(function (dropdown) {
            const trigger = dropdown.querySelector(
                ".stackly-students-dropdown-trigger"
            );

            const menu = dropdown.querySelector(
                ".stackly-students-dropdown-menu"
            );

            const options = Array.from(
                dropdown.querySelectorAll(
                    ".stackly-students-dropdown-option"
                )
            );

            if (!trigger || !menu) return;

            /* Open or close on trigger click */
            trigger.addEventListener("click", function () {
                const isOpen =
                    trigger.getAttribute("aria-expanded") === "true";

                if (isOpen) {
                    closeDropdown(dropdown, false);
                } else {
                    openDropdown(dropdown);
                }
            });

            /* Select a dropdown option */
            options.forEach(function (option, index) {
                option.addEventListener("click", function () {

                    options.forEach(function (item) {
                        item.classList.remove("selected");
                        item.setAttribute("aria-selected", "false");
                    });

                    option.classList.add("selected");
                    option.setAttribute("aria-selected", "true");

                    const currentLabel = trigger.querySelector(
                        ".stackly-students-dropdown-current"
                    );

                    const optionLabel = option.querySelector("span");

                    if (currentLabel && optionLabel) {
                        currentLabel.textContent =
                            optionLabel.textContent.trim();
                    }

                    /* Update the active filter */
                    const filterType = dropdown.dataset.dropdown;

                    filters[filterType] = option.dataset.value;

                    closeDropdown(dropdown, false);

                    /* Apply search and filters together */
                    applyStudentFilters();

                    /* Notify other scripts if needed */
                    directory.dispatchEvent(
                        new CustomEvent("students-dropdown-change", {
                            bubbles: true,
                            detail: {
                                type: filterType,
                                value: option.dataset.value
                            }
                        })
                    );

                    trigger.focus();
                });

                /* Keyboard navigation inside the dropdown */
                option.addEventListener("keydown", function (event) {

                    if (event.key === "ArrowDown") {
                        event.preventDefault();

                        const nextOption =
                            options[(index + 1) % options.length];

                        nextOption.focus();
                    }

                    if (event.key === "ArrowUp") {
                        event.preventDefault();

                        const previousOption =
                            options[
                                (index - 1 + options.length) %
                                options.length
                            ];

                        previousOption.focus();
                    }

                    if (event.key === "Home") {
                        event.preventDefault();
                        options[0].focus();
                    }

                    if (event.key === "End") {
                        event.preventDefault();
                        options[options.length - 1].focus();
                    }

                    if (event.key === "Escape") {
                        event.preventDefault();
                        closeDropdown(dropdown, true);
                    }
                });
            });

            /* Trigger keyboard support */
            trigger.addEventListener("keydown", function (event) {

                if (
                    event.key === "ArrowDown" ||
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openDropdown(dropdown);

                    const selectedOption = menu.querySelector(
                        ".stackly-students-dropdown-option.selected"
                    );

                    const firstOption = selectedOption || options[0];

                    if (firstOption) firstOption.focus();
                }

                if (event.key === "Escape") {
                    closeDropdown(dropdown, false);
                }
            });
        });

        /* Close dropdown when clicking outside */
        document.addEventListener("click", function (event) {
            if (!event.target.closest(
                ".stackly-students-custom-dropdown"
            )) {
                closeAllDropdowns();
            }
        });

        /* Close dropdown on Escape */
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeAllDropdowns();
            }
        });

        /* ================================================
           STUDENT SEARCH & FILTERING
        ================================================ */

        function applyStudentFilters() {

            filters.search = searchInput
                ? normalizeText(searchInput.value)
                : "";

            filters.class = getSelectedValue("class");
            filters.status = getSelectedValue("status");

            let visibleCount = 0;

            studentCards.forEach(function (card) {

                const studentName = normalizeText(
                    card.dataset.studentName
                );

                const studentId = normalizeText(
                    card.dataset.studentId
                );

                const studentClass = normalizeText(
                    card.dataset.studentClass
                );

                const studentStatus = normalizeText(
                    card.dataset.studentStatus
                );

                const matchesSearch =
                    !filters.search ||
                    studentName.includes(filters.search) ||
                    studentId.includes(filters.search);

                const matchesClass =
                    filters.class === "all" ||
                    studentClass === normalizeText(filters.class);

                const matchesStatus =
                    filters.status === "all" ||
                    studentStatus === normalizeText(filters.status);

                const isVisible =
                    matchesSearch &&
                    matchesClass &&
                    matchesStatus;

                card.hidden = !isVisible;

                if (isVisible) {
                    visibleCount++;
                }
            });

            /* Empty-state management */
            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }

            if (studentsGrid) {
                studentsGrid.classList.toggle(
                    "stackly-students-no-results",
                    visibleCount === 0
                );
            }

            /* Update accessible result information */
            directory.setAttribute(
                "data-visible-students",
                String(visibleCount)
            );
        }

        if (searchInput) {
            searchInput.addEventListener(
                "input",
                applyStudentFilters
            );
        }

        /* ================================================
           CSV EXPORT
        ================================================ */

        function escapeCSV(value) {
            const text = String(value ?? "");

            return '"' + text.replace(/"/g, '""') + '"';
        }

        function exportStudents() {

            const visibleCards = studentCards.filter(function (card) {
                return !card.hidden;
            });

            if (visibleCards.length === 0) {
                showExportFeedback(
                    "No students available to export."
                );
                return;
            }

            const rows = [
                [
                    "Student Name",
                    "Student ID",
                    "Class",
                    "Status",
                    "Subject",
                    "Academic Progress"
                ]
            ];

            visibleCards.forEach(function (card) {

                const name =
                    card.dataset.studentName || "";

                const id =
                    card.dataset.studentId || "";

                const studentClass =
                    card.dataset.studentClass || "";

                const status =
                    card.dataset.studentStatus || "";

                const subjectElement = card.querySelector(
                    ".stackly-students-profile-details span:nth-child(2)"
                );

                const subject = subjectElement
                    ? subjectElement.textContent
                        .replace(/^\s*/, "")
                        .trim()
                        .replace(/^.*?\s(?=[A-Za-z])/, "")
                        .trim()
                    : "";

                const progressElement = card.querySelector(
                    ".stackly-students-progress-info strong"
                );

                const progress = progressElement
                    ? progressElement.textContent.trim()
                    : "";

                rows.push([
                    name,
                    id,
                    studentClass,
                    status,
                    subject,
                    progress
                ]);
            });

            const csvContent = rows
                .map(function (row) {
                    return row.map(escapeCSV).join(",");
                })
                .join("\r\n");

            /* Add BOM for Excel UTF-8 compatibility */
            const csvBlob = new Blob(
                ["\uFEFF", csvContent],
                { type: "text/csv;charset=utf-8;" }
            );

            const downloadUrl = URL.createObjectURL(csvBlob);
            const downloadLink = document.createElement("a");

            const date = new Date().toISOString().slice(0, 10);

            downloadLink.href = downloadUrl;
            downloadLink.download =
                "stackly-students-" + date + ".csv";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();

            URL.revokeObjectURL(downloadUrl);

            showExportFeedback(
                visibleCards.length +
                " student record(s) exported successfully."
            );
        }

        function showExportFeedback(message) {

            if (!exportButton) return;

            /* Use a temporary accessible label instead of alert() */
            const originalHTML = exportButton.innerHTML;

            exportButton.innerHTML =
                '<i class="fa-solid fa-check" aria-hidden="true"></i> ' +
                "Exported";

            exportButton.setAttribute("aria-label", message);
            exportButton.title = message;

            window.setTimeout(function () {
                exportButton.innerHTML = originalHTML;
                exportButton.removeAttribute("aria-label");
                exportButton.removeAttribute("title");
            }, 2200);
        }

        if (exportButton) {
            exportButton.addEventListener("click", exportStudents);
        }

        /* ================================================
           INITIALIZE DIRECTORY
        ================================================ */

        /* Respect the selected options already in the HTML */
        dropdowns.forEach(function (dropdown) {

            const selectedOption = dropdown.querySelector(
                ".stackly-students-dropdown-option.selected"
            );

            const currentLabel = dropdown.querySelector(
                ".stackly-students-dropdown-current"
            );

            if (selectedOption && currentLabel) {
                const label = selectedOption.querySelector("span");

                if (label) {
                    currentLabel.textContent = label.textContent.trim();
                }
            }
        });

        applyStudentFilters();

    });

})();


/* =========================================================
   STACKLY EDUCATION - STAFF RESOURCE LIBRARY
   Professional Search, Custom Dropdown & Resource Filtering
========================================================= */

(function () {
    "use strict";

    function initStaffResourceLibrary() {
        const library = document.getElementById("stacklyResourceLibrary");

        if (!library || library.dataset.initialized === "true") {
            return;
        }

        library.dataset.initialized = "true";

        /* ==========================================
           ELEMENT REFERENCES
        ========================================== */

        const searchInput = library.querySelector("#stacklyResourceSearch");
        const filterContainer = library.querySelector("#stacklyResourceCustomFilter");
        const filterTrigger = library.querySelector("#stacklyResourceFilterTrigger");
        const filterMenu = library.querySelector("#stacklyResourceFilterMenu");
        const filterLabel = library.querySelector("#stacklyResourceFilterLabel");
        const filterInput = library.querySelector("#stacklyResourceFilter");
        const filterOptions = Array.from(
            library.querySelectorAll(".stackly-resources-filter-option")
        );
        const resourceGrid = library.querySelector("#stacklyResourceGrid");
        const noResults = library.querySelector("#stacklyResourceNoResults");

        if (
            !searchInput ||
            !filterContainer ||
            !filterTrigger ||
            !filterMenu ||
            !filterLabel ||
            !filterInput ||
            !resourceGrid ||
            !noResults
        ) {
            console.warn("Stackly Resource Library: Required elements are missing.");
            return;
        }

        const resources = Array.from(
            resourceGrid.querySelectorAll(".stackly-resources-library-item")
        );

        if (!resources.length) {
            noResults.hidden = false;
            return;
        }

        /* ==========================================
           CONFIGURATION
        ========================================== */

        const FILTER_LABELS = {
            all: "All Resources",
            lesson: "Lesson Plans",
            activity: "Activities",
            worksheet: "Worksheets",
            guide: "Teacher Guides"
        };

        let activeFilter = filterInput.value || "all";
        let searchQuery = "";
        let focusedOptionIndex = -1;

        /* ==========================================
           NORMALIZE SEARCH TEXT
        ========================================== */

        function normalizeText(value) {
            return String(value || "")
                .toLowerCase()
                .trim()
                .replace(/\s+/g, " ");
        }

        /* ==========================================
           CUSTOM DROPDOWN
        ========================================== */

        function openDropdown(focusSelected = false) {
            filterMenu.hidden = false;
            filterTrigger.setAttribute("aria-expanded", "true");
            filterContainer.classList.add("is-open");

            if (focusSelected) {
                focusedOptionIndex = filterOptions.findIndex(function (option) {
                    return option.dataset.value === activeFilter;
                });

                if (focusedOptionIndex < 0) {
                    focusedOptionIndex = 0;
                }

                focusOption(focusedOptionIndex);
            }
        }

        function closeDropdown(returnFocus = false) {
            filterMenu.hidden = true;
            filterTrigger.setAttribute("aria-expanded", "false");
            filterContainer.classList.remove("is-open");
            focusedOptionIndex = -1;

            if (returnFocus) {
                filterTrigger.focus();
            }
        }

        function focusOption(index) {
            if (!filterOptions.length) return;

            focusedOptionIndex =
                (index + filterOptions.length) % filterOptions.length;

            filterOptions[focusedOptionIndex].focus();
        }

        function updateSelectedOption(value) {
            filterOptions.forEach(function (option) {
                const isSelected = option.dataset.value === value;

                option.classList.toggle("is-selected", isSelected);
                option.setAttribute("aria-selected", String(isSelected));
            });

            filterLabel.textContent = FILTER_LABELS[value] || FILTER_LABELS.all;
            filterInput.value = value;
        }

        function selectFilter(value) {
            if (!Object.prototype.hasOwnProperty.call(FILTER_LABELS, value)) {
                value = "all";
            }

            activeFilter = value;

            updateSelectedOption(value);
            closeDropdown(true);
            filterResources();
        }

        /* ==========================================
           FILTER AND SEARCH RESOURCES
        ========================================== */

        function filterResources() {
            let visibleCount = 0;

            resources.forEach(function (resource) {
                const resourceType = normalizeText(resource.dataset.resourceType);
                const resourceName = normalizeText(resource.dataset.resourceName);
                const resourceContent = normalizeText(resource.textContent);

                const matchesCategory =
                    activeFilter === "all" || resourceType === activeFilter;

                const searchableContent =
                    resourceName + " " + resourceContent + " " + resourceType;

                const matchesSearch =
                    !searchQuery || searchableContent.includes(searchQuery);

                const shouldShow = matchesCategory && matchesSearch;

                resource.hidden = !shouldShow;
                resource.classList.toggle("is-filtered-out", !shouldShow);

                if (shouldShow) {
                    visibleCount++;
                }
            });

            noResults.hidden = visibleCount > 0;

            resourceGrid.classList.toggle(
                "stackly-resources-grid-empty",
                visibleCount === 0
            );

            library.setAttribute("aria-busy", "false");
        }

        /* ==========================================
           DROPDOWN EVENTS
        ========================================== */

        filterTrigger.addEventListener("click", function () {
            if (filterMenu.hidden) {
                openDropdown();
            } else {
                closeDropdown();
            }
        });

        filterOptions.forEach(function (option, index) {
            option.addEventListener("click", function () {
                selectFilter(option.dataset.value);
            });

            option.addEventListener("keydown", function (event) {
                switch (event.key) {
                    case "ArrowDown":
                        event.preventDefault();
                        focusOption(index + 1);
                        break;

                    case "ArrowUp":
                        event.preventDefault();
                        focusOption(index - 1);
                        break;

                    case "Home":
                        event.preventDefault();
                        focusOption(0);
                        break;

                    case "End":
                        event.preventDefault();
                        focusOption(filterOptions.length - 1);
                        break;

                    case "Enter":
                    case " ":
                        event.preventDefault();
                        selectFilter(option.dataset.value);
                        break;

                    case "Escape":
                        event.preventDefault();
                        closeDropdown(true);
                        break;

                    case "Tab":
                        closeDropdown();
                        break;
                }
            });
        });

        filterTrigger.addEventListener("keydown", function (event) {
            switch (event.key) {
                case "ArrowDown":
                case "Enter":
                case " ":
                    event.preventDefault();
                    openDropdown(true);
                    break;

                case "Escape":
                    closeDropdown();
                    break;
            }
        });

        /* Close when clicking outside the dropdown */

        document.addEventListener("click", function (event) {
            if (!filterContainer.contains(event.target)) {
                closeDropdown();
            }
        });

        /* Close dropdown with Escape */

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !filterMenu.hidden) {
                closeDropdown(true);
            }
        });

        /* ==========================================
           SEARCH EVENTS
        ========================================== */

        searchInput.addEventListener("input", function () {
            searchQuery = normalizeText(searchInput.value);
            filterResources();
        });

        /* ==========================================
           INITIALIZE LIBRARY
        ========================================== */

        updateSelectedOption(activeFilter);
        filterResources();

        console.info("Stackly Resource Library initialized.");
    }

    /* Supports scripts loaded before or after the HTML */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initStaffResourceLibrary,
            { once: true }
        );
    } else {
        initStaffResourceLibrary();
    }
})();



/* ==========================================
   STACKLY EDUCATION - STAFF PROFILE
   Dynamic Username and Email
========================================== */

(function () {
    "use strict";

    function initStaffProfile() {

        // Find the logged-in user's email
        const emailKeys = [
            "loginEmail",
            "stacklyEduLoginEmail",
            "stacklyStaffLoginEmail",
            "staffEmail",
            "userEmail"
        ];

        let email = "";

        for (const key of emailKeys) {
            try {
                const storedValue = localStorage.getItem(key);

                if (storedValue && storedValue.trim()) {
                    email = storedValue.trim();
                    break;
                }
            } catch (error) {
                console.warn("Unable to read saved account details.");
                break;
            }
        }

        // Normalize the email
        email = email.toLowerCase();

        // Get the username before @
        function getUserName(emailAddress) {
            if (!emailAddress || !emailAddress.includes("@")) {
                return "Staff Member";
            }

            const userPart = emailAddress.split("@")[0];

            // Convert dots, underscores, and hyphens into spaces
            const words = userPart
                .replace(/[._-]+/g, " ")
                .trim()
                .split(/\s+/);

            // Capitalize each word
            return words
                .filter(Boolean)
                .map(function (word) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join(" ") || "Staff Member";
        }

        const userName = getUserName(email);
        const displayEmail = email || "Email not available";

        // Update profile name elements
        const nameElements = [
            ".stackly-profile-identity h3",
            "#stacklyStaffProfileName",
            "#stacklyStaffFullName"
        ];

        nameElements.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element) {
                element.textContent = userName;
            });
        });

        // Update profile email elements
        const emailElements = [
            "#stacklyStaffProfileEmail",
            "#stacklyStaffEmailAddress",
            ".stackly-profile-email"
        ];

        emailElements.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element) {
                element.textContent = displayEmail;
                element.title = displayEmail;
            });
        });

        // Update email in Personal Information
        const personalInfoRows = document.querySelectorAll(
            ".stackly-profile-info-row"
        );

        personalInfoRows.forEach(function (row) {
            const label = row.querySelector("span");
            const value = row.querySelector("strong");

            if (
                label &&
                value &&
                label.textContent.trim().toLowerCase() === "full name"
            ) {
                value.textContent = userName;
            }

            if (
                label &&
                value &&
                label.textContent.trim().toLowerCase() === "email address"
            ) {
                value.textContent = displayEmail;
                value.title = displayEmail;
            }
        });

        // Update staff email in the dashboard header if present
        const headerEmail = document.getElementById(
            "stacklyStaffEmailAddress"
        );

        if (headerEmail) {
            headerEmail.textContent = displayEmail;
            headerEmail.title = displayEmail;
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initStaffProfile, {
            once: true
        });
    } else {
        initStaffProfile();
    }
})();
