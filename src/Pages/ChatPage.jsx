import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CardMessage from '../components/Fragments/CardMessage';
const MAX_MESSAGE_LENGTH = 500; // Maksimal panjang pesan

const socket = io('https://violet-grass-drug.glitch.me/');
const ChatPage = () => {
  //VARIABEL
  const navigate = useNavigate();
  //state variable
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadPage, setLoadPage] = useState(false);
  const [userSend, setUserSend] = useState("");
  const [admins, setAdmins] = useState([]);
  const [imgUrl, setImgUrl] = useState(null)
  //variabel
  const token = localStorage.getItem('token'); 
  const apikey = 'ktsktsrylfktiydketkssto5838255022vswibu';
  const endMessageRef = useRef(null);
  localStorage.setItem('password', '');
  const urlApi = 'https://violet-grass-drug.glitch.me';

  //GET LIST ADMINS
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(urlApi + '/api/admins', {
          headers: {
            Authorization: apikey, // Menyertakan token dalam header
          },
        });
        setAdmins(response.data[0].list);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  // DELETE MESSAGE BY ID
  const handleDelete = async (id) => {
    try {
     await axios.delete(`${urlApi}/items/${id}`);
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    console.log(id)
  };

  //GET USER DATA
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(urlApi + '/user', {
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

  //VALIDASI TOKEN
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
        const response = await axios.post(urlApi + '/validateToken', { token });

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

  //PANTAU SOCKET.IO
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

  //POST MESSAGE
  const sendMessage = async () => {
    if (selectedImage) {
      const formData = new FormData();
        formData.append('image', selectedImage);
  
        try {
          const res = await fetch(urlApi + '/upload', {
            method: 'POST',
            body: formData
          });
  
          const data = await res.json();
     
          if (res.ok) {
            if(message) {
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
            }
            
            const userMessage = { username, text: message || "", image: data.imageUrl};
          
            socket.emit('sendMessage', userMessage);
          
            setMessage('');
            setSelectedImage(null); // Clear after upload
            setImgUrl(null);
          } else {
            console.error('Failed to upload image:', data);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
        
      } else if ( message && !selectedImage) {
      
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
      const userMessage = { username, text: message, image: ""};
      socket.emit('sendMessage', userMessage);
      setMessage('');
      setSelectedImage(null);
      setImgUrl(null);
      setUserSend(message);
    } else {
      alert('You need to be logged in to send messages!'); // Pesan jika user tidak login
    }
  };

  //DELETE MESSAGE
  useEffect(() => {
    // Mendengarkan event ketika item dihapus
    socket.on('itemDeleted', (id) => {
      console.log(`Item with id ${id} has been deleted.`);
      // Memperbarui state untuk menghapus item yang telah dihapus
      setMessages((prevItems) => prevItems.filter(item => item._id !== id));
    });
    // Cleanup saat komponen unmounted
    return () => {
      socket.off('itemDeleted');
    };
  }, [socket]);
  

  //FUNCTION AUTO SCROLL
  const scrollToBottom = () => {
    endMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    setTimeout(() => scrollToBottom(), 1000)
  }, [userSend])
  useEffect(() => {
    if(!loadPage) {
      scrollToBottom();
      setTimeout(() => {
        setLoadPage(true);
      }, 3000)

    }
  }, [messages]);

  //IMG THUMBNAIL
  useEffect(() => {
    if(selectedImage) {
    
    setImgUrl(URL.createObjectURL(selectedImage))
    }
  }, [selectedImage]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className='flex border-b-[1px] border-b-gray-700 fixed w-full bg-gray-900 z-10'>
      <Link onClick={() => {localStorage.removeItem('token');  localStorage.removeItem('password'); navigate('/login')}} className='text-slate-400 text-4xl mx-2 mt-1'><ion-icon name="arrow-back-outline"></ion-icon></Link>
      <h1 className='mt-2 font-bold text-slate-200 text-xl'>{username}</h1>
      </div>
      <div className="mt-12 ml-3 overflow-y-auto h-full text-white mb-16">
      {messages.map((msg, index) => (
          <CardMessage key={index}>
            <CardMessage.Image></CardMessage.Image>
            <CardMessage.Header msgUser={msg.username} username={username} admins={admins} handleDelete={handleDelete} id={msg._id}></CardMessage.Header>
            <CardMessage.Body text={msg.text} image={msg.image}></CardMessage.Body>
          </CardMessage>
        ))}
        <div ref={endMessageRef}></div>
      </div>
      <div className='flex fixed bottom-0 items-center justify-center bg-gray-900 w-full h-16 z-10 '>
      <button className='mr-2 overflow-hidden relative rounded-full bg-blue-600 w-9 h-9 md:w-10 md:h-10 ml-2 text-white text-xl px-[0.5rem] md:px-[0.7rem] py-[0.4rem] md:py-2' src='/vite.svg'>
      <ion-icon name="folder"></ion-icon>
      <input type="file" className='w-full h-full absolute left-0 top-0 opacity-0' onChange={(e) => setSelectedImage(e.target.files[0])}/>
        </button>
        <div className='w-64 h-10 md:h-12 sm:w-1/2 rounded-lg relative'>
        {imgUrl && (
          <div onClick={() => {setSelectedImage(null); setImgUrl(null);}} className='rounded group h-20 w-20 absolute left-0 -top-24 bg-black'>
            <img alt='uploaded' src={imgUrl} className='object-cover h-full w-full absolute left-0 top-0 opacity-100 group-hover:opacity-80'></img>
            <div className='text-white p-6 text-3xl opacity-0 group-hover:opacity-100 transition-all duration-200  w-full h-full'>
              <ion-icon name="trash"></ion-icon>
            </div>
          </div>
        )}
        <textarea
            type="text"
            value={message}
          
            onChange={(e) => setMessage(e.target.value)}
            className='bg-gray-700 border-0 w-full h-full rounded-lg text-white p-2'
            placeholder="Type your message..."
        />
        </div>
        <button onClick={() => {sendMessage(); }} className='rounded-full bg-blue-600 w-9 h-9 md:w-10 md:h-10 ml-2 text-white text-xl px-[0.6rem] md:px-[0.7rem] py-[0.4rem] md:py-2' src='/vite.svg'>
          <ion-icon name="send"></ion-icon>
        </button>
      </div>  
    </div>
  );
};

export default ChatPage;
