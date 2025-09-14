const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// CRUD for comments
router.post("/", async (req, res) => {
  const comment = new Comment(req.body);
  await comment.save();
  res.json(comment);
});

router.put("/:id", async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(comment);
});

router.delete("/:id", async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
