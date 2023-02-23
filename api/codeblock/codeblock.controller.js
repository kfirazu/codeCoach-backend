const codeBlockService = require('../codeblock/codeblock.service')
const logger = require('../../services/logger.service')
const asyncLocalStorage = require("../../services/als.service.js")

async function getCodeBlocks(req, res) {
    try {
        const codeBlocks = await codeBlockService.query()
        res.send(codeBlocks)
    } catch (err) {
        logger.error('Failed to get code blocks', err)
        res.status(500).send({ err: 'Failed to get code blocks' })
    }
}

async function getCodeBlock(req, res) {
    try {
        const codeBlock = await codeBlockService.getCodeBlockById(req.params.id)
        res.send(codeBlock)
    } catch (err) {
        logger.error('Failed to get code block by id', err)
        res.status(500).send({ err: 'Failed to get code block' })

    }
}

async function update(req, res) {
    try {
        const codeBlock = req.body
        const updatedCodeBlock = await codeBlockService.updateCodeBlock(codeBlock)
        res.send(updatedCodeBlock)
    } catch (err) {
        logger.error('Failed to update code block', err)
        res.status(500).send({ err: 'Failed to update code block' })
    }
}

module.exports = {
    getCodeBlock,
    getCodeBlocks,
    update
}