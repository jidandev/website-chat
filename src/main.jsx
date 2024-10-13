import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import ErrorPage from './Pages/404'
import ChatPage from './Pages/ChatPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatPage />,
    errorElement: <ErrorPage />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
