import {useQuery, UseQueryResult} from "react-query";
import { API_ROUTE } from "./API_CONFIG";
import { FeedData } from "@/pages/api/feed";
import axios from 'axios';

const fetchLocallyRunningRealFeed = async () : Promise<FeedData> => {

    const response = await axios.get('http://127.0.0.1:5000/feed')

    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
    
}

const fetchMockFeed = async () : Promise<FeedData> => {
    const response = await fetch('/api/feed');
    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.json();
}


export const useFetchFeed = () : UseQueryResult<FeedData> => {
    return useQuery<FeedData>("fetchFeed", fetchLocallyRunningRealFeed, {staleTime : 6000});
}
