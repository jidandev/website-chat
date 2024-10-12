import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './index.css';

const socket = io('https://violet-grass-drug.glitch.me/');

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('sendMessage', { text: message, username });
      setMessage('');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://violet-grass-drug.glitch.me/register', { username, password });
      alert(response.data.message);
    } catch (error) {
      console.error('Registration error:', error.response.data);
      alert(error.response.data.error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://violet-grass-drug.glitch.me/login', { username, password });
      alert(response.data.message);
      setLoggedIn(true); // Set loggedIn ke true jika login berhasil
    } catch (error) {
      console.error('Login error:', error.response.data);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Real-Time Chat</h2>
        {!loggedIn ? (
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              placeholder="Password"
            />
            <button onClick={handleRegister} className="w-full bg-green-500 text-white p-2 rounded mb-2">
              Register
            </button>
            <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">
              Login
            </button>
          </div>
        ) : (
          <div className="mb-4 overflow-y-auto h-64 border rounded p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.username}: </strong>{msg.text}
              </div>
            ))}
          </div>
        )}
        {loggedIn && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;
