import { useRef, useState } from 'react'

export const WebSocketChat = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')
    const socket = useRef()

    const handleSendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    const handleConnect = () => {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [...prev, message])
        }

        socket.current.onclose = () => {
            console.log('closed')
        }

        socket.current.onerror = () => {
            console.log('error')
        }
    }

    if (!connected) {
        return (
            <div>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type='text'
                    placeholder='Please, input your name'/>
                <button onClick={handleConnect}>Login</button>
            </div>
        )
    }

    return (
        <div>
            <div className='form'>
                <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    type='text'
                    placeholder='Type your message'/>
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div className='messages'>
                {messages.map(item =>
                    <div className='message' key={item.id}>
                        {item.event === 'connection'
                            ? <div>User {item.username} connected.</div>
                            : <div><b>{item.username}:</b> {item.message}</div>
                        }
                    </div>
                )}
            </ div>
        </div>
    )
}
