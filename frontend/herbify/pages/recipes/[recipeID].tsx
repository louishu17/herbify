import { BaseHerbifyLayout } from "@/components/shared/layouts/baseLayout";
import { useRouter } from "next/router";
import { useBasicRecipeInfo, useRecipeID} from "@/lib/recipePage/basicRecipeInfoHooks";
import { BasicRecipeInfo } from "../api/recipe/[recipeID]/recipeInfo";
import { RecipeHeader } from "../../components/pageSpecific/recipePage/RecipeHeader";
import {Container} from "@mui/material"
import { IngredientsSection } from "@/components/pageSpecific/recipePage/ingredientsSection";
import { DirectionsSection } from "@/components/pageSpecific/recipePage/directionsSection";
import { PictureSection } from "@/components/pageSpecific/recipePage/pictureSection";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useEffect, useState } from "react";


export default function RecipePage() {
    const router = useRouter();
    const recipeID = useRecipeID();
    const {data, isLoading, isError} = useBasicRecipeInfo(recipeID);

    const [userLiked, setUserLiked] = useState(false);
    const [likes, setLikes] = useState(data?.numLikes || 0);
    
    useEffect(() => {
        // Fetch user's like status from the database
        const fetchUserLikeStatus = async () => {
            try {
                const response = await getUserLikeStatusAPI(recipeID);
                setUserLiked(response.userLiked);
                setLikes(response.numLikes);
            } catch (error) {
                console.error("Failed to fetch user like status", error);
                // Handle error appropriately
            }
        };

        if (recipeID) {
            fetchUserLikeStatus();
        }
    }, [recipeID]);
    
    // Fetch user like status and total likes when component mounts or recipeID changes
    const handleLikeClick = async () => {
        if (userLiked) {
            // User has already liked the recipe, so unlike it
            // Call API to unlike the recipe
            // Example: await unlikeRecipeAPI(recipeID);
    
            setUserLiked(false);
            setLikes(likes - 1);
        } else {
            // User hasn't liked the recipe, so like it
            // Call API to like the recipe
            // Example: await likeRecipeAPI(recipeID);
    
            setUserLiked(true);
            setLikes(likes + 1);
        }
    };
    
    
    return (
        <BaseHerbifyLayout>
            <Container maxWidth="lg">
                <RecipeHeader />
                <PictureSection/>
                <IconButton onClick={handleLikeClick} aria-label="like">
                    {userLiked ? <FavoriteIcon style={{color: "red"}} /> : <FavoriteBorderIcon />}
                </IconButton>
                <span>{likes} Likes</span>
                <IngredientsSection />
                <DirectionsSection/>
                <div>
            </div>
            </Container>
        </BaseHerbifyLayout>
    )
}


