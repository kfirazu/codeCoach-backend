const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await _getCodeBlockCollection()
        const codeBlocks = await collection.find({}).toArray()
        return codeBlocks
    } catch (err) {
        logger.error('Cannot get code blocks from db', err)
        throw err
    }
}

async function getCodeBlockById(codeBlockId) {
    try {
        const collection = await _getCodeBlockCollection()
        const codeBlock = await collection.findOne({ _id: new ObjectId(codeBlockId) })
        return codeBlock
    } catch (err) {
        logger.error(`Cannot get code block by id: ${codeBlockId}`, err)
        throw err
    }
}

async function updateCodeBlock(codeBlock) {
    try {
        const codeBlockToSave = {
            ...codeBlock,
            _id: new ObjectId(codeBlock._id)
        }
        const collection = await _getCodeBlockCollection()
        await collection.updateOne({ _id: codeBlockToSave._id }, { $set: codeBlockToSave })
        return codeBlock
        // return { msg: 'Code block updated successfully' }
    } catch (err) {
        logger.error(`Cannot update code block: ${codeBlock}`, err)
        throw err
    }
}

async function _getCodeBlockCollection() {
    return await dbService.getCollection('codeblock')
}

module.exports = {
    query,
    getCodeBlockById,
    updateCodeBlock
}