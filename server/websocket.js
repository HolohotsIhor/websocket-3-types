import { WebSocketServer } from 'ws'

const PORT = 5000
const wss = new WebSocketServer(
    { port: PORT },
    () => {console.log(`Server started on port ${PORT}`)})

const broadcastMessage = (message) => {
    wss.clients.forEach(client =>   {
        client.send(JSON.stringify(message))
    })
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)

        switch(message.event) {
            case 'message':
                broadcastMessage(message)
                break

            case 'connection':
                broadcastMessage(message)
                // Some other logic for connection
                break

            default:
                console.log(`Received unknown event: ${message.event}`)
        }
    })
})


