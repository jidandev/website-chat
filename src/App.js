import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';
import axios from 'axios';

const socket = io('https://violet-grass-drug.glitch.me/');

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('login'); // 'login' or 'register'
  const [token, setToken] = useState(null); // Token untuk otentikasi

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
    if (token && message) { // Pastikan user sudah login
      const userMessage = { username, text: message };
      socket.emit('sendMessage', userMessage);
      setMessage('');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://violet-grass-drug.glitch.me/register', {
        username,
        password,
      });
      console.log(response.data);
      alert('Registration successful! Please log in.'); // Pesan sukses
      setAction('login'); // After registering, switch to login
    } catch (error) {
      alert(error.response.data); // Tampilkan pesan error
      console.error('Registration error:', error.response.data); // Tampilkan pesan error di konsol
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://violet-grass-drug.glitch.me/login', {
        username,
        password,
      });
      console.log(response.data);
      setToken(response.data.token); // Simpan token
      alert('Login successful!'); // Pesan sukses
    } catch (error) {
      alert(error.response.data); // Tampilkan pesan error
      console.error('Login error:', error.response.data); // Tampilkan pesan error di konsol
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{action === 'login' ? 'Login' : 'Register'}</h2>

        {action === 'register' && (
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
              className="w-full border rounded p-2 mb-4"
              placeholder="Password"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Register
            </button>
            <p className="mt-2 text-center">
              Already have an account? 
              <span 
                className="text-blue-500 cursor-pointer"
                onClick={() => setAction('login')}
              > Login</span>
            </p>
          </div>
        )}

        {action === 'login' && (
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
              className="w-full border rounded p-2 mb-4"
              placeholder="Password"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>
            <p className="mt-2 text-center">
              Don't have an account? 
              <span 
                className="text-blue-500 cursor-pointer"
                onClick={() => setAction('register')}
              > Register</span>
            </p>
          </div>
        )}

        {action === 'login' && token && ( // Cek apakah sudah login
          <div>
            <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
            <div className="mb-4 overflow-y-auto h-64 border rounded p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">{msg.username}: {msg.text}</div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="w-full bg-green-500 text-white p-2 rounded"
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
                </div>
    </div>
  );
};

export default App;
    
