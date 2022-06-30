const express = require("express");
const router = express.Router();
const annContrl = require("../controllers/announce.controller");

router.post("/announces", annContrl.exportAnnonces);
router.post("/addPhoneToCsv", annContrl.removeDuplicateAnnonces);
router.get("/annonce", annContrl.getAnnonce);

module.exports = router;
