/* ============================================================
   STEMMATE APPLICATION CONTROLLER

   This file connects:

   - Navigation
   - Activities
   - My Activities
   - Create Activity
   - Saved Activities
   - Activity Details
   - Planner
   - Accessibility interactions
============================================================ */


/* ============================================================
   APPLICATION STARTUP
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initialiseNavigation();

        initialiseActivities();

        initialiseCreateActivity();

        initialiseMyActivities();

        initialiseSavedActivities();

        initialisePlanner();

        initialiseConnectionControls();

        restorePlanIntoForm();

        updateConnectionUI();

        renderFeaturedActivities();

        renderActivityResults();

        renderMyActivities();

        renderSavedActivities();

    }
);


/* ============================================================
   NAVIGATION
============================================================ */

function initialiseNavigation() {

    document.addEventListener(
        "click",
        event => {

            const navigationButton =
                event.target.closest(
                    "[data-screen]"
                );

            if (!navigationButton) {
                return;
            }

            const screen =
                navigationButton.dataset.screen;

            navigateTo(screen);

        }
    );

}


function navigateTo(screenName) {

    const screens =
        document.querySelectorAll(
            "[data-screen-panel]"
        );

    const navigationButtons =
        document.querySelectorAll(
            ".nav-btn"
        );


    screens.forEach(screen => {

        screen.hidden =
            screen.dataset.screenPanel !== screenName;

    });


    navigationButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.screen === screenName
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
        Some screens need to refresh their content
        every time the user opens them.
    */

    if (
        screenName ===
        "my-activities"
    ) {

        renderMyActivities();

    }


    if (
        screenName ===
        "saved"
    ) {

        renderSavedActivities();

    }


    if (
        screenName ===
        "planner"
    ) {

        populatePlannerActivities();

    }

}


/* ============================================================
   ACTIVITY INITIALISATION
============================================================ */

function initialiseActivities() {

    populateSubjectFilter();

    populateGradeFilter();


    const search =
        document.getElementById(
            "activity-search"
        );

    const subject =
        document.getElementById(
            "subject-filter"
        );

    const grade =
        document.getElementById(
            "grade-filter"
        );


    search.addEventListener(
        "input",
        renderActivityResults
    );

    subject.addEventListener(
        "change",
        renderActivityResults
    );

    grade.addEventListener(
        "change",
        renderActivityResults
    );

}


/* ============================================================
   SUBJECT FILTER
============================================================ */

function populateSubjectFilter() {

    const select =
        document.getElementById(
            "subject-filter"
        );


    getSubjects().forEach(subject => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            subject;

        option.textContent =
            subject;

        select.appendChild(
            option
        );

    });

}


/* ============================================================
   GRADE FILTER
============================================================ */

function populateGradeFilter() {

    const select =
        document.getElementById(
            "grade-filter"
        );


    getGrades().forEach(grade => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            grade;

        option.textContent =
            grade;

        select.appendChild(
            option
        );

    });

}


/* ============================================================
   RENDER FEATURED ACTIVITIES
============================================================ */

function renderFeaturedActivities() {

    const container =
        document.getElementById(
            "featured-activities"
        );


    container.innerHTML = "";


    activities
        .slice(0, 3)
        .forEach(activity => {

            container.appendChild(
                createActivityCard(
                    activity
                )
            );

        });

}


/* ============================================================
   RENDER ACTIVITY SEARCH RESULTS
============================================================ */

function renderActivityResults() {

    const container =
        document.getElementById(
            "activity-results"
        );


    const search =
        document.getElementById(
            "activity-search"
        ).value;


    const subject =
        document.getElementById(
            "subject-filter"
        ).value;


    const grade =
        document.getElementById(
            "grade-filter"
        ).value;


    const results =
        searchActivities(
            search,
            subject,
            grade
        );


    container.innerHTML = "";


    if (results.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⌕</div>
                <h2>No activities found</h2>
                <p>
                    Try a different search term or filter.
                </p>
            </div>
        `;

        return;

    }


    results.forEach(activity => {

        container.appendChild(
            createActivityCard(
                activity
            )
        );

    });

}


/* ============================================================
   ACTIVITY CARD CREATOR
============================================================ */

function createActivityCard(
    activity
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "activity-card";


    card.innerHTML = `

        <div class="activity-icon">
            ${activity.icon || "🧪"}
        </div>

        <div class="activity-meta">

            <span>
                ${escapeHtml(
                    activity.subject
                )}
            </span>

            <span>
                ${escapeHtml(
                    activity.grade
                )}
            </span>

        </div>

        <h3>
            ${escapeHtml(
                activity.title
            )}
        </h3>

        <p>
            ${escapeHtml(
                activity.description
            )}
        </p>

        <div class="activity-details">

            <span>
                ⏱
                ${escapeHtml(
                    activity.duration
                )}
            </span>

            <span>
                👥
                ${activity.learners || "—"}
            </span>

        </div>

        <div class="activity-actions">

            <button
                class="btn btn-secondary"
                data-open-activity="${activity.id}"
            >
                View
            </button>

            <button
                class="btn btn-primary"
                data-save-activity="${activity.id}"
            >
                ${
                    isActivitySaved(activity.id)
                        ? "Saved"
                        : "Save"
                }
            </button>

        </div>

    `;


    return card;

}


/* ============================================================
   OPEN ACTIVITY DETAILS
============================================================ */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-open-activity]"
            );


        if (!button) {
            return;
        }


        const activity =
            findAnyActivity(
                button.dataset.openActivity
            );


        if (!activity) {
            return;
        }


        renderActivityDetail(
            activity
        );

        navigateTo(
            "activity-detail"
        );

    }
);


/* ============================================================
   FIND ANY ACTIVITY
   Searches both built-in and user-created activities.
============================================================ */

function findAnyActivity(
    activityId
) {

    const builtIn =
        getActivityById(
            activityId
        );


    if (builtIn) {
        return builtIn;
    }


    return loadCustomActivities()
        .find(
            activity =>
                activity.id === activityId
        );

}


/* ============================================================
   ACTIVITY DETAIL
============================================================ */

function renderActivityDetail(
    activity
) {

    const container =
        document.getElementById(
            "activity-detail"
        );


    const isCustom =
        Boolean(activity.custom);


    container.innerHTML = `

        <div class="activity-detail-card">

            <button
                class="btn btn-secondary"
                data-screen="${
                    isCustom
                        ? "my-activities"
                        : "activities"
                }"
            >
                ← Back
            </button>


            <div class="activity-detail-header">

                <div class="activity-icon large">
                    ${activity.icon || "🧪"}
                </div>

                <div>

                    <span class="eyebrow">
                        ${escapeHtml(
                            activity.subject
                        )}
                    </span>

                    <h2>
                        ${escapeHtml(
                            activity.title
                        )}
                    </h2>

                    <p>
                        ${escapeHtml(
                            activity.grade
                        )}
                        ·
                        ${escapeHtml(
                            activity.duration
                        )}
                    </p>

                </div>

            </div>


            <div class="detail-section">

                <h3>
                    Instructions
                </h3>

                <p>
                    ${escapeHtml(
                        activity.description
                    )}
                </p>

            </div>


            <div class="detail-section">

                <h3>
                    Learning objective
                </h3>

                <p>
                    ${escapeHtml(
                        activity.objective
                    )}
                </p>

            </div>


            <div class="detail-section">

                <h3>
                    Materials
                </h3>

                <p>
                    ${escapeHtml(
                        activity.materials ||
                        "No materials listed."
                    )}
                </p>

            </div>


            <div class="detail-section">

                <h3>
                    Safety
                </h3>

                <p>
                    ${escapeHtml(
                        activity.safety ||
                        "No specific safety notes."
                    )}
                </p>

            </div>


            ${
                activity.accessibility
                    ? `
                        <div class="detail-section">

                            <h3>
                                Accessibility & inclusion
                            </h3>

                            <p>
                                ${escapeHtml(
                                    activity.accessibility
                                )}
                            </p>

                        </div>
                    `
                    : ""
            }


            <div class="form-actions">

                <button
                    class="btn btn-primary"
                    data-add-to-planner="${activity.id}"
                >
                    Add to planner
                </button>


                <button
                    class="btn btn-secondary"
                    data-save-activity="${activity.id}"
                >
                    ${
                        isActivitySaved(activity.id)
                            ? "Saved"
                            : "Save for offline"
                    }
                </button>

            </div>

        </div>

    `;

}


/* ============================================================
   SAVE ACTIVITY
============================================================ */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-save-activity]"
            );


        if (!button) {
            return;
        }


        const activityId =
            button.dataset.saveActivity;


        const nowSaved =
            toggleSavedActivity(
                activityId
            );


        renderActivityResults();

        renderFeaturedActivities();

        renderSavedActivities();

        renderMyActivities();


        /*
            If we're currently viewing the detail page,
            refresh that page too.
        */

        const activity =
            findAnyActivity(
                activityId
            );


        if (
            activity &&
            !document.getElementById(
                "screen-activity-detail"
            ).hidden
        ) {

            renderActivityDetail(
                activity
            );

        }


        showToast(
            nowSaved
                ? "Activity saved for offline access."
                : "Activity removed from saved activities.",
            nowSaved
                ? "success"
                : "warning"
        );

    }
);


/* ============================================================
   ADD ACTIVITY TO PLANNER
============================================================ */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-add-to-planner]"
            );


        if (!button) {
            return;
        }


        const activityId =
            button.dataset.addToPlanner;


        navigateTo(
            "planner"
        );


        populatePlannerActivities(
            activityId
        );


        showToast(
            "Activity added to your planner.",
            "success"
        );

    }
);


/* ============================================================
   CREATE ACTIVITY
============================================================ */

function initialiseCreateActivity() {

    const form =
        document.getElementById(
            "create-activity-form"
        );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(form);


            const activity = {

                id:
                    generateCustomActivityId(),

                custom: true,

                title:
                    formData
                        .get("title")
                        .trim(),

                subject:
                    formData
                        .get("subject"),

                grade:
                    formData
                        .get("grade"),

                duration:
                    formData
                        .get("duration")
                        .trim(),

                learners:
                    Number(
                        formData
                            .get("learners")
                    ) || 0,

                icon:
                    formData
                        .get("icon") ||
                    "🧪",

                description:
                    formData
                        .get("description")
                        .trim(),

                objective:
                    formData
                        .get("objective")
                        .trim(),

                materials:
                    formData
                        .get("materials")
                        .trim(),

                safety:
                    formData
                        .get("safety")
                        .trim(),

                accessibility:
                    formData
                        .get("accessibility")
                        .trim(),

                createdAt:
                    new Date()
                        .toISOString()

            };


            addCustomActivity(
                activity
            );


            form.reset();


            renderMyActivities();


            navigateTo(
                "my-activities"
            );


            showToast(
                "Your activity was created and saved on this device.",
                "success"
            );

        }
    );

}


/* ============================================================
   CUSTOM ACTIVITY ID
============================================================ */

function generateCustomActivityId() {

    return (
        "custom-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}


/* ============================================================
   MY ACTIVITIES
============================================================ */

function initialiseMyActivities() {

    document
        .getElementById(
            "create-activity-from-library"
        )
        ?.addEventListener(
            "click",
            () => navigateTo(
                "create-activity"
            )
        );


    document
        .getElementById(
            "create-activity-from-my-library"
        )
        ?.addEventListener(
            "click",
            () => navigateTo(
                "create-activity"
            )
        );


    document
        .getElementById(
            "create-first-activity"
        )
        ?.addEventListener(
            "click",
            () => navigateTo(
                "create-activity"
            )
        );


    document
        .getElementById(
            "cancel-create-activity"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "create-activity-form"
                    )
                    .reset();

                navigateTo(
                    "my-activities"
                );

            }
        );

}


/* ============================================================
   RENDER MY ACTIVITIES
============================================================ */

function renderMyActivities() {

    const container =
        document.getElementById(
            "my-activities-list"
        );


    const emptyState =
        document.getElementById(
            "my-activities-empty"
        );


    const customActivities =
        loadCustomActivities();


    container.innerHTML = "";


    if (
        customActivities.length === 0
    ) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    customActivities.forEach(
        activity => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "activity-card";


            card.innerHTML = `

                <div class="activity-icon">
                    ${activity.icon || "🧪"}
                </div>

                <div class="activity-meta">

                    <span>
                        ${escapeHtml(
                            activity.subject
                        )}
                    </span>

                    <span>
                        ${escapeHtml(
                            activity.grade
                        )}
                    </span>

                </div>

                <h3>
                    ${escapeHtml(
                        activity.title
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        activity.description
                    )}
                </p>

                <div class="activity-details">

                    <span>
                        ⏱
                        ${escapeHtml(
                            activity.duration
                        )}
                    </span>

                    ${
                        activity.learners
                            ? `
                                <span>
                                    👥
                                    ${activity.learners}
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="activity-actions">

                    <button
                        class="btn btn-secondary"
                        data-open-activity="${activity.id}"
                    >
                        View
                    </button>

                    <button
                        class="delete-activity-btn"
                        data-delete-activity="${activity.id}"
                        aria-label="Delete ${escapeHtml(activity.title)}"
                        title="Delete activity"
                    >
                        ×
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* ============================================================
   DELETE CUSTOM ACTIVITY
============================================================ */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-delete-activity]"
            );


        if (!button) {
            return;
        }


        const activityId =
            button.dataset.deleteActivity;


        const activity =
            findAnyActivity(
                activityId
            );


        if (!activity) {
            return;
        }


        const confirmed =
            confirm(
                `Delete "${activity.title}"?`
            );


        if (!confirmed) {
            return;
        }


        deleteCustomActivity(
            activityId
        );


        renderMyActivities();


        showToast(
            "Activity deleted.",
            "success"
        );

    }
);


/* ============================================================
   SAVED ACTIVITIES
============================================================ */

function initialiseSavedActivities() {
    // Saved activities are rendered dynamically.
}


function renderSavedActivities() {

    const container =
        document.getElementById(
            "saved-activities"
        );


    const emptyState =
        document.getElementById(
            "saved-empty"
        );


    const savedIds =
        loadSavedActivities();


    const savedActivities =
        savedIds
            .map(
                id =>
                    findAnyActivity(id)
            )
            .filter(Boolean);


    container.innerHTML = "";


    if (
        savedActivities.length === 0
    ) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    savedActivities.forEach(
        activity => {

            container.appendChild(
                createActivityCard(
                    activity
                )
            );

        }
    );

}


/* ============================================================
   PLANNER INITIALISATION
============================================================ */

function initialisePlanner() {

    document
        .getElementById(
            "save-draft"
        )
        .addEventListener(
            "click",
            () => {

                saveCurrentPlan(
                    true
                );

            }
        );


    document
        .getElementById(
            "save-and-sync"
        )
        .addEventListener(
            "click",
            () => {

                const plan =
                    saveCurrentPlan(
                        false
                    );


                if (!plan) {
                    return;
                }


                syncPlan();

            }
        );


    populatePlannerActivities();

}


/* ============================================================
   POPULATE PLANNER ACTIVITIES
============================================================ */

function populatePlannerActivities(
    selectedId = ""
) {

    const select =
        document.getElementById(
            "planner-activity"
        );


    if (!select) {
        return;
    }


    const allActivities =
        getAllActivities();


    const currentValue =
        selectedId ||
        select.value;


    select.innerHTML = `

        <option value="">
            Select an activity
        </option>

    `;


    allActivities.forEach(
        activity => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                activity.id;


            option.textContent =
                activity.custom
                    ? `✦ ${activity.title} — ${activity.subject}`
                    : `${activity.title} — ${activity.subject}`;


            select.appendChild(
                option
            );

        }
    );


    if (currentValue) {

        select.value =
            currentValue;

    }

}


/* ============================================================
   CONNECTION CONTROLS
============================================================ */

function initialiseConnectionControls() {

    document
        .getElementById(
            "toggle-connection"
        )
        .addEventListener(
            "click",
            () => {

                toggleConnectivity();


                document
                    .getElementById(
                        "toggle-connection"
                    )
                    .textContent =
                    isOnline
                        ? "Simulate offline mode"
                        : "Restore connection";

            }
        );


    document
        .getElementById(
            "sync-plan"
        )
        .addEventListener(
            "click",
            syncPlan
        );

}


/* ============================================================
   TOAST
============================================================ */

let toastTimer = null;


function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.className =
        `toast ${type}`;


    toast.hidden = false;


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3000
        );

}


/* ============================================================
   SAFE HTML OUTPUT
============================================================ */

function escapeHtml(
    value
) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   KEYBOARD SHORTCUT
   "/" focuses the activity search field.
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "/" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA" &&
            document.activeElement.tagName !== "SELECT"
        ) {

            event.preventDefault();


            const search =
                document.getElementById(
                    "activity-search"
                );


            if (search) {

                navigateTo(
                    "activities"
                );

                search.focus();

            }

        }

    }
);