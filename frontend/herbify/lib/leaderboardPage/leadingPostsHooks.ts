import {useQuery, UseQueryResult} from "react-query";
import { LeaderboardAPIData } from "@/pages/api/leaderboard";
import axios from '../../utils/axiosInstance';
import { FeedData } from "@/pages/api/feed";



const fetchLocallyRunningLeadingPosts = async () : Promise<FeedData> => {
    const response = await axios.get('/leading_posts')
    if (response.status > 300){
        throw new Error("Error fetching leading posts");
    } 
    return response.data;
}


export const useFetchLocallyRunningLeadingPosts = () : UseQueryResult<FeedData> => {
    return useQuery<FeedData>("fetch leading posts", fetchLocallyRunningLeadingPosts);
}