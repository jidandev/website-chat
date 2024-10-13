import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter,Navigate,RouterProvider} from 'react-router-dom'
import ErrorPage from './Pages/404'
import ChatPage from './Pages/ChatPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Mengembalikan true jika token ada
};

const router = createBrowserRouter([
  {
    path: '/',
    element: isAuthenticated() ? <ChatPage /> : <Navigate to="/login" />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
