// SearchBar.tsx
import React, { useState } from 'react';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    onSearchSubmit: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    // Handle the search logic here
    // For instance, you might call an API to fetch search results based on the searchTerm
    console.log("Searching for:", searchTerm);
    e.preventDefault();
    onSearchSubmit(searchTerm);
  };

  return (
    <Paper 
      component="form" 
      style={{ 
        alignItems: 'center'
      }}
      onSubmit={handleSearchSubmit}
    >
      <InputBase
        style={{ marginLeft: 8, flex: 1 }}
        placeholder="Search..."
        inputProps={{ 'aria-label': 'Search for users or posts' }}
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <IconButton type="submit" style={{ padding: 10 }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
