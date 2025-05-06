import axios from 'axios'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from './components/auth/ProtectedRoute'
import { serverUrl } from './constants/server-url'
import Chat from './pages/Chat'
import Groups from './pages/Groups'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import ChatManagement from './pages/admin/ChatManagement'
import Dashboard from './pages/admin/Dashboard'
import MessageManagement from './pages/admin/MessageManagement'
import UserManagement from './pages/admin/UserManagement'
import useAuthStore from './store/authStore'
import { SocketContextProvider } from './socket'


const App = () => {
  const isUser = useAuthStore((state) => state.user)
  const userExists = useAuthStore((state) => state.userExists)
  const userNotExists = useAuthStore((state) => state.userNotExists)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`${serverUrl}/user/profile`, { withCredentials: true })
        userExists(response.data.user)
      } catch (error) {
        userNotExists()
      }
    }
    fetchUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'
          element={<SocketContextProvider>
            <ProtectedRoute isUser={isUser}>
              <Home />
            </ProtectedRoute>
          </SocketContextProvider>} />

        <Route path='/chat/:chatId'
          element={<SocketContextProvider>
            <ProtectedRoute isUser={isUser}>
              <Chat />
            </ProtectedRoute>
          </SocketContextProvider>} />

        <Route path="/groups"
          element={<SocketContextProvider>
            <ProtectedRoute isUser={isUser}>
              <Groups />
            </ProtectedRoute>
          </SocketContextProvider>} />

        <Route path='/login'
          element={<ProtectedRoute isUser={!isUser} redirect='/'>
            <Login />
          </ProtectedRoute>} />

        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/users' element={<UserManagement />} />
        <Route path='/admin/chats' element={<ChatManagement />} />
        <Route path='/admin/messages' element={<MessageManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App
