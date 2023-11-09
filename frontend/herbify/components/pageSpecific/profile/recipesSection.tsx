import React from "react";
import { ProfileData, useFetchProfile, useUserID } from "@/lib/profileHooks";
import { HerbifyLoadingContainer } from "@/components/shared/loading";
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RecipeOnProfile } from "./recipeOnProfile";
export const RecipesSection : React.FC = () => {
    const userID = useUserID();
    const {data, isLoading, isError} = useFetchProfile(userID);
    if (isLoading) {
        return <HerbifyLoadingContainer/>
    } else if (isError) {
        return <Typography>Error loading the recipes</Typography>
    } else if (data) {
        return (
            <RecipesGrid container spacing={2}>
                {data.recipes.map((recipe, index) => {
                    return (
                        <RecipeOnProfile data={recipe} key={recipe.recipeID}/>
                    );
                })}
            </RecipesGrid>
        )
    } else {
        return null;
    }
    
}

const ProfileGrid = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(3),
  }));
  
  const ProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
  const RecipesGrid = styled(Grid)(({ theme }) => ({
    flexGrow: 1,
    marginTop: theme.spacing(2),
  }));
  
  const RecipeThumbnail = styled('img')({
    width: '100%',
    height: 'auto',
  });