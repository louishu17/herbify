import { BaseHerbifyLayout } from "@/components/shared/layouts/baseLayout";
import { useRouter } from "next/router";
import { useBasicRecipeInfo, useRecipeID} from "@/lib/recipePage/basicRecipeInfoHooks";
import { useLikeRecipe, useUnlikeRecipe } from "@/lib/recipePage/likeRecipeHooks";
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
    const recipeID = useRecipeID();
    const {data, isLoading, isError} = useBasicRecipeInfo(recipeID);
    const { mutate: like } = useLikeRecipe();
    const { mutate: unlike } = useUnlikeRecipe();
  

    const [userLiked, setUserLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        if (data) {
            setUserLiked(data.userLiked);
            setLikes(data.numLikes);
        }
    }, [data]);

    const handleLikeClick = () => {
        if (userLiked) {
            // User has already liked the recipe, so unlike it
            unlike(recipeID, {
                onSuccess: () => {
                    console.log("unliked");
                    setUserLiked(false);
                    setLikes(likes => likes - 1);
                }
            });
        } else {
            // User hasn't liked the recipe, so like it
            like(recipeID, {
                onSuccess: () => {
                    console.log("liked");
                    setUserLiked(true);
                    setLikes(likes => likes + 1);
                }
            });
        }
    };

    
    return (
        <BaseHerbifyLayout>
            <Container maxWidth="lg">
                <RecipeHeader />
                <PictureSection/>
                <IconButton onClick={handleLikeClick} aria-label="like" disabled={isLoading}>
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


