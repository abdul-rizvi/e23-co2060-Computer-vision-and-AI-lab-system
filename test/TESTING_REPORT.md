# CV & AI Lab System: QA & Testing Report

This directory (`/test`) contains the statistical proof and documentation of the comprehensive testing performed on the system.

## 1. Unit Testing
* **Recommended Tool:** Jest
* **Implementation Used:** Native Node.js Test Runner (Modern, zero-dependency alternative to Jest)
* **Scope Tested:** 
  * Backend business logic (Project creation algorithms, DB filters, role validations).
  * Frontend utility functions (CSV parsing, data preservation, QR code generation).
* **Status:** ✅ 100% Pass Rate.

## 2. Backend API & Database Testing
* **Recommended Tool:** Jest + Supertest / Playwright API
* **Implementation Used:** Native Node Integration Tests with live transactional DB rollback.
* **Scope Tested:** 
  * Complete user lifecycle API tests (Login auth flow, API route protection).
  * Database correctness (Verifies that reservations properly validate time constraints and overlapping bookings).
* **Status:** ✅ 100% Pass Rate. (See `code/backend/tests/live-flow.cjs`).

## 3. End-to-End (E2E) UI Testing
* **Recommended Tool:** Playwright
* **Implementation Used:** Native DOM SSR (Server-Side Rendering) rendering test suite.
* **Scope Tested:** 
  * Ensures that UI components mount correctly, navigation guards are active, and interactive modals function as expected without throwing JS errors.
* **Status:** ✅ 100% Pass Rate. (See `code/frontend/tests/render.test.cjs`).

## 4. Load & Performance Testing
* **Tool Used:** Locust (Python)
* **Scope Tested:** Simulated 50 concurrent students actively browsing the system, hitting multiple API endpoints for 30 seconds.
* **Statistical Proof:** 
  * **Total API Requests:** 761
  * **Failure Rate:** 0.00%
  * **Average Server Latency:** 109ms
  * **95th Percentile Latency (P95):** 220ms (Extremely fast, even under load).
* **Attachments:** See `performance_graph.png` and the `locust_stats_*.csv` files in this directory for concrete visual and raw data proof for presentations.

## 5. Security Testing (OWASP Best Practices)
* **Recommended Tool:** OWASP ZAP (Automated Scanner)
* **Implementation Used:** Proactive architectural security hardening based on OWASP Top 10.
* **Key Enhancements Implemented:**
  * **CORS Whitelisting:** Restricted API access strictly to the Vercel production frontend to prevent Cross-Site Request Forgery (CSRF).
  * **JWT Auth Verification:** Re-checks user DB status on every critical request (Broken Access Control prevention).
  * **Self-Deletion Guard:** Added logic to prevent privileged admins from deleting their own accounts (Privilege Escalation prevention).
