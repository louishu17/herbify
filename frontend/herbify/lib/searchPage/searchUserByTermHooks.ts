import {InfiniteData, UseInfiniteQueryResult, useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import axios from '../../utils/axiosInstance';
import { SearchResults, Recipe } from "@/components/pageSpecific/search/searchResultsRecipe";
import { SearchResultsUsers, SearchResultsUsersProps, User } from "@/components/pageSpecific/search/searchResultsUser";
import { useState } from "react";

export const INITIAL_TERM = ""
const fetchLocallyRunningPaginatedSearchUser = async (term: string, pageNum : number) : Promise<SearchResultsUsersProps> => {
    if (term === INITIAL_TERM){
        return {results : []};
    }
    const response = await axios.get('/search_user/' + pageNum, {params: {term: term}});

    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
}

export interface useFetchPaginatedSearchByTermResult {
    data : { results : User[]};
    isError : boolean;
    isFetchingNextPage : boolean;
    isLoading : boolean;
    loadMore : () => void;
    term : string;
    setTerm : (s : string) => void;

}
export const useFetchPaginatedSearchUserByTerm  = () : useFetchPaginatedSearchByTermResult => {
    const {data : term} = useQuery(['UserTerm'], () => "", {initialData : INITIAL_TERM});
    
    const queryClient = useQueryClient();
    const setTerm = (t : string) => {
        queryClient.setQueryData(['UserTerm'], t)
    }
    const {data, isError, isFetchingNextPage, isLoading, fetchNextPage} = useInfiniteQuery<SearchResultsUsersProps>(
        ['fetchSearchByTerm', term],
        ({pageParam = 0}) => fetchLocallyRunningPaginatedSearchUser(term ? term : INITIAL_TERM, pageParam ),
        {
            getNextPageParam: (lastPage, pages) => {
                return pages.length;
            }
        }
    );
    const searchResults : User[] = [];
    if (data){
        data.pages.map((page) => {
            page.results.map((result) => searchResults.push(result))

        })
    }
    return {data : {results: searchResults}, isError : isError, isFetchingNextPage : isFetchingNextPage, isLoading, loadMore : () => fetchNextPage(), term : term ? term : INITIAL_TERM, setTerm}
}