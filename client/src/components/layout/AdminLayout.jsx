import { Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Message as MessageIcon } from '@mui/icons-material';
import { Grid, Stack, styled, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom';
import { serverUrl } from '../../constants/server-url';
import useAuthStore from '../../store/authStore';

const Link = styled(LinkComponent)`
    text-decoration: none;
    border-radius: 2rem;
    padding: 1rem 2rem;
    color: black;
    &:hover {
    color: rgba(0,0,0,0.54);
    }
`;

const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon />
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupsIcon />
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />
    },
]
const Sidebar = () => {
    const location = useLocation();
    const setIsAdmin = useAuthStore(state => state.setIsAdmin)
    const logoutHandler = async () => {
        try {
            const response = await axios.get(`${serverUrl}/admin/logout`, { withCredentials: true })
            if (response.data.success) {
                setIsAdmin(false)
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    return (
        <Stack width={"100%"} padding={"3rem"} spacing={"3rem"}>
            <Typography variant='h5' textTransform={'uppercase'}>TextFlow</Typography>

            <Stack spacing={"1rem"}>
                {adminTabs.map((tab) => (
                    <Link key={tab.path} to={tab.path} sx={location.pathname === tab.path && {
                        bgcolor: "#1c1c1c",
                        color: "white",
                        ":hover": { color: "white" },
                    }}>
                        <Stack direction='row' alignItems={'center'} spacing={'1rem'}>
                            {tab.icon}

                            <Typography>{tab.name}</Typography>
                        </Stack>
                    </Link>
                ))}

                <Link onClick={logoutHandler} >
                    <Stack direction='row' alignItems={'center'} spacing={'1rem'}>
                        <ExitToAppIcon />

                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    )
}


const AdminLayout = ({ children }) => {
    const isAdmin = useAuthStore(state => state.isAdmin)

    if (!isAdmin) return <Navigate to='/admin' />

    return (
        <Grid container height={"100vh"}>
            <Grid item sm={3} md={4} lg={3}>
                <Sidebar />
            </Grid>

            <Grid item sm={9} md={8} lg={9} bgcolor="#f5f5f5">
                {children}
            </Grid>
        </Grid>
    )
}

export default AdminLayout