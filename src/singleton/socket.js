import io from 'socket.io-client'

const socketConnection = io('localhost:5030');

export default socketConnection;