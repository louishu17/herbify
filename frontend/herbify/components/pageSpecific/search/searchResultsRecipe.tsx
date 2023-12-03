import React from 'react';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import Link from "next/link";
import { useFetchPaginatedSearchRecipeByTerm, INITIAL_TERM } from '@/lib/searchPage/searchByTermHooks';
import { HerbifyLoadingCircle } from '@/components/shared/loading';


export interface Recipe {
    recipeID: number;
    postedByUserID: number;
    createdDate: Date;
    title: string;
    caption?: string;
}

export interface SearchResults {
  results: Recipe[];
}

const SearchResults: React.FC = () => {
    const {data : {results}, term, isLoading, isFetchingNextPage, isError, loadMore} = useFetchPaginatedSearchRecipeByTerm();
    const atLeastOneLoad = term !== INITIAL_TERM && !isLoading && !isFetchingNextPage;
    if (results.length === 0 && atLeastOneLoad) {
        return <Typography>No recipes found.</Typography>;
    }

  return (
    <>
      {results && <List style={{marginLeft: '20%'}}>
        {results.map(recipe => (
          <ListItem key={recipe.recipeID} divider >
              <Link href={"/recipes/"+recipe.recipeID} passHref>
                  <ListItemText 
                      primary={recipe.title}
                      secondary={recipe.caption}
                  />
            </Link>
          </ListItem>
        ))}
      </List>}
      {isLoading || isFetchingNextPage ? <Typography align="center"><HerbifyLoadingCircle/></Typography> : null}
      {isError ? <Typography align="center">An Error Occurred</Typography> : null}
      {atLeastOneLoad ? 
        <Button onClick={() => loadMore()}>
            <Typography align="center">Load More</Typography>
        </Button> 
        : 
        null
      }  
    </>
  );
}

export { SearchResults };
