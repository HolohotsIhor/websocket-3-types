import express from 'express'
import cors from 'cors'
import events from 'events'

const PORT = 5000
const app = express()
const emitter = new events.EventEmitter()

app.use(cors())
app.use(express.json())

app.get('/get-message', (req, res) => {
    emitter.once('newMessage', (message) => {
        res.json(message)
    })
})

app.post('/new-message', (req, res) => {
    const message = req.body

    emitter.emit('newMessage', message)
    res.status(200)
})

// TODO: need to remove
app.listen(PORT, () => console.log(`server start on port ${PORT}`))
