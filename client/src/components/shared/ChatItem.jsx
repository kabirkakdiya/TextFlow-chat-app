import { Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from '../styles/StyledComponents'
import AvatarCard from './AvatarCard'
import { motion } from "framer-motion"
const ChatItem = ({ avatar = [], name, _id, groupChat = false, sameSender, newMessageAlert, index, handleDeleteChat }) => {
    return (

        <Link sx={{
            padding: "0"
        }} to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>

            <motion.div initial={{ opacity: 0, y: "-100%" }} whileInView={{ opacity: 1, y: 0 }}
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: sameSender ? "black" : "unset",
                    color: sameSender ? "white" : "unset",
                    position: "relative",
                }}>
                <AvatarCard avatar={avatar} />
                <Stack>
                    <Typography>{name}</Typography>
                    {newMessageAlert && <Typography>{newMessageAlert.count} new message</Typography>}
                </Stack>
            </motion.div>
        </Link>
    )
}

export default ChatItem