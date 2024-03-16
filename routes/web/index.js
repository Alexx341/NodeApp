const express = require("express");

const router = express.Router();

// add in error and info

router.use("/", require("./home"));

module.exports = router;