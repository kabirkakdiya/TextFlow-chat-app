import axios from 'axios'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { serverUrl } from '../constants/server-url'

const useChatsStore = create(devtools((set) => ({
    chats: [],
    error: null,
    fetchChats: async () => {
        set({ error: null })
        try {
            const response = await axios.get(`${serverUrl}/chat/my`, { withCredentials: true })
            set({ chats: response.data.chats })
        } catch (error) {
            set(state => ({ ...state, error: error.response?.data?.message || "Something went wrong" }))
        }
    },

    deleteChat: async (chatId) => {
        set({ error: null })
        try {
            const response = await axios.delete(`${serverUrl}/chat/${chatId}`, { withCredentials: true })
            if (response.data.success) {

            }
        } catch (error) {
            set(state => ({ ...state, error: error.response?.data?.message || "Something went wrong" }))
        }
    },

    leaveGroupChat: async (chatId) => {
        set({ error: null })
        try {
            const response = await axios.delete(`${serverUrl}/chat/leave/${chatId}`, { withCredentials: true })
            if (response.data.success) {
                set(state => ({ ...state, chats: state.chats.filter(chat => chat._id !== chatId) }))
            }
        } catch (error) {
            set(state => ({ ...state, error: error.response?.data?.message || "Something went wrong" }))
        }
    },
}), { name: "Chats Store" }))

export default useChatsStore;