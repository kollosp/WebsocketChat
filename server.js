require('./logger')

const CONST = require('./constModule')()

const WebSocket = require('ws');
const http = require('http');
let wss;
let httpServer;


if(CONST.httpServer) {
    console.log("Run websocket server stand alone")
    wss = new WebSocket.Server({port: CONST.wsport});
}else{
    console.log("Run websocket server on http server")
    httpServer = http.createServer();
    wss = new WebSocket.Server({noServer: true});

    httpServer.on('')

    httpServer.on('upgrade', function upgrade(request, socket, head) {
        console.log("Received upgrade.")

        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    })

    httpServer.listen(CONST.wsport)
}

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
