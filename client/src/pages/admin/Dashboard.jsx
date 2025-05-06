import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, ModeComment, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { serverUrl } from '../../constants/server-url'
import moment from 'moment'

const Appbar = (
    <Paper elevation={3} sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1rem"
    }}>
        <Stack direction='row' alignItems={'center'} spacing={'1rem'}>
            <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />

            <Typography variant='h4' padding={"0 0.5rem"} textTransform={'uppercase'}>Admin  Panel</Typography>
            <Box flexGrow="1" />
            <Typography display={{ xs: "none", lg: "block" }} color='rgba(0,0,0,0.75)' textAlign={'center'}>{moment().format("dddd, D MMMM YYYY")}</Typography>
            <NotificationsIcon />
        </Stack>

    </Paper>
)

const Dashboard = () => {
    const [stats, setStats] = useState({});
    useEffect(() => {
        async function fetchDashboardStats() {
            try {
                const response = await axios.get(`${serverUrl}/admin/stats`, { withCredentials: true })
                if (response.data.success) {
                    setStats(response.data.stats)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchDashboardStats()
    }, [])
    return (
        <AdminLayout>
            <Container component="main">
                {Appbar}

                {/* Widgets */}
                <Stack direction={{
                    lg: "row",
                    md: "column"
                }} justifyContent="space-between" alignItems={"center"} margin={"2rem 1.5rem"}>
                    <Widget title="Users" value={stats.usersCount || "No Data"} Icon={<PersonIcon />} />
                    <Widget title="Chats" value={stats.chatsCount || "No Data"} Icon={<GroupIcon />} />
                    <Widget title="Messages" value={stats.messagesCount || "No Data"} Icon={<MessageIcon />} />
                </Stack>
            </Container>
        </AdminLayout>
    )
}

const Widget = ({ title, value, Icon }) => {
    return (
        <Paper sx={{
            padding: "2rem",
            margin: "2rem 0",
            borderRadius: "1.5rem",
            width: "17rem"
        }}>
            <Stack alignItems={'center'} spacing={'1rem'}>
                <Typography sx={{
                    color: "black",
                    borderRadius: "50%",
                    border: "5px solid black",
                    width: "5rem",
                    height: "5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>{value}</Typography>
                <Stack direction={'row'} spacing='1rem' alignItems='center'>
                    {Icon}
                    <Typography>{title}</Typography>
                </Stack>
            </Stack>
        </Paper>
    )
}
export default Dashboard