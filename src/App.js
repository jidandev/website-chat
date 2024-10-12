import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';

const socket = io('https://violet-grass-drug.glitch.me/');

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    socket.on('receiveMessages', (messages) => {
      setMessages(messages);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    const data = {
      username,
      text: message,
      image: file ? `uploads/${Date.now()}-${file.name}` : null,
    };
    socket.emit('sendMessage', data);
    setMessage('');
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleLogin = () => {
    fetch('https://violet-grass-drug.glitch.me/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          alert('Login failed!');
        }
      });
  };

  const handleRegister = () => {
    fetch('https://violet-grass-drug.glitch.me/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Registration successful!');
        } else {
          alert('Registration failed!');
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {!isLoggedIn ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Login or Register</h2>
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
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded mb-2"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Register
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Real-Time Chat</h2>
            <div className="mb-4">
              {messages.map((msg, index) => (
                <div key={index} className="border-b py-2">
                  <strong>{msg.username}: </strong>
                  {msg.text}
                  {msg.image && <img src={msg.image} alt="uploaded" className="mt-2" />}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              placeholder="Type your message..."
            />
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
    
