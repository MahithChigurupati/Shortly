const bcrypt = require("bcrypt")
const logger = require("../../logger")

const db = require("../models")

const User = db.users
const Urls = db.urls

// create customized URL method to create a new shortly URL
const customizeUrl = async (req, res) => {
    logger.info("POST: hitting customize URL")

    //check if Auth block exist in request
    if (!req.get("Authorization")) {
        logger.error("POST: Failed to provide credentials to authenticate")

        return res.status(401).send("Unauthorized")
    }

    // check if user is authorized
    const authenticatedUser = await authenticate(req, res)

    if (!isNaN(authenticatedUser)) {
        // check if user has available requests
        // retrieve user data based on parameter id

        let user = await User.findOne({
            where: { id: authenticatedUser },
        })

        if (user.requests_available <= 0) {
            return res.status(403).send("Forbidden: Out of requests")
        }

        // check if request body exists
        if (Object.keys(req.body).length === 0) {
            logger.error("POST: Failed due to bad request body: no arguments passed")

            return res.status(400).send("Bad request: no arguments passed")
        }

        if (Object.keys(req.body).length == 2 && !(req.body.shortly_url || req.body.originalUrl)) {
            logger.error("POST: Failed due to bad request body: Fields mismatch")

            return res.status(400).send("Bad request: unwanted Fields passed")
        }

        // check if request body has all the necessary information
        if (
            Object.keys(req.body).length == 0 ||
            Object.keys(req.body).length > 2 ||
            !req.body.original_url ||
            typeof req.body.original_url != "string"
        ) {
            logger.error("POST: Failed due to bad request body - Fields mismatch")

            return res.status(400).send("Bad request: Fields mismatch")
        }

        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i

        if (!req.body.original_url.match(urlPattern)) {
            logger.error("POST: Failed due to bad request body - Invalid URL")

            return res.status(400).send("Bad request: Invalid URL")
        }

        if (!req.body.shortly_url || req.body.shortly_url == "") {
            generate = true

            while (generate) {
                //generate shortly url
                var shortly = Math.random().toString(36).substring(2, 7)

                //check if product already exist
                let isShortlyExist = await Urls.findOne({ where: { shortly_url: shortly } })

                //reject post if product exist already
                if (isShortlyExist == null) {
                    generate = false
                }
            }
        } else {
            var shortly = req.body.shortly_url

            //check if product already exist
            let isShortlyExist = await Urls.findOne({ where: { shortly_url: shortly } })

            //reject post if product exist already
            if (isShortlyExist != null) {
                logger.error(`POST: Shortly with url - ${shortly} already exist`)

                return res.status(409).send("Conflict")
            }
        }

        // retrieves attribute values from request body
        var original_url = req.body.original_url

        // structuring JSON object with Info
        let customizedUrl = {
            user_id: authenticatedUser,
            original_url: original_url,
            shortly_url: shortly,
        }
        await Urls.create(customizedUrl)

        // decrement available requests for the user
        // call Patch call on user data db

        let updatedUser = {
            requests_available: user.requests_available - 1,
        }

        await User.update(updatedUser, { where: { id: authenticatedUser } })

        // retrieving back the created user to send it back in response
        let response = await Urls.findOne({ where: { shortly_url: shortly } })

        logger.info(`POST: Shortly with url - ${response.id} created`)

        return res.status(201).send(response)
    }
}

//getUrl method to be executed on GET method call to get the original URL
const getOriginalUrl = async (req, res) => {
    logger.info("GET: hitting retrieve to get a Shortly URL")

    if (req.params.url == "" || typeof req.params.url != "string") {
        logger.error(`GET: ID in EndPoint URL is invalid`)

        return res.status(400).json("Bad request: Invalid url parameter")
    }

    let originalUrl = await Urls.findOne({ where: { shortly_url: req.params.url } })

    //check if originalUrl exist
    if (originalUrl != null) {
        logger.info(`GET: Original URL with id: ${originalUrl.id} retrieved`)

        return res.redirect(301, originalUrl.original_url)
    } else {
        logger.error(`GET: Original URL with id: ${req.params.url} Not Found`)

        return res.status(404).send("Not Found")
    }
}

//getAllMyUrl method to be executed on GET method call to get all the URLs created by a user
const getAllMyUrl = async (req, res) => {
    logger.info(`GET: hitting All URL retrieval for User ${req.params.user_id}`)

    //check if auth block exist in request
    if (!req.get("Authorization")) {
        logger.error(`GET:Credentials not provided to authenticate`)

        return res.status(401).send("Unauthorized")
    }

    //decode auth
    const authenticatedUser = await authenticate(req, res)

    if (!isNaN(authenticatedUser)) {
        let urls = await Urls.findAll({ where: { user_id: authenticatedUser } })

        //check if urls exist
        if (urls != null) {
            logger.info(`GET: URLs for User ${req.params.user_id} is fetched`)
            return res.status(200).send(urls)
        } else {
            logger.error(`GET: URLs for User ${req.params.user_id} is Not found`)

            return res.status(404).send("Not Found")
        }
    }
}

// function to authenticate a user
async function authenticate(req, res) {
    // decrypt auth
    var basicAuth = Buffer.from(req.get("Authorization").split(" ")[1], "base64")
        .toString()
        .split(":")

    let user = await User.findOne({ where: { username: basicAuth[0] } })

    if (user) {
        const authenticated = await bcrypt.compare(basicAuth[1], user.password)
        if (authenticated) {
            if (basicAuth[0] == user.username) {
                return user.id
            } else {
                logger.error(`user ${basicAuth[0]} is forbidden to perform this action`)
                return res.status(403).send("Forbidden")
            }
        } else {
            logger.error(`user ${basicAuth[0]} is not authorized`)
            return res.status(401).send("Unauthorized")
        }
    } else {
        logger.error(`user ${basicAuth[0]} is not authorized`)
        return res.status(401).send("Unauthorized")
    }
}

module.exports = {
    customizeUrl,
    getOriginalUrl,
    getAllMyUrl,
}
