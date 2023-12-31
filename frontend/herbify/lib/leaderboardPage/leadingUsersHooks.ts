import {useQuery, UseQueryResult} from "react-query";
import { LeaderboardAPIData } from "@/pages/api/leaderboard";
import axios from '../../utils/axiosInstance';
import { FeedData } from "@/pages/api/feed";


const fetchLocallyRunningLeadingUsers = async () : Promise<LeaderboardAPIData> => {
    const response = await axios.get('/leading_users')

    if (response.status > 300){
        throw new Error("Error fetching leading users");
    } 
    return response.data;
}

const fetchMockLeadingUsers = async () : Promise<LeaderboardAPIData> => {
    const response = await fetch('/api/leaderboard');
    if (response.status > 300){
        throw new Error("Error fetching leaderboard");
    } 
    return response.json();
}


export const useFetchMockLeadingUsers = () : UseQueryResult<LeaderboardAPIData> => {
    return useQuery<LeaderboardAPIData>("fetchLeadingUsers", fetchMockLeadingUsers);
}

export const useFetchLocallyRunningLeadingUsers = () : UseQueryResult<LeaderboardAPIData> => {
    return useQuery<LeaderboardAPIData>("fetchLeadingUsers", fetchLocallyRunningLeadingUsers);
}