import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useAuthStore = create(devtools((set) => ({
    user: null,
    isAdmin: false,
    userExists: (user) => set((state) => ({ ...state, user: user })),
    userNotExists: () => set((state) => ({ ...state, user: null })),
    setIsAdmin: (value) => set({ isAdmin: value })
}), { name: "Auth Store" }))

export default useAuthStore;