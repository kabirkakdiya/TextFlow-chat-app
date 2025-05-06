import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React from 'react';
import { serverUrl } from '../../constants/server-url';

const UserItem = ({ user, handler, isAddedInGroup = false, styling }) => {

    const { name, _id, avatar } = user;

    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} {...styling}>

                <Avatar src={`${serverUrl}/user/avatar/${avatar}`} />

                <Typography width={"100%"}>{name}</Typography>

                <IconButton size='small' sx={{
                    color: "white",
                    bgcolor: isAddedInGroup ? "error.main" : "primary.main",
                    "&:hover": {
                        bgcolor: isAddedInGroup ? "error.dark" : "primary.dark"
                    }
                }} onClick={() => handler(_id)}>

                    {isAddedInGroup ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
            </Stack>
        </ListItem >
    )
}

export default UserItem