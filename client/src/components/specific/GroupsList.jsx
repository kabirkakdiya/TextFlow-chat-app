import { Stack, Typography } from '@mui/material'
import React from 'react'
import GroupListItem from '../shared/GroupListItem'

const GroupsList = ({ myGroups = [] }) => {

    return (
        <Stack width={"100%"} height={"100vh"} overflow={"auto"}>
            {myGroups.length > 0 ?
                myGroups.map((group) => <GroupListItem group={group} key={group._id} />) :
                <Typography textAlign={"center"} padding="1rem">No Groups</Typography>}
        </Stack>
    )
}

export default GroupsList