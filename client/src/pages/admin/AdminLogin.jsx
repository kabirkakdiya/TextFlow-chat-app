import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { serverUrl } from '../../constants/server-url';
import useAuthStore from '../../store/authStore';


const AdminLogin = () => {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const isAdmin = useAuthStore(state => state.isAdmin)
    const setIsAdmin = useAuthStore(state => state.setIsAdmin)

    const submitHandler = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        try {
            const response = await axios.post(`${serverUrl}/admin/login`, { username, password }, { withCredentials: true })
            if (response.data.success) {
                setIsAdmin(true)
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message)
        }
    }

    useEffect(() => {
        async function fetchAdmin() {
            try {
                const response = await axios.get(`${serverUrl}/admin/`, { withCredentials: true })
                if (response.data.admin)
                    setIsAdmin(true)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAdmin();
    }, [])

    if (isAdmin) return <Navigate to={"/admin/dashboard"} />
    return (
        <div style={{
            backgroundImage: "linear-gradient(rgb(255 225 209), rgb(249 159 159))",
        }}>
            <Container
                component={"main"}
                maxWidth="xs"
                sx={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Paper elevation={3}
                    sx={{
                        padding: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Typography variant='h5'>Admin Login</Typography>
                    <form onSubmit={submitHandler}
                        style={{
                            width: "100%",
                            marginTop: "1rem",
                        }}>
                        <TextField
                            required
                            fullWidth={true}
                            label="Username"
                            margin="normal"
                            variant="outlined"
                            inputRef={usernameRef}
                        />

                        <TextField
                            required
                            fullWidth={true}
                            label="Password"
                            type="password"
                            margin="normal"
                            variant="outlined"
                            inputRef={passwordRef}
                        />
                        <Button sx={{ marginTop: "1rem" }} fullWidth={true} variant='contained' color='primary' type='submit'>Login</Button>
                    </form>
                </Paper>
            </Container>
        </div>
    )
}

export default AdminLogin