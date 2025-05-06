import { CameraAlt as CameraAltIcon } from "@mui/icons-material"
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { serverUrl } from '../constants/server-url.js'
import useAuthStore from '../store/authStore.js'

const Login = () => {
    const userExists = useAuthStore((state) => state.userExists)
    const [isLogin, setIsLogin] = useState(true);
    const [imageFile, setImageFile] = useState(false);
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [imageError, setImageError] = useState("")
    const [isTouched, setIsTouched] = useState(false)

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const [data, setData] = useState({
        name: "",
        about: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${serverUrl}/user/login`, { email: data.email, password: data.password }, { withCredentials: true })
            userExists(response.data.user);     // sets user data
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //Validate type
            if (!file.type.startsWith("image/")) {
                setImageError("Only image files are allowed!")
                setImageFile(false);          //reset the state
                e.target.value = "";         //reset the input
                return;
            }

            //Validate size
            const maxSize = 2 * 1024 * 1024; //2MB
            if (file.size > maxSize) {
                setImageError("File size exceeds 2MB!")
                setImageFile(false)          //reset the state
                e.target.value = ""         //reset the input
                return;
            }
            setImageFile(file)
            setImageError("")
        }
        console.log(imageError)
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("about", data.about)
        formData.append("email", data.email)
        formData.append("password", password)
        formData.append("avatar", imageFile)
        try {
            const response = await axios.post(`${serverUrl}/user/register`, formData, {
                withCredentials: true, //for storing cookies sent in the response.
            })
            userExists(response.data.user);
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    //password errors
    useEffect(() => {
        if (!isTouched) return;

        if (password && password.length < 6) {
            setPasswordError("Password must be atleast 6 characters")
        } else if (!password.match(/\d/)) {
            setPasswordError("Password must contain at least one number");
        } else if (!password.match(/[A-Z]/)) {
            setPasswordError("Password must contain at least one uppercase letter");
        } else if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
            setPasswordError("Password must contain at least one special character");
        } else {
            setPasswordError("")
        }
    }, [password])
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
                    {isLogin ?
                        <>
                            <Typography variant='h5'>Login</Typography>
                            <form onSubmit={handleLogin}
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                }}>
                                <TextField
                                    required
                                    fullWidth={true}
                                    name="email"
                                    type="email"
                                    label="Email"
                                    margin="normal"
                                    variant="outlined"
                                    value={data.email}
                                    onChange={onChangeHandler}
                                />

                                <TextField
                                    required
                                    fullWidth={true}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                    variant="outlined"
                                    value={data.password}
                                    onChange={onChangeHandler}
                                />
                                <Button sx={{ marginTop: "1rem" }} fullWidth={true} variant='contained' color='primary' type='submit'>Login</Button>

                                <Typography textAlign="center" margin="1rem">OR</Typography>

                                <Button fullWidth={true} variant="text" onClick={toggleLogin}>Sign up Instead</Button>
                            </form>
                        </>
                        : <>
                            <Typography variant='h5'>Sign Up</Typography>
                            <form onSubmit={handleSignUp}
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                }}>
                                <Stack position={"relative"} width={"10rem"} margin={"auto"} >
                                    <Avatar sx={{
                                        width: "10rem",
                                        height: "10rem",                    //Only do this if you are able to upload images from frontend easily.
                                        objectFit: "contain"
                                    }} src={imageFile ? URL.createObjectURL(imageFile) : null} />

                                    {imageError && (
                                        <Typography color="error" variant='caption'>
                                            {imageError}
                                        </Typography>
                                    )}

                                    <IconButton sx={{
                                        position: "absolute", //To bring cameraIcon on the edge of Avatar
                                        bottom: 0,
                                        right: 0,
                                        color: "white",
                                        bgcolor: "rgba(0,0,0,0.5)", //lighter than black
                                        ":hover": {
                                            bgcolor: "rgba(0,0,0,0.7)",
                                        }
                                    }}
                                        component="label"  //by default, iconButton renders as button element, to change it 'label' is specified in 'component' prop. Because the input element needs a label
                                    >
                                        <CameraAltIcon></CameraAltIcon>
                                        <input type='file' accept='image/*' onChange={handleFileChange} style={{ display: "none" }} required />
                                    </IconButton>

                                </Stack>

                                <TextField
                                    required
                                    fullWidth={true}
                                    name="name"
                                    label="Name"
                                    margin="normal"
                                    variant="outlined"
                                    value={data.name}
                                    onChange={onChangeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth={true}
                                    name="about"
                                    label="About"
                                    margin="normal"
                                    variant="outlined"
                                    value={data.about}
                                    onChange={onChangeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth={true}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    margin="normal"
                                    variant="outlined"
                                    value={data.email}
                                    onChange={onChangeHandler}
                                />

                                <TextField
                                    required
                                    fullWidth={true}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setIsTouched(true)
                                    }}
                                />
                                {passwordError && <Typography color="error" variant='caption'>{passwordError}</Typography>}
                                <Button sx={{ marginTop: "1rem" }} fullWidth={true} disabled={passwordError !== ""} variant='contained' color='primary' type='submit'>Sign Up</Button>

                                <Typography textAlign={"center"} margin={"1rem"}>OR</Typography>

                                <Button fullWidth={true} variant="text" onClick={toggleLogin}>Login Instead</Button>

                            </form>
                        </>
                    }
                </Paper>
            </Container>
        </div>
    )
}

export default Login