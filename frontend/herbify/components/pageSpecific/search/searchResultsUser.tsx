import React from 'react';
import { List, ListItem, ListItemText, Typography, Avatar, Button } from '@mui/material';
import Link from "next/link";
import { useFetchPaginatedSearchUserByTerm, INITIAL_TERM } from '@/lib/searchPage/searchUserByTermHooks';
import { HerbifyLoadingCircle } from '@/components/shared/loading';

export interface User {
    uid: number;
    firstName: string;
}

export interface SearchResultsUsersProps {
  results: User[];
  onClose?: () => void;
}

const avatarStyle = {
    // Define your avatar styles here
};


export const UsersList : React.FC<SearchResultsUsersProps>  = (props : SearchResultsUsersProps) => {
    return (
        <List style={{ marginLeft: '20%' }}>   
            {props.results && props.results.map(user => (
                <ListItem key={user.uid} divider>
                    <Avatar 
                        alt={user.firstName} 
                        src="/static/images/avatar/1.jpg" 
                        style={avatarStyle}
                        sx={{ marginRight: 2 }}
                    />
                    <Link onClick={props.onClose ? props.onClose : () => {}} href={`/profile/${user.uid}`} passHref>
                        <ListItemText primary={user.firstName} />
                    </Link>
                </ListItem>
            ))}
        </List>
    );

}

export const SearchPageUsersResults: React.FC = () => {
    const {data : {results}, isLoading, isFetchingNextPage, loadMore, isError, term} = useFetchPaginatedSearchUserByTerm();
    const atLeastOneLoad = term !== INITIAL_TERM && !isLoading && !isFetchingNextPage;
    if (results.length === 0 && atLeastOneLoad) {
        return <Typography>No Users found.</Typography>;
    }


    return (
        <>
            <UsersList results={results ? results : []}/>
            {isLoading || isFetchingNextPage ? <Typography align="center"><HerbifyLoadingCircle/></Typography> : null}
            {isError ? <Typography align="center">An Error Occurred</Typography> : null}
            {atLeastOneLoad ? 
                <Button onClick={() => loadMore()}>
                    <Typography align="center">Load More</Typography>
                </Button> 
                : 
                null
            } 
        </>
    );
}

export { UsersList as SearchResultsUsers };
