const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await getUserCollection()
        let users = await collection.find({}).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = new ObjectId(user._id).getTimestamp()
            return user
        })
        return users

    }
    catch (err) {
        logger.error('Cannot get users from db', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await getUserCollection()
        const user = await collection.findOne({ _id: new ObjectId(userId) })
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

async function update(user) {
    try {
        const userToSave = {
            ...user,
            _id: ObjectId(user._id)
        }
        const collection = await getUserCollection()
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    } catch (err) {
        logger.error(`Cannot update user ${user}`, err)
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
    update
}