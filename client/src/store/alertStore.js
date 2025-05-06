import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useAlertStore = create(devtools((set, get) => ({
    notificationCount: 0,
    newMessagesAlert: [
        {
            chatId: "",
            count: 0
        }
    ],
    incrementNotificationCount: () => set((state) => ({ notificationCount: state.notificationCount + 1 })),
    resetNotificationCount: () => set({ notificationCount: 0 }),
    setNewMessagesAlert: (data) => {
        const state = get()      //get the current state
        const index = state.newMessagesAlert.findIndex((item) => item.chatId === data.chatId)

        if (index === -1) {      //chatId does not exist
            set((state) => {
                return { newMessagesAlert: [...state.newMessagesAlert, { chatId: data.chatId, count: 1 }] }
            })
        } else {      //chatId exists, so increment count
            set((state) => {
                const updatedAlerts = [...state.newMessagesAlert];      //copy as it is
                updatedAlerts[index] = {          //replace the object with updated count
                    ...updatedAlerts[index],
                    count: updatedAlerts[index].count + 1
                };
                return { newMessagesAlert: updatedAlerts }
            })
        }
    },

    removeNewMessagesAlert: (chatId) => {     //to remove newMessageAlert when chatId is same as user is chatting with
        const state = get();
        const updatedAlerts = state.newMessagesAlert.filter(item => item.chatId !== chatId)
        set({ newMessagesAlert: updatedAlerts })
    }
}), { name: "Alert Store" }))

export default useAlertStore