const express = require("express");
const router = express.Router();

const {
    getAllNews,
    createNews,
    updateNews,
    deleteNews
} = require("../controllers/newsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", getAllNews);
router.post("/", verifyToken, requireRole("admin"), createNews);
router.put("/:id", verifyToken, requireRole("admin"), updateNews);
router.delete("/:id", verifyToken, requireRole("admin"), deleteNews);

module.exports = router;
