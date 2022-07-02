const express = require("express");
const router = express.Router();
const annContrl = require("../controllers/announce.controller");

router.post("/announces", annContrl.exportAnnonces);

router.get("/get_url", annContrl.getUrls);
router.post("/addPhoneToCsv", annContrl.removeDuplicateAnnonces);
router.get("/annonce", annContrl.getAnnonce);
router.get("/sendDataToserver", annContrl.sendDataToserver);

module.exports = router;
