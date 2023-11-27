import { RecipeOnFeed } from "@/components/pageSpecific/feed/recipeOnFeed";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout"
import { HerbifyLoadingCircle, HerbifyLoadingContainer } from "@/components/shared/loading";
import { useFetchPaginatedFeed} from "@/lib/feedHooks";
import {Typography, Container, Button} from '@mui/material';
import React from "react";


export default function FeedPage() {
    //const {data : recipes, isLoading, isError} = useFetchBasicFeed();
    const {data : recipes, isLoading, isError, loadMore} = useFetchPaginatedFeed();

    let body = null;
    if (!recipes){
        body = <HerbifyLoadingContainer/>
    } else if (recipes){
        body = (
            <Container style={{alignContent: 'center'}} maxWidth="lg">
                {recipes.descriptions.map((recipe) => <RecipeOnFeed info={recipe} key={recipe.id}/>)}
                {isLoading ? <HerbifyLoadingCircle/> : null}
                <Button onClick={() => loadMore()} variant="contained" style={{paddingTop : 16, paddingBottom : 16, backgroundColor: "green"}}>Load More</Button>
            </Container>
        )
    } else {
        body = <Typography>An error Occurred</Typography>
    }

    return (
        <BaseHerbifyLayoutWithTitle title="Feed">
            {body}
        </BaseHerbifyLayoutWithTitle>
    )

}

