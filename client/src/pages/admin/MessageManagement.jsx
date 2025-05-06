import { IconButton, Stack } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import MuiTable from '../../components/shared/MuiTable'
import { serverUrl } from '../../constants/server-url'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import toast from 'react-hot-toast'

const MessageManagement = () => {
    const [rows, setRows] = useState([]);

    const handleMessageDelete = async (id) => {
        console.log("Msg deleted: ", id)
        try {
            const response = await axios.delete(`${serverUrl}/admin/messages/${id}`, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                setRows(prevMessages => prevMessages.filter(msg => msg.id !== id))
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message)
        }
    }

    const columns = [
        {
            field: "id",
            headerName: "ID",
            headerClassName: "table-header",
            width: 200,
        },
        {
            field: "content",
            headerName: "Content",
            headerClassName: "table-header",
            width: 380,
        },
        {
            field: "sender",
            headerName: "Sent By",
            headerClassName: "table-header",
            width: 120,
            renderCell: (params) => (
                <Stack direction="row" alignItems="center">
                    <span>{params.row.sender.name}</span>
                </Stack>
            )
        },
        {
            field: "createdAt",
            headerName: "Time",
            headerClassName: "table-header",
            width: 220,
        },
        {
            field: "actions",
            headerName: "Actions",
            headerClassName: "table-header",
            width: 100,
            renderCell: (params) => (
                <Tooltip title='Delete'>
                    <IconButton color='error' onClick={() => handleMessageDelete(params.row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )
        }
    ]

    useEffect(() => {
        async function fetchMessagesData() {
            try {
                const response = await axios.get(`${serverUrl}/admin/messages`, { withCredentials: true })
                if (response.data.success) {
                    setRows(response.data.messages.map(message => ({ ...message, id: message._id, createdAt: moment(message.createdAt).format("MMMM Do YYYY, h:mm:ss a") })))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessagesData()
    }, []);

    return (
        <AdminLayout>
            <MuiTable heading={"All Messages"} columns={columns} rows={rows} rowHeight={52} />
        </AdminLayout>
    )
}

export default MessageManagement