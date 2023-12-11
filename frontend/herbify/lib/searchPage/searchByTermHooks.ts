// @ts-nocheck
import {InfiniteData, UseInfiniteQueryResult, useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import axios from '../../utils/axiosInstance';
import { SearchResults, Recipe } from "@/components/pageSpecific/search/searchResultsRecipe";
import { useState } from "react";

export const INITIAL_TERM = ""
const fetchLocallyRunningPaginatedSearchRecipe = async (term: string, pageNum : number, searchingByIngredient : boolean, filters: string[]) : Promise<SearchResults> => {
    console.log("term is " + term);
    console.log("filters are " + filters);

    if (term === INITIAL_TERM){
        return {results : []};
    }
    if (searchingByIngredient){
        const response = await axios.get('/search_ingredient/' + pageNum, {params: {term: term, filters: filters}});
        if (response.status > 300){
            throw new Error("Error fetching recipes by ingredient");
        } 
        return response.data;

    } else {
        const response = await axios.get('/search/' + pageNum, {params: {term: term, filters: filters}});
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
    selectedFilters: string[];
}

export const useFetchPaginatedSearchRecipeByTerm  = ()  => {
    const {data : term} = useQuery(['RecipeTerm'], () => "", {initialData : INITIAL_TERM});
    const {data : searchingByIngredient} = useQuery(['SearchingByIngredient'], () => false, {initialData : false});
    const { data: selectedFilters } = useQuery(['SelectedFilters'], () => selectedFilters, {
        initialData: [],
      });

    console.log(selectedFilters);

    const queryClient = useQueryClient();
    const setTerm = (t : string) => {
        queryClient.setQueryData(['RecipeTerm'], t)
    }
    const setSearchingByIngredient = (b : boolean) => {
        queryClient.setQueryData(['SearchingByIngredient'], b);
    }
    const setSelectedFilters = (b : boolean) => {
        queryClient.setQueryData(['SelectedFilters'], b);
    }

    const {data, isError, isFetchingNextPage, isLoading, fetchNextPage} = useInfiniteQuery<SearchResults>(
        ['fetchRecipeByTerm', term, searchingByIngredient, selectedFilters],
        ({pageParam = 0}) => fetchLocallyRunningPaginatedSearchRecipe(term ? term : INITIAL_TERM, pageParam, searchingByIngredient ? searchingByIngredient : false, selectedFilters ),
        {
            getNextPageParam: (lastPage, pages) => {
                return pages.length;
            }
        }
    );
    const searchResultsValue : Recipe[] = []
    if (data){
        data.pages.map((page) => {
            page.results.map((result) => searchResultsValue.push(result))

        })
    }
    return {
        data : {results: searchResultsValue}, 
        isError : isError, 
        isFetchingNextPage : isFetchingNextPage, 
        isLoading, loadMore : () => fetchNextPage(), 
        term : term ? term : INITIAL_TERM, 
        setTerm,
        searchingByIngredient : searchingByIngredient ? searchingByIngredient : false,
        setSearchingByIngredient,
        selectedFilters : selectedFilters ? selectedFilters : [],
        setSelectedFilters
    }
}