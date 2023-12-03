import React from "react";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText, Link as MuiLink } from '@mui/material';
import { useFetchMockLeaderboard, useFetchLocallyRunningLeaderboard } from "@/lib/leaderboardHooks";
import { HerbifyLoadingContainer } from "@/components/shared/loading";
import Link from "next/link";

export const LeaderboardTableBody : React.FC = () => {
    const {data : leaderboardData, isLoading, isError} = useFetchLocallyRunningLeaderboard();
    if (isLoading){
        return <HerbifyLoadingContainer/>
    } else if (isError || !leaderboardData){
        return (<Typography align ="center" style={{color : "red"}}>An Error Occurred</Typography>);
    } else {
        return (
            <List>
                {leaderboardData.leaders.map((leader, rank) => {
                    return (
                        <Link href={`/profile/${leader.uid}`} passHref key={rank}>
                            <MuiLink underline="none">
                                <ListItem >
                                    <ListItemText primary={`${rank + 1}. ${leader.name}`} secondary={`Followers: ${leader.numberOfFollowers}`} />
                                </ListItem>
                            </MuiLink>
                        </Link>

                    );
                    
                })}
            </List>
        );
    }
}