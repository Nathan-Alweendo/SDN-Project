/* ============================================================
   STEMMATE STORAGE
   Local browser storage for offline-first behaviour
============================================================ */


/* ============================================================
   STORAGE KEYS
============================================================ */

const STORAGE_KEYS = {

    savedActivities:
        "stemmate_saved_activities",

    customActivities:
        "stemmate_custom_activities",

    currentPlan:
        "stemmate_current_plan",

    connection:
        "stemmate_connection"

};


/* ============================================================
   GENERIC STORAGE HELPERS
============================================================ */

function readStorage(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "STEMMate storage read error:",
            error
        );

        return fallback;

    }

}


function writeStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "STEMMate storage write error:",
            error
        );

        return false;

    }

}


/* ============================================================
   SAVED ACTIVITIES
============================================================ */

function loadSavedActivities() {

    return readStorage(
        STORAGE_KEYS.savedActivities,
        []
    );

}


function saveSavedActivities(ids) {

    return writeStorage(
        STORAGE_KEYS.savedActivities,
        ids
    );

}


function isActivitySaved(activityId) {

    return loadSavedActivities()
        .includes(activityId);

}


function toggleSavedActivity(activityId) {

    const saved =
        loadSavedActivities();

    const index =
        saved.indexOf(activityId);

    if (index === -1) {

        saved.push(activityId);

    } else {

        saved.splice(index, 1);

    }

    saveSavedActivities(saved);

    return index === -1;

}


/* ============================================================
   CUSTOM / USER-CREATED ACTIVITIES
============================================================ */

/*
    This is the important part for the new feature.

    Activities created by the teacher are stored locally.

    This means:

    Create activity
        ↓
    Save locally
        ↓
    Refresh page
        ↓
    Activity is still there

    This supports the A3 offline-first concept.
*/


function loadCustomActivities() {

    return readStorage(
        STORAGE_KEYS.customActivities,
        []
    );

}


function saveCustomActivities(activitiesList) {

    return writeStorage(
        STORAGE_KEYS.customActivities,
        activitiesList
    );

}


function addCustomActivity(activity) {

    const customActivities =
        loadCustomActivities();

    customActivities.unshift(activity);

    saveCustomActivities(
        customActivities
    );

    return activity;

}


function deleteCustomActivity(activityId) {

    const updatedActivities =
        loadCustomActivities()
            .filter(
                activity =>
                    activity.id !== activityId
            );

    saveCustomActivities(
        updatedActivities
    );

}


/* ============================================================
   CURRENT SESSION PLAN
============================================================ */

function loadPlan() {

    return readStorage(
        STORAGE_KEYS.currentPlan,
        null
    );

}


function savePlan(plan) {

    return writeStorage(
        STORAGE_KEYS.currentPlan,
        plan
    );

}


function clearPlan() {

    localStorage.removeItem(
        STORAGE_KEYS.currentPlan
    );

}


/* ============================================================
   CONNECTION STATE
============================================================ */

function loadConnectionState() {

    return readStorage(
        STORAGE_KEYS.connection,
        true
    );

}


function saveConnectionState(isOnline) {

    return writeStorage(
        STORAGE_KEYS.connection,
        isOnline
    );

}