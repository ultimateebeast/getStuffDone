const express = require("express");
const router = express.Router();
const Attachment = require("../models/Attachment");

// CRUD for attachments
router.post("/", async (req, res) => {
  const attachment = new Attachment(req.body);
  await attachment.save();
  res.json(attachment);
});

router.delete("/:id", async (req, res) => {
  await Attachment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
