const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Task completion trends

// Task completion trends: completed tasks per week (last 6 weeks)
router.get("/completion", async (req, res) => {
  try {
    const now = new Date();
    const weeks = Array.from({ length: 6 }, (_, i) => {
      const start = new Date(now);
      start.setDate(now.getDate() - (i + 1) * 7);
      const end = new Date(now);
      end.setDate(now.getDate() - i * 7);
      return { start, end };
    }).reverse();
    const data = [];
    for (const { start, end } of weeks) {
      const count = await Task.countDocuments({
        completed: true,
        createdAt: { $gte: start, $lt: end },
      });
      data.push({
        week: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        completed: count,
      });
    }
    res.json({ trends: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Time tracking

// Time tracking: overdue tasks, tasks completed late, average completion time
router.get("/timetracking", async (req, res) => {
  try {
    const allTasks = await Task.find({});
    let overdue = 0,
      completedLate = 0,
      totalCompletionTime = 0,
      completedCount = 0;
    allTasks.forEach((task) => {
      if (!task.completed && task.dueDate && task.dueDate < new Date())
        overdue++;
      if (task.completed && task.dueDate && task.createdAt > task.dueDate)
        completedLate++;
      if (task.completed && task.dueDate) {
        totalCompletionTime += task.createdAt - task.dueDate;
        completedCount++;
      }
    });
    const avgCompletionTime = completedCount
      ? (totalCompletionTime / completedCount / 3600000).toFixed(2)
      : 0; // hours
    res.json({ overdue, completedLate, avgCompletionTime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats

// Dashboard stats: total, completed, active, overdue
router.get("/dashboard", async (req, res) => {
  try {
    const total = await Task.countDocuments({});
    const completed = await Task.countDocuments({ completed: true });
    const active = await Task.countDocuments({ completed: false });
    const overdue = await Task.countDocuments({
      completed: false,
      dueDate: { $lt: new Date() },
    });
    res.json({ total, completed, active, overdue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
