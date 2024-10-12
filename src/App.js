import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';
import axios from 'axios';

const socket = io('https://violet-grass-drug.glitch.me/'); // Ganti dengan URL Glitch kamu

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      console.log('New message received from server:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

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
      setLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error.response.data);
      alert(error.response.data.error);
    }
  };

  const sendMessage = async () => {
    const formData = new FormData();
    formData.append('image', image);
    const imagePath = image ? await uploadImage(formData) : null;

    const newMessage = {
      username,
      text: message,
      image: imagePath,
    };

    console.log('Sending message:', newMessage);
    socket.emit('sendMessage', newMessage);
    setMessage('');
    setImage(null);
  };

  const uploadImage = async (formData) => {
    try {
      const response = await axios.post('https://violet-grass-drug.glitch.me/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imagePath; // Kembalikan path gambar
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {!loggedIn ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Register / Login</h2>
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
              onClick={handleRegister}
              className="w-full bg-blue-500 text-white p-2 rounded mb-2"
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Real-Time Chat</h2>
            <div className="mb-4 overflow-y-auto h-64 border rounded p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.username}: </strong>
                  {msg.text}
                  {msg.image && <img src={msg.image} alt="Uploaded" className="w-32 mt-2" />}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              placeholder="Type a message..."
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border rounded p-2 mb-2"
            />
            <button
              onClick={sendMessage}
              className="w-full bg-blue-500 text-white p-2 rounded"
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
    
