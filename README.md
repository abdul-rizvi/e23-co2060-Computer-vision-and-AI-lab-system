# Computer Vision & AI Lab Management System

<div align="center">

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![Team](https://img.shields.io/badge/Team-Bug%20Slayer-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> A unified web platform for the **Computer Vision & AI Lab** — combining a dynamic public research portfolio with a secure internal management system for equipment bookings and GPU resource scheduling.

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
| **Routing** | React Router DOM v7 | Client-side navigation between sections |
| **Backend** | Node.js + Express v5 | REST API server, authentication, business logic |
| **Database** | PostgreSQL (via `pg`) | Relational storage for users, bookings, inventory |
| **Auth** | JWT + Google OAuth (`@react-oauth/google`) | Secure session management and single sign-on |
| **Email** | Nodemailer | OTP delivery and notification emails |
| **Styling** | Vanilla CSS + CSS Variables | Theming and component-level styles |
| **Icons** | React Icons | UI icon library |
| **HTTP Client** | Axios | Frontend-to-backend API communication |
| **File Handling** | XLSX | Spreadsheet export for data and reports |

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
│   │   ├── config/           # Database connection (pg pool)
│   │   ├── controllers/      # Route handler logic
│   │   ├── middleware/       # JWT authentication middleware
│   │   ├── routes/           # Express route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── usersRoutes.js
│   │   │   ├── peopleRoutes.js
│   │   │   ├── newsRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── services/         # Business logic & email service
│   │   ├── sql/              # SQL schema files
│   │   ├── seedEquipment.js  # Seed script for equipment data
│   │   ├── seedInventory.js  # Seed script for inventory items
│   │   ├── seedUsers.js      # Seed script for initial users
│   │   └── index.js          # Express app entry point (port 5000)
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/   # Shared UI components (Layout, Modals)
│       │   ├── pages/        # Public portal pages
│       │   ├── portal/       # Role-based internal portal views
│       │   │   ├── AdminPortal.jsx
│       │   │   ├── OfficerPortal.jsx
│       │   │   ├── StaffPortal.jsx
│       │   │   ├── StudentPortal.jsx
│       │   │   └── PortalLayout.jsx
│       │   ├── services/     # Axios API service wrappers
│       │   ├── styles/       # CSS theme & global styles
│       │   └── App.jsx       # Root component & section router
│       └── index.html
│
└── docs/                     # GitHub Pages documentation site
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
node runSchema.js
node seedUsers.js
node seedInventory.js
node seedEquipment.js
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

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/login` | User login — returns JWT token |
| `POST` | `/api/auth/register` | New user registration with OTP |
| `GET` | `/api/items` | List all inventory/equipment items |
| `POST` | `/api/items` | Add new inventory item (admin) |
| `GET` | `/api/bookings` | View bookings (filtered by role) |
| `POST` | `/api/bookings` | Create a new booking request |
| `GET` | `/api/users` | User management (admin only) |
| `GET` | `/api/people` | Retrieve lab people/profiles |
| `POST` | `/api/people` | Add/update a person profile |
| `GET` | `/api/news` | Retrieve news and events |
| `POST` | `/api/news` | Publish a news item (admin) |
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
