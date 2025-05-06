import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material'
import { Button, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UserItem from '../components/shared/UserItem'
import AddMemberDialog from '../components/specific/AddMemberDialog'
import GroupsList from '../components/specific/GroupsList'
import { serverUrl } from '../constants/server-url'
import useAuthStore from '../store/authStore'
import useOtherStore from '../store/otherStore'


const Groups = () => {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("group");
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState("")
    const [groupNameUpdated, setGroupNameUpdated] = useState("")
    const [groupMembers, setGroupMembers] = useState([])
    const [myGroups, setMyGroups] = useState([])
    const [isEditGroupName, setIsEditGroupName] = useState(false)

    const user = useAuthStore(state => state.user)
    const isAddMemberInGroup = useOtherStore(state => state.isAddMemberInGroup)
    const setIsAddMemberInGroup = useOtherStore(state => state.setIsAddMemberInGroup)

    useEffect(() => {
        async function fetchGroupChats() {
            try {
                const response = await axios.get(`${serverUrl}/chat/my/groups`, { withCredentials: true })
                setMyGroups(response.data.groups)
            } catch (error) {
                console.log(error.response?.data?.message || "Something went wrong")
            }
        }
        fetchGroupChats()
    }, [])

    useEffect(() => {        //to retrieve specific group details
        async function fetchGroupDetails() {
            if (!chatId) return;     //prevents unnecessary API calls when chatId(groupId) is not present. This is because the Groups component is mounted and it will try to fetch chats even if no group is selected.
            try {
                const response = await axios.get(`${serverUrl}/chat/${chatId}`, { withCredentials: true })
                setGroupName(response.data.chat.name)
                setGroupNameUpdated(response.data.chat.name)
                setGroupMembers(response.data.chat.members)     //chat member details only
                console.log(response.data.chat)
            } catch (error) {
                console.log(error.response?.data?.message || "Error fetching chat members")
            }
        }
        fetchGroupDetails()

        return () => {
            setGroupName("");
            setGroupNameUpdated("")
            setGroupMembers([]);
            setIsEditGroupName(false)
        }
    }, [chatId])
    const navigateBack = () => {
        navigate("/");
    }

    const openAddMemberHandler = () => {
        setIsAddMemberInGroup(true)
        console.log("Add member.");
    }

    const updateGroupNameHandler = async () => {
        setIsEditGroupName(false)
        try {
            const response = await axios.put(`${serverUrl}/chat/${chatId}`, { name: groupNameUpdated }, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                setGroupName(groupNameUpdated)
                setMyGroups(prev => prev.map(group => {
                    if (group._id.toString() === chatId.toString())
                        group.name = groupNameUpdated;
                    return group
                }))

            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.")
        }
        console.log(groupNameUpdated)
    }

    const deleteGroupHandler = async () => {
        try {
            const response = await axios.delete(`${serverUrl}/chat/${chatId}`, { withCredentials: true })
            setGroupMembers([])
            setGroupName("")
            setMyGroups(prev => prev.filter(group => group._id !== chatId))
            toast.success(response.data.message)
            console.log("group deleted ", chatId)
            navigate("/groups")
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.")
        }
    }

    const removeMemberHandler = async (id) => {
        try {
            const response = await axios.put(`${serverUrl}/chat/remove-member`, { chatId: chatId, userId: id }, { withCredentials: true })
            toast.success(response.data.message)
            setGroupMembers(prev => prev.filter(member => member._id !== id))
            console.log("Removed Member ", id);
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const GroupName = (           //JSX element that displays group name
        <Stack direction={"row"} alignItems={'center'} justifyContent={'center'} spacing={"1rem"} padding={"3rem"} >
            {isEditGroupName ?
                <>
                    <TextField value={groupNameUpdated} onChange={(e) => setGroupNameUpdated(e.target.value)} />
                    <IconButton onClick={updateGroupNameHandler}><DoneIcon /></IconButton>
                </> :
                <>
                    <Typography variant='h4'>{groupName}</Typography>
                    <IconButton onClick={() => setIsEditGroupName(true)} ><EditIcon /> </IconButton>
                </>}
        </Stack>
    )

    return (
        <Grid container height={"100vh"}>
            <Grid item sm={4} sx={{
                backgroundImage: "linear-gradient(rgb(255 225 209), rgb(249 159 159))",
            }}>
                <GroupsList myGroups={myGroups} />
            </Grid>
            <Grid item sm={8} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                padding: "1rem 3rem",
            }}>

                <Tooltip title="Back">
                    <IconButton onClick={navigateBack} sx={{
                        position: "absolute",
                        top: "2.5rem",
                        left: "2rem",
                        bgcolor: "rgba(0,0,0,0.8)",
                        color: "white",
                        "&:hover": {
                            bgcolor: "rgba(0,0,0,0.7)"
                        },
                    }}>
                        <KeyboardBackspaceIcon />
                    </IconButton>
                </Tooltip>

                {groupName &&
                    <>
                        {GroupName}
                        <Typography margin="2rem" alignSelf={"flex-start"}>
                            Members
                        </Typography>

                        {/* members below */}
                        <Stack maxWidth="45rem" width="100%" boxSizing="border-box" padding={"1rem"} spacing={"2rem"} height={"50vh"} overflow="auto">
                            {groupMembers.map((i) => {
                                if (i._id === user._id) {   //do not show admin
                                    return null;
                                }
                                return <UserItem user={i} key={i._id} isAddedInGroup={true} handler={removeMemberHandler} styling={{
                                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                                    padding: "1rem 2rem",
                                    borderRadius: "1rem"
                                }} />
                            })}
                        </Stack>

                        {/* Buttons below */}
                        <Stack direction={{
                            xs: "column",
                            sm: "row",
                        }} spacing="1rem" padding="0.5rem">
                            <Button color="error" startIcon={<DeleteIcon />} onClick={deleteGroupHandler}>Delete Group</Button>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
                        </Stack>
                    </>
                }
            </Grid>

            {isAddMemberInGroup && <AddMemberDialog chatId={chatId} setGroupMembers={setGroupMembers} />}
        </Grid >
    )
}

export default Groups