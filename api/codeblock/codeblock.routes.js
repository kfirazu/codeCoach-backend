const express = require('express')
const { getCodeBlock, getCodeBlocks, update } = require('./codeblock.controller')
const router = express.Router()


router.get('/', getCodeBlocks)
router.get('/:id', getCodeBlock)
router.put('/:id', update)

module.exports = router
