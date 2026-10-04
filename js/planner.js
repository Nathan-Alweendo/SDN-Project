/* ============================================================
   STEMMATE PLANNER
   Session planning + offline/sync demonstration
============================================================ */


/* ============================================================
   CONNECTION STATE
============================================================ */

let isOnline =
    loadConnectionState();


/* ============================================================
   GET ALL AVAILABLE ACTIVITIES
   Includes built-in AND user-created activities.
============================================================ */

function getAllActivities() {

    return [
        ...activities,
        ...loadCustomActivities()
    ];

}


/* ============================================================
   CREATE PLAN FROM FORM
============================================================ */

function createPlanFromForm() {

    const activityId =
        document.getElementById(
            "planner-activity"
        ).value;

    const activity =
        getAllActivities().find(
            item => item.id === activityId
        );

    return {

        activityId,

        activityTitle:
            activity
                ? activity.title
                : "",

        date:
            document.getElementById(
                "planner-date"
            ).value,

        learners:
            Number(
                document.getElementById(
                    "planner-learners"
                ).value
            ) || 0,

        notes:
            document.getElementById(
                "planner-notes"
            ).value.trim(),

        status: "pending",

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

    const plan =
        createPlanFromForm();

    if (!plan.activityId) {

        showPlanMessage(
            "Select an activity before saving your plan.",
            "error"
        );

        return null;

    }

    plan.status = "pending";

    savePlan(plan);

    updatePlannerStatus(plan);

    if (showMessage) {

        showPlanMessage(
            "Plan saved locally.",
            "success"
        );

    }

    return plan;

}


/* ============================================================
   RESTORE PLAN INTO FORM
============================================================ */

function restorePlanIntoForm() {

    const plan =
        loadPlan();

    if (!plan) {

        updatePlannerStatus(null);

        return;

    }


    document.getElementById(
        "planner-activity"
    ).value = plan.activityId || "";


    document.getElementById(
        "planner-date"
    ).value = plan.date || "";


    document.getElementById(
        "planner-learners"
    ).value =
        plan.learners || "";


    document.getElementById(
        "planner-notes"
    ).value =
        plan.notes || "";


    updatePlannerStatus(plan);

}


/* ============================================================
   UPDATE PLANNER STATUS UI
============================================================ */

function updatePlannerStatus(plan) {

    const badge =
        document.getElementById(
            "planner-status-badge"
        );

    const localStep =
        document.getElementById(
            "sync-step-local"
        );

    const waitingStep =
        document.getElementById(
            "sync-step-waiting"
        );

    const syncedStep =
        document.getElementById(
            "sync-step-synced"
        );


    localStep.classList.remove("active");
    waitingStep.classList.remove("active");
    syncedStep.classList.remove("active");


    if (!plan) {

        badge.textContent =
            "No plan";

        badge.className =
            "status-badge";

        return;

    }


    if (plan.status === "synced") {

        badge.textContent =
            "SYNCED";

        badge.className =
            "status-badge synced";

        localStep.classList.add("active");

        syncedStep.classList.add("active");

        return;

    }


    if (plan.status === "failed") {

        badge.textContent =
            "FAILED";

        badge.className =
            "status-badge failed";

        localStep.classList.add("active");

        waitingStep.classList.add("active");

        return;

    }


    badge.textContent =
        "PENDING";

    badge.className =
        "status-badge pending";

    localStep.classList.add("active");

    waitingStep.classList.add("active");

}


/* ============================================================
   TOGGLE ONLINE / OFFLINE
============================================================ */

function toggleConnectivity() {

    isOnline = !isOnline;

    saveConnectionState(
        isOnline
    );

    updateConnectionUI();


    if (isOnline) {

        showPlanMessage(
            "Connection restored.",
            "success"
        );

    } else {

        showPlanMessage(
            "Offline mode enabled. Your local work remains available.",
            "warning"
        );

    }

}


/* ============================================================
   UPDATE CONNECTION UI
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
   SYNC PLAN
============================================================ */

function syncPlan() {

    const plan =
        loadPlan();

    if (!plan) {

        showPlanMessage(
            "There is no saved plan to synchronize.",
            "error"
        );

        return;

    }


    if (!isOnline) {

        plan.status =
            "pending";

        savePlan(plan);

        updatePlannerStatus(plan);

        showPlanMessage(
            "Sync unavailable while offline. Your draft was not lost.",
            "warning"
        );

        return;

    }


    showPlanMessage(
        "Synchronizing plan...",
        "warning"
    );


    setTimeout(() => {

        plan.status =
            "synced";

        plan.updatedAt =
            new Date().toISOString();

        savePlan(plan);

        updatePlannerStatus(plan);

        showPlanMessage(
            "Plan synchronized successfully.",
            "success"
        );

    }, 900);

}


/* ============================================================
   USER FEEDBACK
============================================================ */

function showPlanMessage(
    message,
    type = "success"
) {

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            message,
            type
        );

    }

}