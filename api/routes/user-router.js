// defining routes to route request calls to corresponding methods

const userController = require("../controllers/users-controller.js")

const router = require("express").Router()

//Route for POST method
router.post("/v1/user", userController.add)

//Route for GET method
router.get("/v2/user/:id", userController.retrieve)

//Route for PUT method
router.put("/v1/user/:id", userController.update)

//Route for GET method -- a health check method
router.get("/health", userController.check)

module.exports = router
