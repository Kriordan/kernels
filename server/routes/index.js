const express = require("express");
const router = express.Router();

const scrapeController = require("../controllers/scrapeController");
const urlController = require("../controllers/urlController");

router.post("/api/scrapeForRender", scrapeController.scrapeForRender);

router.post("/api/v1/urls", urlController.create);
router.get("/api/v1/urls", urlController.findAll);
router.delete("/api/v1/urls/:id", urlController.delete);

module.exports = router;
