
const CONST = require('./constModule')()

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: CONST.wsport });

wss.on('connection', function connection(ws, req) {

    console.log(`${CONST.prefix} ws connected. \nHeaders: \n${JSON.stringify(req.headers, null, 4)}`)

    ws.on('message', function incoming(message) {
        console.log(`${CONST.prefix} received: %s`, message);
        ws.send('echo:' + message)
    });

    ws.on('close', function close() {
        console.log(`${CONST.prefix} disconnected`);
    });

    ws.send(`connection established`);
});
