const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const { text, dueDate, media } = req.body;
  const task = new Task({ text, dueDate, media });
  await task.save();
  res.json(task);
});

router.put("/:id", async (req, res) => {
  const { text, completed, dueDate, media } = req.body;
  const task = await Task.findById(req.params.id);
  if (text !== undefined) task.text = text;
  if (completed !== undefined) task.completed = completed;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (media !== undefined) task.media = media;
  await task.save();
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
