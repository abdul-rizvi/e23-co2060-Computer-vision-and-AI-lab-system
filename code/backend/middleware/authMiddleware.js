const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Verify token — runs before the actual route handler
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // Token comes as: "Bearer <token>"
    const token = typeof authHeader === "string" && /^Bearer \S+$/i.test(authHeader) ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query("SELECT id, email, role FROM users WHERE id = $1", [decoded.id]);
        if (!result.rows.length) return res.status(401).json({ message: "Account no longer exists" });
        req.user = result.rows[0];
        next();              // pass control to the actual route handler
    } catch (error) {
        if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error.name)) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        return res.status(503).json({ message: "Authentication is temporarily unavailable" });
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
