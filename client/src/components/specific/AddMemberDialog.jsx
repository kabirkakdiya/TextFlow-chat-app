import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { sampleUsers } from '../../constants/sampleData'
import { serverUrl } from '../../constants/server-url'
import useOtherStore from '../../store/otherStore'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ chatId, setGroupMembers }) => {
    const isAddMemberInGroup = useOtherStore(state => state.isAddMemberInGroup)
    const setIsAddMemberInGroup = useOtherStore(state => state.setIsAddMemberInGroup)

    const [members, setMembers] = useState(sampleUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((currentId) => currentId !== id) : [...prev, id]
        )
    }

    const closeHandler = () => {
        setIsAddMemberInGroup(false)
    }

    const submitHandler = async () => {
        try {
            const response = await axios.put(`${serverUrl}/chat/add-members/`, { chatId, membersToAdd: selectedMembers }, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                try {
                    const response2 = await axios.get(`${serverUrl}/chat/${chatId}`, { withCredentials: true })
                    setGroupMembers(response2.data.chat.members)     //chat member details only
                    console.log(response2.data.chat)
                } catch (error) {
                    console.log(error.response2?.data?.message || "Error fetching chat members")
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            closeHandler()
        }
    }

    useEffect(() => {
        async function fetchAvailableFriends() {
            try {
                const response = await axios.get(`${serverUrl}/user/friends?chatId=${chatId}`, { withCredentials: true })
                console.log(response.data)
                setMembers(response.data.availableFriends)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAvailableFriends()
    }, [])

    return (
        <Dialog open={isAddMemberInGroup} onClose={closeHandler}>
            <Stack padding={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>
                    Add Member
                </DialogTitle>

                <Stack spacing={"1rem"}>
                    {members.length > 0 ? members.map(user => <UserItem key={user._id} user={user} isAddedInGroup={selectedMembers.includes(user._id)} handler={selectMemberHandler} />) : <Typography textAlign={"center"}>No friends</Typography>}
                </Stack>
                <Button variant='contained' onClick={submitHandler}>Add Member</Button>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog