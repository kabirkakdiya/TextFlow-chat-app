
import { Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <Container sx={{ height: "100vh" }}>
            <Stack justifyContent={'center'} alignItems={'center'} spacing={'2rem'} height='100%'>

                <img src='/404-hdfc.webp' width={"500px"} />

                <Typography variant='h1'>404</Typography>
                <Typography variant='h3'>Not Found</Typography>

                <Link to="/">Go back to Home</Link>
            </Stack>
        </Container>
    )
}

export default NotFound