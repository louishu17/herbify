import React, {useState} from "react";
import { Typography, Paper, Tabs, Tab } from '@mui/material';
import { LeadingUsersTableBody } from "@/components/pageSpecific/leaderboard/leadingUsersTableBody";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { LeadingPosts } from "@/components/pageSpecific/leaderboard/leadingPosts";
import { useAuth } from "@/lib/authContext";


export default function LeaderboardPage(){
    const { isAuthenticated } = useAuth();
    const [tabIndex, setTabIndex] = useState<number>(1);
    const handleTabChange = (e: any, tabIndex: React.SetStateAction<number>) => {
        setTabIndex(tabIndex);
    };

    if (!isAuthenticated){
        return null;
    }
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

