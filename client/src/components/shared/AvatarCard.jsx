import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'
import { serverUrl } from '../../constants/server-url'

const AvatarCard = ({ avatar = [], max = 4 }) => {
    return (
        <Stack direction={"row"} spacing={"0.5"}>

            <AvatarGroup max={max} sx={{
                position: "relative"
            }}>
                <Box width={"5rem"} height={"3rem"}>
                    {avatar.map((i, index) => (
                        <Avatar key={index} src={`${serverUrl}/user/avatar/${i}`} alt={`Avatar ${index}`}
                            sx={{
                                width: "3rem",
                                height: "3rem",
                                position: "absolute",
                                left: {
                                    xs: `${0.5 + index}rem`, //because if more than one avatars are there, then they will be spaced equally without overlapping.
                                    sm: `${index}rem`
                                },
                            }} />
                    ))
                    }
                </Box>
            </AvatarGroup>
        </Stack>
    )
}

export default AvatarCard