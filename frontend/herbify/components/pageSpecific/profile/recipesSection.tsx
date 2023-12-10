import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, styled } from '@mui/material';
import { useUserID } from '@/lib/profileHooks';
import { HerbifyLoadingContainer } from "@/components/shared/loading";
import { fetchLiked } from "@/lib/profileHooks";
import { useFetchProfile } from '@/lib/profileHooks';
import { RecipeOnProfile } from '@/components/pageSpecific/profile/recipeOnProfile';

export const LikedPostsSection: React.FC = () => {
    const userID = useUserID();
    const [data, setData] = useState<any[]>([]); // Replace 'any' with the appropriate type
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchLiked(userID);
                setData(result);
                setIsLoading(false);
            } catch (error) {
                setIsError(true);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userID]);

    if (isLoading) {
        return <HerbifyLoadingContainer />;
    } else if (isError) {
        return <Typography>Error loading the liked posts</Typography>;
    } else if (data && data.length > 0 && data[0]) {
        console.log(data);
        return <RecipesContainer recipes={data} />;
    } else {
        return <Box style={{justifyContent: 'center', container: 'flex'}}><Typography >No liked posts found</Typography></Box>;
        
    }
};


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
}

const RecipesContainer: React.FC<RecipesContainerProps> = ({ recipes }) => {
    return (
        <StyledRecipesContainer>
            <RecipesGrid container spacing={2}>
                {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.recipeID}>
                        <RecipeOnProfile recipeSpecificData={recipe} profilePicS3Filename={recipe.profilePicS3Filename} />
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
            <RecipesContainer recipes={data.recipes} />
        );
    } else {
        return null;
    }
};

