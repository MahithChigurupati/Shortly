const bcrypt = require("bcrypt")
const moment = require("moment")
const logger = require("../../logger")

const db = require("../models")
const sequelize = require("../models/index")

const User = db.users

// A health check method to check db connection status
const healthCheck = async (req, res) => {
    logger.info("hitting status check")

    sequelize.sequelize.authenticate().then(() => {
        res.send("Connection established successfully.")
    })
}

// createUser method to create a new user
const createUser = async (req, res) => {
    logger.info("POST: hitting create a user")

    // check if request body exists
    if (Object.keys(req.body).length === 0) {
        logger.error("POST: Failed due to bad request body: no arguments passed")

        return res.status(400).send("Bad request: no arguments passed")
    }

    // check if request body has all the necessary information
    if (
        !req.body.first_name ||
        !req.body.last_name ||
        !req.body.username ||
        !req.body.password ||
        !req.body.user_tier
    ) {
        logger.error("POST: Failed due to bad request body: Fields mismatch")

        return res.status(400).send("Bad request: Fields mismatch")
    }

    var date = moment().tz("America/New_York").format("YYYY-MM-DDTHH:mm:ss.sss")

    // retrieves attribute values from request body
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var username = req.body.username
    var password = req.body.password
    var created_date = date
    var user_tier = req.body.user_tier
    var requests_available = 0

    if (user_tier == 1) {
        requests_available = 1000
    } else if (user_tier == 2) {
        requests_available = 500
    } else if (user_tier == 3) {
        requests_available = 100
    } else {
        requests_available = 0
    }

    // standard email regex
    var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var userExists = await User.findOne({ where: { username: username } })

    // hash the user password with a salt value
    var hash = await bcrypt.hash(password, 11)

    // check if username is valid
    if (userExists == null && username.match(re)) {
        // check if user_tier is valid
        if (req.body.user_tier < 1 || req.body.user_tier > 3) {
            logger.error("POST: Failed due to bad request body: user tier is not valid")

            return res.status(400).send("Bad request: Invalid user tier")
        }

        // structuring JSON object with Info
        let newUser = {
            first_name: first_name,
            last_name: last_name,
            username: username,
            password: hash,
            user_tier: user_tier,
            requests_available: requests_available,
            account_created: created_date,
            account_updated: created_date,
        }

        await User.create(newUser)

        // retrieving back the created user to send it back in response
        let response = await User.findOne({
            where: { username: username },
            attributes: { exclude: ["password"] },
        })

        logger.info(`user ${username} created with id ${response.id}`)

        return res.status(201).send(response)
    }

    logger.error(`POST: User with username: ${username} already exists`)

    return res.status(400).send("Bad request: User already exist")
}

//getUser method to be executed on GET method call
const retrieveUser = async (req, res) => {
    logger.info(`GET:retrieving a user with id: ${req.params.id}`)

    // check if Auth Block exists in the request
    if (isNaN(req.params.id)) {
        logger.error("GET: ID in Endpoint URL is NaN")

        return res.status(400).json("Bad request")
    }

    if (!req.get("Authorization")) {
        logger.error(`GET:Credentials not provided to authenticate`)

        return res.status(401).send("Unauthorized")
    }

    // decoding the Auth Block
    const authenticated = await authenticate(req, res)

    if (authenticated == true) {
        // retrieve user data based on parameter id
        let user = await User.findOne({
            where: { id: req.params.id },
            attributes: { exclude: ["password"] },
        })

        if (user != null) {
            logger.info(`GET: Success`)

            return res.status(200).send(user)
        }
    }
}

// function to authenticate a user
async function authenticate(req, res) {
    // decrypt auth
    var basicAuth = Buffer.from(req.get("Authorization").split(" ")[1], "base64")
        .toString()
        .split(":")

    logger.info(`checking authentication for user ${basicAuth[0]}`)

    // find the user by id
    let userByID = await User.findOne({ where: { id: req.params.id } })

    let user = await User.findOne({ where: { username: basicAuth[0] } })

    if (user && userByID) {
        // check the auth
        const authenticated = await bcrypt.compare(basicAuth[1], user.password)

        if (authenticated && basicAuth[0] == userByID.username) {
            logger.info(`user ${basicAuth[0]} is authenticated`)

            return true
        }
        if (authenticated && basicAuth[0] != userByID.username) {
            logger.error(`user ${basicAuth[0]} is forbidden to perform this action`)

            return res.status(403).send("Forbidden")
        }
    }

    logger.error(`user ${basicAuth[0]} is not authorized`)

    return res.status(401).send("Unauthorized")
}

module.exports = {
    createUser,
    retrieveUser,
    healthCheck,
}
