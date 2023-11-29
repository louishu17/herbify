import React from 'react';
import { List, ListItem, ListItemText, Typography, Avatar } from '@mui/material';
import Link from "next/link";

interface User {
    uid: number;
    firstName: string;
}

interface SearchResultsUsersProps {
  results: User[];
}

const avatarStyle = {
    // Define your avatar styles here
};

const SearchResultsUsers: React.FC<SearchResultsUsersProps> = ({ results }) => {
    if (results.length === 0) {
        return <Typography>No users found.</Typography>;
    }

    return (
        <List style={{ marginLeft: '20%' }}>
            {results.map(user => (
                <ListItem key={user.uid} divider >
                    <Avatar 
                        alt={user.firstName} 
                        src="/static/images/avatar/1.jpg" 
                        style={avatarStyle} 
                    />
                    <Link href={`/profile/${user.uid}`} passHref>
                        <ListItemText primary={user.firstName} />
                    </Link>
                </ListItem>
            ))}
        </List>
    );
}

export { SearchResultsUsers };