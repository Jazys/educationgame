import io from 'socket.io-client'
var W3CWebSocket = require('websocket').w3cwebsocket;

/*var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
    "timeout" : 10000, //before connect_error and connect_timeout are emitted.
    "transports" : ["websocket"]
};*/

var socketConnection=null;
const useSocketIo=false;

if(!useSocketIo)
    socketConnection = new W3CWebSocket('ws://192.168.1.26:9091','');
else
    socketConnection = io('http://192.168.1.3:9092');

export default socketConnection;