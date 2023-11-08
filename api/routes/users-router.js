// defining routes to route request calls to corresponding methods

const userController = require("../controllers/users-controller.js")

const router = require("express").Router()

//Route for POST method
router.post("/user", userController.createUser)

//Route for GET method
router.get("/user/:id", userController.retrieveUser)

//Route for GET method -- a health check method
router.get("/health", userController.healthCheck)

module.exports = router
