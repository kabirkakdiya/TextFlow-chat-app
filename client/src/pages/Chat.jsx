import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import MessageItem from '../components/shared/MessageItem';
import { InputBox } from '../components/styles/StyledComponents';
import { gray } from '../constants/colour';
import { NEW_MESSAGE } from '../constants/events';
import { serverUrl } from '../constants/server-url';
import { SocketContext } from '../socket';
import useAlertStore from '../store/alertStore';
import useAuthStore from '../store/authStore';

const Chat = () => {
    const messagesEndRef = useRef(null)
    const params = useParams();
    const chatId = params.chatId;
    const socket = useContext(SocketContext)
    const user = useAuthStore((state) => state.user)

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([])
    const [members, setMembers] = useState([]) //chat members
    const [oldMessages, setOldMessages] = useState([]) //db messages
    const removeNewMessagesAlert = useAlertStore((state) => state.removeNewMessagesAlert)

    useEffect(() => { //to retrieve chat details with members and will run on mount.
        async function fetchChatDetails() {
            try {
                const response = await axios.get(`${serverUrl}/chat/${chatId}`, { withCredentials: true })
                setMembers(response.data.chat.members.map((member) => member._id)) //chat member ids only
            } catch (error) {
                console.log(error.response.data.message || "Error fetching chat members")
            }
        }
        fetchChatDetails()
    }, [chatId])

    useEffect(() => { //to retrieve old messages only 
        async function fetchOldMessages() {
            try {
                const response = await axios.get(`${serverUrl}/chat/message/${chatId}`, { withCredentials: true })
                setOldMessages(response.data.messages)
            } catch (error) {
                toast.error(error.response.data.message || "Error fetching old messages")
            }
        }
        fetchOldMessages()
    }, [chatId])

    useEffect(() => {    //for auto scroll
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, oldMessages]);

    const fileChangeHandler = async (e) => {
        const files = [...e.target.files]    // constructing an array from uploaded files

        if (files.length < 1)
            return;
        if (files.length > 5)
            return toast.error("You can only send 5 images at a time")

        try {
            const formData = new FormData();
            formData.append("chatId", chatId)
            files.forEach(file => formData.append("files", file))

            const response = await axios.post(`${serverUrl}/chat/message`, formData, { withCredentials: true })
            if (response.data.success) {
                toast.success("Image sent successfully")
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    const sendMessageHandler = (e) => {
        e.preventDefault()
        if (!message.trim()) return;

        //emitting msg to the server
        socket.emit(NEW_MESSAGE, { chatId, members, message })
        setMessage("")
    }

    useEffect(() => {      //just to empty all states when chatId changes, so that states will be set with completely new data of the changed chatId
        removeNewMessagesAlert(chatId);

        return () => {
            setMessages([]);
            setMessage("")
            setOldMessages([])
        }
    }, [chatId])

    const newMessageListener = useCallback((data) => { //memoized to prevent re-renders
        if (data.chatId !== chatId) return;

        setMessages(prev => [...prev, data.message])
    }, [chatId])
    useEffect(() => { //get new message from the server (socket)
        socket.on(NEW_MESSAGE, newMessageListener)

        return () => {
            socket.off(NEW_MESSAGE, newMessageListener)
        }
    }, [socket, newMessageListener])

    const allMessages = [...oldMessages, ...messages]
    return (
        <>
            <AppLayout>
                <Stack box-sizing={"border-box"} padding={"1rem"} spacing={"1rem"} height={"90%"} bgcolor={gray}
                    sx={{
                        overflowX: "hidden",
                        overflowY: "auto",
                    }}>
                    {allMessages.map((msg) => <MessageItem message={msg} user={user} key={msg._id} />)}

                    {/* scroll to here */}
                    <div ref={messagesEndRef} />
                </Stack>

                <form onSubmit={sendMessageHandler} style={{ height: "10%" }}>
                    <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"} bgcolor={"white"}> {/*position is relative to be able to set icons positions as relative to the Stack*/}
                        <IconButton sx={{
                            position: "absolute",
                            left: "1.5rem",
                            rotate: "30deg"
                        }} component='label'>
                            <AttachFileIcon />
                            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => fileChangeHandler(e)} />
                        </IconButton>

                        <InputBox placeholder='Type Message Here...' value={message} onChange={(e) => setMessage(e.target.value)} />

                        <IconButton type='submit' sx={{
                            bgcolor: "#5a8add",
                            color: "white",
                            marginLeft: "1rem",
                            "&:hover": {
                                bgcolor: "primary.dark"
                            }
                        }}>
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </form>
            </AppLayout>
        </>
    )
}

export default Chat