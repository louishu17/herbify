import {useQuery, UseQueryResult} from "react-query";
import { LeaderboardAPIData } from "@/pages/api/leaderboard";
import axios from 'axios';


const fetchLocallyRunningLeaderboard = async () : Promise<LeaderboardAPIData> => {
    const response = await axios.get('http://127.0.0.1:5000/leaderboard')

    if (response.status > 300){
        throw new Error("Error fetching leaderboard");
    } 
    return response.data;
}

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

export const useFetchLocallyRunningLeaderboard = () : UseQueryResult<LeaderboardAPIData> => {
    return useQuery<LeaderboardAPIData>("fetchLeaderboard", fetchLocallyRunningLeaderboard);
}