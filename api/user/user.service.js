const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const collection = await getUserCollection()
        let users = await collection.find(filterBy).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
    }
    catch (err) {
        logger.error('Cannot get users from db', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await getUserCollection()
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`Error while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUserName(username) {
    try {
        const collection = await getUserCollection()
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`Error while finding user by username: ${username}`, err)
        throw err
    }
}

async function addUser(user) {
    try {
        const collection = await getUserCollection()
        await collection.insertOne(user)
        return user
    } catch (err) {
        logger.error('Cannot insert user', err)
        throw err

    }
}

async function getUserCollection() {
    return await dbService.getCollection('user')
}

module.exports = {
    query,
    getById,
    addUser,
    getByUserName,
}