require('./logger')

const CONST = require('./constModule')()

console.log("Run websocket server stand alone")

const WebSocket = require('ws');
const http = require('http');
let wss;
let httpServer;


if(!CONST.httpServer) {
    console.log(`${CONST.prefix}  Run websocket server stand alone`)
    wss = new WebSocket.Server({port: CONST.wsport});
}else{
    console.log(`${CONST.prefix} Run websocket server on http server`)

    httpServer = http.createServer((req, res)=> {
        console.log(`${CONST.prefix} Http message received`)
        console.log(`${CONST.prefix} Headers: \n${JSON.stringify(req.headers, null, 4)}`)
        console.log(`${CONST.prefix} RawHeaders: \n${JSON.stringify(req.rawHeaders, null, 4)}`)
        console.log(`${CONST.prefix} Req : ${Object.keys(req)}`)
        console.log(`${CONST.prefix} Upgrade : ${req.upgrade}`)
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Hello World!');
        res.end();
    });

    wss = new WebSocket.Server({noServer: true});

    httpServer.on('upgrade', function upgrade(request, socket, head) {
        console.log(`${CONST.prefix} Received upgrade.`)

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
