import {useQuery, UseQueryResult} from "react-query";
import { LeaderboardAPIData } from "@/pages/api/leaderboard";
import axios from 'axios';




const fetchMockLeaderboard = async () : Promise<LeaderboardAPIData> => {
    const response = await fetch('/api/leaderboard');
    if (response.status > 300){
        throw new Error("Error fetching leaderboard");
    } 
    return response.json();
}


export const useFetchMockLeaderboard = () : UseQueryResult<LeaderboardAPIData> => {
    return useQuery<LeaderboardAPIData>("fetchLeaderboard", fetchMockLeaderboard);
}