const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================
exports.register = async (req, res) => {
 const { name, email, password, flatNo,mobile } = req.body;

  try {
    // 🔐 PASSWORD VALIDATION
    const passwordRegex = /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 5 characters long and contain at least 1 special character (@$!%*#?&)"
      });
    }

    // check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered "
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      flatNo
    });

    // IST time
    const istTime = new Date(user.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully ",
      registeredAt: istTime
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // user check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found "
      });
    }

    // password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong password "
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful ",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile:user.mobile,
        flatNo: user.flatNo,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



// ================= FORGOT OTP GENERATOR  =================
exports.forgotPassword = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    // 1️⃣ user check
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ OTP generate (6 digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3️⃣ expiry (5 minutes)
    const otpExpire = Date.now() + 5 * 60 * 1000;

    // 4️⃣ save in DB
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // ⚠️ Abhi SMS nahi, sirf response me OTP
    console.log("OTP:", otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      otp // ❗ dev testing ke liye
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= OTP VERIFY   =================


exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // OTP match check
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Expiry check
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




// ================= RESET PASSWORD  =================
exports.resetPassword = async (req, res) => {
  const { mobile, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ mobile, otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
