import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Elements/Button';

const socket = io('https://violet-grass-drug.glitch.me/');

const ChatPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  //const [password, setPassword] = useState(localStorage.getItem('password') || '');
  //const [action, setAction] = useState('login'); // 'login' or 'register'
  //const [token, setToken] = useState(localStorage.getItem('token') || null); // Token untuk otentikasi
  localStorage.setItem('password', '');
  const [tierUser, setTier] = useState(0);
  const token = localStorage.getItem('token'); // Mengambil token dari localStorage

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('https://violet-grass-drug.glitch.me/api/admins'); // Ganti dengan URL server kamu jika diperlukan
        const data = await response.json();
        setAdmins(data[0].list);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://violet-grass-drug.glitch.me/user', {
          headers: {
            Authorization: token, // Menyertakan token dalam header
          },
        });
        setTier(response.data.tier);
        
        
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [token]);
  //console.log(tierUser)

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        navigate('/login');
        return;
      }
      try {
        // Kirim token ke backend untuk divalidasi
        const response = await axios.post('https://violet-grass-drug.glitch.me/validateToken', { token });

        // Jika token tidak valid, arahkan ke login
        if (!response.data.valid) {
          console.log(localStorage.getItem('token'))
          console.log(response.data)
          localStorage.removeItem('token'); // Hapus token palsu
          navigate('/login');
          
        }
      } catch (error) {
        // Jika ada error saat validasi token, arahkan ke login
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkToken();
  }, [navigate]);

  useEffect(() => {
    // Menerima pesan ketika komponen terpasang
    socket.on('receiveMessages', (messages) => {
      setMessages(messages);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Membersihkan listener saat komponen tidak lagi terpasang
      socket.off('receiveMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if ( message) { // Pastikan user sudah login
      const userMessage = { username, text: message };
      socket.emit('sendMessage', userMessage);
      setMessage('');
    } else {
      alert('You need to be logged in to send messages!'); // Pesan jika user tidak login
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className='flex'>
      <Button onClick={() => {localStorage.removeItem('token'); localStorage.removeItem('username'); localStorage.removeItem('password'); navigate('/login')}} classname='m-3 bg-black'>Logout</Button>
      <h1 className='mt-5 font-bold'>{username}</h1>
      </div>
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md m-auto">
          <div>
            <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
            <div className="mb-4 overflow-y-auto h-64 border rounded p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">{msg.username} {admins.includes(msg.username) ? <span className=' text-blue-600'><ion-icon name="checkmark-circle"></ion-icon></span>: ""}: {msg.text}</div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              placeholder="Type your message..."
            />
            <Button classname='w-full bg-black' onClick={() => sendMessage()}>Send</Button>
          </div>
      
      </div>
    </div>
  );
};

export default ChatPage;