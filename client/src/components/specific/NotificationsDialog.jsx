import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { serverUrl } from '../../constants/server-url'
import useOtherStore from '../../store/otherStore'

const NotificationsDialog = () => {
    const [notifications, setNotifications] = useState([])
    const isNotification = useOtherStore((state) => state.isNotification)
    const setIsNotification = useOtherStore((state) => state.setIsNotification)

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const response = await axios.get(`${serverUrl}/user/notifications`, { withCredentials: true })
                setNotifications(response.data.requests)
                console.log("received notification");
            } catch (error) {
                toast.error(error.response.data.message)
            }

        }
        fetchNotifications()
    }, [])

    const friendRequestHandler = async ({ _id, accept }) => {  //object
        setIsNotification(false)           //close the notifications dialog as soon as user clicks
        try {
            const response = await axios.put(`${serverUrl}/user/accept-request`, { requestId: _id, acceptStatus: accept }, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong.")
            console.log(error)
        }

    }

    return (
        <Dialog open={isNotification} onClose={() => setIsNotification(false)}>
            <Stack width={"25rem"}>
                <DialogTitle textAlign='center'>Notifications</DialogTitle>

                {
                    notifications.length > 0 ? (
                        notifications.map(i => (
                            <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id} />
                        ))
                    ) : <Typography textAlign={"center"}>No new notifications</Typography>
                }
            </Stack>
        </Dialog>
    )
}

const NotificationItem = ({ sender, _id, handler }) => {
    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>

                <Avatar src={`${serverUrl}/user/avatar/${sender.avatar}`} />
                <Typography width={"100%"}>{`${sender.name} sent you friend request`}</Typography>

                <Stack direction={"row"}>
                    <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
                    <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>
                </Stack>
            </Stack>
        </ListItem >
    )
}

export default NotificationsDialog