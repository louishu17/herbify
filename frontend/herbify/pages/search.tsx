import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Tabs, Tab, } from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from 'axios';
import { SearchBar } from "@/components/pageSpecific/search/searchBar"; 
import { SearchResults } from "@/components/pageSpecific/search/searchResults"; 
import { SearchResultsUsers } from "@/components/pageSpecific/search/searchResultsUser"; 

export default function SearchPage(){
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    const handleSearchRecipesSubmit = async (term: string) => {
        interface searchBody {
            term: string;
        }
        const searchBodyTerm: searchBody = {term: term}

        try {
            const response = await axios.get(`http://127.0.0.1:5000/search`, {params: {term: term}});
            setSearchResults(response.data.results);
            console.log(response.data.results)
        } catch (error) {
            console.error("Failed to fetch search results:", error);
        }
    };

    const handleSearchUsersSubmit = async (term: string) => {
        interface searchBody {
            term: string;
        }
        const searchBodyTerm: searchBody = {term: term}

        try {
            const response = await axios.get(`http://127.0.0.1:5000/search_user`, {params: {term: term}});
            setSearchResults(response.data.results);
            console.log(response.data.results)
        } catch (error) {
            console.error("Failed to fetch search results:", error);
        }
    };

    const handleTabChange = (e: any, tabIndex: React.SetStateAction<number>) => {
        setCurrentTabIndex(tabIndex);
        setSearchResults([]);
      };

    const handleSearchSubmit = currentTabIndex === 0 ? handleSearchRecipesSubmit : handleSearchUsersSubmit;
    
    return (
        <BaseHerbifyLayoutWithTitle title="Search">
            <Tabs value={currentTabIndex} onChange={handleTabChange}>
                <Tab label="Search Recipes"/>
                <Tab label="Search Users"/>
            </Tabs>
            <SearchBar onSearchSubmit={handleSearchSubmit}/>
            {currentTabIndex === 0 ? (
                <SearchResults results={searchResults} />
            ) : (
                <SearchResultsUsers results={searchResults} />
            )}       
        </BaseHerbifyLayoutWithTitle>
    )
}