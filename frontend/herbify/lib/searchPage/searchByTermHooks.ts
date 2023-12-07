import {InfiniteData, UseInfiniteQueryResult, useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import axios from "axios";
import { SearchResults, Recipe } from "@/components/pageSpecific/search/searchResultsRecipe";
import { useState } from "react";

export const INITIAL_TERM = ""
const fetchLocallyRunningPaginatedSearchRecipe = async (term: string, pageNum : number, searchingByIngredient : boolean) : Promise<SearchResults> => {
    console.log("term is " + term);
    if (term === INITIAL_TERM){
        return {results : []};
    }
    if (searchingByIngredient){
        const response = await axios.get('http://127.0.0.1:5000/search_ingredient/' + pageNum, {params: {term: term}});
        if (response.status > 300){
            throw new Error("Error fetching recipes by ingredient");
        } 
        return response.data;

    } else {
        const response = await axios.get('http://127.0.0.1:5000/search/' + pageNum, {params: {term: term}});
        if (response.status > 300){
            throw new Error("Error fetching recipes by title");
        } 
        return response.data;
    }
    
}

export interface useFetchPaginatedSearchByTermResult {
    data : SearchResults;
    isError : boolean;
    isFetchingNextPage : boolean;
    isLoading : boolean;
    loadMore : () => void;
    term : string;
    setTerm : (s : string) => void;
    searchingByIngredient : boolean;
    setSearchingByIngredient : (b : boolean) => void;


}

export const useFetchPaginatedSearchRecipeByTerm  = ()  => {
    const {data : term} = useQuery(['RecipeTerm'], () => "", {initialData : INITIAL_TERM});
    const {data : searchingByIngredient} = useQuery(['SearchingByIngredient'], () => false, {initialData : false});
    
    const queryClient = useQueryClient();
    const setTerm = (t : string) => {
        queryClient.setQueryData(['RecipeTerm'], t)
    }
    const setSearchingByIngredient = (b : boolean) => {
        queryClient.setQueryData(['SearchingByIngredient'], b);
    }
    const {data, isError, isFetchingNextPage, isLoading, fetchNextPage} = useInfiniteQuery<SearchResults>(
        ['fetchRecipeByTerm', term, searchingByIngredient],
        ({pageParam = 0}) => fetchLocallyRunningPaginatedSearchRecipe(term ? term : INITIAL_TERM, pageParam, searchingByIngredient ? searchingByIngredient : false ),
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
    return {
        data : {results: searchResults}, 
        isError : isError, 
        isFetchingNextPage : isFetchingNextPage, 
        isLoading, loadMore : () => fetchNextPage(), 
        term : term ? term : INITIAL_TERM, 
        setTerm,
        searchingByIngredient : searchingByIngredient ? searchingByIngredient : false,
        setSearchingByIngredient
    }
}