let isOnline = navigator.onLine;

function getAllActivities() {

    return [
        ...activities,
        ...loadCustomActivities()
    ];

}

function initialisePlanner() {
    document.getElementById("save-draft").addEventListener("click", () => {
        saveCurrentPlan(true);
    });

    document.getElementById("save-and-sync").addEventListener("click", () => {
        const plan = saveCurrentPlan(false);
        if (!plan) return;
        syncPlan();
    });

    // ADD THIS BLOCK:
    document.getElementById("sync-plan").addEventListener("click", () => {
        syncPlan();
    });

    populatePlannerActivities();
}

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

function updatePlannerStatus(status) {
    const statusLabel = document.getElementById("planner-status");
    const statusBadge = document.getElementById("planner-status"); // Fallback

    if (!statusLabel && !statusBadge) return;

    const el = statusLabel || statusBadge;
    el.className = `status-badge ${status.toLowerCase()}`;

    const labels = {
        SYNCED: "✓ Synced",
        PENDING: "◷ Pending sync",
        FAILED: "! Sync failed",
        CONFLICT: "! Conflict"
    };

    el.textContent = labels[status] || "No plan";
}

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

function showPlanMessage(
    message,
    type = "success"
) {

    showToast(
        message,
        type
    );

}

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

isOnline =
    navigator.onLine;

updateConnectionUI();

document.addEventListener("DOMContentLoaded", () => {
    initialisePlanner();
    restorePlanIntoForm();
});