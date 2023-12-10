import React from "react";
import {Container, Typography} from "@mui/material";
import { useFetchLocallyRunningLeadingPosts } from "@/lib/leaderboardPage/leadingPostsHooks";
import { RecipeOnFeed } from "../feed/recipeOnFeed";
import { HerbifyLoadingContainer } from "@/components/shared/loading";

export const LeadingPosts : React.FC = () => {
    const {data : recipes, isLoading, isError} = useFetchLocallyRunningLeadingPosts();

    
    if (isLoading){
        return <HerbifyLoadingContainer/>
    } else if (isError || !recipes){
        return <Typography align="center">An error occurred</Typography>
    } else {
        return (
            <Container maxWidth="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {recipes.descriptions.map((recipe) => <RecipeOnFeed  info={recipe} key={recipe.recipeID}/>)}
            </Container>
        )
    }

    
    

}
