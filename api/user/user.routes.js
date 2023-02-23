const express = require('express')
const { getUsers, getUser, addUser, updateUser } = require('./user.controller')
const router = express.Router()


router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.post('/', addUser)


module.exports = router