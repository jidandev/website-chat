import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Elements/Button';
const MAX_MESSAGE_LENGTH = 500; // Maksimal panjang pesan

const socket = io('https://violet-grass-drug.glitch.me/');

const ChatPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');


  
  //const [password, setPassword] = useState(localStorage.getItem('password') || '');
  //const [action, setAction] = useState('login'); // 'login' or 'register'
  //const [token, setToken] = useState(localStorage.getItem('token') || null); // Token untuk otentikasi
  localStorage.setItem('password', '');

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
        setUsername(response.data.username);
        
        
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [token]);
  //console.log(username)

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
    if ( message) {
      if (message.length > MAX_MESSAGE_LENGTH) {
        alert("Pesan terlalu panjang!");
        return false;
      }
  
      // Memeriksa pengulangan karakter berlebihan
      const repeatedCharRegex = /(.)\1{9,}/;
      if (repeatedCharRegex.test(message)) {
        alert("Pesan mengandung pengulangan karakter yang berlebihan!");
        return false;
      }
      const userMessage = { username, text: message };
      socket.emit('sendMessage', userMessage);
      setMessage('');
    } else {
      alert('You need to be logged in to send messages!'); // Pesan jika user tidak login
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className='flex border-b-[1px] border-b-gray-700 fixed w-full bg-gray-900 z-10'>
      <Link onClick={() => {localStorage.removeItem('token');  localStorage.removeItem('password'); navigate('/login')}} className='text-slate-400 text-4xl mx-2 mt-1'><ion-icon name="arrow-back-outline"></ion-icon></Link>
      <h1 className='mt-2 font-bold text-slate-200 text-xl'>{username}</h1>
      </div>
      <div className="mt-12 ml-3 overflow-y-auto h-full text-white mb-16">
              {messages.map((msg, index) => (
                <div key={index} className='mt-4'>
                  <img className='rounded-full bg-white w-8 h-8 float-left mt-0 mr-2 ' src='/vite.svg'></img>
                  <h1 className='mt-2 font-medium text-slate-200 text-md md:font-bold md:text-xl'>{msg.username} {admins.includes(msg.username) ? <span className=' text-blue-600'><ion-icon name="checkmark-circle"></ion-icon></span>: ""}</h1>
                  <pre className='break-words -mt-1  text-slate-300 text-md md:text-xl text-left ml-10 whitespace-pre-wrap font-sans'>{msg.text}</pre>
                </div>
              ))}
      </div>
      <div className='flex fixed bottom-0 items-center justify-center bg-gray-900 w-full h-16 z-10 '>
        <textarea
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-700 border-0 w-64 h-10 md:h-12 sm:w-1/2 rounded-lg p-3 text-white"
            placeholder="Type your message..."
        />
        <button onClick={() => sendMessage()} className='rounded-full bg-blue-600 w-9 h-9 md:w-10 md:h-10 ml-2 text-white text-xl px-[0.6rem] md:px-[0.7rem] py-2' src='/vite.svg'>
          <ion-icon name="send"></ion-icon>
        </button>
      </div>  
    </div>
  );
};

export default ChatPage;
