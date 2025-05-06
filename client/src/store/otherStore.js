import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useOtherStore = create(devtools((set) => ({
    isProfile: false,
    isNewGroup: false,
    isAddMemberInGroup: false,
    isNotification: false,
    isSearch: false,
    isDeleteMenu: false,
    selectedDeleteChat: {
        chatId: "",
        groupChat: false,
    },
    setIsProfile: (value) => set({ isProfile: value }),
    setIsNewGroup: (value) => set({ isNewGroup: value }),
    setIsAddMemberInGroup: (value) => set({ isAddMemberInGroup: value }),
    setIsNotification: (value) => set({ isNotification: value }),
    setIsSearch: (value) => set({ isSearch: value }),
    setIsDeleteMenu: (value) => set({ isDeleteMenu: value }),
    setSelectedDeleteChat: (value) => set({ selectedDeleteChat: value }),
}), { name: "Other Store" }))

export default useOtherStore;