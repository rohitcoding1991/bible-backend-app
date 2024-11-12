const express = require("express");
const {
  signUp,
  signIn,
  handleVerifyOtp,
  getUsers,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/verifyotp", handleVerifyOtp);

router.get("/users", authMiddleware, getUsers);

// Protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "You are authorized!" });
});

module.exports = router;
