const express = require('express')
const { getUsers, getUser, addUser } = require('./user.controller')
const router = express.Router()


router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', addUser)

module.exports = router