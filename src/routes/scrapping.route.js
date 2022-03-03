const express = require("express");

const router = express.Router();
const xboxController = require("../controllers/xbox.controller");
const nintendoController = require("../controllers/nintendo.controller");
const psController = require("../controllers/ps.controller");

router.get("/xbox", xboxController.getXboxProducts);
router.get("/nintendo", nintendoController.getNintendoProducts);
router.get("/ps", psController.getPsroducts);

module.exports = router;
