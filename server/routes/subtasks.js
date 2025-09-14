const express = require("express");
const router = express.Router();
const SubTask = require("../models/SubTask");

// CRUD for sub-tasks
router.post("/", async (req, res) => {
  const subtask = new SubTask(req.body);
  await subtask.save();
  res.json(subtask);
});

router.put("/:id", async (req, res) => {
  const subtask = await SubTask.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(subtask);
});

router.delete("/:id", async (req, res) => {
  await SubTask.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
