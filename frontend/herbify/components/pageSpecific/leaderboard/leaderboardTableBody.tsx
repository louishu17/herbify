import React from "react";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText } from '@mui/material';
import { useFetchMockLeaderboard } from "@/lib/leaderboardHooks";
import { HerbifyLoadingContainer } from "@/components/shared/loading";

export const LeaderboardTableBody : React.FC = () => {
    const {data : leaderboardData, isLoading, isError} = useFetchMockLeaderboard();
    if (isLoading){
        return <HerbifyLoadingContainer/>
    } else if (isError || !leaderboardData){
        return (<Typography align ="center" style={{color : "red"}}>An Error Occurred</Typography>);
    } else {
        return (
            <List>
                {leaderboardData.leaders.map((leader, rank) => {
                    return (
                        
                        <ListItem key={rank}>
                            <ListItemText primary={`${rank + 1}. ${leader.name}`} secondary={`Likes: ${leader.numberOfLikes}`} />
                        </ListItem>
                    );
                    
                })}
            </List>
        );
    }
}