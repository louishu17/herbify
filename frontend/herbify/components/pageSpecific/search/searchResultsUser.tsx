import React from 'react';
import { List, ListItem, ListItemText, Typography, Avatar, Button } from '@mui/material';
import Link from "next/link";
import { useFetchPaginatedSearchUserByTerm, INITIAL_TERM } from '@/lib/searchPage/searchUserByTermHooks';
import { HerbifyLoadingCircle } from '@/components/shared/loading';
import { useImageForProfilePic, INVALID_S3_FILENAME } from '@/lib/profilePicHooks';

export interface User {
    uid: number;
    firstName: string;
    profilePicS3Filename : string;
}

export interface SearchResultsUsersProps {
  results: User[];
  onClose?: () => void;
}

const avatarStyle = {
    // Define your avatar styles here
};

interface UserResultProps {
    user : User;
    onClose?: () => void;
}
const UserResult : React.FC<UserResultProps> = (props : UserResultProps) => {
    const {data : profilePicImgSrc, isLoading : isLoadingProfilePic, isError : isErrorLoadingProfilePic} = useImageForProfilePic(props.user.profilePicS3Filename);

    return (
        <ListItem key={props.user.uid} divider>
            <Avatar 
                alt={props.user.firstName} 
                src={(profilePicImgSrc && !isLoadingProfilePic && !isErrorLoadingProfilePic) ? profilePicImgSrc : INVALID_S3_FILENAME}
                style={avatarStyle}
                sx={{ marginRight: 2 }}
            />
            <Link href={`/profile/${props.user.uid}`} passHref>
                <div onClick={props.onClose ? props.onClose : () => {}}>
                    <ListItemText primary={props.user.firstName} />
                </div>
            </Link>
        </ListItem>
    );
    
}

export const UsersList : React.FC<SearchResultsUsersProps>  = (props : SearchResultsUsersProps) => {
    return (
        <List style={{ marginLeft: '20%' }}>   
            {props.results && props.results.map(user => <UserResult key={user.uid} user={user} onClose={props.onClose}/>)}
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
