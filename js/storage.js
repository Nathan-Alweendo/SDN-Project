/* ============================================================
   STEMMATE STORAGE
   Local browser storage for offline-first behaviour
============================================================ */

const STORAGE_KEYS = {

    savedActivities:
        "stemmate_saved_activities",

    customActivities:
        "stemmate_custom_activities",

    currentPlan:
        "stemmate_current_plan"

};


/* ============================================================
   BASIC STORAGE HELPERS
============================================================ */

function readStorage(
    key,
    fallback
) {

    try {

        const value =
            localStorage.getItem(key);


        if (value === null) {
            return fallback;
        }


        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Storage read failed:",
            error
        );

        return fallback;

    }

}


function writeStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Storage write failed:",
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


function saveSavedActivities(
    activityIds
) {

    return writeStorage(
        STORAGE_KEYS.savedActivities,
        activityIds
    );

}


function isActivitySaved(
    activityId
) {

    return loadSavedActivities()
        .includes(activityId);

}


function saveActivity(
    activityId
) {

    const saved =
        loadSavedActivities();


    if (
        !saved.includes(
            activityId
        )
    ) {

        saved.push(
            activityId
        );

    }


    return saveSavedActivities(
        saved
    );

}


function removeSavedActivity(
    activityId
) {

    const saved =
        loadSavedActivities()
            .filter(
                id =>
                    id !== activityId
            );


    return saveSavedActivities(
        saved
    );

}


/* ============================================================
   CUSTOM ACTIVITIES
============================================================ */

function loadCustomActivities() {

    return readStorage(
        STORAGE_KEYS.customActivities,
        []
    );

}


function saveCustomActivities(
    activities
) {

    return writeStorage(
        STORAGE_KEYS.customActivities,
        activities
    );

}


function addCustomActivity(
    activity
) {

    const customActivities =
        loadCustomActivities();


    customActivities.push(
        activity
    );


    return saveCustomActivities(
        customActivities
    );

}


function deleteCustomActivity(
    activityId
) {

    const customActivities =
        loadCustomActivities()
            .filter(
                activity =>
                    activity.id !== activityId
            );


    saveCustomActivities(
        customActivities
    );


    removeSavedActivity(
        activityId
    );

}


/* ============================================================
   CURRENT SESSION PLAN
============================================================ */

function loadCurrentPlan() {

    return readStorage(
        STORAGE_KEYS.currentPlan,
        null
    );

}


function saveCurrentPlanData(
    plan
) {

    return writeStorage(
        STORAGE_KEYS.currentPlan,
        plan
    );

}


function clearCurrentPlan() {

    try {

        localStorage.removeItem(
            STORAGE_KEYS.currentPlan
        );

        return true;

    } catch (error) {

        console.error(
            "Could not clear saved plan:",
            error
        );

        return false;

    }

}