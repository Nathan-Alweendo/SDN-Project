# Data Isolation Rules (FR-08)

## Principle
Aggregate attendance headcounts must contain **zero text fields, photo uploads, or pupil personal identifiers**.

## Audit
- **Numeric-only validation:** ParticipationCount accepts integers only.
- **Rejected inputs:** Text entries and photo uploads are blocked.
- **Mathematical proof:** ∀ record ∈ AttendanceForm, record ∈ ℤ (integer set).
- **Privacy guarantee:** No learner names or identifiers are stored.

## Traceability
Requirement FR-08 → Prototype ParticipationCount → Test notes
