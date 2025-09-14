const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get tasks by Kanban column
router.get("/:column", async (req, res) => {
  const tasks = await Task.find({ kanban: req.params.column });
  res.json(tasks);
});

// Move task to another column
router.put("/:id/move", async (req, res) => {
  const { column } = req.body;
  const task = await Task.findById(req.params.id);
  task.kanban = column;
  await task.save();
  res.json(task);
});

module.exports = router;
