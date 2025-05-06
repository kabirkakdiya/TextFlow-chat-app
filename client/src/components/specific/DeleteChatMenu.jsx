import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material'
import { Menu, Stack, Typography } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useChatsStore from '../../store/chatsStore'
import useOtherStore from '../../store/otherStore'

const DeleteChatMenu = ({ deleteMenuAnchor }) => {
    const navigate = useNavigate();
    const isDeleteMenu = useOtherStore(state => state.isDeleteMenu)
    const setIsDeleteMenu = useOtherStore(state => state.setIsDeleteMenu)
    const selectedDeleteChat = useOtherStore(state => state.selectedDeleteChat)
    const deleteChat = useChatsStore(state => state.deleteChat)
    const leaveGroupChat = useChatsStore(state => state.leaveGroupChat)


    const closeHandler = () => {
        setIsDeleteMenu(false)
        deleteMenuAnchor.current = null;
    }

    const leaveGroupHandler = async () => {
        closeHandler();
        await leaveGroupChat(selectedDeleteChat.chatId)
        toast.success("Group left")
        navigate("/")
    }
    const deleteChatHandler = async () => {
        closeHandler()
        await deleteChat(selectedDeleteChat.chatId)
        toast.success("Chat deleted")
        navigate("/")
    }
    return (
        <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "center", horizontal: "center", }}
            PaperProps={{
                sx: {
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                },
            }}>

            <Stack sx={{
                width: "10rem",
                padding: "0.5rem",
                cursor: "pointer",
                "&:hover": {
                    bgcolor: "rgba(226, 82, 82, 0.89)"
                },
            }} direction="row" alignItems={"center"} spacing={"0.5rem"}
                onClick={selectedDeleteChat.groupChat ? leaveGroupHandler : deleteChatHandler}>
                {
                    selectedDeleteChat.groupChat ?
                        <>
                            <ExitToAppIcon />
                            <Typography>Leave Group</Typography>
                        </> :
                        <>
                            <DeleteIcon />
                            <Typography>Delete Chat</Typography> {/* unfriend a user*/}
                        </>
                }
            </Stack>
        </Menu >
    )
}

export default DeleteChatMenu