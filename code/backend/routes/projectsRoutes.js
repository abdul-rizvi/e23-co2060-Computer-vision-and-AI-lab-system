const express = require("express");
const router = express.Router();
const { getAllProjects, createProject, updateProject, deleteProject } = require("../controllers/projectsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Public route
router.get("/", getAllProjects);

// Protected routes
router.post("/", verifyToken, requireRole("admin", "officer"), createProject);
router.put("/:id", verifyToken, requireRole("admin", "officer"), updateProject);
router.delete("/:id", verifyToken, requireRole("admin", "officer"), deleteProject);

module.exports = router;
