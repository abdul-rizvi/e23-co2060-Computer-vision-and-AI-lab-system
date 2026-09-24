const pool = require("../config/db");
const { validateSchedule } = require("../utils/bookingValidation");
const { sendBookingConfirmationEmail, sendBookingStatusEmail, sendAdminNotificationEmail } = require("../services/emailService");

// 1. Submit a new booking (For Students)
const createBooking = async (req, res) => {
    try {
        const { requestType, resource, date, time, purpose } = req.body;
        if ([requestType, resource, purpose].some(value => typeof value !== "string" || !value.trim())) {
            return res.status(400).json({ message: "Request type, resource, and purpose are required" });
        }
        const scheduleError = validateSchedule(date, time);
        if (scheduleError) return res.status(400).json({ message: scheduleError });
        const userId = req.user.id; // Comes from your verifyToken middleware

        // Get user info for email
        const userResult = await pool.query("SELECT name, email FROM users WHERE id = $1", [userId]);
        const user = userResult.rows[0];
        if (!user) return res.status(401).json({ message: "Account no longer exists. Please sign in again." });

        const result = await pool.query(
            `INSERT INTO reservations 
            (user_id, request_type, resource, booking_date, time_slot, purpose, status) 
            VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`,
            [userId, requestType, resource, date, time, purpose]
        );

        const booking = result.rows[0];

        // Send confirmation email to student (non-blocking)
        sendBookingConfirmationEmail(user.email, user.name, {
            requestType,
            resource,
            date,
            time,
            purpose
        }).catch(err => console.error("Email sending failed (non-critical):", err.message));

        // Notify admin of new booking (non-blocking)
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

// 2. Get bookings (Admins see all, Students see only their own)
const getBookings = async (req, res) => {
    try {
        let result;
        if (req.query?.mine !== "true" && ["officer", "admin"].includes(req.user.role)) {
            // Admins get everything, plus the user's name
            result = await pool.query(`
                SELECT r.*, u.name as user_name, u.email as user_email
                FROM reservations r 
                JOIN users u ON r.user_id = u.id 
                ORDER BY r.created_at DESC
            `);
        } else {
            // Students only see their personal history
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

// 3. Update booking status (For Admins)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, booking_date, time_slot, admin_notes } = req.body; // "Approved", "Rejected", "Rescheduled"
        if (!["Approved", "Rejected", "Rescheduled"].includes(status)) {
            return res.status(400).json({ message: "Invalid reservation status" });
        }
        if (status === "Rescheduled" || booking_date || time_slot) {
            const scheduleError = validateSchedule(booking_date, time_slot);
            if (scheduleError) return res.status(400).json({ message: scheduleError });
        }

        let query = "UPDATE reservations SET status = $1";
        const values = [status];
        let paramIndex = 2;
        if (admin_notes !== undefined) {
            query += `, admin_notes = $${paramIndex++}`;
            values.push(admin_notes || null);
        }

        if (booking_date) {
            query += `, booking_date = $${paramIndex++}`;
            values.push(booking_date);
        }
        if (time_slot) {
            query += `, time_slot = $${paramIndex++}`;
            values.push(time_slot);
        }

        query += ` WHERE id = $${paramIndex} RETURNING *`;
        values.push(id);

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = result.rows[0];

        // Get user info for email
        const userResult = await pool.query("SELECT name, email FROM users WHERE id = $1", [booking.user_id]);
        const user = userResult.rows[0];

        // Send status update email (non-blocking)
        if (user) {
            sendBookingStatusEmail(
                user.email,
                user.name,
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

module.exports = { createBooking, getBookings, updateBookingStatus };
