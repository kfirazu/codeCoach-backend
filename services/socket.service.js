const logger = require('./logger.service')
const codeBlockService = require('../api/codeblock/codeblock.service.js')
const userService = require('../api/user/user.service')

var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, { cors: { origin: '*' } })

    gIo.on('connection', (socket) => {
        logger.info(`New connected socket [id: ${socket.id}]`)

        socket.on('disconnect', (socket) => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })

        socket.on('set-code-block', async (codeBlockId, loggedInUser) => {
            if (socket.codeBlockId === codeBlockId) return
            // if (socket.codeBlockId) {
            //     const user = await userService.getById(loggedInUser._id)
            //     user.isMentor = false
            //     socket.leave(socket.codeBlockId)
            //     logger.info(`Socket is leaving codeblock ${socket.codeBlockId} [id: ${socket.id}]`)
            // }
            const connectedUsers = []
            const connectedUser = await userService.getByUserName(loggedInUser?.username)
            if (loggedInUser) {
                connectedUsers.push(connectedUser)
            }
            // Sets first user in room as mentor
            if (connectedUsers.length === 1) {
                connectedUsers[0].isMentor = true
                // Sets all other users isMentor key to false
            } else if (connectedUsers.length > 1) {
                connectedUsers.forEach((user, idx) => {
                    if (idx >= 1) user.isMentor = false
                })
            }
            socket.join(codeBlockId)
            socket.codeBlockId = codeBlockId
            const broadcastDetails = {
                type: 'user-connected',
                data: connectedUsers,
                room: codeBlockId,
                userId: loggedInUser._id
            }
            setTimeout(() => { broadcast(broadcastDetails) }, 1000)

            logger.info(`Socket is joining code block ${codeBlockId} [id: ${socket.id}]`)
        })

        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
            socket.join(userId)
        })

        socket.on('update-code-block', async (codeBlock, loggedInUser) => {
            logger.info(`Update code block from socket [id: ${socket.id}], emitting to code block ${codeBlock._id}`)
            const broadcastDetails = {
                type: 'update-code',
                data: codeBlock,
                room: codeBlock._id,
                userId: loggedInUser._id
            }
            broadcast(broadcastDetails)
            // gIo.to(socket.codeBlockId).emit('update-code', codeBlock)
        })

        socket.on('user-leave-room', ({ loggedInUser, codeBlockId }) => {
            if (socket.codeBlockId === codeBlockId) {
                socket.leave(socket.codeBlockId)
                logger.info(`Socket is leaving codeblock ${socket.codeBlockId} [id: ${socket.id}]`)
            } else {
                logger.warn(`Socket is not joined to room ${codeBlockId} [id: ${socket.id}]`);
            }
        })
    })
}

// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId?.toString()
    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)

    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find((s) => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}