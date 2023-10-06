import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';


interface Recipe {
    recipeID: number;
    postedByUserID: number;
    createdDate: Date;
    title: string;
    caption?: string;
}

interface SearchResultsProps {
  results: Recipe[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
    if (results.length === 0) {
        return <Typography>No recipes found.</Typography>;
      }

  return (
    (results && <List style={{marginLeft: '20%'}}>
      {results.map(recipe => (
        <ListItem key={recipe.recipeID} divider >
          <ListItemText 
            primary={recipe.title}
            secondary={recipe.caption}
          />
        </ListItem>
      ))}
    </List>)
  );
}

export { SearchResults };
