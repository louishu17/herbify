import {InfiniteData, UseInfiniteQueryResult, useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import axios from "axios";
import { SearchResults, Recipe } from "@/components/pageSpecific/search/searchResultsRecipe";
import { useState } from "react";

export const INITIAL_TERM = ""
const fetchLocallyRunningPaginatedSearchRecipe = async (term: string, pageNum : number) : Promise<SearchResults> => {
    if (term === INITIAL_TERM){
        return {results : []};
    }
    const response = await axios.get('http://127.0.0.1:5000/search/' + pageNum, {params: {term: term}});

    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
}

export interface useFetchPaginatedSearchByTermResult {
    data : SearchResults;
    isError : boolean;
    isFetchingNextPage : boolean;
    isLoading : boolean;
    loadMore : () => void;
    term : string;
    setTerm : (s : string) => void;

}
export const useFetchPaginatedSearchRecipeByTerm  = ()  => {
    const {data : term} = useQuery(['RecipeTerm'], () => "", {initialData : INITIAL_TERM});
    
    const queryClient = useQueryClient();
    const setTerm = (t : string) => {
        queryClient.setQueryData(['RecipeTerm'], t)
    }
    const {data, isError, isFetchingNextPage, isLoading, fetchNextPage} = useInfiniteQuery<SearchResults>(
        ['fetchSearchByTerm', term],
        ({pageParam = 0}) => fetchLocallyRunningPaginatedSearchRecipe(term ? term : INITIAL_TERM, pageParam ),
        {
            getNextPageParam: (lastPage, pages) => {
                return pages.length;
            }
        }
    );
    const searchResults : Recipe[] = []
    if (data){
        data.pages.map((page) => {
            page.results.map((result) => searchResults.push(result))

        })
    }
    return {data : {results: searchResults}, isError : isError, isFetchingNextPage : isFetchingNextPage, isLoading, loadMore : () => fetchNextPage(), term : term ? term : INITIAL_TERM, setTerm}
}