const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

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

router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

router.post("/", authMiddleware, async (req, res) => {
  const { text, dueDate, media } = req.body;
  const task = new Task({ text, dueDate, media, user: req.user.id });
  await task.save();
  res.json(task);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { text, completed, dueDate, media } = req.body;
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (text !== undefined) task.text = text;
  if (completed !== undefined) task.completed = completed;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (media !== undefined) task.media = media;
  await task.save();
  res.json(task);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ success: true });
});

module.exports = router;
