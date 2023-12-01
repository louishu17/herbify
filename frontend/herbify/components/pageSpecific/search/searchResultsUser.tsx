import React from 'react';
import { List, ListItem, ListItemText, Typography, Avatar } from '@mui/material';
import Link from "next/link";

export interface User {
    uid: number;
    firstName: string;
}

interface SearchResultsUsersProps {
  results: User[];
  onClose?: () => void;
}

const avatarStyle = {
    // Define your avatar styles here
};

const SearchResultsUsers: React.FC<SearchResultsUsersProps> = ({ results, onClose }) => {
    if (results === null || results.length === 0) {
        return <Typography>No users found.</Typography>;
    }

    return (
        <List style={{ marginLeft: '20%' }}>   
            {results.map(user => (
                <ListItem key={user.uid} divider onClick={onClose ? () => onClose() : undefined}>
                    <Avatar 
                        alt={user.firstName} 
                        src="/static/images/avatar/1.jpg" 
                        style={avatarStyle}
                        sx={{ marginRight: 2 }}
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
