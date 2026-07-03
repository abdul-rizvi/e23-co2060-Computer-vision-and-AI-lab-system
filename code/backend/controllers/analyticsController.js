const pool = require("../config/db");

// GET /api/analytics — Admin only: aggregate stats across all tables
const getAnalytics = async (req, res) => {
    try {
        const [bookingsResult, equipmentResult, usersResult, newsResult, peopleResult] = await Promise.all([
            pool.query(`
                SELECT
                    COUNT(*)                                          AS total,
                    COUNT(*) FILTER (WHERE LOWER(status) = 'pending')  AS pending,
                    COUNT(*) FILTER (WHERE LOWER(status) = 'approved') AS approved,
                    COUNT(*) FILTER (WHERE LOWER(status) = 'rejected') AS rejected
                FROM reservations
            `),
            pool.query(`
                SELECT
                    COUNT(*)                                                  AS total,
                    COUNT(*) FILTER (WHERE LOWER(status) = 'available')       AS available,
                    COUNT(*) FILTER (WHERE LOWER(status) = 'in-use')          AS in_use,
                    COUNT(*) FILTER (WHERE LOWER(status) = 'maintenance')     AS maintenance
                FROM inventory
            `),
            pool.query(`
                SELECT
                    COUNT(*)                                               AS total,
                    COUNT(*) FILTER (WHERE role = 'student')               AS students,
                    COUNT(*) FILTER (WHERE role = 'officer')               AS officers,
                    COUNT(*) FILTER (WHERE role = 'admin')                 AS admins,
                    COUNT(*) FILTER (WHERE role = 'professor')             AS professors,
                    COUNT(*) FILTER (WHERE role = 'staff')                 AS staff
                FROM users
            `),
            pool.query("SELECT COUNT(*) AS total FROM news"),
            pool.query("SELECT COUNT(*) AS total FROM people"),
        ]);

        const bookings  = bookingsResult.rows[0];
        const equipment = equipmentResult.rows[0];
        const users     = usersResult.rows[0];
        const news      = newsResult.rows[0];
        const people    = peopleResult.rows[0];

        // Recent 5 bookings for the timeline widget
        const recentBookings = await pool.query(`
            SELECT r.id, r.resource, r.booking_date, r.time_slot, r.status, u.name AS user_name
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
            LIMIT 5
        `);

        res.json({
            bookings: {
                total:    Number(bookings.total),
                pending:  Number(bookings.pending),
                approved: Number(bookings.approved),
                rejected: Number(bookings.rejected),
            },
            equipment: {
                total:       Number(equipment.total),
                available:   Number(equipment.available),
                in_use:      Number(equipment.in_use),
                maintenance: Number(equipment.maintenance),
            },
            users: {
                total:      Number(users.total),
                students:   Number(users.students),
                officers:   Number(users.officers),
                admins:     Number(users.admins),
                professors: Number(users.professors),
                staff:      Number(users.staff),
            },
            content: {
                news:   Number(news.total),
                people: Number(people.total),
            },
            recentBookings: recentBookings.rows,
        });

    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ message: "Failed to load analytics" });
    }
};

module.exports = { getAnalytics };
