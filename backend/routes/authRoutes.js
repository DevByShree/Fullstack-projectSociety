const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { verifyOtp } = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);


const {
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


module.exports = router;
