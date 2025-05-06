import { Drawer, Grid2 as Grid } from '@mui/material'
import React, { useCallback, useContext, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events'
import { SocketContext } from '../../socket'
import useAlertStore from '../../store/alertStore'
import useChatsStore from '../../store/chatsStore'
import useOtherStore from '../../store/otherStore'
import ChatList from '../specific/ChatList'
import DeleteChatMenu from '../specific/DeleteChatMenu'
import Profile from '../specific/Profile'
import Header from './Header'

const AppLayout = ({ children }) => {
    const { chats, error, fetchChats } = useChatsStore()
    const socket = useContext(SocketContext)
    const incrementNotificationCount = useAlertStore((state) => state.incrementNotificationCount)
    const setIsDeleteMenu = useOtherStore((state) => state.setIsDeleteMenu)
    const navigate = useNavigate()
    console.log("App layout component ran")
    useEffect(() => {
        async function loadData() {
            await fetchChats(); console.log("fetchChats inside appLayout ran.")
            if (error) {
                toast.error(error)
            }
        }
        loadData();
    }, [error])

    const params = useParams(); //path parameters accessed using useParams() i.e. /chat/2993
    const chatId = params.chatId;
    const isProfile = useOtherStore(state => state.isProfile)
    const setIsProfile = useOtherStore(state => state.setIsProfile)
    const newMessagesAlert = useAlertStore((state) => state.newMessagesAlert)
    const setNewMessagesAlert = useAlertStore((state) => state.setNewMessagesAlert)
    const setSelectedDeleteChat = useOtherStore(state => state.setSelectedDeleteChat)
    const deleteMenuAnchor = useRef(null)

    socket.on("auth_error", (data) => {
        console.log("auth_error")
        toast.error(data.message);
    });

    const handleDeleteChat = (e, chatId, groupChat) => {
        e.preventDefault();
        deleteMenuAnchor.current = e.currentTarget;        // currentTarget refers to the element that the event handler is attached, regardless of the children who triggered the event.
        setSelectedDeleteChat({ chatId, groupChat })
        setIsDeleteMenu(true)
    }

    const newRequestListener = useCallback(() => { //memoized to prevent re-renders
        incrementNotificationCount();
    }, [])
    const newMessageAlertListener = useCallback((data) => {
        if (data.chatId === chatId) return;
        setNewMessagesAlert(data)
    }, [chatId])
    const refetchChatsListener = useCallback(() => { //memoized to prevent re-renders
        fetchChats();
        navigate("/");
        console.log("refetched chats")
    }, [fetchChats, navigate])

    useEffect(() => {
        socket.on(NEW_REQUEST, newRequestListener)
        socket.on(NEW_MESSAGE_ALERT, newMessageAlertListener)
        socket.on(REFETCH_CHATS, refetchChatsListener)    // this listens for all components inside it (Chat,Home,Header,etc.)

        return () => {
            socket.off(NEW_REQUEST, newRequestListener)
            socket.off(NEW_MESSAGE_ALERT, newMessageAlertListener)
            socket.off(REFETCH_CHATS, refetchChatsListener)
        }
    }, [socket, newRequestListener, newMessageAlertListener, refetchChatsListener])
    return (
        <>
            <Header />

            <DeleteChatMenu deleteMenuAnchor={deleteMenuAnchor} />

            <Drawer sx={{
                width: 350,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: 350,
                    height: "calc(100vh-4rem)",
                    top: "4rem",
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                },

            }} anchor='right' open={isProfile} onClose={() => setIsProfile(false)}>
                <Profile />
            </Drawer>

            <Grid container height={"calc(100vh - 4rem)"}>
                <Grid size={{
                    xs: 2,
                    sm: 4,
                    md: 3
                }} bgcolor={"rgb(255, 255, 255)"} height={"100%"}>
                    <ChatList chats={chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} />
                </Grid>
                <Grid size={{
                    xs: 10,
                    sm: 8,
                    md: 9,
                }} height={"100%"}>
                    {children}
                </Grid>
            </Grid >
        </>
    );
};

export default AppLayout