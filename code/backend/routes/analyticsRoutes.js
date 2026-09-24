const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Admin/Officer analytics endpoint
router.get("/", verifyToken, requireRole("admin", "officer"), getAnalytics);

module.exports = router;
