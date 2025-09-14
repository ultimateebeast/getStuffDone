const express = require("express");
const router = express.Router();

// Send notification
router.post("/", async (req, res) => {
  // ...implementation...
  res.json({ success: true });
});

module.exports = router;
