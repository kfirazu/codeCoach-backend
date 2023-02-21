const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const cryptr = new Cryptr(process.env.SECRET1 || 'K2kuDIP')

async function login(username, password) {
    try {
        logger.debug(`auth.service - login with email: ${username}`)
        const user = await userService.getByUserName(username)
        if (!user) return Promise.reject('Invalid email or password')
        const match = await bcrypt.compare(password, user.password)
        if (!match) return Promise.reject('Invalid email or password')
        delete user.password
        user._id = user._id.toString()
        return user
    } catch (err) {
        throw err
    }
}

async function signup({ username, password }) {
    // Could also accept email, firstName, lastName as props
    try {
        const saltRounds = 10
        logger.debug(`auth.service - signup with username: ${username}`)
        if (!username || !password) return Promise.reject('Missing required signup information')

        const userExist = await userService.getByUserName(username)
        if (userExist) return Promise.reject('Username is already taken')

        const hash = await bcrypt.hash(password, saltRounds)
        return userService.addUser({ username, password: hash })
        // If app manages a user with different permissions add a boolean to add user. like isAdmin: false

    } catch (err) {
        throw err
    }
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedInUser = JSON.parse(json)
        return loggedInUser
    } catch (err) {
        console.log('Invalid login token', err)
    }
}

module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}
