---
layout: default
title: "Appendix E: Selected Source Code"
permalink: /appendix-e/
---

# Appendix E: Selected Source Code

This appendix houses the key code excerpts representing the core authentication, resource booking, and database schema implementation for the **Computer Vision & AI Lab Management System**.

---

## 1. Database Schema Specifications

### File: [schema.sql](file:///c:/Users/HP/OneDrive/Desktop/2YP/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/sql/schema.sql)
Defines the relational PostgreSQL database tables including data check constraints, unique indexing, and cascade delete rules on foreign keys.

```sql
-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student','professor','officer', 'admin', 'staff')) NOT NULL
);

-- 2. Inventory / Items Table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'available'
);

-- 3. Reservations Table (Linked to Users via user_id)
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(100),
    resource VARCHAR(100),
    booking_date DATE,
    time_slot VARCHAR(50),
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    fee VARCHAR(50) DEFAULT 'TBD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Authentication Middleware & Access Control Guards

### File: [authMiddleware.js](file:///c:/Users/HP/OneDrive/Desktop/2YP/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/middleware/authMiddleware.js)
Extracts and validates JSON Web Tokens (JWT) from client authorization headers and implements role-based checking policies.

```javascript
const jwt = require("jsonwebtoken");

// Verify token — runs before the actual route handler
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // Token comes as: "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // attach user info to the request
        next();              // pass control to the actual route handler
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

// Role-based guard — use after verifyToken
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };
```

---

## 3. User Register & Login Controllers

### File: [authController.js](file:///c:/Users/HP/OneDrive/Desktop/2YP/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/controllers/authController.js)
Handles password hashing via `bcryptjs`, writes registered users to the PostgreSQL database, validates credentials during logins, and issues short-lived JWT signatures.

```javascript
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../services/emailService");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Hash the password — never store plain text
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role || "student"]
        );

        // Send registration confirmation email (non-blocking)
        sendRegistrationEmail(email, name, role || "student").catch(err => 
            console.error("Email sending failed (non-critical):", err.message)
        );

        res.status(201).json({ message: "User registered", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Find user
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token containing user id, email, and role
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};
```

---

## 4. Booking & Reservation Controllers

### File: [bookingController.js](file:///c:/Users/HP/OneDrive/Desktop/2YP/e23-co2060-Computer-vision-and-AI-lab-system/code/backend/controllers/bookingController.js)
Coordinates transaction pipelines for booking creation, permission filters (allowing admins to view all bookings and students to view only their own), and admin status overrides.

```javascript
const pool = require("../config/db");
const { sendBookingConfirmationEmail, sendBookingStatusEmail, sendAdminNotificationEmail } = require("../services/emailService");

// 1. Submit a new booking (For Students)
const createBooking = async (req, res) => {
    try {
        const { requestType, resource, date, time, purpose } = req.body;
        const userId = req.user.id; 

        const userResult = await pool.query("SELECT name, email FROM users WHERE id = $1", [userId]);
        const user = userResult.rows[0];

        const result = await pool.query(
            `INSERT INTO reservations 
            (user_id, request_type, resource, booking_date, time_slot, purpose, status) 
            VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`,
            [userId, requestType, resource, date, time, purpose]
        );

        const booking = result.rows[0];

        // Send confirmation email to student
        sendBookingConfirmationEmail(user.email, user.name, {
            requestType, resource, date, time, purpose
        }).catch(err => console.error("Email sending failed (non-critical):", err.message));

        // Notify admin of new booking
        sendAdminNotificationEmail(
            process.env.ADMIN_EMAIL || "admin@pdn.ac.lk",
            `New booking request from ${user.name}`,
            { userId, requestType, resource, date, time }
        ).catch(err => console.error("Admin email failed (non-critical):", err.message));

        res.status(201).json({ message: "Booking submitted", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating booking" });
    }
};

// 2. Get bookings (Admins/Staff see all, Students see only their own)
const getBookings = async (req, res) => {
    try {
        let result;
        if (req.user.role === "officer" || req.user.role === "admin" || req.user.role === "staff") {
            result = await pool.query(`
                SELECT r.*, u.name as user_name 
                FROM reservations r 
                JOIN users u ON r.user_id = u.id 
                ORDER BY r.created_at DESC
            `);
        } else {
            result = await pool.query(
                "SELECT * FROM reservations WHERE user_id = $1 ORDER BY created_at DESC", 
                [req.user.id]
            );
        }
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

// 3. Update booking status (For Admins / Officers)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "Approved" or "Rejected"

        const result = await pool.query(
            "UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = result.rows[0];

        const userResult = await pool.query("SELECT name, email FROM users WHERE id = $1", [booking.user_id]);
        const user = userResult.rows[0];

        if (user) {
            sendBookingStatusEmail(
                user.email, user.name,
                {
                    requestType: booking.request_type,
                    resource: booking.resource,
                    date: booking.booking_date,
                    time: booking.time_slot
                },
                status
            ).catch(err => console.error("Email sending failed (non-critical):", err.message));
        }

        res.json({ message: "Booking updated", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating booking" });
    }
};
```
