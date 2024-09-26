const socketIO = require('socket.io');
let io;
const socketService = require("../../services/socketService");

function initialize(server) {
    io = socketIO(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socketService.handleSocketEvents(socket);
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });

        socket.on('exampleEvent', (data) => {
            console.log('Received exampleEvent with data:', data);
        });

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    });

    io.on('error', (err) => {
        console.error('Socket.io error:', err);
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

module.exports = {
    initialize,
    getIO,
};
