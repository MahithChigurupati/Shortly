const bcrypt = require("bcrypt")
const moment = require("moment")
const logger = require("../../logger")

const db = require("../models")
const sequelize = require("../models/index")

const User = db.users
const Url = db.urls

// create customized URL method to create a new shortly URL
const customizeUrl = async (req, res) => {}

//getUrl method to be executed on GET method call to get the original URL
const getUrl = async (req, res) => {}

//getAllMyUrl method to be executed on GET method call to get all the URLs created by a user
const getAllMyUrl = async (req, res) => {}

// function to authenticate a user
async function authenticate(req, res) {}

module.exports = {
    customizeUrl,
    getUrl,
    getAllMyUrl,
}
