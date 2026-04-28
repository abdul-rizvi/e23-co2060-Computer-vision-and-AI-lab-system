const express = require("express")
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const { getAllItems, createItem, deleteItem, importEquipmentData } = require("../controllers/inventoryController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllItems);                              // any logged in user
router.post("/", verifyToken, requireRole("officer"), createItem);     // only officer
router.delete("/:id", verifyToken, requireRole("officer"), deleteItem); // only officer
router.post('/import', verifyToken, upload.single('file'), requireRole('admin'), importEquipmentData);   // Excel file upload

module.exports=router;