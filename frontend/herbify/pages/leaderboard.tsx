import React from "react";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List } from '@mui/material';
import { LeaderboardTableBody } from "@/components/pageSpecific/leaderboard/leaderboardTableBody";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { withAuth } from '@/lib/authCheck';

export const getServerSideProps = withAuth();


export default function LeaderboardPage(){
    return (
        <BaseHerbifyLayoutWithTitle title="Leaderboard">
            <Paper elevation={3} style={{maxWidth : 400, margin : "auto", marginTop : 20, padding : 16}}>
                <LeaderboardTableBody/>
            </Paper>
            
        </BaseHerbifyLayoutWithTitle>
        
    )
}

