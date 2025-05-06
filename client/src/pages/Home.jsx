import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { gray } from "../constants/colour";

const Home = () => {
    return (
        <AppLayout>
            <Box bgcolor={gray} height={"100%"}>
                <Typography p={"2rem"} variant="h5" textAlign={"center"}>
                    Select a friend to chat
                </Typography>
            </Box>
        </AppLayout>
    );
};

export default Home;