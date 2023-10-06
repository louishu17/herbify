import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography} from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from 'axios';
import { SearchBar } from "@/components/pageSpecific/search/searchBar"; 
import { SearchResults } from "@/components/pageSpecific/search/searchResults"; 


export default function SearchPage(){
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearchSubmit = async (term: string) => {
        interface searchBody {
            term: string;
        }
        const searchBodyTerm: searchBody = {term: term}

        try {
            const response = await axios.get(`http://127.0.0.1:5000/search`, {params: {term: term}});
            setSearchResults(response.data.results);
        } catch (error) {
        console.error("Failed to fetch search results:", error);
        }
    };
    

    return (
        <BaseHerbifyLayoutWithTitle title="Search">
            <h1>My Social Media App</h1>
            <SearchBar onSearchSubmit={handleSearchSubmit} />
            <SearchResults results={searchResults} />
        </BaseHerbifyLayoutWithTitle>
    )
}