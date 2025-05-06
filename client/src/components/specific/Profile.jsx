import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react'
import { Face as FaceIcon, CalendarMonth as CalendarIcon, Email as EmailIcon } from '@mui/icons-material'
import moment from 'moment';
import useAuthStore from '../../store/authStore';
import { serverUrl } from '../../constants/server-url';
const Profile = () => {
    const user = useAuthStore((state) => state.user)

    return (
        <Stack width={"100%"} direction={"column"} spacing={"2rem"} alignItems={"center"} padding={"2rem"} marginTop={"2rem"}>
            <Avatar src={`${serverUrl}/user/avatar/${user.avatar}`} sx={{
                height: 200,
                width: 200,
                objectFit: "contain",
                marginBottom: "1rem",
                border: "5px solid white"
            }} />
            <ProfileCard heading={"About"} text={user.about} />
            <ProfileCard heading={"Email"} text={user.email} Icon={<EmailIcon />} />
            <ProfileCard heading={"Name"} text={user.name} Icon={<FaceIcon />} />
            <ProfileCard heading={"Joined"}
                text={moment(user.createdAt).fromNow()}
                Icon={<CalendarIcon />} />
        </Stack >
    )
}

const ProfileCard = ({ Icon, heading, text }) => {
    return (
        <Stack direction={"row"} color={"white"} spacing={"1rem"} alignItems={"center"} textAlign={"center"}>

            {Icon && Icon}

            <Stack>  {/*to stack them vertically in a centered position given by previous stack  */}
                <Typography variant='body1'>{text}</Typography>
                <Typography color={"gray"} variant='caption'>{heading}</Typography>
            </Stack>
        </Stack>
    )
}

export default Profile
