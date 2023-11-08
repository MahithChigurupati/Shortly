// importing to hash passwords
const bcrypt = require("bcrypt")

// importing for timestamp generation
const moment = require("moment")

// for info/error logging to debug
const logger = require("../../logger")

// importing db models
const db = require("../models")

// importing ORM - sequelize
const sequelize = require("../models/index")

const User = db.users

// A dummy check method
const healthCheck = async (req, res) => {
    sequelize.sequelize.authenticate().then(() => {
        res.send("Connection established successfully.")
    })
}

// createUser method to create a new user
const createUser = async (req, res) => {}

//retrieveUser method to be executed on GET method call
const retrieveUser = async (req, res) => {}

// updateUser method to be called on PUT method call
const updateUser = async (req, res) => {}

//helper function to authenticate a user
async function authenticate(req, res) {}

module.exports = {
    createUser,
    retrieveUser,
    updateUser,
    healthCheck,
}
