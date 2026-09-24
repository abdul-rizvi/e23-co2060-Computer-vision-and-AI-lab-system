const express = require("express");
const router = express.Router();
router.use((req, res, next) => {
    if (req.body?.email !== undefined) {
        if (typeof req.body.email !== "string") return res.status(400).json({ message: "Invalid email" });
        req.body.email = req.body.email.trim().toLowerCase();
    }
    next();
});
const { initiateRegistration, verifyRegistration, login, googleLogin, forgotPasswordInitiate, resetPassword } = require("../controllers/authController");

router.post("/register/initiate", initiateRegistration);
router.post("/register/verify", verifyRegistration);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password/initiate", forgotPasswordInitiate);
router.post("/forgot-password/reset", resetPassword);

module.exports = router;
