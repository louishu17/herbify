import { RecipeOnFeed } from "@/components/pageSpecific/feed/recipeOnFeed";
import { BaseHerbifyLayout } from "@/components/shared/layouts/baseLayout"
import { HerbifyLoadingContainer } from "@/components/shared/loading";
import { useFetchFeed} from "@/lib/feedHooks";
import {Typography, Container} from '@mui/material';
import React from "react";


export default function FeedPage() {
    const {data : recipes, isLoading, isError} = useFetchFeed();

    if (isLoading){
        return <LoadingPage/>
    } else if (!isLoading && recipes){
        return (
            <BaseHerbifyLayout>
                <Container style={{alignContent: 'center'}} maxWidth="lg">
                    {recipes.descriptions.map((recipe) => <RecipeOnFeed info={recipe} key={recipe.id}/>)}
                </Container>
            </BaseHerbifyLayout>
        )
    }
    return (
        <BaseHerbifyLayout>
            <Typography>Feed</Typography>
        </BaseHerbifyLayout>
    )
}

const LoadingPage : React.FC = () => {
    return (
        <BaseHerbifyLayout>
            <HerbifyLoadingContainer/>
        </BaseHerbifyLayout>
    )
}