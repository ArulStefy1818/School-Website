/* ==========================================
   STACKLY EDUCATION
   ADMIN DASHBOARD JAVASCRIPT
   Email + Welcome Name + Mobile Navigation
   AOS + Enrollment Chart + Custom Dropdown
   Account Menu + Accessibility
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================
       1. ELEMENT SELECTORS
    ========================================== */

    const body = document.body;

    const sidebar = document.getElementById("stacklyAdminSidebar");
    const overlay = document.getElementById("stacklyAdminOverlay");
    const menuToggle = document.getElementById("stacklyAdminMenuToggle");
    const sidebarClose = document.getElementById("stacklyAdminSidebarClose");

    const adminEmail = document.getElementById("stacklyAdminEmail");
    const welcomeName = document.getElementById("stacklyAdminWelcomeName");

    const accountMenu = document.getElementById("stacklyAdminAccountMenu");
    const account = document.querySelector(".stackly-admin-account");

    const yearElement = document.getElementById("stacklyAdminYear");

    const mobileBreakpoint = window.matchMedia("(max-width: 900px)");

    /* ==========================================
       2. AOS ANIMATIONS
    ========================================== */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
            offset: 65,
            mirror: false
        });
    }

    /* ==========================================
       3. COPYRIGHT YEAR
    ========================================== */

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* ==========================================
       4. EMAIL AND WELCOME NAME
    ========================================== */

    function getSavedAdminEmail() {
        const emailKeys = [
            "loginEmail",
            "stacklyEduLoginEmail",
            "stacklyAdminEmail",
            "stacklyEduRememberedEmail"
        ];

        try {
            for (const key of emailKeys) {
                const value = localStorage.getItem(key);

                if (value && value.trim()) {
                    return value.trim();
                }
            }
        } catch (error) {
            // Local storage may be unavailable.
        }

        return "";
    }

    function displayAdminDetails() {
        const savedEmail = getSavedAdminEmail();
        const defaultEmail = "admin@stacklyeducation.com";
        const emailToDisplay = savedEmail || defaultEmail;

        if (adminEmail) {
            adminEmail.textContent = emailToDisplay;
            adminEmail.setAttribute("title", emailToDisplay);
        }

        if (welcomeName) {
            if (savedEmail && savedEmail.includes("@")) {
                const username = savedEmail
                    .split("@")[0]
                    .split(/[._\-\s]+/)
                    .filter(Boolean)[0] || "Admin";

                welcomeName.textContent =
                    username.charAt(0).toUpperCase() +
                    username.slice(1).toLowerCase();
            } else {
                welcomeName.textContent = "Admin";
            }
        }
    }

    displayAdminDetails();

    /* ==========================================
       5. MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.add("stackly-admin-sidebar-open");
        overlay.classList.add("stackly-admin-overlay-visible");
        body.classList.add("stackly-admin-menu-active");

        overlay.setAttribute("aria-hidden", "false");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );
        }

        if (sidebarClose) {
            sidebarClose.focus();
        }
    }

    function closeSidebar(returnFocus = false) {
        if (!sidebar || !overlay) return;

        sidebar.classList.remove("stackly-admin-sidebar-open");
        overlay.classList.remove("stackly-admin-overlay-visible");
        body.classList.remove("stackly-admin-menu-active");

        overlay.setAttribute("aria-hidden", "true");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            if (returnFocus && mobileBreakpoint.matches) {
                menuToggle.focus();
            }
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            const isOpen = sidebar &&
                sidebar.classList.contains("stackly-admin-sidebar-open");

            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener("click", function () {
            closeSidebar(true);
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function () {
            closeSidebar(true);
        });
    }

    if (sidebar) {
        sidebar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (mobileBreakpoint.matches) {
                    closeSidebar();
                }
            });
        });
    }

    function handleBreakpointChange(event) {
        if (!event.matches) {
            closeSidebar();
        }
    }

    if (typeof mobileBreakpoint.addEventListener === "function") {
        mobileBreakpoint.addEventListener(
            "change",
            handleBreakpointChange
        );
    } else if (typeof mobileBreakpoint.addListener === "function") {
        mobileBreakpoint.addListener(handleBreakpointChange);
    }

    /* ==========================================
       6. ACTIVE SIDEBAR NAVIGATION
    ========================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "admin.html";

    if (sidebar) {
        sidebar.querySelectorAll(
            ".stackly-admin-nav-link"
        ).forEach(function (link) {
            const href = link.getAttribute("href");

            if (!href || href.startsWith("#")) return;

            const linkPage = href.split("/").pop().toLowerCase();
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
       7. ADMIN ACCOUNT DROPDOWN
    ========================================== */

    let accountDropdown = null;

    function createAccountDropdown() {
        if (!account || accountDropdown) return;

        accountDropdown = document.createElement("div");
        accountDropdown.className = "stackly-admin-account-dropdown";
        accountDropdown.id = "stacklyAdminAccountDropdown";
        accountDropdown.hidden = true;

        accountDropdown.innerHTML = `
            <a href="404-admin.html"
               class="stackly-admin-account-option">
                <i class="fa-solid fa-user-gear"
                   aria-hidden="true"></i>
                <span>Account Settings</span>
            </a>

            <a href="index.html"
               class="stackly-admin-account-option">
                <i class="fa-solid fa-arrow-right-from-bracket"
                   aria-hidden="true"></i>
                <span>Logout</span>
            </a>
        `;

        account.appendChild(accountDropdown);

        if (accountMenu) {
            accountMenu.setAttribute(
                "aria-controls",
                accountDropdown.id
            );
            accountMenu.setAttribute("aria-expanded", "false");
        }
    }

    function toggleAccountMenu() {
        createAccountDropdown();

        if (!accountDropdown) return;

        const willOpen = accountDropdown.hidden;

        accountDropdown.hidden = !willOpen;

        if (accountMenu) {
            accountMenu.setAttribute(
                "aria-expanded",
                String(willOpen)
            );
        }
    }

    function closeAccountMenu() {
        if (!accountDropdown) return;

        accountDropdown.hidden = true;

        if (accountMenu) {
            accountMenu.setAttribute("aria-expanded", "false");
        }
    }

    if (accountMenu) {
        accountMenu.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleAccountMenu();
        });
    }

    document.addEventListener("click", function (event) {
        if (account && !account.contains(event.target)) {
            closeAccountMenu();
        }
    });

    /* ==========================================
       8. ENROLLMENT CHART DATA
    ========================================== */

    const chartBars = document.querySelectorAll(
        ".stackly-admin-chart-bar"
    );

    const chartSummary = document.querySelector(
        ".stackly-admin-chart-summary h2"
    );

    const chartLabel = document.querySelector(
        ".stackly-admin-chart-summary span"
    );

    const enrollmentData = {
        year: {
            values: [42, 53, 47, 66, 58, 76, 68, 88],
            total: "1,248",
            labels: [
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug"
            ],
            description: "students",
            heading: "Total Enrollments"
        },

        month: {
            values: [36, 48, 43, 61, 55, 73, 82, 92],
            total: "124",
            labels: [
                "W1", "W2", "W3", "W4",
                "W5", "W6", "W7", "W8"
            ],
            description: "this month",
            heading: "Monthly Enrollments"
        },

        week: {
            values: [45, 58, 52, 72, 64, 84, 76, 96],
            total: "32",
            labels: [
                "Mon", "Tue", "Wed", "Thu",
                "Fri", "Sat", "Sun", "Today"
            ],
            description: "this week",
            heading: "Weekly Enrollments"
        }
    };

    function updateEnrollmentChart(period) {
        const data = enrollmentData[period];

        if (!data) return;

        chartBars.forEach(function (bar, index) {
            if (data.values[index] !== undefined) {
                bar.style.height = data.values[index] + "%";
            }
        });

        const barLabels = document.querySelectorAll(
            ".stackly-admin-chart-bar-wrap > span"
        );

        barLabels.forEach(function (label, index) {
            if (data.labels[index] !== undefined) {
                label.textContent = data.labels[index];
            }
        });

        if (chartSummary) {
            chartSummary.replaceChildren(
                document.createTextNode(data.total + " ")
            );

            const small = document.createElement("small");
            small.textContent = data.description;
            chartSummary.appendChild(small);
        }

        if (chartLabel) {
            chartLabel.textContent = data.heading;
        }
    }

    /* ==========================================
       9. CUSTOM ENROLLMENT DROPDOWN
       Supports custom dropdown and native select.
    ========================================== */

    const enrollmentPeriod = document.getElementById(
        "stacklyAdminEnrollmentPeriod"
    );

    const customDropdown = document.getElementById(
        "stacklyAdminEnrollmentDropdown"
    );

    const dropdownTrigger = document.getElementById(
        "stacklyAdminEnrollmentTrigger"
    );

    const dropdownSelected = document.getElementById(
        "stacklyAdminEnrollmentSelected"
    );

    const dropdownOptions = customDropdown
        ? customDropdown.querySelectorAll(
            ".stackly-admin-dropdown-option"
        )
        : [];

    function closeEnrollmentDropdown(returnFocus = false) {
        if (!customDropdown || !dropdownTrigger) return;

        customDropdown.classList.remove("open");

        dropdownTrigger.setAttribute("aria-expanded", "false");

        if (returnFocus) {
            dropdownTrigger.focus();
        }
    }

    function openEnrollmentDropdown() {
        if (!customDropdown || !dropdownTrigger) return;

        customDropdown.classList.add("open");
        dropdownTrigger.setAttribute("aria-expanded", "true");
    }

    function syncCustomDropdown(value) {
        if (!customDropdown) return;

        const selectedOption = Array.from(dropdownOptions).find(
            function (option) {
                return option.dataset.value === value;
            }
        );

        if (selectedOption && dropdownSelected) {
            dropdownSelected.textContent =
                selectedOption.textContent.trim();
        }

        dropdownOptions.forEach(function (option) {
            const isSelected = option.dataset.value === value;

            option.classList.toggle("active", isSelected);
            option.setAttribute(
                "aria-selected",
                String(isSelected)
            );
        });
    }

    function handleEnrollmentChange() {
        if (!enrollmentPeriod) return;

        updateEnrollmentChart(enrollmentPeriod.value);
        syncCustomDropdown(enrollmentPeriod.value);
    }

    if (enrollmentPeriod) {
        enrollmentPeriod.addEventListener(
            "change",
            handleEnrollmentChange
        );
    }

    if (customDropdown && dropdownTrigger && enrollmentPeriod) {
        dropdownTrigger.addEventListener("click", function () {
            const isOpen = customDropdown.classList.contains("open");

            if (isOpen) {
                closeEnrollmentDropdown();
            } else {
                openEnrollmentDropdown();
            }
        });

        dropdownOptions.forEach(function (option, index) {
            option.addEventListener("click", function () {
                const value = option.dataset.value;

                if (!enrollmentData[value]) return;

                enrollmentPeriod.value = value;

                syncCustomDropdown(value);
                closeEnrollmentDropdown();

                /*
                 * Notify the chart listener.
                 * The same event also supports other listeners.
                 */
                enrollmentPeriod.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
            });

            option.addEventListener("keydown", function (event) {
                let nextIndex = index;

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    nextIndex = (index + 1) % dropdownOptions.length;
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    nextIndex =
                        (index - 1 + dropdownOptions.length) %
                        dropdownOptions.length;
                } else if (event.key === "Escape") {
                    event.preventDefault();
                    closeEnrollmentDropdown(true);
                    return;
                } else {
                    return;
                }

                dropdownOptions[nextIndex].focus();
            });
        });

        dropdownTrigger.addEventListener("keydown", function (event) {
            if (
                event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                openEnrollmentDropdown();

                if (dropdownOptions.length) {
                    dropdownOptions[0].focus();
                }
            } else if (event.key === "Escape") {
                closeEnrollmentDropdown();
            }
        });

        document.addEventListener("click", function (event) {
            if (!customDropdown.contains(event.target)) {
                closeEnrollmentDropdown();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeEnrollmentDropdown();
            }
        });

        /* Initialize selected value and chart */
        const initialPeriod = enrollmentData[enrollmentPeriod.value]
            ? enrollmentPeriod.value
            : "year";

        enrollmentPeriod.value = initialPeriod;
        syncCustomDropdown(initialPeriod);
        updateEnrollmentChart(initialPeriod);
    } else if (enrollmentPeriod) {
        /* Native select fallback */
        const initialPeriod = enrollmentData[enrollmentPeriod.value]
            ? enrollmentPeriod.value
            : "year";

        enrollmentPeriod.value = initialPeriod;
        updateEnrollmentChart(initialPeriod);
    }

    /* ==========================================
       10. ICON BUTTON CLICK FEEDBACK
    ========================================== */

    document.querySelectorAll(
        ".stackly-admin-icon-button"
    ).forEach(function (button) {
        button.addEventListener("click", function () {
            button.classList.add(
                "stackly-admin-button-clicked"
            );

            window.setTimeout(function () {
                button.classList.remove(
                    "stackly-admin-button-clicked"
                );
            }, 180);
        });
    });

    /* ==========================================
       11. KEYBOARD FOCUS VISIBILITY
    ========================================== */

    document.querySelectorAll(
        ".stackly-admin-nav-link, " +
        ".stackly-admin-button, " +
        ".stackly-admin-quick-action, " +
        ".stackly-admin-view-all, " +
        ".stackly-admin-table-action"
    ).forEach(function (element) {
        element.addEventListener("focus", function () {
            element.classList.add(
                "stackly-admin-keyboard-focus"
            );
        });

        element.addEventListener("blur", function () {
            element.classList.remove(
                "stackly-admin-keyboard-focus"
            );
        });
    });

    /* ==========================================
       12. GLOBAL ESCAPE KEY
    ========================================== */

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar(true);
            closeAccountMenu();
            closeEnrollmentDropdown();
        }
    });

    /* ==========================================
       13. INITIALIZE DASHBOARD
    ========================================== */

    closeSidebar();
    createAccountDropdown();

});



/* =========================================================
   STACKLY EDUCATION — ADMIN STUDENT DIRECTORY
   Professional Search, Custom Filters & Dropdown Controls
========================================================= */

(() => {
    "use strict";

    /* -----------------------------------------------------
       DOM ELEMENTS
    ----------------------------------------------------- */

    const directory = document.querySelector(
        ".stackly-admin-students-directory"
    );

    if (!directory) return;

    const searchInput = directory.querySelector(
        "#stacklyAdminStudentSearch"
    );

    const classDropdown = directory.querySelector(
        "#stacklyAdminClassDropdown"
    );

    const statusDropdown = directory.querySelector(
        "#stacklyAdminStatusDropdown"
    );

    const statusNativeSelect = directory.querySelector(
        "#stacklyAdminStudentStatusFilter"
    );

    const table = directory.querySelector(
        ".stackly-admin-students-table"
    );

    const tableBody = table?.querySelector("tbody");

    const emptyState = directory.querySelector(
        ".stackly-admin-students-empty"
    );

    const tableWrapper = directory.querySelector(
        ".stackly-admin-students-table-wrapper"
    );

    const tableFooter = directory.querySelector(
        ".stackly-admin-students-table-footer"
    );

    const searchContainer = directory.querySelector(
        ".stackly-admin-students-search"
    );

    if (!tableBody || !table) return;

    const rows = Array.from(tableBody.querySelectorAll("tr"));

    /* -----------------------------------------------------
       FILTER STATE
    ----------------------------------------------------- */

    const filters = {
        search: "",
        className: "all",
        status: "all"
    };

    let visibleCount = rows.length;

    /* -----------------------------------------------------
       ACCESSIBLE STATUS ANNOUNCEMENT
    ----------------------------------------------------- */

    let liveRegion = directory.querySelector(
        "#stacklyAdminStudentsLiveRegion"
    );

    if (!liveRegion) {
        liveRegion = document.createElement("div");

        liveRegion.id = "stacklyAdminStudentsLiveRegion";
        liveRegion.className =
            "stackly-admin-students-live-region";

        liveRegion.setAttribute("role", "status");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");

        directory.appendChild(liveRegion);
    }

    /* -----------------------------------------------------
       RESULT COUNTER
       Adds a count beside the existing directory heading.
    ----------------------------------------------------- */

    let resultCount = directory.querySelector(
        ".stackly-admin-students-result-count"
    );

    if (!resultCount) {
        const heading = directory.querySelector(
            ".stackly-admin-students-section-heading h2"
        );

        if (heading) {
            resultCount = document.createElement("span");

            resultCount.className =
                "stackly-admin-students-result-count";

            resultCount.setAttribute("aria-live", "polite");

            heading.insertAdjacentElement(
                "afterend",
                resultCount
            );
        }
    }

    /* -----------------------------------------------------
       HELPERS
    ----------------------------------------------------- */

    const normalize = (value) =>
        String(value || "")
            .trim()
            .toLowerCase();

    const getStudentName = (row) =>
        row.querySelector(
            ".stackly-admin-student-profile strong"
        )?.textContent || "";

    const getStudentEmail = (row) =>
        row.querySelector(
            ".stackly-admin-student-profile span"
        )?.textContent || "";

    const getStudentId = (row) => {
        const cells = row.querySelectorAll("td");
        return cells[1]?.textContent.trim() || "";
    };

    const getStudentClass = (row) =>
        row.dataset.studentClass || "";

    const getStudentStatus = (row) =>
        row.dataset.studentStatus || "";

    /* -----------------------------------------------------
       SEARCH AND FILTER LOGIC
    ----------------------------------------------------- */

    function applyFilters(announce = true) {
        filters.search = normalize(filters.search);

        let count = 0;

        rows.forEach((row) => {
            const searchableText = normalize([
                getStudentName(row),
                getStudentEmail(row),
                getStudentId(row),
                getStudentClass(row),
                getStudentStatus(row)
            ].join(" "));

            const matchesSearch =
                !filters.search ||
                searchableText.includes(filters.search);

            const matchesClass =
                filters.className === "all" ||
                getStudentClass(row) === filters.className;

            const matchesStatus =
                filters.status === "all" ||
                getStudentStatus(row) === filters.status;

            const matches =
                matchesSearch &&
                matchesClass &&
                matchesStatus;

            row.hidden = !matches;

            if (matches) {
                count++;
            }
        });

        visibleCount = count;

        updateEmptyState(count);
        updateResultCount(count);
        updateFilterAccessibility();

        if (announce) {
            liveRegion.textContent =
                `${count} ${count === 1 ? "student" : "students"} found.`;
        }

        directory.dispatchEvent(
            new CustomEvent("stackly:students-filtered", {
                bubbles: true,
                detail: {
                    count,
                    total: rows.length,
                    search: filters.search,
                    className: filters.className,
                    status: filters.status
                }
            })
        );
    }

    /* -----------------------------------------------------
       EMPTY STATE
    ----------------------------------------------------- */

    function updateEmptyState(count) {
        const isEmpty = count === 0;

        if (emptyState) {
            emptyState.hidden = !isEmpty;
        }

        if (table) {
            table.hidden = isEmpty;
        }

        if (tableFooter) {
            tableFooter.hidden = isEmpty;
        }

        if (tableWrapper) {
            tableWrapper.classList.toggle(
                "is-empty",
                isEmpty
            );
        }
    }

    /* -----------------------------------------------------
       RESULT COUNT
    ----------------------------------------------------- */

    function updateResultCount(count) {
        if (!resultCount) return;

        resultCount.textContent =
            `${count} of ${rows.length} students`;

        resultCount.classList.toggle(
            "has-no-results",
            count === 0
        );
    }

    /* -----------------------------------------------------
       DROPDOWN INITIALIZATION
    ----------------------------------------------------- */

    function setupDropdown(wrapper, options = {}) {
        if (!wrapper) return null;

        const trigger = wrapper.querySelector(
            ".stackly-admin-students-select-trigger"
        );

        const panel = wrapper.querySelector(
            ".stackly-admin-students-select-options"
        );

        const valueDisplay = wrapper.querySelector(
            ".stackly-admin-students-select-value"
        );

        const nativeSelect = wrapper.querySelector("select");

        if (!trigger || !panel || !valueDisplay) {
            return null;
        }

        const optionButtons = Array.from(
            panel.querySelectorAll(
                ".stackly-admin-students-select-option"
            )
        );

        let selectedValue =
            optionButtons.find((option) =>
                option.classList.contains("is-selected")
            )?.dataset.value || "all";

        let previousFocus = null;

        function setExpanded(expanded) {
            trigger.setAttribute(
                "aria-expanded",
                String(expanded)
            );

            panel.hidden = !expanded;

            wrapper.classList.toggle(
                "is-open",
                expanded
            );

            if (expanded) {
                previousFocus = document.activeElement;
            }
        }

        function closeDropdown(returnFocus = false) {
            if (panel.hidden) return;

            setExpanded(false);

            if (returnFocus) {
                trigger.focus();
            }
        }

        function selectOption(option, announce = true) {
            if (!option) return;

            selectedValue = option.dataset.value || "all";

            optionButtons.forEach((button) => {
                const selected =
                    button === option;

                button.classList.toggle(
                    "is-selected",
                    selected
                );

                button.setAttribute(
                    "aria-selected",
                    String(selected)
                );
            });

            const label = option.querySelector("span");

            valueDisplay.textContent =
                label?.textContent.trim() ||
                option.textContent.trim();

            if (nativeSelect) {
                nativeSelect.value = selectedValue;

                nativeSelect.dispatchEvent(
                    new Event("change", {
                        bubbles: true
                    })
                );
            }

            if (typeof options.onChange === "function") {
                options.onChange(selectedValue);
            }

            closeDropdown();

            if (announce) {
                liveRegion.textContent =
                    `${valueDisplay.textContent} filter selected.`;
            }
        }

        trigger.addEventListener("click", () => {
            const shouldOpen =
                trigger.getAttribute("aria-expanded") !== "true";

            closeAllDropdowns(wrapper);

            setExpanded(shouldOpen);

            if (shouldOpen) {
                const selectedOption =
                    optionButtons.find(
                        (option) =>
                            option.dataset.value === selectedValue
                    ) || optionButtons[0];

                selectedOption?.focus();
            }
        });

        optionButtons.forEach((option, index) => {
            option.setAttribute("tabindex", "-1");

            option.addEventListener("click", () => {
                selectOption(option);
                trigger.focus();
            });

            option.addEventListener("keydown", (event) => {
                let nextIndex = index;

                switch (event.key) {
                    case "ArrowDown":
                        event.preventDefault();
                        nextIndex =
                            (index + 1) % optionButtons.length;
                        optionButtons[nextIndex]?.focus();
                        break;

                    case "ArrowUp":
                        event.preventDefault();
                        nextIndex =
                            (index - 1 + optionButtons.length) %
                            optionButtons.length;
                        optionButtons[nextIndex]?.focus();
                        break;

                    case "Home":
                        event.preventDefault();
                        optionButtons[0]?.focus();
                        break;

                    case "End":
                        event.preventDefault();
                        optionButtons[
                            optionButtons.length - 1
                        ]?.focus();
                        break;

                    case "Enter":
                    case " ":
                        event.preventDefault();
                        selectOption(option);
                        trigger.focus();
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

        trigger.addEventListener("keydown", (event) => {
            if (
                event.key === "ArrowDown" ||
                event.key === "ArrowUp"
            ) {
                event.preventDefault();

                closeAllDropdowns(wrapper);
                setExpanded(true);

                const selectedOption =
                    optionButtons.find(
                        (option) =>
                            option.dataset.value === selectedValue
                    ) || optionButtons[0];

                if (event.key === "ArrowUp") {
                    optionButtons[
                        optionButtons.length - 1
                    ]?.focus();
                } else {
                    selectedOption?.focus();
                }
            }

            if (event.key === "Escape") {
                closeDropdown();
            }
        });

        return {
            wrapper,
            trigger,
            panel,
            optionButtons,

            getValue() {
                return selectedValue;
            },

            setValue(value, announce = false) {
                const option = optionButtons.find(
                    (item) => item.dataset.value === value
                );

                if (option) {
                    selectOption(option, announce);
                }
            },

            close: closeDropdown
        };
    }

    /* -----------------------------------------------------
       INITIALIZE CLASS AND STATUS FILTERS
    ----------------------------------------------------- */

    const classControl = setupDropdown(
        classDropdown,
        {
            onChange(value) {
                filters.className = value;
                applyFilters();
            }
        }
    );

    const statusControl = setupDropdown(
        statusDropdown,
        {
            onChange(value) {
                filters.status = value;
                applyFilters();
            }
        }
    );

    /* -----------------------------------------------------
       CLOSE OTHER DROPDOWNS
    ----------------------------------------------------- */

    function closeAllDropdowns(except = null) {
        [classControl, statusControl].forEach((control) => {
            if (
                control &&
                control.wrapper !== except
            ) {
                control.close();
            }
        });
    }

    /* -----------------------------------------------------
       UPDATE FILTER ACCESSIBILITY
    ----------------------------------------------------- */

    function updateFilterAccessibility() {
        [classControl, statusControl].forEach((control) => {
            if (!control) return;

            control.trigger.setAttribute(
                "aria-label",
                `${control.valueDisplay?.textContent || "Filter"}`
            );
        });
    }

    /* -----------------------------------------------------
       LIVE SEARCH
    ----------------------------------------------------- */

    let searchTimer;

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            filters.search = searchInput.value;

            window.clearTimeout(searchTimer);

            searchTimer = window.setTimeout(() => {
                applyFilters();
            }, 120);
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                searchInput.value = "";
                filters.search = "";
                applyFilters();

                searchInput.blur();
            }
        });
    }

    /* -----------------------------------------------------
       CLOSE DROPDOWNS ON OUTSIDE CLICK
    ----------------------------------------------------- */

    document.addEventListener("click", (event) => {
        if (
            !classDropdown?.contains(event.target) &&
            !statusDropdown?.contains(event.target)
        ) {
            closeAllDropdowns();
        }
    });

    /* -----------------------------------------------------
       CLOSE DROPDOWNS ON ESCAPE
    ----------------------------------------------------- */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllDropdowns();
        }
    });

    /* -----------------------------------------------------
       NATIVE STATUS SELECT COMPATIBILITY
       Supports scripts that update the hidden select.
    ----------------------------------------------------- */

    if (statusNativeSelect) {
        statusNativeSelect.addEventListener("change", () => {
            const value = statusNativeSelect.value;

            if (
                statusControl &&
                statusControl.getValue() !== value
            ) {
                statusControl.setValue(value, false);
            }
        });
    }

    /* -----------------------------------------------------
       SEARCH ICON INTERACTION
    ----------------------------------------------------- */

    if (searchContainer && searchInput) {
        searchContainer.addEventListener("click", (event) => {
            if (event.target.closest("i")) {
                searchInput.focus();
            }
        });
    }

    /* -----------------------------------------------------
       CLEAR FILTERS API
       Use from other page scripts if required:
       directory.clearStudentFilters()
    ----------------------------------------------------- */

    directory.clearStudentFilters = function () {
        filters.search = "";
        filters.className = "all";
        filters.status = "all";

        if (searchInput) {
            searchInput.value = "";
        }

        classControl?.setValue("all", false);
        statusControl?.setValue("all", false);

        applyFilters();
    };

    /* -----------------------------------------------------
       INITIALIZE DIRECTORY
    ----------------------------------------------------- */

    applyFilters(false);

    /* -----------------------------------------------------
       CLEANUP SEARCH TIMER ON PAGE NAVIGATION
    ----------------------------------------------------- */

    window.addEventListener("pagehide", () => {
        window.clearTimeout(searchTimer);
    }, { once: true });

})();



document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const page = document.querySelector(".stackly-ann-page");

    if (!page) return;

    const filterButtons = page.querySelectorAll(".stackly-ann-filter");
    const cards = page.querySelectorAll(".stackly-ann-card");
    const emptyMessage = page.querySelector(".stackly-ann-empty");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.annFilter;
            let visibleCount = 0;

            filterButtons.forEach(function (filter) {
                const isActive = filter === button;

                filter.classList.toggle("active", isActive);
                filter.setAttribute("aria-pressed", String(isActive));
            });

            cards.forEach(function (card) {
                const matches =
                    selectedCategory === "all" ||
                    card.dataset.annCategory === selectedCategory;

                card.hidden = !matches;

                if (matches) visibleCount++;
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount > 0;
            }
        });
    });
});



/* =========================================================
   STACKLY EDUCATION — ADMIN MESSAGES
   Inbox Filters + Conversation Menus + Drafts + Compose Form
   Responsive, Accessible, Defensive JavaScript
========================================================= */

(() => {
    "use strict";

    function initializeMessages() {
        const page = document.querySelector(".stackly-msg-page");

        // This script can be included on every admin page.
        if (!page) return;

        const STORAGE = {
            drafts: "stacklyEduMessageDrafts",
            sent: "stacklyEduSentMessages"
        };

        const $ = (selector, root = page) =>
            root ? root.querySelector(selector) : null;

        const $$ = (selector, root = page) =>
            Array.from(root ? root.querySelectorAll(selector) : []);

        const inbox = $("#stacklyMsgInbox");
        const form = $("#stacklyMsgComposeForm");

        let toastTimer = null;
        let draftTimer = null;
        let activeMenu = null;
        let activeMenuTrigger = null;
        let activeFilter = "all";
        let isSubmitting = false;

        /* -------------------------------------------------
           SAFE LOCAL STORAGE
        ------------------------------------------------- */

        function readStorage(key, fallback) {
            try {
                const value = localStorage.getItem(key);

                if (value === null) return fallback;

                return JSON.parse(value);
            } catch (error) {
                console.warn("Unable to read messages storage:", error);
                return fallback;
            }
        }

        function writeStorage(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn("Unable to save messages storage:", error);
                return false;
            }
        }

        /* -------------------------------------------------
           TOAST NOTIFICATIONS
        ------------------------------------------------- */

        let toast = $("#stacklyMsgToast", document);

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "stacklyMsgToast";
            toast.className = "stackly-msg-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            toast.setAttribute("aria-atomic", "true");

            Object.assign(toast.style, {
                position: "fixed",
                right: "20px",
                bottom: "20px",
                zIndex: "99999",
                maxWidth: "min(390px, calc(100vw - 32px))",
                padding: "14px 18px",
                borderRadius: "12px",
                color: "#fff",
                background: "#075e55",
                boxShadow: "0 12px 32px rgba(0,0,0,.18)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "1.6",
                opacity: "0",
                visibility: "hidden",
                transform: "translateY(12px)",
                pointerEvents: "none",
                transition:
                    "opacity .22s ease, transform .22s ease, visibility .22s ease"
            });

            document.body.appendChild(toast);
        }

        function showToast(message, type = "success") {
            if (!toast) return;

            window.clearTimeout(toastTimer);

            toast.textContent = message;
            toast.style.background =
                type === "error" ? "#b42318" :
                type === "warning" ? "#9a5b00" :
                "#075e55";

            toast.style.visibility = "visible";
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";

            toastTimer = window.setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateY(12px)";
                toast.style.visibility = "hidden";
            }, 3200);
        }

        /* -------------------------------------------------
           INBOX: CONVERSATIONS AND FILTERS
        ------------------------------------------------- */

        if (inbox) {
            const conversationList = $(
                ".stackly-msg-conversation-list",
                inbox
            );

            const conversations = $$(".stackly-msg-conversation", inbox);
            const filterButtons = $$(".stackly-msg-filter", inbox);

            function getStatus(conversation) {
                return {
                    unread: Boolean(
                        $(".stackly-msg-tag-unread", conversation)
                    ),
                    important: Boolean(
                        $(".stackly-msg-tag-important", conversation)
                    )
                };
            }

            function updateCounts() {
                const unreadCount = conversations.filter(
                    conversation => getStatus(conversation).unread
                ).length;

                const unreadBadge = $(
                    ".stackly-msg-unread-badge",
                    inbox
                );

                if (unreadBadge) {
                    unreadBadge.textContent = `${unreadCount} Unread`;
                }

                const unreadStat = $(
                    ".stackly-msg-stat-card:nth-child(2) h3"
                );

                if (unreadStat) {
                    unreadStat.textContent = String(unreadCount);
                }
            }

            function getFilterValue(button) {
                const explicitValue =
                    button.dataset.msgFilter ||
                    button.dataset.filter ||
                    button.dataset.annFilter;

                if (explicitValue) {
                    const value = explicitValue.toLowerCase();

                    if (["all", "unread", "important"].includes(value)) {
                        return value;
                    }
                }

                const label = button.textContent
                    .trim()
                    .toLowerCase();

                if (label.includes("important")) return "important";
                if (label.includes("unread")) return "unread";

                return "all";
            }

            function applyFilter(filter = "all") {
                activeFilter = filter;

                let visibleCount = 0;

                conversations.forEach(conversation => {
                    const status = getStatus(conversation);

                    const visible =
                        filter === "all" ||
                        (filter === "unread" && status.unread) ||
                        (filter === "important" && status.important);

                    conversation.hidden = !visible;

                    if (visible) visibleCount++;
                });

                filterButtons.forEach(button => {
                    const selected = getFilterValue(button) === filter;

                    button.classList.toggle("active", selected);
                    button.setAttribute(
                        "aria-pressed",
                        String(selected)
                    );
                });

                let emptyState = $(
                    ".stackly-msg-empty-state",
                    inbox
                );

                if (visibleCount === 0) {
                    if (!emptyState) {
                        emptyState = document.createElement("div");
                        emptyState.className = "stackly-msg-empty-state";

                        Object.assign(emptyState.style, {
                            padding: "28px 16px",
                            textAlign: "center",
                            color: "#586575",
                            fontSize: "15px",
                            lineHeight: "1.7"
                        });

                        if (conversationList) {
                            conversationList.appendChild(emptyState);
                        } else {
                            inbox.appendChild(emptyState);
                        }
                    }

                    if (emptyState) {
                        emptyState.textContent =
                            filter === "unread"
                                ? "You're all caught up. No unread messages."
                                : filter === "important"
                                ? "No important messages found."
                                : "No conversations are available.";
                    }
                } else if (emptyState) {
                    emptyState.remove();
                }

                updateCounts();
            }

            filterButtons.forEach(button => {
                button.addEventListener("click", () => {
                    applyFilter(getFilterValue(button));
                });
            });

            /* ---------------------------------------------
               CONVERSATION ACTION MENUS
            --------------------------------------------- */

            function closeConversationMenu(returnFocus = false) {
                const trigger = activeMenuTrigger;

                if (activeMenu) {
                    activeMenu.remove();
                }

                activeMenu = null;
                activeMenuTrigger = null;

                if (trigger) {
                    trigger.setAttribute("aria-expanded", "false");

                    if (returnFocus && trigger.isConnected) {
                        trigger.focus();
                    }
                }
            }

            function createMenuAction(label, callback) {
                const button = document.createElement("button");

                button.type = "button";
                button.textContent = label;

                Object.assign(button.style, {
                    display: "block",
                    width: "100%",
                    padding: "11px 12px",
                    border: "0",
                    borderRadius: "7px",
                    background: "#fff",
                    color: "#202d3c",
                    textAlign: "left",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                });

                button.addEventListener("mouseenter", () => {
                    button.style.background = "#fff3df";
                });

                button.addEventListener("mouseleave", () => {
                    button.style.background = "#fff";
                });

                button.addEventListener("click", () => {
                    closeConversationMenu();
                    callback();
                });

                return button;
            }

            function markAsRead(conversation) {
                const unreadTag = $(
                    ".stackly-msg-tag-unread",
                    conversation
                );

                if (unreadTag) {
                    unreadTag.remove();
                    showToast("Conversation marked as read.");
                } else {
                    showToast("This conversation is already marked as read.");
                }

                applyFilter(activeFilter);
            }

            function toggleImportant(conversation) {
                const tags = $(
                    ".stackly-msg-conversation-tags",
                    conversation
                );

                if (!tags) {
                    showToast("Unable to update this conversation.", "error");
                    return;
                }

                const existing = $(
                    ".stackly-msg-tag-important",
                    tags
                );

                if (existing) {
                    existing.remove();
                    showToast("Important status removed.");
                } else {
                    const tag = document.createElement("span");
                    tag.className = "stackly-msg-tag-important";
                    tag.textContent = "Important";
                    tags.appendChild(tag);

                    showToast("Conversation marked as important.");
                }

                applyFilter(activeFilter);
            }

            function openConversationMenu(conversation, trigger) {
                closeConversationMenu();

                const menu = document.createElement("div");

                menu.className = "stackly-msg-action-menu";
                menu.setAttribute("role", "group");
                menu.setAttribute("aria-label", "Conversation actions");

                Object.assign(menu.style, {
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    right: "0",
                    zIndex: "1000",
                    width: "190px",
                    padding: "6px",
                    border: "1px solid #e8edf2",
                    borderRadius: "11px",
                    background: "#fff",
                    boxShadow: "0 12px 30px rgba(32,45,60,.14)"
                });

                menu.appendChild(
                    createMenuAction("Mark as read", () => {
                        markAsRead(conversation);
                    })
                );

                menu.appendChild(
                    createMenuAction("Toggle important", () => {
                        toggleImportant(conversation);
                    })
                );

                menu.appendChild(
                    createMenuAction("View details", () => {
                        const name = $(
                            ".stackly-msg-conversation-top h3",
                            conversation
                        );

                        const role = $(
                            ".stackly-msg-person-role",
                            conversation
                        );

                        const preview = $(
                            ".stackly-msg-preview",
                            conversation
                        );

                        const details = [
                            name?.textContent.trim() || "Conversation",
                            role?.textContent.trim(),
                            preview?.textContent.trim()
                        ].filter(Boolean).join(" — ");

                        showToast(details);
                    })
                );

                const parent = trigger.parentElement || conversation;

                if (getComputedStyle(parent).position === "static") {
                    parent.style.position = "relative";
                }

                parent.appendChild(menu);

                activeMenu = menu;
                activeMenuTrigger = trigger;

                trigger.setAttribute("aria-expanded", "true");

                menu.addEventListener("click", event => {
                    event.stopPropagation();
                });

                const firstAction = $("button", menu);
                if (firstAction) firstAction.focus();
            }

            conversations.forEach(conversation => {
                const trigger = $(
                    ".stackly-msg-conversation-more",
                    conversation
                );

                if (trigger) {
                    trigger.type = "button";
                    trigger.setAttribute("aria-haspopup", "true");
                    trigger.setAttribute("aria-expanded", "false");

                    trigger.addEventListener("click", event => {
                        event.preventDefault();
                        event.stopPropagation();

                        if (
                            activeMenu &&
                            activeMenuTrigger === trigger
                        ) {
                            closeConversationMenu();
                        } else {
                            openConversationMenu(conversation, trigger);
                        }
                    });
                }

                /* Make the conversation keyboard accessible. */
                const name = $(
                    ".stackly-msg-conversation-top h3",
                    conversation
                );

                if (name) {
                    conversation.setAttribute("tabindex", "0");

                    if (!conversation.hasAttribute("role")) {
                        conversation.setAttribute("role", "button");
                    }

                    if (!conversation.hasAttribute("aria-label")) {
                        conversation.setAttribute(
                            "aria-label",
                            `View conversation with ${name.textContent.trim()}`
                        );
                    }

                    function showConversationPreview() {
                        const preview = $(
                            ".stackly-msg-preview",
                            conversation
                        );

                        const role = $(
                            ".stackly-msg-person-role",
                            conversation
                        );

                        showToast([
                            name.textContent.trim(),
                            role?.textContent.trim(),
                            preview?.textContent.trim()
                        ].filter(Boolean).join(" — "));
                    }

                    conversation.addEventListener("click", event => {
                        if (
                            event.target.closest("button, a, input, select, textarea")
                        ) {
                            return;
                        }

                        showConversationPreview();
                    });

                    conversation.addEventListener("keydown", event => {
                        if (
                            (event.key === "Enter" || event.key === " ") &&
                            event.target === conversation
                        ) {
                            event.preventDefault();
                            showConversationPreview();
                        }
                    });
                }
            });

            document.addEventListener("click", event => {
                if (
                    activeMenu &&
                    !activeMenu.contains(event.target) &&
                    !event.target.closest(SELECTORS.moreButton)
                ) {
                    closeConversationMenu();
                }
            });

            document.addEventListener("keydown", event => {
                if (event.key === "Escape" && activeMenu) {
                    closeConversationMenu(true);
                }
            });

            // Initial state
            applyFilter("all");
        }

        /* -------------------------------------------------
           COMPOSE FORM AND DRAFTS
        ------------------------------------------------- */

        if (form) {
            const recipient = $("#stacklyMsgRecipient", form);
            const subject = $("#stacklyMsgSubject", form);
            const priority = $("#stacklyMsgPriority", form);
            const message = $("#stacklyMsgBody", form);
            const sendCopy = $('[name="sendCopy"]', form);

            const canCompose = recipient && subject && message;

            function getDraft() {
                const draft = readStorage(STORAGE.drafts, {});

                return draft &&
                    typeof draft === "object" &&
                    !Array.isArray(draft)
                    ? draft
                    : {};
            }

            function saveDraft() {
                if (!canCompose) return false;

                return writeStorage(STORAGE.drafts, {
                    recipient: recipient.value,
                    subject: subject.value,
                    priority: priority?.value || "normal",
                    message: message.value,
                    sendCopy: Boolean(sendCopy?.checked),
                    updatedAt: new Date().toISOString()
                });
            }

            function restoreDraft() {
                if (!canCompose) return;

                const draft = getDraft();

                if (!draft.updatedAt) return;

                recipient.value = typeof draft.recipient === "string"
                    ? draft.recipient
                    : "";

                subject.value = typeof draft.subject === "string"
                    ? draft.subject
                    : "";

                message.value = typeof draft.message === "string"
                    ? draft.message
                    : "";

                if (priority) {
                    priority.value =
                        typeof draft.priority === "string"
                            ? draft.priority
                            : "normal";
                }

                if (sendCopy) {
                    sendCopy.checked = Boolean(draft.sendCopy);
                }

                if (
                    draft.recipient ||
                    draft.subject ||
                    draft.message
                ) {
                    showToast("Your saved draft has been restored.");
                }
            }

            if (canCompose) {
                function scheduleDraftSave() {
                    window.clearTimeout(draftTimer);

                    draftTimer = window.setTimeout(() => {
                        if (saveDraft()) {
                            // Autosaving is intentionally quiet.
                        }
                    }, 400);
                }

                form.addEventListener("input", scheduleDraftSave);
                form.addEventListener("change", scheduleDraftSave);

                function validateForm() {
                    if (!recipient.value.trim()) {
                        recipient.focus();
                        showToast("Please select a recipient group.", "error");
                        return false;
                    }

                    if (!subject.value.trim()) {
                        subject.focus();
                        showToast("Please enter a message subject.", "error");
                        return false;
                    }

                    if (subject.value.trim().length > 150) {
                        subject.focus();
                        showToast(
                            "The subject must be 150 characters or fewer.",
                            "error"
                        );
                        return false;
                    }

                    if (!message.value.trim()) {
                        message.focus();
                        showToast("Please enter your message.", "error");
                        return false;
                    }

                    if (message.value.trim().length > 5000) {
                        message.focus();
                        showToast(
                            "The message must be 5,000 characters or fewer.",
                            "error"
                        );
                        return false;
                    }

                    return true;
                }

                function getSavedMessages() {
                    const records = readStorage(STORAGE.sent, []);
                    return Array.isArray(records) ? records : null;
                }

                function updateSentCount(savedCount) {
                    const sentStat = $(
                        ".stackly-msg-stat-card:nth-child(3) h3"
                    );

                    if (!sentStat) return;

                    // Keep the original HTML number as the baseline.
                    const initialText = sentStat.dataset.initialCount;

                    if (initialText === undefined) {
                        sentStat.dataset.initialCount =
                            sentStat.textContent.trim();
                    }

                    const baselineText = sentStat.dataset.initialCount;
                    const baseline = Number(
                        String(baselineText).replace(/[^\d.-]/g, "")
                    );

                    if (Number.isFinite(baseline)) {
                        sentStat.textContent = (
                            baseline + savedCount
                        ).toLocaleString();
                    }
                }

                function sendLocalDemoMessage() {
                    if (isSubmitting) return;

                    isSubmitting = true;

                    try {
                        if (!validateForm()) return;

                        const savedMessages = getSavedMessages();

                        if (!savedMessages) {
                            showToast(
                                "Saved message data is invalid. Clear the browser storage and try again.",
                                "error"
                            );
                            return;
                        }

                        const record = {
                            id: (
                                window.crypto &&
                                typeof window.crypto.randomUUID === "function"
                            )
                                ? window.crypto.randomUUID()
                                : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                            recipient: recipient.value,
                            subject: subject.value.trim(),
                            priority: priority?.value || "normal",
                            message: message.value.trim(),
                            sendCopy: Boolean(sendCopy?.checked),
                            createdAt: new Date().toISOString(),
                            status: "Local demo record"
                        };

                        savedMessages.unshift(record);

                        if (!writeStorage(STORAGE.sent, savedMessages)) {
                            showToast(
                                "Could not save this message in your browser.",
                                "error"
                            );
                            return;
                        }

                        // Remove the draft without triggering the manual-reset notice.
                        writeStorage(STORAGE.drafts, {});

                        window.clearTimeout(draftTimer);
                        form.reset();

                        updateSentCount(savedMessages.length);

                        showToast(
                            "Message saved locally. It has not been delivered to recipients.",
                            "warning"
                        );
                    } finally {
                        isSubmitting = false;
                    }
                }

                form.addEventListener("submit", event => {
                    event.preventDefault();
                    sendLocalDemoMessage();
                });

                form.addEventListener("reset", () => {
                    if (isSubmitting) return;

                    window.setTimeout(() => {
                        writeStorage(STORAGE.drafts, {});
                        window.clearTimeout(draftTimer);
                        showToast("Compose form cleared.");
                    }, 0);
                });

                restoreDraft();

                const savedMessages = getSavedMessages();
                if (savedMessages) {
                    updateSentCount(savedMessages.length);
                }
            } else {
                console.warn(
                    "Messages compose form is missing a recipient, subject, or message field."
                );
            }
        }

        /* -------------------------------------------------
           VIEW ALL CONVERSATIONS
        ------------------------------------------------- */

        if (inbox) {
            const viewAllLink = $(
                ".stackly-msg-view-all",
                inbox
            );

            if (viewAllLink) {
                viewAllLink.addEventListener("click", event => {
                    const href = viewAllLink.getAttribute("href");

                    if (!href || href === "#") {
                        event.preventDefault();

                        const allButton = $$(".stackly-msg-filter", inbox)
                            .find(button => {
                                const value =
                                    button.dataset.msgFilter ||
                                    button.dataset.filter ||
                                    button.textContent.trim().toLowerCase();

                                return value === "all" ||
                                    value.includes("all messages");
                            });

                        if (allButton) {
                            allButton.click();
                        }

                        showToast("All available conversations are displayed.");
                    }
                });
            }
        }

        console.info("Stackly Education Messages initialized.");
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeMessages,
            { once: true }
        );
    } else {
        initializeMessages();
    }
})();
