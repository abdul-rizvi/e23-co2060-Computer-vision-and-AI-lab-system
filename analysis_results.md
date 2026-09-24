# 🔍 Full Project Audit — CV & AI Lab System

After reviewing **every file** in the project, here is a categorized list of all bugs, security issues, inconsistencies, and documentation mistakes found.

---

## 🔴 CRITICAL — Security

### 1. `.env` file is committed to the repository
**File:** [`.env`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/.env)

The backend `.env` file is **tracked by Git** and contains **live production credentials**:
- Real Neon `DATABASE_URL` with username and password
- Real Gmail `EMAIL_PASSWORD` (App Password)
- Real `JWT_SECRET`
- Real Google `Client_ID` and `Client_secret`

> [!CAUTION]
> This is a **severe security vulnerability**. Anyone who clones the repo has full access to your database, email account, and can forge JWT tokens. The `.gitignore` lists `.env`, but the file was already committed before the `.gitignore` was added. You **must** rotate ALL these credentials immediately and remove the file from Git history with `git filter-branch` or `git filter-repo`.

### 2. Frontend `.env` is also committed
**File:** [`frontend/.env`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/.env)

Contains the `VITE_GOOGLE_CLIENT_ID`. While client IDs are less sensitive than secrets, this still shouldn't be committed for a private project.

### 3. Debug / test files committed with hardcoded data
**Files:**
- [`get_otp.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/get_otp.js) — reads OTP for a hardcoded test email directly from the DB
- [`test_api.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/test_api.js) — has a hardcoded OTP `"856969"`

These are development helper scripts that should not be in production code or version control.

---

## 🟠 BUGS — Functional Issues

### 4. `seedEquipment.js` uses `ON CONFLICT DO NOTHING` but `inventory` table has no UNIQUE constraint on `name`
**File:** [`seedEquipment.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/seedEquipment.js#L91-L95)

```sql
ON CONFLICT DO NOTHING
```
The `inventory` table only has a UNIQUE constraint on `id` (PRIMARY KEY). There is no unique constraint on `name`, so `ON CONFLICT DO NOTHING` will never actually trigger on duplicate names — **re-running the seeder will insert duplicate rows every time.**

### 5. `inventoryController.js` — unused `xlsx` import
**File:** [`inventoryController.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/controllers/inventoryController.js#L2)

```js
const xlsx = require('xlsx');
```
This import is never used in the controller. It's a dead import that adds unnecessary dependency loading.

### 6. Typo in `inventoryController.js` response
**File:** [`inventoryController.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/controllers/inventoryController.js#L41-L42)

```js
message: "Item deleted succesfully",  // typo: "succesfully" → "successfully"
deletItem: result.rows[0]             // typo: "deletItem" → "deletedItem"
```

### 7. Missing `VITE_API_URL` in frontend `.env`
**File:** [`frontend/.env`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/.env)

The file only contains `VITE_GOOGLE_CLIENT_ID`. The `VITE_API_URL` variable is missing — the README says to add it, and the api.js falls back to `http://localhost:5000`, but the README says the frontend runs on port `5174`. This works because the backend is on port 5000, not the frontend, but it should be explicitly set as documented.

### 8. Port mismatch in `emailService.js` default URL
**File:** [`emailService.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/services/emailService.js#L24)

```js
const portalUrl = process.env.PORTAL_URL || "http://localhost:5173";
```
The fallback port is `5173`, but the README and `.env` file specify `5174`. Vite 7.x defaults to `5173`, but your `.env` has `PORTAL_URL=http://localhost:5174`. If `PORTAL_URL` is ever unset, email links will point to the wrong port.

### 9. `NewsPage.jsx` — `useMemo` does nothing
**File:** [`NewsPage.jsx`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/src/pages/NewsPage.jsx#L41)

```js
const shown = useMemo(() => news, [news]);
```
This `useMemo` simply returns `news` directly — it performs no computation and provides zero memoization benefit. It's an identity function wrapper.

### 10. `createNews` allows null `title` from the API
**File:** [`newsController.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/controllers/newsController.js#L15-L27)

There's no validation that `title` is provided before insertion — the DB has `NOT NULL` on `title`, so this will throw a 500 error instead of a friendly 400 with a useful message.

### 11. `createPerson` allows empty `name` and `type`
**File:** [`peopleController.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/controllers/peopleController.js#L15-L27)

Same issue — no input validation. Both `name` (NOT NULL) and `type` (NOT NULL with CHECK constraint) will throw raw database errors rather than user-friendly messages.

### 12. `index.html` title is `"frontend"`
**File:** [`index.html`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/index.html#L7)

```html
<title>frontend</title>
```
This is the default Vite scaffold title. It should be something like `"CV & AI Laboratory — University of Peradeniya"`.

---

## 🟡 INCONSISTENCIES — Schema vs. Code vs. Docs

### 13. Schema has role `professor` but code never uses it
**File:** [`schema.sql`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/sql/schema.sql#L15)

```sql
role VARCHAR(20) CHECK (role IN ('student','professor','officer', 'admin', 'staff'))
```

The `professor` role is defined in the schema but:
- The frontend [`App.jsx`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/src/App.jsx#L34) `VALID_ROLES` doesn't include `professor`
- No portal view exists for `professor`
- The README doesn't mention `professor` role at all
- `analyticsController.js` does count `professors` but there's no UI to display it meaningfully

If a user is assigned `professor` role, they will be forcibly logged out by the frontend's `restoreSession()` guard.

### 14. Schema uses table name `reservations` but API route says `bookings`
The SQL table is called **`reservations`** but the API endpoint is **`/api/bookings`**. The README documents it as `/api/bookings`. Comments in schema say "Reservations Table". This naming mismatch is confusing for maintainability.

### 15. Schema comment says `bookings` table exists
**File:** [`schema.sql`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/sql/schema.sql#L5)

```sql
DROP TABLE IF EXISTS bookings;
```
There is a `DROP TABLE IF EXISTS bookings` statement, but no `bookings` table is ever created — only `reservations`. This is a stale artifact.

### 16. `CORS` is fully open
**File:** [`index.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/index.js#L12)

```js
app.use(cors());
```
The comment says "Allowed all origins for local development flexibility" but this is also the production config. In production (Northflank), this allows any website to make authenticated API requests.

### 17. `Client_ID` env var naming is inconsistent
**File:** [`authController.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/controllers/authController.js#L162-L165)

```js
const client = new OAuth2Client(process.env.Client_ID);
```
The env var is named `Client_ID` (mixed case), which breaks the convention of `ALL_CAPS_SNAKE_CASE` used by all other env vars (`JWT_SECRET`, `EMAIL_SERVICE`, etc.). The `.env` file also has it as `Client_ID = 253...` with spaces around `=`, which some `.env` parsers handle differently.

### 18. `Client_secret` env var defined but never used
**File:** [`.env`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/.env#L15)

```
Client_secret= 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
```
This variable is defined in `.env` but **never referenced** anywhere in the backend code. The Google Auth flow only uses `Client_ID`.

---

## 🟡 DOCUMENTATION Issues

### 19. README says `seedInventory.js` is a seed script, but it requires a file argument
**File:** [README.md](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/README.md#L189)

README says:
```bash
node seedInventory.js
```
But `seedInventory.js` **requires** a CSV/Excel file path as an argument:
```
Error: Please provide a path to the CSV/Excel file.
```
The correct equipment seeder to run standalone is `seedEquipment.js`. The README should clarify that `seedInventory.js` is for importing custom data from a spreadsheet.

### 20. README deployment section omits `seedInventory.js` but mentions `seedEquipment.js` inconsistently
The Getting Started section (line 189) lists `seedInventory.js` but the Deployment section (line 310) lists `seedEquipment.js`. These two serve different purposes and the doc conflates them.

### 21. `package.json` description has typo
**File:** [`backend/package.json`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/package.json#L4)

```
"description": "a dual purpose website, which will serve as a public portal and a mangement system for lab"
```
`"mangement"` → `"management"`

### 22. README project structure is outdated
**File:** [README.md](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/README.md#L117-L156)

The documented tree is missing several actual files:
- Missing: `runSchema.js`, `seedEquipment.js`, `get_otp.js`, `test_api.js`, `setup_otp_table.js`, `setup_password_reset_table.js`
- Missing frontend files: `data/labData.js`, `components/iconUtils.js`, `components/UI.jsx`
- Missing `services/emailService.js`

### 23. README API Reference is incomplete
**File:** [README.md](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/README.md#L266-L282)

Missing endpoints:
- `POST /api/auth/register/initiate` — OTP-based registration step 1
- `POST /api/auth/register/verify` — OTP verification step 2
- `POST /api/auth/google` — Google OAuth login
- `POST /api/auth/forgot-password/initiate` — Forgot password step 1
- `POST /api/auth/forgot-password/reset` — Password reset step 2
- `PUT /api/items/:id` — Update inventory item
- `DELETE /api/items/:id` — Delete inventory item
- `PUT /api/people/:id` — Update person
- `DELETE /api/people/:id` — Delete person
- `PUT /api/news/:id` — Update news item
- `DELETE /api/news/:id` — Delete news item
- `PUT /api/bookings/:id/status` — Update booking status
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

The table only shows 12 endpoints but there are **25+** in the actual code.

### 24. README mentions `react-router-dom` but no router is used
**File:** [README.md](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/README.md#L68)

```
| **Routing** | React Router DOM v7 | Client-side navigation between sections |
```
The app does **not** use React Router DOM at all. Navigation is done via state-driven section switching in `App.jsx`. The package is listed as a dependency in `package.json` but never imported or used in the codebase.

---

## 🔵 MINOR — Code Quality

### 25. No `process.exit(1)` on DB connection failure
**File:** [`index.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/index.js#L69-L71)

```js
} catch (error) {
    console.error("Database connection failed:", error.message);
}
```
If the DB connection fails, the server just logs and silently exits — but doesn't call `process.exit(1)`, so in some environments (like Docker), the container might keep running with a "healthy" status while the server is actually dead.

### 26. `seedUsers.js` duplicates the Pool configuration
**File:** [`seedUsers.js`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/seedUsers.js#L5-L15)

The `runSchema.js` and `seedUsers.js` both create their own `Pool` instances instead of importing from `config/db.js`. Only `seedEquipment.js` and `seedInventory.js` correctly reuse the shared pool. This means if the connection logic changes in `config/db.js`, these scripts would break.

### 27. Missing `meta description` in `index.html`
**File:** [`index.html`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/index.html)

No `<meta name="description">` tag for SEO.

### 28. `FacilitiesPage` accepts `setShowBooking` prop but never uses it
**File:** [`App.jsx`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/src/App.jsx#L79) passes `setShowBooking` prop, but [`FacilitiesPage.jsx`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/src/pages/FacilitiesPage.jsx) component signature doesn't destructure or use it.

### 29. Footer quick links are not clickable
**File:** [`Layout.jsx`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/src/components/Layout.jsx#L129-L151)

The footer "Quick Links" and "Resources" sections render plain `<div>` elements — they look like links but are not clickable and don't navigate anywhere.

### 30. `StudentPortal.jsx` heading says "Equipments"
**File:** [`StudentPortal.jsx`](file:///c:/Users/LENOVO%20LEGION/Documents/sem%203/2yp/code/e23-co2060-Computer-vision-and-AI-lab-system/code/frontend/src/portal/StudentPortal.jsx#L189)

```jsx
<h2>Equipments & Availability</h2>
```
"Equipments" is not standard English — it should be **"Equipment & Availability"** (equipment is an uncountable noun).

---

## Summary

| Severity | Count | Category |
|:---|:---:|:---|
| 🔴 Critical | 3 | Security (leaked credentials, debug files) |
| 🟠 Bug | 9 | Functional issues (typos, dead code, schema mismatches) |
| 🟡 Inconsistency | 12 | Schema ↔ code ↔ docs mismatches, naming |
| 🔵 Minor | 6 | Code quality, unused props, SEO |
| **Total** | **30** | |

> [!IMPORTANT]
> **Priority #1** should be removing the `.env` file from Git history and rotating all leaked credentials (database password, JWT secret, Gmail app password, Google OAuth client secret).
