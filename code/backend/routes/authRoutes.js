const express = require("express");
const router = express.Router();
const { initiateRegistration, verifyRegistration, login, googleLogin } = require("../controllers/authController");

router.post("/register/initiate", initiateRegistration);
router.post("/register/verify", verifyRegistration);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;