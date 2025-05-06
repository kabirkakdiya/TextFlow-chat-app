import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { serverUrl } from '../../constants/server-url';
import useOtherStore from '../../store/otherStore';
import UserItem from '../shared/UserItem';

const SearchDialog = () => {
    const isSearch = useOtherStore((state) => state.isSearch)
    const setIsSearch = useOtherStore((state) => state.setIsSearch)

    const [searchValue, setSearchValue] = useState("");
    const [users, setUsers] = useState([])

    const addFriendHandler = async (id) => {
        try {
            const response = await axios.put(`${serverUrl}/user/send-request`, { receiverId: id }, { withCredentials: true })
            toast.success(response.data.message)
            console.log(response.data)
        } catch (error) {
            toast.error(error.response.data.message)
        }

    }

    useEffect(() => {
        async function fetchSearchUsers() {
            try {
                console.log(`${serverUrl}/user/search?name=${searchValue}`)
                const response = await axios.get(`${serverUrl}/user/search?name=${searchValue}`, { withCredentials: true })
                setUsers(response.data.users)

            } catch (error) {
                console.log(error)
            }

        }
        fetchSearchUsers()
    }, [searchValue])
    return (
        <Dialog open={isSearch} onClose={() => setIsSearch(false)}>
            <Stack padding={"2rem"} width={"25rem"}>
                <DialogTitle textAlign={"center"}>Find People</DialogTitle>
                <TextField label="" onChange={(e) => setSearchValue(e.target.value)}
                    size='small' InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }} />

                <List>
                    {users.length !== 0 && users.map((user) => (
                        <UserItem user={user} key={user._id} handler={addFriendHandler} />
                    ))}
                </List>
            </Stack>
        </Dialog>
    )
}

export default SearchDialog