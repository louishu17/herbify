import React, {useState} from "react";
import { Typography, Paper, Tabs, Tab } from '@mui/material';
import { LeadingUsersTableBody } from "@/components/pageSpecific/leaderboard/leadingUsersTableBody";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { withAuth } from '@/lib/authCheck';
import { LeadingPosts } from "@/components/pageSpecific/leaderboard/leadingPosts";

export const getServerSideProps = withAuth();


export default function LeaderboardPage(){
    const [tabIndex, setTabIndex] = useState<number>(1);
    const handleTabChange = (e: any, tabIndex: React.SetStateAction<number>) => {
        setTabIndex(tabIndex);
    };


    return (
        <BaseHerbifyLayoutWithTitle title="Leaderboard">
            <Paper elevation={3} style={{maxWidth : 400, margin : "auto", marginTop : 20, padding : 16}}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Leading Users"/>
                    <Tab label="Leading Posts"/>
                </Tabs>
            </div>
                {tabIndex == 0 ? <LeadingUsersTableBody/> : <LeadingPosts/>}
            </Paper>
            
        </BaseHerbifyLayoutWithTitle>
        
    )
}

