import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Container, Paper, Typography } from '@mui/material'

const MuiTable = ({ rows, columns, heading, rowHeight }) => {
    return (
        <Container sx={{
            height: "100vh",
        }}>
            <Paper elevation={3} sx={{
                padding: "1rem 4rem",
                borderRadius: "1rem",
                margin: "auto",
                width: "100%",
                height: "100%",
                overflow: "hidden",    //mui data grid has pagination by default to access those.
            }}>
                <Typography textAlign={'center'} variant='h4' sx={{
                    margin: '2rem',
                    textTransform: 'uppercase',
                }}>{heading}</Typography>

                <DataGrid rows={rows} columns={columns} rowHeight={rowHeight} sx={{
                    height: "80%",
                    border: "none",
                    ".table-header": {
                        bgcolor: "#1c1c1c",
                        color: "white",
                    }
                }} />
            </Paper>
        </Container>
    )
}

export default MuiTable