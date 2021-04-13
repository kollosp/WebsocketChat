const CONST = require('./constModule')()

const WebSocket = require('ws');
const process = require('process');

const connectionPath = `ws://${CONST.wsdomain}:${CONST.wsport}/${CONST.wspath}`

console.log(`${CONST.prefix} connecting to the server at: ${connectionPath}`)

const ws = new WebSocket(connectionPath);

ws.on('open', function open() {
    console.log(`${CONST.prefix} port opened. waiting for hello message...`)
    //ws.send('test message');
});

let i=1

ws.on('message', function incoming(data) {
    console.log(`${CONST.prefix} received ${data.toString()}`)
    if(i <= CONST.messageCount) {
        console.log(`${CONST.prefix} pinging... ${i}/${CONST.messageCount}`)
        ws.send('test message')
    }
    else{
        ws.close()
        process.exit(0)
    }
    i++
});
