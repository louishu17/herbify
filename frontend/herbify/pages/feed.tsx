import { RecipeOnFeed } from "@/components/pageSpecific/feed/recipeOnFeed";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout"
import { HerbifyLoadingCircle, HerbifyLoadingContainer } from "@/components/shared/loading";
import { useFetchPaginatedFeed} from "@/lib/feedHooks";
import {Typography, Container, Button} from '@mui/material';
import React, {useEffect, useRef} from "react";
import { fetchSessionId } from "@/lib/profileHooks";
import { withAuth } from '@/lib/authCheck';

export const getServerSideProps = withAuth();

export default function FeedPage() {
    //const {data : recipes, isLoading, isError} = useFetchBasicFeed();
    const {data : recipes, isLoading, isError, loadMore} = useFetchPaginatedFeed();
    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
    
            if (firstEntry.isIntersecting && !isLoading && recipes) {
                loadMore();
            }
        }, {threshold: .1});
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
                {recipes.descriptions.map((recipe) => <RecipeOnFeed info={recipe} key={recipe.recipeID}/>)}
                <div ref={loader} style={{ width: '100%', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? <HerbifyLoadingCircle/> : 'I am the loader'}
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

