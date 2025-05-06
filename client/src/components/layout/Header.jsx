import { AppBar, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { Search as SearchIcon, Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationsIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import SearchDialog from '../specific/SearchDialog'
import NotificationsDialog from '../specific/NotificationsDialog'
import NewGroupDialog from '../specific/NewGroupDialog'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import axios from 'axios'
import { serverUrl } from '../../constants/server-url'
import useOtherStore from '../../store/otherStore'
import useAlertStore from '../../store/alertStore'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
    const navigate = useNavigate();
    const userNotExists = useAuthStore((state) => state.userNotExists)
    const isSearch = useOtherStore((state) => state.isSearch)
    const setIsSearch = useOtherStore((state) => state.setIsSearch)
    const isNotification = useOtherStore((state) => state.isNotification)
    const setIsNotification = useOtherStore((state) => state.setIsNotification)
    const isNewGroup = useOtherStore((state) => state.isNewGroup)
    const setIsNewGroup = useOtherStore((state) => state.setIsNewGroup)
    const notificationCount = useAlertStore((state) => state.notificationCount)
    const resetNotificationCount = useAlertStore((state) => state.resetNotificationCount)
    const setIsProfile = useOtherStore((state) => state.setIsProfile)


    const openSearch = () => {
        setIsSearch(true);
    }
    const openProfileDrawer = () => {
        setIsProfile(true);
    }
    const openNewGroup = () => {
        setIsNewGroup(true);
    }

    const openNotification = () => {
        setIsNotification(true);
        resetNotificationCount();
    }

    const navigateToGroup = () => navigate("/groups");

    const logoutHandler = async () => {
        try {
            const response = await axios.get(`${serverUrl}/user/logout`, {
                withCredentials: true, //for storing cookies sent in the response.
            })
            userNotExists();
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    return (
        <>
            <Box height={"4rem"}>
                <AppBar position='static' sx={{ bgcolor: "#4e7ead" }}>
                    <Toolbar>
                        <Typography variant='h5'>TextFlow</Typography>

                        <Box sx={{ flexGrow: "1" }} /> {/*only to fill the space in the middle and push the final 'icons' box to the right.*/}
                        <Box>
                            {/* final icons */}
                            <IconBtn title={"Profile"} icon={<AccountCircleIcon />} onClick={openProfileDrawer} />
                            <IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearch} />
                            <IconBtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} />
                            <IconBtn title={"Manage Groups"} icon={<GroupIcon />} onClick={navigateToGroup} />
                            <IconBtn title={"Notifications"} icon={<NotificationsIcon />} onClick={openNotification} value={notificationCount} />
                            <IconBtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            {isSearch && <SearchDialog />}
            {isNotification && <NotificationsDialog />}
            {isNewGroup && <NewGroupDialog />}
        </>
    )
}


const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {value ? <Badge badgeContent={value} color='error'>{icon}</Badge> : icon}
            </IconButton>
        </Tooltip>
    )
}

export default Header