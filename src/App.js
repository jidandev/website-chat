import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';

const socket = io('https://violet-grass-drug.glitch.me/');

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessages', (messages) => {
      console.log('Messages received from server:', messages);
      setMessages(messages);
    });

    socket.on('receiveMessage', (message) => {
      console.log('New message received from server:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    console.log('Sending message:', message);
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Real-Time Chat</h2>
        <div className="mb-4 overflow-y-auto h-64 border rounded p-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">{msg.text}</div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
