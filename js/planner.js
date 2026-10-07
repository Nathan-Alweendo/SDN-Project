/* ============================================================
   STEMMATE PLANNER
   Session planning + offline/sync support
============================================================ */

/* ============================================================
   CONNECTION STATE
============================================================ */

let isOnline = navigator.onLine;


/* ============================================================
   GET ALL ACTIVITIES
============================================================ */

function getAllActivities() {

    return [
        ...activities,
        ...loadCustomActivities()
    ];

}


/* ============================================================
   PLANNER INITIALISATION
============================================================ */

function initialisePlanner() {

    document
        .getElementById("save-draft")
        .addEventListener(
            "click",
            () => {

                saveCurrentPlan(true);

            }
        );


    document
        .getElementById("save-and-sync")
        .addEventListener(
            "click",
            () => {

                const plan =
                    saveCurrentPlan(false);

                if (!plan) {
                    return;
                }

                syncPlan();

            }
        );


    populatePlannerActivities();

}


/* ============================================================
   POPULATE ACTIVITY SELECT
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


            select.appendChild(option);

        }
    );


    if (currentValue) {

        select.value =
            currentValue;

    }

}


/* ============================================================
   CREATE PLAN FROM FORM
============================================================ */

function createPlanFromForm() {

    const activity =
        findAnyActivity(
            document.getElementById(
                "planner-activity"
            ).value
        );


    if (!activity) {

        showPlanMessage(
            "Please select an activity before saving the plan.",
            "warning"
        );

        return null;

    }


    const date =
        document.getElementById(
            "planner-date"
        ).value;


    const learners =
        document.getElementById(
            "planner-learners"
        ).value;


    const notes =
        document.getElementById(
            "planner-notes"
        ).value.trim();


    if (!date) {

        showPlanMessage(
            "Please choose a session date.",
            "warning"
        );

        return null;

    }


    return {

        id:
            `plan-${Date.now()}`,

        activityId:
            activity.id,

        activityTitle:
            activity.title,

        date,

        learners,

        notes,

        status:
            "PENDING",

        updatedAt:
            new Date().toISOString()

    };

}


/* ============================================================
   SAVE CURRENT PLAN
============================================================ */

function saveCurrentPlan(
    showMessage = true
) {

    const existingPlan =
        loadCurrentPlan();


    const newPlan =
        createPlanFromForm();


    if (!newPlan) {
        return null;
    }


    if (existingPlan) {

        newPlan.id =
            existingPlan.id;

    }


    if (
        existingPlan &&
        existingPlan.status === "SYNCED"
    ) {

        newPlan.status =
            "PENDING";

    }


    saveCurrentPlanData(
        newPlan
    );


    updatePlannerStatus(
        newPlan.status
    );


    if (showMessage) {

        showPlanMessage(
            "Draft saved on this device.",
            "success"
        );

    }


    return newPlan;

}


/* ============================================================
   RESTORE SAVED PLAN
============================================================ */

function restorePlanIntoForm() {

    const plan =
        loadCurrentPlan();


    if (!plan) {
        return;
    }


    const activitySelect =
        document.getElementById(
            "planner-activity"
        );


    const dateInput =
        document.getElementById(
            "planner-date"
        );


    const learnersInput =
        document.getElementById(
            "planner-learners"
        );


    const notesInput =
        document.getElementById(
            "planner-notes"
        );


    if (activitySelect) {

        activitySelect.value =
            plan.activityId;

    }


    if (dateInput) {

        dateInput.value =
            plan.date;

    }


    if (learnersInput) {

        learnersInput.value =
            plan.learners || "";

    }


    if (notesInput) {

        notesInput.value =
            plan.notes || "";

    }


    updatePlannerStatus(
        plan.status
    );

}


/* ============================================================
   UPDATE PLANNER STATUS
============================================================ */

function updatePlannerStatus(
    status
) {

    const statusLabel =
        document.getElementById(
            "planner-status"
        );


    if (!statusLabel) {
        return;
    }


    statusLabel.className =
        `plan-status ${status.toLowerCase()}`;


    const labels = {

        SYNCED:
            "✓ Synced",

        PENDING:
            "◷ Pending sync",

        FAILED:
            "! Sync failed",

        CONFLICT:
            "! Conflict"

    };


    statusLabel.textContent =
        labels[status] ||
        "Not saved";

}


/* ============================================================
   SYNC PLAN
============================================================ */

function syncPlan() {

    const plan =
        loadCurrentPlan();


    if (!plan) {

        showPlanMessage(
            "There is no saved plan to synchronize.",
            "warning"
        );

        return;

    }


    if (!navigator.onLine) {

        isOnline = false;

        updateConnectionUI();

        plan.status =
            "PENDING";

        saveCurrentPlanData(
            plan
        );

        updatePlannerStatus(
            "PENDING"
        );

        showPlanMessage(
            "Sync unavailable while offline. Your draft was not lost.",
            "warning"
        );

        return;

    }


    isOnline = true;

    updateConnectionUI();


    plan.status =
        "PENDING";

    saveCurrentPlanData(
        plan
    );

    updatePlannerStatus(
        "PENDING"
    );


    showPlanMessage(
        "Connection available. Synchronizing plan...",
        "success"
    );


    setTimeout(
        () => {

            if (!navigator.onLine) {

                isOnline = false;

                updateConnectionUI();

                plan.status =
                    "PENDING";

                saveCurrentPlanData(
                    plan
                );

                updatePlannerStatus(
                    "PENDING"
                );

                showPlanMessage(
                    "Connection was lost. Your plan remains saved locally.",
                    "warning"
                );

                return;

            }


            plan.status =
                "SYNCED";

            plan.updatedAt =
                new Date().toISOString();


            saveCurrentPlanData(
                plan
            );


            updatePlannerStatus(
                "SYNCED"
            );


            showPlanMessage(
                "Plan synchronized successfully.",
                "success"
            );

        },
        900
    );

}


/* ============================================================
   PLANNER FEEDBACK
============================================================ */

function showPlanMessage(
    message,
    type = "success"
) {

    showToast(
        message,
        type
    );

}


/* ============================================================
   CONNECTION STATUS
============================================================ */

function updateConnectionUI() {

    const status =
        document.getElementById(
            "connection-status"
        );


    const label =
        document.getElementById(
            "connection-label"
        );


    if (!status || !label) {
        return;
    }


    if (isOnline) {

        status.classList.remove(
            "offline"
        );

        status.classList.add(
            "online"
        );

        label.textContent =
            "Online";

    } else {

        status.classList.remove(
            "online"
        );

        status.classList.add(
            "offline"
        );

        label.textContent =
            "Offline";

    }

}


/* ============================================================
   REAL NETWORK DETECTION
============================================================ */

window.addEventListener(
    "online",
    () => {

        isOnline = true;

        updateConnectionUI();

        showToast(
            "Connection restored. Sync is available.",
            "success"
        );

        const plan =
            loadCurrentPlan();


        if (
            plan &&
            plan.status === "PENDING"
        ) {

            updatePlannerStatus(
                "PENDING"
            );

        }

    }
);


window.addEventListener(
    "offline",
    () => {

        isOnline = false;

        updateConnectionUI();

        showToast(
            "You are offline. Changes will be saved locally.",
            "warning"
        );

    }
);


/* ============================================================
   INITIAL NETWORK STATE
============================================================ */

isOnline =
    navigator.onLine;

updateConnectionUI();