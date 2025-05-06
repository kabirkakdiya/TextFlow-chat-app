import { Stack } from '@mui/material';
import React from 'react';
import ChatItem from '../shared/ChatItem';

const ChatList = ({ chats = [], chatId,
    newMessagesAlert = [
        { chatId: "", count: 0 }
    ],
    handleDeleteChat }) => {

    return (
        <>
            <Stack width={"100%"} height="100%" overflow="auto">
                {chats.map((data, index) => {
                    const { avatar, name, _id, groupChat } = data;

                    const newMessageAlert = newMessagesAlert.find(
                        (alert) => alert.chatId == _id);

                    return <ChatItem
                        index={index}
                        newMessageAlert={newMessageAlert}
                        avatar={avatar}
                        name={name}
                        _id={_id}
                        key={_id}
                        groupChat={groupChat}
                        sameSender={chatId === _id}
                        handleDeleteChat={handleDeleteChat} />;
                })}
            </Stack>
        </>
    )
}

export default ChatList