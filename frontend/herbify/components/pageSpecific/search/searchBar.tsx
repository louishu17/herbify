// SearchBar.tsx
import React, { useState } from 'react';
import { InputBase, Paper, IconButton, Container } from '@mui/material';
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
    <Container maxWidth="xs">
      <Paper 
        component="form" 
        style={{ 
          display: 'flex', // Ensures the contents are laid out in a row
        alignItems: 'right',
        width: '100%', // Adjust this value as needed
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
        <IconButton type="submit" style={{ padding: 10, marginRight: 0 }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Container>
  );
}
