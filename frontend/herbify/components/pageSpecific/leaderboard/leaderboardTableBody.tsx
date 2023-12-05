import React from "react";
import { Typography, Stack, Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText, Link as MuiLink } from '@mui/material';
import { useFetchMockLeaderboard, useFetchLocallyRunningLeaderboard } from "@/lib/leaderboardHooks";
import { HerbifyLoadingContainer } from "@/components/shared/loading";
import Link from "next/link";
import { useImageForProfilePic, INVALID_S3_FILENAME } from "@/lib/profilePicHooks";
import { LeaderOnLeaderboardData } from "@/pages/api/leaderboard";

export const LeaderboardTableBody : React.FC = () => {
    const {data : leaderboardData, isLoading, isError} = useFetchLocallyRunningLeaderboard();

    if (isLoading){
        return <HerbifyLoadingContainer/>
    } else if (isError || !leaderboardData){
        return (<Typography align ="center" style={{color : "red"}}>An Error Occurred</Typography>);
    } else {
        return (
            <List>
                {leaderboardData.leaders.map((leader, rank) => <Leader key={leader.uid} leader={leader} rank={rank}/>)}
            </List>
        );

    }
}

interface LeaderProps {
    leader : LeaderOnLeaderboardData;
    rank : number;
}
const Leader : React.FC<LeaderProps> = (props : LeaderProps) => {
    const {data : profilePicImgSrc, isLoading : isLoadingProfilePic, isError : isErrorLoadingProfilePic} = useImageForProfilePic(props.leader.profilePicS3Filename);

    return (
        <Link href={`/profile/${props.leader.uid}`} passHref key={props.leader.uid}>
            <MuiLink underline="none">
                <Stack direction="row">
                    <Avatar alt={props.leader.name} 
                    src={(profilePicImgSrc && !isLoadingProfilePic && !isErrorLoadingProfilePic) ? profilePicImgSrc : INVALID_S3_FILENAME}
                    />
                    <ListItem >
                        <ListItemText primary={`${props.rank + 1}. ${props.leader.name}`} secondary={`Followers: ${props.leader.numberOfFollowers}`} />
                    </ListItem>
                </Stack>
            </MuiLink>
        </Link>

    );

}