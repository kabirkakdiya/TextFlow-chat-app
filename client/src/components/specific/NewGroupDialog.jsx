import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, ListItem, Stack, TextField, Typography } from '@mui/material'
import UserItem from '../shared/UserItem'
import axios from 'axios'
import { serverUrl } from '../../constants/server-url'
import useOtherStore from '../../store/otherStore'
import toast from 'react-hot-toast'

const NewGroupDialog = () => {
    const isNewGroup = useOtherStore(state => state.isNewGroup)
    const setIsNewGroup = useOtherStore(state => state.setIsNewGroup)
    const [groupNameValue, setGroupNameValue] = useState("");

    const [friends, setFriends] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((currentId) => currentId !== id) : [...prev, id]
        )
    }

    const createGroup = async () => {
        try {
            const response = await axios.post(`${serverUrl}/chat/new`, { groupName: groupNameValue, members: selectedMembers }, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const submitHandler = () => {
        if (!groupNameValue)
            return toast.error("Group Name is required")
        if (selectedMembers.length < 2)
            return toast.error("Please select at least 2 members.")
        createGroup();
        closeHandler()
    }

    const closeHandler = () => {
        setIsNewGroup(false)
    }
    useEffect(() => {
        async function fetchFriends() {
            try {
                const response = await axios.get(`${serverUrl}/user/friends`, { withCredentials: true })
                setFriends(response.data.friends)
            } catch (error) {
                console.log(error.response?.data?.message || "Something went wrong")
            }
        }
        fetchFriends()
    }, [])
    return (
        <Dialog open={isNewGroup} onClose={closeHandler}>
            <Stack padding={"3rem"} width={"25rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>New Group</DialogTitle>

                <TextField required={true} label="Group Name" value={groupNameValue} onChange={(e) => setGroupNameValue(e.target.value)} />

                <Typography>Members</Typography>

                <Stack>
                    {friends.map((user) => (
                        <UserItem user={user} key={user._id} handler={selectMemberHandler} isAddedInGroup={selectedMembers.includes(user._id)} />
                    ))}
                </Stack>

                <Stack direction={"row"} justifyContent={'space-evenly'}>
                    <Button color='error' onClick={closeHandler}>Cancel</Button>
                    <Button variant='contained' onClick={submitHandler}>Create</Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default NewGroupDialog