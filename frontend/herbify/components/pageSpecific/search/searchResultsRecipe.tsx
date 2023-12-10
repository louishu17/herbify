import React from 'react';
import { Typography, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { useFetchPaginatedSearchRecipeByTerm, INITIAL_TERM } from '@/lib/searchPage/searchByTermHooks';
import { HerbifyLoadingCircle } from '@/components/shared/loading';
import Link from "next/link";
import { useImageForProfilePic, INVALID_S3_FILENAME } from '@/lib/profilePicHooks';

export interface Recipe {
    recipeID: number;
    postedByUserID: number;
    title: string;
    caption?: string;
    imageS3Filename: string;
    rating?: number;
}

export interface RecipesListProps {
  results: Recipe[];
  onClose?: () => void;
  isRatings: boolean;
}

interface RecipeResultProps {
  recipe: Recipe;
  onClose?: () => void;
}

const avatarStyle = {
  // Define your avatar styles here
};

export const RecipeResult: React.FC<RecipeResultProps> = ({ recipe, isRatings }) => {
  const {data : profilePicImgSrc, isLoading : isLoadingProfilePic, isError : isErrorLoadingProfilePic} = useImageForProfilePic(recipe.imageS3Filename);

  return (
      <ListItem key={recipe.recipeID} divider>
            <Avatar 
                alt={recipe.title} 
                src={(profilePicImgSrc && !isLoadingProfilePic && !isErrorLoadingProfilePic) ? profilePicImgSrc : INVALID_S3_FILENAME}
                style={avatarStyle}
                sx={{ marginRight: 2 }}
            />
          <Link href={`/recipes/${recipe.recipeID}`} passHref>
              <ListItemText 
                  primary={recipe.title} 
                  secondary={recipe.caption} 
              />
          </Link>
          {
            isRatings && (
                <ListItemText 
                primary={recipe.rating} 
                sx={{ textAlign: 'right' }}
            />
            )
          }
      </ListItem>
  );
};

export const RecipesList: React.FC<RecipesListProps> = ({ results, isRatings }) => {

  const { isLoading, isFetchingNextPage, isError, loadMore } = useFetchPaginatedSearchRecipeByTerm();

  if ( (!results || results.length === 0) && !isLoading && !isFetchingNextPage) {
      return <Typography>No recipes found.</Typography>;
  }

  return (
      <>
          <List style={{ marginLeft: '20%' }}>
              {results.map(recipe => <RecipeResult key={recipe.recipeID} recipe={recipe} isRatings={isRatings} />)}
          </List>
          {isLoading || isFetchingNextPage ? <Typography align="center"><HerbifyLoadingCircle/></Typography> : null}
          {isError ? <Typography align="center">An Error Occurred</Typography> : null}
      </>
  );
};

export const SearchResults: React.FC = () => {
    const { data: { results }, isLoading, isFetchingNextPage, isError, loadMore, term } = useFetchPaginatedSearchRecipeByTerm();

    const atLeastOneLoad = term !== INITIAL_TERM && !isLoading && !isFetchingNextPage;

    if (results.length === 0 && atLeastOneLoad) {
        return <Typography>No recipes found.</Typography>;
    }

    return (
        <>
            <RecipesList results={results || []} />
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
};
