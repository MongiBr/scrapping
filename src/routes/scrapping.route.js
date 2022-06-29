const express = require("express");
const router = express.Router();
const annContrl = require("../controllers/announce.controller");

router.post("/announces", annContrl.exportAnnonces);

module.exports = router;
