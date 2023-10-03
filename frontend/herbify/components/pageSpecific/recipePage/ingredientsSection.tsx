import React from "react";
import { useIngredients, useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import {Typography, Container, List, ListItem} from "@mui/material";
import { HerbifyLoadingCircle } from "@/components/shared/loading";

interface IngredientsSectionProps{

}
export const IngredientsSection : React.FC<IngredientsSectionProps> = (props : IngredientsSectionProps) => {
    return (
        <Container>
            <Typography variant="h3">Ingredients</Typography>
            <IngredientsBody/>
        </Container>
        

    )
}


const IngredientsBody : React.FC = () => {
    const recipeID = useRecipeID();
    const {data : ingredients, isLoading, isError} = useIngredients(recipeID);
    if (isLoading){
        return <HerbifyLoadingCircle/>
    } else if (isError) {
        return <Typography>An error occurred while loading the ingredients</Typography>
    } else if (ingredients){
        return (
            <Container maxWidth="md">
                <List>
                    {ingredients.ingredients.map((ingredient) => <ListItem key={ingredient} ><Typography>{ingredient}</Typography></ListItem>)}
                </List>
            </Container>
        )
    }
   
}