import {useQuery, UseQueryResult, useQueryClient, useInfiniteQuery} from "react-query";
import { useState } from "react";
import { FeedData, RecipeInfoFromFeed } from "@/pages/api/feed";
import axios from 'axios';


const fetchLocallyRunningBasicFeed = async () : Promise<FeedData> => {
    const response = await axios.get('http://127.0.0.1:5000/feed')

    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
}

const fetchLocallyRunningPaginatedFeed = async (pageNum : number, fetchingCustomized : boolean) : Promise<FeedData> => {

    if (fetchingCustomized){
        const response = await axios.get('http://127.0.0.1:5000/customized_feed/' + pageNum, {withCredentials : true})
        if (response.status > 300){
            throw new Error("Error fetching feed");
        } 
        return response.data;
    } else {
        const response = await axios.get('http://127.0.0.1:5000/feed/' + pageNum, {withCredentials : true})
        if (response.status > 300){
            throw new Error("Error fetching feed");
        } 
        return response.data;
    }
    
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
    const [fetchingCustomized, setFetchingCustomized] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [descriptions, setDescriptions] = useState<RecipeInfoFromFeed[]>([]);

    const {data : queryData, isLoading, isFetchingNextPage , isError, refetch, fetchNextPage} = useInfiniteQuery<FeedData>(
        ["fetchFeed", pageNumber, fetchingCustomized], 
        ({pageParam = 0}) => fetchLocallyRunningPaginatedFeed(pageParam, fetchingCustomized), 
        {
            onSuccess : (data) => {
                let newRecipes : RecipeInfoFromFeed[] = [];
                data.pages.forEach((recipes) => recipes.descriptions.forEach((recipe) => descriptions.push(recipe)));
                setDescriptions([...descriptions, ...newRecipes])
            },
            getNextPageParam: (lastPage, pages) => {
                if (fetchingCustomized && lastPage.descriptions.length < 7){
                    setFetchingCustomized(false);
                    return 0;
                } else {
                    return pages.length;
                }
            }
        },
    );

    return {data : {descriptions : descriptions}, isLoading : isLoading || isFetchingNextPage, isError, loadMore : fetchNextPage}
}

interface UserLikedRecipeAPIData {
    userLiked : boolean;
}
const fetchIfUserLikedRecipe = async (recipeID : number) : Promise<UserLikedRecipeAPIData> => {
    const response = await axios.get('http://127.0.0.1:5000/check_user_liked/' + recipeID, {withCredentials : true})
    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
}

export const useCheckIfUserLikedRecipe = (recipeID : number) : UseQueryResult<UserLikedRecipeAPIData> => {
    return useQuery(["fetch if user liked recipe", recipeID], () => fetchIfUserLikedRecipe(recipeID))

}


