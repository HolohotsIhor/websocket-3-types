import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Message } from '../types/message.ts';

export const LongPulling = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [value, setValue] = useState<string>('');

    const handleClick = async () => {
        await axios.post<void, Message>('http://localhost:5000/new-message', {
            text: value,
            id: `${Date.now()}-${Math.random()}`
        })
        console.log('Need reset message')
        setValue('')
    }

    const subscribe = async () => {
        try {
           const { data } = await axios.get<Message[], void>('http://localhost:5000/get-message')
           setMessages(prev => [...prev, data])
           // Subscribe after new message. Recursion.
           await subscribe()
        } catch(e) {
            setTimeout(() => subscribe(), 1000)
        }
    }

    useEffect(() => {
        subscribe()
    }, []);

    return (
        <>
            <div className='form'>
                <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <button onClick={handleClick}>Send</button>
            </div>
            <div className='messages'>
                {
                    messages.map(message =>
                        <div key={message.id}>{message.text}</div>
                    )}
            </div>
        </>
    );
}
