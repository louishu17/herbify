import {useQuery, UseQueryResult} from "react-query";
import { useState } from "react";
import { FeedData } from "@/pages/api/feed";
import axios from 'axios';


const fetchLocallyRunningBasicFeed = async () : Promise<FeedData> => {
    const response = await axios.get('http://127.0.0.1:5000/feed')

    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
}

const fetchLocallyRunningPaginatedFeed = async (pageNum : number) : Promise<FeedData> => {
    const response = await axios.get('http://127.0.0.1:5000/feed/' + pageNum)

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


export const useFetchBasicFeed = () : UseQueryResult<FeedData> => {
    return useQuery<FeedData>("fetchFeed", fetchLocallyRunningBasicFeed, {staleTime : 6000});
}

interface usePaginatedFeedResult {
    data : FeedData | undefined;
    isLoading : boolean;
    isError : boolean;
    loadMore : () => void;
}
export const useFetchPaginatedFeed = () : usePaginatedFeedResult => {
    const [lastPageNumber, setLastPageNumber] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [lastPageFetched, setLastPageFetched] = useState<number>(-1);
    const [data, setData] = useState<FeedData>({descriptions : []});

    const {data : queryData, isLoading, isError, refetch} = useQuery<FeedData>(["fetchFeed", pageNumber], () => fetchLocallyRunningPaginatedFeed(pageNumber), 
        {
            onSuccess : (newData) => {
                if (lastPageFetched < pageNumber){
                    setData((oldData) => {
                        return {descriptions : [...oldData.descriptions, ...newData.descriptions]}
                    })
                }
                setLastPageFetched(pageNumber);     
            } 
        },
    );

    const loadMore = () => {
        if (queryData){
            setPageNumber((oldPageNum) => oldPageNum + 1);
            setLastPageNumber(pageNumber);
            refetch();
        }   
    }

    return {data, isLoading, isError, loadMore}
}
