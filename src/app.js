const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const request = require("request");
//const https = require("https");
const morgan = require("morgan");
var bodyparser = require("body-parser");
const fs = require('fs');
require("dotenv").config();
const puppeteer = require("puppeteer");
const router = require("./routes");

const app = express();

app.use(express.static("public/"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Server texto is running!");
});

app.use("/api", router);



const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on http://51.38.38.214:${PORT}`);
});
