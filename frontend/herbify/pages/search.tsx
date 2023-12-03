import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Tabs, Tab, Button, Typography} from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from 'axios';
import { SearchBar } from "@/components/pageSpecific/search/searchBar"; 
import { SearchResults } from "@/components/pageSpecific/search/searchResultsRecipe"; 
import { SearchPageUsersResults } from "@/components/pageSpecific/search/searchResultsUser"; 
import { useFetchPaginatedSearchRecipeByTerm } from "@/lib/searchPage/searchByTermHooks";
import { useFetchPaginatedSearchUserByTerm } from "@/lib/searchPage/searchUserByTermHooks";

export default function SearchPage(){
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const {loadMore : loadMoreRecipes, setTerm : setRecipeTerm} = useFetchPaginatedSearchRecipeByTerm();
    const {loadMore : loadMoreUsers, setTerm : setUsersTerm} = useFetchPaginatedSearchUserByTerm();

    const handleSearchRecipesSubmit = async (term: string) => {
        setRecipeTerm(term);
        loadMoreRecipes();
    };

    const handleSearchUsersSubmit = async (term: string) => {
        setUsersTerm(term);
        loadMoreUsers();
    };

    const handleTabChange = (e: any, tabIndex: React.SetStateAction<number>) => {
        setCurrentTabIndex(tabIndex);
      };

    const handleSearchSubmit = currentTabIndex === 0 ? handleSearchRecipesSubmit : handleSearchUsersSubmit;
    
    return (
        <BaseHerbifyLayoutWithTitle title="Search">
            <Tabs value={currentTabIndex} onChange={handleTabChange}>
                <Tab label="Search Recipes"/>
                <Tab label="Search Users"/>
            </Tabs>
            <SearchBar onSearchSubmit={handleSearchSubmit}/>
            {currentTabIndex === 0 ? <SearchResults  /> : <SearchPageUsersResults />}   
              
        </BaseHerbifyLayoutWithTitle>
    )
}