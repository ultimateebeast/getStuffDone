const express = require("express");
const router = express.Router();

// Real-time sync placeholder (WebSocket/Firebase integration)
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
