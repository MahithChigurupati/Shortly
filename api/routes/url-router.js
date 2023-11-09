// defining routes to route request calls to corresponding methods

const urlController = require("../controllers/url-controller.js")

const router = require("express").Router()

//Route for POST method
router.post("/customizeUrl", urlController.customizeUrl)

//Route for GET method
router.get("/:url", urlController.getOriginalUrl)

// Route for Get method
router.get("/user/getAllMyUrl", urlController.getAllMyUrl)

module.exports = router
