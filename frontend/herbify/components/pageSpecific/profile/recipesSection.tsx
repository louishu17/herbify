import React from "react";
import { ProfileData, useFetchProfile, useUserID } from "@/lib/profileHooks";
import { HerbifyLoadingContainer } from "@/components/shared/loading";
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RecipeOnProfile } from "./recipeOnProfile";
import { fetchLiked } from "@/lib/profileHooks";


const RecipesGrid = styled(Grid)(({ theme }) => ({
    flexGrow: 1,
    marginTop: theme.spacing(2),
    width: '100%',
}));

const StyledRecipesContainer = styled(Box)({
    width: '900px', // Adjust as per your design
    margin: '0 auto', // Center the container
});

interface RecipesContainerProps {
    recipes: any[]; // Replace 'any' with the appropriate type for your recipes
    user: any; // Replace 'any' with the appropriate type for your user data
}

const RecipesContainer: React.FC<RecipesContainerProps> = ({ recipes, user }) => {
    return (
        <StyledRecipesContainer>
            <RecipesGrid container spacing={2}>
                {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.recipeID}>
                        <RecipeOnProfile recipeSpecificData={recipe} profilePicS3Filename={user.profilePicS3Filename} />
                    </Grid>
                ))}
            </RecipesGrid>
        </StyledRecipesContainer>
    );
};

export const UserRecipesSection: React.FC = () => {
    const userID = useUserID();
    const { data, isLoading, isError } = useFetchProfile(userID);

    if (isLoading) {
        return <HerbifyLoadingContainer />;
    } else if (isError) {
        return <Typography>Error loading the recipes</Typography>;
    } else if (data) {
        return (
            <RecipesContainer recipes={data.recipes} user={data.user[0]}/>
        );
    } else {
        return null;
    }
};

export const LikedPostsSection: React.FC = async () => {
    const userID = useUserID();
    const data = await fetchLiked(userID);

    if (data) {
        return (
            <RecipesContainer recipes={data} user={data.user[0]}/>
        );
    } else {
        return null;
    }
}
