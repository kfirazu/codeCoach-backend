const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })

    }
}

async function updateUser(req, res) {
    try {
        const user = req.body
        await userService.update(user)
        res.send({ msg: 'User updated successfully' })
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })

    }
}

async function addUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.addUser(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to add user', err)
        res.status(500).send({ err: 'Failed to add user' })
    }
}


module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser
}