import { RecipeOnFeed } from "@/components/pageSpecific/feed/recipeOnFeed";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout"
import { HerbifyLoadingCircle, HerbifyLoadingContainer } from "@/components/shared/loading";
import { useFetchPaginatedFeed} from "@/lib/feedHooks";
import {Typography, Container, Button} from '@mui/material';
import React, {useEffect, useRef} from "react";
import { fetchSessionId } from "@/lib/profileHooks";
import { useRouter } from "next/router";
import { is } from "date-fns/locale";
import { useAuth } from "@/lib/authContext";





export default function FeedPage() {
    //const {data : recipes, isLoading, isError} = useFetchBasicFeed();
    const {data : recipes, isLoading, isError, loadMore} = useFetchPaginatedFeed();
    const loader = useRef(null);

    const router = useRouter();
    const { isAuthenticated } = useAuth();
    


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

    if (!isAuthenticated){
        return null;
    }

    if (!recipes){
        body = <HerbifyLoadingContainer/>
    } else if (recipes){
        body = (
            <Container maxWidth="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {recipes.descriptions.map((recipe) => <RecipeOnFeed  info={recipe} key={recipe.recipeID}/>)}
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

