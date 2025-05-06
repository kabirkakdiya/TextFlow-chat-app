import { Box, Typography } from '@mui/material';
import React from 'react'
import moment from "moment";
import { motion } from "framer-motion"
import { serverUrl } from '../../constants/server-url'
const MessageItem = ({ message, user }) => { //details of currently logged in user.

    const { sender, content, attachments = [], createdAt } = message;

    const sameSender = sender._id === user._id;

    const time = moment(createdAt).fromNow();
    return (
        <motion.div initial={{ opacity: 0, x: "-100%" }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px",
                padding: "0.5rem",
            }}>
            {!sameSender && <Typography color={"#2694ab"} fontWeight={"600"} variant='caption'>{sender.name}</Typography>}

            {content && <Typography>{content}</Typography>}

            {attachments.length > 0 &&
                attachments.map((attachment, index) => {
                    return (
                        <Box key={index}>
                            <a href={`${serverUrl}/message/attachment/${attachment}`} target='_blank' download style={{ color: "black" }}>
                                <img src={`${serverUrl}/message/attachment/${attachment}`} alt='Attachment' width='200px' height='150px' style={{ objectFit: "contain" }} />
                            </a>
                        </Box>
                    );
                })}
            <Typography variant='caption' color='text.secondary'>{time}</Typography>
        </motion.div>
    )
}

export default MessageItem