import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import MuiTable from '../../components/shared/MuiTable';
import { serverUrl } from '../../constants/server-url';
import { Avatar } from '@mui/material';

const columns = [
    {
        field: "id",
        headerName: "ID",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "avatar",
        headerName: "Avatar",
        headerClassName: "table-header",
        width: 150,
        renderCell: (params) => <Avatar src={`${serverUrl}/user/avatar/${params.row.avatar}`} />
    },
    {
        field: "name",
        headerName: "Name",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "email",
        headerName: "Email",
        headerClassName: "table-header",
        width: 250,
    },
    {
        field: "friends",
        headerName: "Friends",
        headerClassName: "table-header",
        width: 150,
    },
    {
        field: "groups",
        headerName: "Groups",
        headerClassName: "table-header",
        width: 150,
    },
]

const UserManagement = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function fetchUsersData() {
            try {
                const response = await axios.get(`${serverUrl}/admin/users`, { withCredentials: true })
                if (response.data.success) {
                    setRows(response.data.users.map(user => ({ ...user, id: user._id })))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUsersData()
    }, []);
    return (
        <AdminLayout>
            <MuiTable heading={"All Users"} columns={columns} rows={rows} rowHeight={52} />
        </AdminLayout>
    )
}

export default UserManagement