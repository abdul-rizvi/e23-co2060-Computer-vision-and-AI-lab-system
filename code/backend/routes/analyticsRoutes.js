const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Admin-only analytics endpoint
router.get("/", verifyToken, requireRole("admin"), getAnalytics);

module.exports = router;
