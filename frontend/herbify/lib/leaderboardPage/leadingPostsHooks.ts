import {useQuery, UseQueryResult} from "react-query";
import { LeaderboardAPIData } from "@/pages/api/leaderboard";
import axios from 'axios';
import { FeedData } from "@/pages/api/feed";



const fetchLocallyRunningLeadingPosts = async () : Promise<FeedData> => {
    const response = await axios.get('http://127.0.0.1:5000/leading_posts')
    if (response.status > 300){
        throw new Error("Error fetching leading posts");
    } 
    return response.data;
}


export const useFetchLocallyRunningLeadingPosts = () : UseQueryResult<FeedData> => {
    return useQuery<FeedData>("fetch leading posts", fetchLocallyRunningLeadingPosts);
}