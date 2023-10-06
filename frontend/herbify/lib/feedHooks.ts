import {useQuery, UseQueryResult} from "react-query";
import { API_ROUTE } from "./API_CONFIG";
import { FeedData } from "@/pages/api/feed";
import axios from 'axios';

const fetchFeed = async () : Promise<FeedData> => {
    const response = await axios.get('http://127.0.0.1:5000/feed')

    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
}


export const useFetchFeed = () : UseQueryResult<FeedData> => {
    return useQuery<FeedData>("fetchFeed", fetchFeed, {staleTime : 6000});
}
