import { RecipeOnFeed } from "@/components/pageSpecific/feed/recipeOnFeed";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout"
import { HerbifyLoadingCircle, HerbifyLoadingContainer } from "@/components/shared/loading";
import { useFetchPaginatedFeed} from "@/lib/feedHooks";
import {Typography, Container, Button} from '@mui/material';
import React, {useEffect, useRef} from "react";


export default function FeedPage() {
    //const {data : recipes, isLoading, isError} = useFetchBasicFeed();
    const {data : recipes, isLoading, isError, loadMore} = useFetchPaginatedFeed();
    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading && recipes) {
                loadMore();
            }
        }, {threshold: 1});
        if (loader.current) {
            observer.observe(loader.current)
        }
        return () => {
            if (loader.current) {
                observer.unobserve(loader.current)
            }
        }
    }, [loadMore, isLoading])

    let body = null;
    if (!recipes){
        body = <HerbifyLoadingContainer/>
    } else if (recipes){
        body = (
            <Container style={{alignContent: 'center'}} maxWidth="lg">
                {recipes.descriptions.map((recipe) => <RecipeOnFeed info={recipe} key={recipe.id}/>)}
                <div ref={loader} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? <HerbifyLoadingCircle/> : null}
                </div>
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

