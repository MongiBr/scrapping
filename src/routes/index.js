const express = require("express");
const scrappingRoute = require("./scrapping.route");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API is running...",
  });
});

const defaultRoutes = [
  {
    path: "/scrapping",
    route: scrappingRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
