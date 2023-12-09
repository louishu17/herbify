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
import { withAuth } from '@/lib/authCheck';

// export const getServerSideProps = withAuth();

export default function SearchPage(){
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const {loadMore : loadMoreRecipes, setTerm : setRecipeTerm, setSearchingByIngredient, searchingByIngredient} = useFetchPaginatedSearchRecipeByTerm();
    const {loadMore : loadMoreUsers, setTerm : setUsersTerm} = useFetchPaginatedSearchUserByTerm();

    const handleSearchRecipesSubmit = async (term: string) => {
        setSearchingByIngredient(false);
        setRecipeTerm(term);
        loadMoreRecipes();
    };

    const handleSearchUsersSubmit = async (term: string) => {
        setUsersTerm(term);
        loadMoreUsers();
    };

    const handleSearchIngredientsSubmit = async (term : string) => {
        setSearchingByIngredient(true);
        setRecipeTerm(term);
        loadMoreRecipes();
    }

    const handleTabChange = (e: any, tabIndex: React.SetStateAction<number>) => {
        setCurrentTabIndex(tabIndex);
      };

    const handleSearchSubmit = () => {
        if (currentTabIndex === 0){
            return handleSearchRecipesSubmit;
        } else if (currentTabIndex === 1){
            return handleSearchIngredientsSubmit;
        } else {
            return handleSearchUsersSubmit;
        }

    }

    
    return (
        <BaseHerbifyLayoutWithTitle title="Search">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tabs value={currentTabIndex} onChange={handleTabChange}>
                    <Tab label="Search Recipes By Title"/>
                <Tab label="Search Recipes By Ingredient"/>
                    <Tab label="Search Users"/>
                </Tabs>
            </div>
            <SearchBar onSearchSubmit={handleSearchSubmit()}/>
            {currentTabIndex <=1 ? <SearchResults  /> : <SearchPageUsersResults />}   
              
        </BaseHerbifyLayoutWithTitle>
    )
}