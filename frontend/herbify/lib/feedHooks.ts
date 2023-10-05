import {useQuery, UseQueryResult} from "react-query";
import { API_ROUTE } from "./API_CONFIG";
import { FeedData } from "@/pages/api/feed";

const fetchFeed = async () : Promise<FeedData> => {
    const response = await fetch(API_ROUTE + 'feed');

    if (!response.ok){
        throw new Error("Error fetching feed");
    } 
    return response.json();
}


export const useFetchFeed = () : UseQueryResult<FeedData> => {
    return useQuery<FeedData>("fetchFeed", fetchFeed, {staleTime : 6000000});
}
