# ShelfLife AI — Sprint 1 Test Report

**Date:** November 18, 2026  
**Jira Issue:** SLAI-10 — Verify primary user journey and document evidence  
**Test environment:** React + Vite local development server, Brave browser, Supabase backend  
**Mobile test viewport:** 375 × 812 pixels

## 1. Test Objective

Verify the primary ShelfLife AI user journey, input validation, database persistence, recoverable save errors, keyboard accessibility, and mobile layout.

## 2. Happy-Path Tests

| Test | Procedure | Result |
|---|---|---|
| HP-01: User authentication | Register an account, confirm the email, and sign in | PASS — Authenticated Inventory displayed |
| HP-02: Add food | Enter valid food name, storage location, date type, date, and quantity; select Save item | PASS — Food item appeared in Inventory |
| HP-03: Database persistence | Refresh the browser after saving Bananas | PASS — Item reloaded from Supabase |
| HP-04: Multiple saved items | Save Bananas, Apples, and Oranges | PASS — Three items displayed |
| HP-05: Record ownership | Inspect the saved food record in Supabase Table Editor | PASS — Record contained a user_id |

**Security note:** Supabase Row Level Security and user-specific SELECT/INSERT policies were configured and verified. Isolation between two different user accounts was not separately tested.

## 3. Invalid-Path Tests

| Test | Procedure | Result |
|---|---|---|
| IP-01: Empty name | Submit the form with no food name | PASS — Required-name error displayed |
| IP-02: Missing date | Submit without a recorded date | PASS — Invalid-date error displayed |
| IP-03: Invalid quantity | Submit quantity 0 | PASS — Quantity validation error displayed |
| IP-04: Connection failure | Set browser network to Offline and attempt to save | PASS — Error displayed; form remained open |
| IP-05: Error recovery | Restore connection and retry the saved Oranges form | PASS — Save succeeded and item survived refresh |

## 4. Mobile and Accessibility Tests

| Test | Procedure | Result |
|---|---|---|
| UI-01: Inventory layout | View Inventory at 375 × 812 | PASS — Cards, controls, and navigation readable |
| UI-02: Add Food layout | Inspect the form at 375 × 812 | PASS — Inputs and actions accessible through vertical scrolling |
| UI-03: Keyboard navigation | Navigate through form fields and buttons using Tab | PASS — Focus followed interactive controls |
| UI-04: Form labels | Click Food name and Quantity labels | PASS — Corresponding inputs received focus |
| UI-05: Placeholder navigation | Tab through bottom navigation | PASS — Non-interactive Scan and Soon placeholders were skipped |

## 5. Screenshot Evidence

- `evidence/01-inventory-375px.png` — Signed-in mobile Inventory displaying three persisted food records.
- `evidence/02-invalid-form-375px.png` — Three visible form-validation errors at 375px.
- `evidence/03-offline-save-error.png` — Database connection failure showing a recoverable save error.

## 6. Short Issue Log

| ID | Observation | Severity | Disposition |
|---|---|---|---|
| ISSUE-01 | Invalid-date and quantity messages use technical wording | Low | Future usability improvement |
| ISSUE-02 | On a long 375px form, the header and bottom navigation scroll out of view | Low | Vertical scrolling is functional; sticky navigation deferred |
| ISSUE-03 | Production build reports a JavaScript chunk larger than 500 kB | Low | Build succeeds; optimization deferred |
| ISSUE-04 | Scan a date is not interactive | Informational | Intentionally outside Sprint 1 scope |

**Blocking defects remaining:** None identified in the tests performed.

## 7. Conclusion

The tested Sprint 1 user journey successfully supports authenticated access, manual food entry, Supabase persistence, reload after refresh, input validation, and recovery from a failed save. The 375px layout and basic keyboard/label interactions passed their checks.

The documented limitations are non-blocking and may be considered for a future sprint.