# Computer Vision & AI Lab Management System

<div align="center">

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![Team](https://img.shields.io/badge/Team-Bug%20Slayer-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> A unified web platform for the **Computer Vision & AI Lab** — combining a dynamic public research portfolio with a secure internal management system for equipment bookings and GPU resource schedulingg.

[🐛 Report Bug](https://github.com/cepdnaclk/e23-co2060-Computer-vision-and-AI-lab-system/issues) · [✨ Request Feature](https://github.com/cepdnaclk/e23-co2060-Computer-vision-and-AI-lab-system/issues)

</div>

---

## 📖 About the Project

This project implements a comprehensive web platform for the **Computer Vision and AI Lab** at the University of Peradeniya, designed to streamline both public outreach and internal operations.

The system serves two distinct purposes:

1. **External Visibility:** A dynamic public portal showcasing the lab's latest research, publications, and team achievements to the academic community and industry collaborators.
2. **Internal Operations:** A secure, role-based management dashboard that digitizes daily workflows — replacing manual logbooks with automated systems for equipment tracking and GPU resource allocation.

---

## ✨ Key Features

### 🌍 Public Portal
| Feature | Description |
|:---|:---|
| 🏠 Home | Landing page with lab highlights and announcements |
| 🔬 Research | Showcase of ongoing and completed research projects |
| 📄 Publications | Auto-managed list of research papers and journals |
| 👥 People | Profiles of staff, researchers, and student members |
| 🏛️ Facilities | Equipment and facility overview with booking access |
| 📰 News & Events | Workshop announcements and lab activity updates |
| 🛠️ Services | Consultation and collaborative service offerings |
| 📬 Contact | Contact form and lab location information |

### 🔒 Internal Management Portal
| Feature | Description |
|:---|:---|
| 🎒 Student Portal | View booking history, request equipment, book consultations |
| 👮 Officer Portal | Review and approve/reject booking requests |
| 🧑‍💼 Staff Portal | Manage personal profile and lab resources |
| 🛡️ Admin Portal | Full system control — users, inventory, analytics, news |

### ⚙️ Core System Capabilities
- **Resource Booking Engine:** Real-time availability checks and reservations for high-value assets (Drones, Cameras, Sensors)
- **GPU Scheduling:** Job slot management for shared computing resources (e.g., NVIDIA A100/H100 clusters)
- **Role-Based Access Control (RBAC):** Four roles — `student`, `officer`, `staff`, `admin`
- **Authentication:** JWT-based login + Google OAuth integration
- **OTP Verification:** Email-based OTP for secure account verification via Nodemailer
- **Analytics Dashboard:** Usage and booking metrics for administrators

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|:---|:---|:---|
| **Frontend** | React 19 + Vite | Interactive SPA for all portals and public pages |
| **Backend** | Node.js + Express v5 | REST API server, authentication, business logic |
| **Database** | PostgreSQL (via `pg`) | Relational storage for users, bookings, inventory |
| **Auth** | JWT + Google OAuth (`@react-oauth/google`) | Secure session management and single sign-on |
| **Email** | Nodemailer | OTP delivery and notification emails |
| **Styling** | Vanilla CSS + CSS Variables | Theming and component-level styles |
| **Icons** | React Icons | UI icon library |
| **HTTP Client** | Axios | Frontend-to-backend API communication |
| **File Handling** | XLSX | Spreadsheet import for bulk inventory seeding |

---

## 🏗️ Architecture

The system follows a decoupled **client-server architecture**:

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND  (React + Vite)                │
│                                                            │
│  ┌──────────────────┐        ┌──────────────────────────┐  │
│  │   Public Portal  │        │    Internal Portals      │  │
│  │ Home / Research  │        │  Student / Officer /     │  │
│  │ People / News …  │        │  Staff / Admin           │  │
│  └────────┬─────────┘        └───────────┬──────────────┘  │
└───────────┼──────────────────────────────┼─────────────────┘
            │         REST API (Axios)     │
            ▼                              ▼
┌──────────────────────────────────────────────────────────┐
│                BACKEND  (Node.js + Express)              │
│                                                          │
│  /api/auth    /api/items    /api/bookings                │
│  /api/users   /api/people   /api/news    /api/analytics  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  JWT + OAuth │  │  Nodemailer  │  │  File Uploads  │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                   DATABASE  (PostgreSQL)                 │
│     Users · Inventory · Bookings · News · People         │
└──────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
e23-co2060-Computer-vision-and-AI-lab-system/
├── code/
│   ├── backend/
│   │   ├── config/
│   │   │   └── db.js              # PostgreSQL pool (pg) connection
│   │   ├── controllers/
│   │   │   ├── analyticsController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── inventoryController.js
│   │   │   ├── newsController.js
│   │   │   ├── peopleController.js
│   │   │   └── usersController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── newsRoutes.js
│   │   │   ├── peopleRoutes.js
│   │   │   └── usersRoutes.js
│   │   ├── services/
│   │   │   └── emailService.js     # OTP & notification email service
│   │   ├── sql/
│   │   │   └── schema.sql          # Full database schema
│   │   ├── runSchema.js            # Runs schema.sql against the database
│   │   ├── seedEquipment.js        # Seeds 49 real equipment items
│   │   ├── seedInventory.js        # Imports items from CSV/Excel file
│   │   ├── seedUsers.js            # Seeds initial user accounts
│   │   └── index.js                # Express app entry point (port 5000)
│   │
│   └── frontend/
│       ├── src/
│       │   ├── assets/             # Static images (lab logo)
│       │   ├── components/
│       │   │   ├── iconUtils.js    # Icon render helper
│       │   │   ├── Layout.jsx      # TopBar, LogoBar, MainNav, Footer
│       │   │   ├── Modals.jsx      # Login, Register, Forgot Password modals
│       │   │   └── UI.jsx          # Shared UI primitives (Button, Card, etc.)
│       │   ├── data/
│       │   │   └── labData.js      # Static data & portal menu definitions
│       │   ├── pages/              # Public portal page components
│       │   ├── portal/
│       │   │   ├── AdminPortal.jsx
│       │   │   ├── OfficerPortal.jsx
│       │   │   ├── PortalLayout.jsx
│       │   │   ├── StaffPortal.jsx
│       │   │   └── StudentPortal.jsx
│       │   ├── services/
│       │   │   └── api.js          # Axios API service wrappers
│       │   ├── styles/
│       │   │   ├── index.css       # Global CSS & component styles
│       │   │   └── theme.js        # Design tokens & color palette
│       │   ├── App.jsx             # Root component & state-based section router
│       │   └── main.jsx            # React DOM entry point
│       └── index.html
│
└── docs/                           # GitHub Pages documentation site
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18+) & **npm**
- **PostgreSQL** (v14+)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled (for OTP emails)

### 1. Clone the Repository

```bash
git clone https://github.com/cepdnaclk/e23-co2060-Computer-vision-and-AI-lab-system.git
cd e23-co2060-Computer-vision-and-AI-lab-system
```

### 2. Set Up the Database (Neon)

The database is hosted on **[Neon](https://neon.tech)** (serverless PostgreSQL). No local database creation is needed.

1. Get your connection string from the Neon dashboard (Connection Details → Connection string).
2. Add it to `code/backend/.env` as `DATABASE_URL`.
3. Run the schema and seed scripts against Neon:

```bash
cd code/backend
node runSchema.js          # Creates all tables
node seedUsers.js          # Seeds initial user accounts
node seedEquipment.js      # Seeds 49 built-in equipment items
# node seedInventory.js path/to/file.csv  # (Optional) Import from CSV/Excel
```

### 3. Configure the Backend

Create or edit `code/backend/.env`:

```env
PORT=5000

# PostgreSQL connection (local)
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ai_lab_system
DB_PASSWORD=your_password
DB_PORT=5432

# Or use a Neon connection string directly (overrides individual DB_* vars)
# DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require

# JWT
JWT_SECRET=your_jwt_secret_here

# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Admin & frontend config
ADMIN_EMAIL=admin@example.com
PORTAL_URL=http://localhost:5174
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Start the Backend

```bash
cd code/backend
npm install
npm start
```

API server will be running at **http://localhost:5000**

### 5. Configure the Frontend

Create `code/frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 6. Start the Frontend

```bash
cd code/frontend
npm install
npm run dev
```

Web app will be available at **http://localhost:5174**

---

## 🔑 User Roles

| Role | Access Level |
|:---|:---|
| **Student** | Book equipment, view booking history, request consultations |
| **Officer** | Review and approve/reject student booking requests |
| **Staff** | Manage personal profile and lab-related tasks |
| **Admin** | Full access — user management, inventory, analytics, news, people |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/register/initiate` | Start registration — sends OTP email |
| `POST` | `/api/auth/register/verify` | Verify OTP and create account |
| `POST` | `/api/auth/login` | User login — returns JWT token |
| `POST` | `/api/auth/google` | Google OAuth login |
| `POST` | `/api/auth/forgot-password/initiate` | Start password reset — sends OTP |
| `POST` | `/api/auth/forgot-password/reset` | Verify OTP and set new password |

### Inventory

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/items` | List all inventory/equipment items |
| `POST` | `/api/items` | Add new inventory item (admin) |
| `PUT` | `/api/items/:id` | Update an inventory item |
| `DELETE` | `/api/items/:id` | Delete an inventory item |

### Bookings

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/bookings` | View bookings (filtered by role) |
| `POST` | `/api/bookings` | Create a new booking request |
| `PUT` | `/api/bookings/:id/status` | Approve or reject a booking |

### Users

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/users` | List all users (admin only) |
| `PUT` | `/api/users/:id` | Update user details |
| `DELETE` | `/api/users/:id` | Delete a user |

### People (Lab Profiles)

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/people` | Retrieve lab people/profiles |
| `POST` | `/api/people` | Add a person profile |
| `PUT` | `/api/people/:id` | Update a person profile |
| `DELETE` | `/api/people/:id` | Delete a person profile |

### News

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/news` | Retrieve news and events |
| `POST` | `/api/news` | Publish a news item (admin) |
| `PUT` | `/api/news/:id` | Update a news item |
| `DELETE` | `/api/news/:id` | Delete a news item |

### Analytics

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/analytics` | Usage and booking analytics (admin) |

---

## ☁️ Deployment

This project is deployed across three cloud platforms:

| Layer | Platform | Purpose |
|:---|:---|:---|
| 🗄️ **Database** | [Neon](https://neon.tech) | Serverless PostgreSQL — always-on, auto-scaling |
| ⚙️ **Backend** | [Northflank](https://northflank.com) | Node.js API server containerized deployment |
| 🌐 **Frontend** | [Vercel](https://vercel.com) | React + Vite static site with global CDN |

---

### 🗄️ 1. Database — Neon

1. Create a free project at [neon.tech](https://neon.tech)
2. From the **Connection Details** panel, copy your **connection string** — it looks like:
   ```
   postgresql://<user>:<password>@<host>.neon.tech/neondb?sslmode=require
   ```
3. Run the schema against your Neon database:
   ```bash
   cd code/backend
   # Set DATABASE_URL in your shell, then:
   node runSchema.js
   node seedUsers.js
   node seedEquipment.js
   ```
4. Set this as `DATABASE_URL` in all environments (Northflank & local).

> ✅ The backend already reads `DATABASE_URL` from the environment and uses it automatically when present.

---

### ⚙️ 2. Backend — Northflank

1. Sign in to [northflank.com](https://northflank.com) and create a new **Service**.
2. Connect your GitHub repository and set the **root directory** to `code/backend`.
3. Set the **build command** to `npm install` and **start command** to `npm start`.
4. Add the following **environment variables** in the Northflank dashboard:

   | Variable | Value |
   |:---|:---|
   | `DATABASE_URL` | Your Neon connection string |
   | `JWT_SECRET` | A long random secret string |
   | `EMAIL_SERVICE` | `gmail` |
   | `EMAIL_USER` | Your Gmail address |
   | `EMAIL_PASSWORD` | Your Gmail App Password |
   | `ADMIN_EMAIL` | Lab admin email address |
   | `PORTAL_URL` | Your Vercel frontend URL (e.g. `https://your-app.vercel.app`) |
   | `PORT` | `5000` (or leave unset; Northflank sets it automatically) |

5. Deploy — Northflank will build and expose a public HTTPS URL for the API.

---

### 🌐 3. Frontend — Vercel

1. Sign in to [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Import your GitHub repository and set the **Root Directory** to `code/frontend`.
3. Vercel will auto-detect Vite. Set the following **environment variable**:

   | Variable | Value |
   |:---|:---|
   | `VITE_API_URL` | Your Northflank backend URL (e.g. `https://your-service.northflank.app`) |

4. Click **Deploy** — Vercel will build and publish the site globally.

> ⚠️ Make sure `PORTAL_URL` on Northflank matches your Vercel domain exactly to avoid CORS issues.

---

## 👥 Team

| Index No. | Name | Email |
|:---|:---|:---|
| E/23/282 | M.R.A Rahman | [e23282@eng.pdn.ac.lk](mailto:e23282@eng.pdn.ac.lk) |
| E/23/273 | A Piraveen | [e23273@eng.pdn.ac.lk](mailto:e23273@eng.pdn.ac.lk) |
| E/23/289 | A Rajeeth | [e23289@eng.pdn.ac.lk](mailto:e23289@eng.pdn.ac.lk) |
| E/23/396 | M Tharsika | [e23396@eng.pdn.ac.lk](mailto:e23396@eng.pdn.ac.lk) |

---

## 🔗 Links

- 📁 [Project Repository](https://github.com/cepdnaclk/e23-co2060-Computer-vision-and-AI-lab-system)
- 🐛 [Issue Tracker](https://github.com/cepdnaclk/e23-co2060-Computer-vision-and-AI-lab-system/issues)
- 🏫 [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- 🎓 [University of Peradeniya](https://eng.pdn.ac.lk/)

---

## 📄 License

Distributed under the **ISC License**.

---

<div align="center">
  Made with ❤️ by Team Bug Slayer — E/23 Batch, University of Peradeniya
</div>
