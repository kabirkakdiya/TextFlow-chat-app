import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { io } from 'socket.io-client'
import { serverUrl } from '../constants/server-url'

const socket = io(serverUrl, { withCredentials: true });

const useSocketStore = create(() => {
    return {
        socket
    };
})

export default useSocketStore