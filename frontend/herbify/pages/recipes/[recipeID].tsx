import { BaseHerbifyLayout } from "@/components/shared/layouts/baseLayout";
import { useRouter } from "next/router";
import { useBasicRecipeInfo, useRecipeID} from "@/lib/recipePage/basicRecipeInfoHooks";
import { BasicRecipeInfo } from "../api/recipe/[recipeID]/recipeInfo";
import { RecipeHeader } from "../../components/pageSpecific/recipePage/RecipeHeader";
import {Container} from "@mui/material"
import { IngredientsSection } from "@/components/pageSpecific/recipePage/ingredientsSection";
import { DirectionsSection } from "@/components/pageSpecific/recipePage/directionsSection";
import { PictureSection } from "@/components/pageSpecific/recipePage/pictureSection";
export default function RecipePage() {
    const router = useRouter();
    const recipeID = useRecipeID();
    const {data, isLoading, isError} = useBasicRecipeInfo(recipeID);
    return (
        <BaseHerbifyLayout>
            <Container maxWidth="lg">
                <RecipeHeader />
                <PictureSection/>
                <IngredientsSection />
                <DirectionsSection/>
            </Container>
        </BaseHerbifyLayout>
    )
}


