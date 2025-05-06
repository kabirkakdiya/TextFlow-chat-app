import { Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from '../styles/StyledComponents';
import AvatarCard from './AvatarCard';

const GroupListItem = ({ group }) => {
    const { name, avatar, _id } = group; //_id is the unique id of the group
    return (
        <Link to={`?group=${_id}`} >  {/*this allows to access group or chat that is selected */}
            <Stack direction={"row"} spacing="1rem" alignItems={"center"}>
                <AvatarCard avatar={avatar} />
                <Typography>{name}</Typography>
            </Stack>
        </Link>
    )
}

export default GroupListItem