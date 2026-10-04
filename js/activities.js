/* ============================================================
   STEMMATE ACTIVITIES
   Built-in / ready-to-use STEM activities
============================================================ */


/* ============================================================
   BUILT-IN ACTIVITY DATA
============================================================ */

const activities = [

    {
        id: "balloon-rocket",

        title: "Balloon Rocket",

        subject: "Physics",

        grade: "Grade 8",

        duration: "45 minutes",

        learners: 30,

        icon: "⚡",

        description:
            "Learners build a simple balloon rocket and investigate how air movement produces motion.",

        objective:
            "Learners will understand the relationship between force, air pressure and motion.",

        materials:
            "Balloons, string, straws, tape and classroom chairs.",

        safety:
            "Keep strings clear of walkways and avoid overstretching balloons."

    },


    {
        id: "solar-oven",

        title: "Solar Oven Challenge",

        subject: "Physics",

        grade: "Grade 8",

        duration: "60 minutes",

        learners: 30,

        icon: "☀️",

        description:
            "Learners design a simple solar oven and investigate how sunlight can be converted into useful heat.",

        objective:
            "Learners will explore energy transfer and explain how surfaces affect heat absorption.",

        materials:
            "Cardboard boxes, aluminium foil, paper, tape and clear plastic.",

        safety:
            "Do not look directly at strong reflected sunlight. Handle warm materials carefully."

    },


    {
        id: "plant-water",

        title: "Plant Water Transport",

        subject: "Biology",

        grade: "Grade 7",

        duration: "45 minutes",

        learners: 25,

        icon: "🌱",

        description:
            "Learners observe how coloured water moves through a plant stem.",

        objective:
            "Learners will explain how water is transported through plant structures.",

        materials:
            "Celery or white flowers, transparent cups and coloured water.",

        safety:
            "Do not consume experimental materials."

    },


    {
        id: "ecosystem-survey",

        title: "Local Ecosystem Survey",

        subject: "Biology",

        grade: "Grade 9",

        duration: "60 minutes",

        learners: 30,

        icon: "🌿",

        description:
            "Learners conduct a simple observation survey of organisms and environmental conditions in a local area.",

        objective:
            "Learners will identify relationships between organisms and their surrounding environment.",

        materials:
            "Observation sheets, pencils and optional magnifying glasses.",

        safety:
            "Stay within the designated area and avoid touching unknown plants or animals."

    },


    {
        id: "safe-acids",

        title: "Safe Acids and Bases",

        subject: "Chemistry",

        grade: "Grade 9",

        duration: "50 minutes",

        learners: 25,

        icon: "🧪",

        description:
            "Learners investigate common household substances using a simple indicator.",

        objective:
            "Learners will classify substances as acidic, neutral or basic using observable evidence.",

        materials:
            "Red cabbage indicator, small containers and safe household samples.",

        safety:
            "Do not taste substances. Wash hands after the activity and follow teacher safety instructions."

    }

];


/* ============================================================
   ACTIVITY LOOKUP
============================================================ */

function getActivityById(id) {

    return activities.find(
        activity => activity.id === id
    );

}


/* ============================================================
   GET SUBJECT LIST
============================================================ */

function getSubjects() {

    return [
        ...new Set(
            activities.map(
                activity => activity.subject
            )
        )
    ].sort();

}


/* ============================================================
   GET GRADE LIST
============================================================ */

function getGrades() {

    return [
        ...new Set(
            activities.map(
                activity => activity.grade
            )
        )
    ].sort(
        (a, b) =>
            Number(a.replace(/\D/g, "")) -
            Number(b.replace(/\D/g, ""))
    );

}


/* ============================================================
   SEARCH BUILT-IN ACTIVITIES
============================================================ */

function searchActivities(
    searchTerm = "",
    subject = "all",
    grade = "all"
) {

    const term = searchTerm
        .trim()
        .toLowerCase();

    return activities.filter(activity => {

        const matchesSearch =
            !term ||
            activity.title.toLowerCase().includes(term) ||
            activity.subject.toLowerCase().includes(term) ||
            activity.description.toLowerCase().includes(term) ||
            activity.objective.toLowerCase().includes(term);

        const matchesSubject =
            subject === "all" ||
            activity.subject === subject;

        const matchesGrade =
            grade === "all" ||
            activity.grade === grade;

        return (
            matchesSearch &&
            matchesSubject &&
            matchesGrade
        );

    });

}