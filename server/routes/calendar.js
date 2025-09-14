const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get tasks by date range
router.get("/", async (req, res) => {
  const { start, end } = req.query;
  const tasks = await Task.find({
    dueDate: { $gte: new Date(start), $lte: new Date(end) },
  });
  res.json(tasks);
});

module.exports = router;
