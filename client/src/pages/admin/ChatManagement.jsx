import { Avatar, Stack } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import MuiTable from '../../components/shared/MuiTable';
import { serverUrl } from '../../constants/server-url';

const columns = [
    {
        field: "id",
        headerName: "ID",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "name",
        headerName: "Name",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "groupChat",
        headerName: "Group",
        headerClassName: "table-header",
        width: 100
    },
    {
        field: "totalMembers",
        headerName: "Total Members",
        headerClassName: "table-header",
        width: 150,
    },
    {
        field: "totalMessages",
        headerName: "Total Messages",
        headerClassName: "table-header",
        width: 150,
    },
    {
        field: "creator",
        headerName: "Created By",
        headerClassName: "table-header",
        width: 200,
        renderCell: (params) => (
            <Stack direction="row" alignItems="center">
                <span>{params.row.creator}</span>
            </Stack>
        )
    },
]

const ChatManagement = () => {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        async function fetchChatsData() {
            try {
                const response = await axios.get(`${serverUrl}/admin/chats`, { withCredentials: true })
                if (response.data.success) {
                    setRows(response.data.chats.map(chat => ({ ...chat, id: chat._id })))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchChatsData()
    }, []);

    return (
        <AdminLayout>
            <MuiTable heading={"All Chats"} columns={columns} rows={rows} rowHeight={52} />
        </AdminLayout>
    )
}

export default ChatManagement