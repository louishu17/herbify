import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Tabs, Tab, Button, Typography, Checkbox, FormControlLabel, Popover } from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, { useState } from "react";
import { object as YupObject, string as YupString } from 'yup';
import { SearchBar } from "@/components/pageSpecific/search/searchBar";
import { SearchResults } from "@/components/pageSpecific/search/searchResultsRecipe";
import { SearchPageUsersResults } from "@/components/pageSpecific/search/searchResultsUser";
import { FilterPopover } from "@/components/pageSpecific/search/searchFilterPopover";
import { useFetchPaginatedSearchRecipeByTerm } from "@/lib/searchPage/searchByTermHooks";
import { useFetchPaginatedSearchUserByTerm } from "@/lib/searchPage/searchUserByTermHooks";
import { withAuth } from '@/lib/authCheck';

export const getServerSideProps = withAuth();

export default function SearchPage() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // State to manage filter popover
  // const [selectedFilters, setSelectedFilters] = useState([]); // State to store selected filters
  const [currentFilters, setCurrentFilters] = useState([]);

  const { loadMore: loadMoreRecipes, setTerm: setRecipeTerm, setSearchingByIngredient, searchingByIngredient, selectedFilters, setSelectedFilters } = useFetchPaginatedSearchRecipeByTerm();
  const { loadMore: loadMoreUsers, setTerm: setUsersTerm } = useFetchPaginatedSearchUserByTerm();

  const handleSearchRecipesSubmit = async (term: string) => {
    setSearchingByIngredient(false);
    setRecipeTerm(term);
    loadMoreRecipes();
  };

  const handleSearchUsersSubmit = async (term: string) => {
    setUsersTerm(term);
    loadMoreUsers();
  };

  const handleSearchIngredientsSubmit = async (term: string) => {
    setSearchingByIngredient(true);
    setRecipeTerm(term);
    loadMoreRecipes();
  }

  const handleTabChange = (e: any, tabIndex: React.SetStateAction<number>) => {
    setCurrentTabIndex(tabIndex);
  };

  const handleSearchSubmit = () => {
    if (currentTabIndex === 0) {
      return handleSearchRecipesSubmit;
    } else if (currentTabIndex === 1) {
      return handleSearchIngredientsSubmit;
    } else {
      return handleSearchUsersSubmit;
    }
  }

  const handleOpenFilter = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterOptionChange = (event) => {
    const value = event.target.value;
    if (currentFilters.includes(value)) {
      setCurrentFilters(currentFilters.filter((filter) => filter !== value));
    } else {
      setCurrentFilters([...currentFilters, value]);
    }
  };

  const applyFilters = () => {
    setSelectedFilters(currentFilters);
    handleSearchSubmit();
    handleCloseFilter();
  };

  return (
    <BaseHerbifyLayoutWithTitle title="Search">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs value={currentTabIndex} onChange={handleTabChange}>
          <Tab label="Search Recipes By Title" />
          <Tab label="Search Recipes By Ingredient" />
          <Tab label="Search Users" />
        </Tabs>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SearchBar onSearchSubmit={handleSearchSubmit()} />
        {currentTabIndex <= 1 && (
          <Button onClick={handleOpenFilter}>
            Filter
          </Button>
        )}
      </div>
      {currentTabIndex <= 1 ? <SearchResults /> : <SearchPageUsersResults />}
      <FilterPopover
        filterAnchorEl={filterAnchorEl}
        handleCloseFilter={handleCloseFilter}
        selectedFilters={currentFilters}
        handleFilterOptionChange={handleFilterOptionChange}
        applyFilters={applyFilters}
        filterOptions={[
          "Vegan",
          "Gluten-Free",
          "High-Protein",
          "Keto",
          "Kid-Friendly",
          "Nut-Free",
          "Spicy",
          "Vegetarian"
        ]}
      />
    </BaseHerbifyLayoutWithTitle>
  )
}
