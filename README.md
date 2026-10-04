# STEMMate Namibia - Technical Prototype MVP (A3 Milestone)

## Project Overview
**STEMMate Namibia** is an offline-first planning, coordination, and educational deployment platform engineered to support remote educational outreach initiatives conducted under severe infrastructural constraints. The platform allows field facilitators to browse cached STEM training modules, compile custom classroom itineraries completely offline, log privacy-safe attendance metrics, and sync tracking structures dynamically when connectivity re-establishes.

This repository hosts the functional interactive prototype implementation developed using clean, dependency-free vanilla technology under the guidelines of the **Namibian Sustainable Software Design Laboratory (NSSDL)**.

---

## Technical Metadata & Governance
*   **Course Framework:** Software Design (SDN621S) | Level 6 | Semester 2, 2026
*   **Institution:** Faculty of Computing and Informatics, Department of Software Engineering, Namibia University of Science and Technology (NUST)
*   **Practical Workspace Group:** Group 9
*   **Primary System Contributor / Code Architect:** Nathan Frans Alweendo (Student Number: 225022745)

---

## Architectural & Sustainability Strategy
To honor the strict resource boundaries typical of regional Namibian deployments, the engineering baseline for `prototype.html` relies exclusively on native system components:
1. **Zero External Dependencies:** Built entirely with raw vanilla HTML5, native browser CSS custom custom variables, and pure JavaScript. There are exactly zero calls to bloated CDN frameworks (such as Tailwind or React), ensuring the core bundle remains under **5KB** to minimize network transit costs on expensive prepaid data links (**QR-02, SR-02**).
2. **Durable Local Persistence Layer:** Leverages browser `localStorage` transactional boundaries using a decoupled **Repository Pattern** abstraction layer. Active facilitator draft changes are stored locally and atomically, guaranteeing complete data insulation against unexpected device termination or battery discharge faults (**QR-01**).
3. **Privacy-by-Design Headcount Intake:** Programmatically restricts session demographic records to broad numeric counter inputs. The data forms omit text capture or image upload elements, keeping the software completely isolated from gathering pupil personally identifiable information (**FR-08**).

---

## Installation & Local Execution
Because the prototype runs natively on low-specification devices, it requires zero server setup, database installations, or dependency compile tasks.

### Running the Application Natively:
1. Clone this repository directly into your local workspace directory:
   ```bash
   git clone https://github.com
   ```
2. Navigate into the folder path and locate the primary workflow file:
   ```bash
   cd SDN-Project
   ```
3. Open `prototype.html` directly using any mobile or desktop web browser (e.g., Chrome, Edge, Firefox, or Android System WebView).

---

## Core System Mappings & Demonstration Traces
The codebase is structured into explicit functional simulation blocks that align directly with the primary evaluation criteria of the milestone report:

*   **Workflow 1: Offline Planner Input Matrix (FR-03, QR-01)**
    *   *Location:* `<form id="plannerForm">`
    *   *Action:* Validates input sequences across dates, safety instructions, and inclusion prompts, then securely locks data payloads atomically on the local hardware terminal.
*   **Workflow 2: Privacy-Safe Statistics Framework (FR-08)**
    *   *Location:* `<fieldset class="form-group">`
    *   *Action:* Restricts records to numeric counters via explicit, decoupled control button rows to guarantee compliance with aggregate statistics constraints.
*   **Workflow 3: Network Synchronization Conflict Pipeline (FR-05, QR-02)**
    *   *Location:* `function simulateSync(scenario)`
    *   *Action:* Simulates network collision exceptions when a physical equipment package is double-booked, providing non-destructive error text descriptions to guide users through correction steps.

---

## Accessibility Compliance Metrics (WCAG 2.2 Level AA)
*   **Clause 2.1.1 (Keyboard Operability):** Fully navigable without pointer cursor attachments using standard `Tab` and `Enter` loops.
*   **Clause 1.4.1 (Non-Colour Cues):** Interface warnings utilize distinct contextual shapes (`⬤` vs `▲`) alongside textual strings to communicate sync transitions.
*   **Clause 2.5.8 (Target Sizing):** Touch target interfaces are sized to exactly `44px by 44px` to simplify field input tracking on volatile hardware displays.
*   **Clause 1.4.3 (Contrast Threshold):** Typography color profiles guarantee a minimum luminance contrast ratio of **4.5:1** against underlying layouts.
