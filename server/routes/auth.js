const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Password validation helper
function validatePassword(password) {
  // Minimum 8 chars, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

// JWT middleware
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Signup
const fs = require("fs");
const path = require("path");
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    if (!validatePassword(password))
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include a letter and a number.",
      });
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    // Create user data folder
    const userDir = path.join(
      __dirname,
      "..",
      "user_data",
      user._id.toString()
    );
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// User profile (protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ username: user.username });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Avatar upload
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const userDir = path.join(__dirname, "..", "user_data", req.user.id);
      if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
      cb(null, userDir);
    },
    filename: function (req, file, cb) {
      cb(null, "avatar" + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.avatar = `/user_data/${user._id}/avatar${path.extname(
        req.file.originalname
      )}`;
      await user.save();
      res.json({ avatar: user.avatar });
    } catch (err) {
      res.status(500).json({ message: "Failed to upload avatar" });
    }
  }
);

module.exports = router;
