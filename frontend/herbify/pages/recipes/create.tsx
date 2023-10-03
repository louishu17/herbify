import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography, Stack, Container, Button, Grid} from "@mui/material";
import {IngredientsForm} from "@/components/pageSpecific/create/addIngredientsForm";
import {DirectionsForm} from "@/components/pageSpecific/create/addDirectionsForm";
import { createContext, useState } from "react";
import { NewRecipeContext } from "@/lib/createRecipePage/newRecipeContext";
import { AddTitleForm } from "@/components/pageSpecific/create/addTitleForm";


export default function CreateRecipePage() {
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [directions, setDirections] = useState<string[]>(['']);
    const [title, setTitle] = useState<string>('');
    const handleSubmit = () => {
        console.log(ingredients);
        console.log(directions);
    }

    return (
        <BaseHerbifyLayoutWithTitle title="Create Recipe">
            <NewRecipeContext.Provider value={{title, setTitle, ingredients, setIngredients, directions, setDirections}}>
                <Container maxWidth="lg" >
                    <AddTitleForm/>
                    <Stack direction={"row"} spacing={6} >
                        <IngredientsForm/>
                        <DirectionsForm/>
                        
                    </Stack>
                    <Button variant="contained" onClick={handleSubmit} style={{backgroundColor: "Highlight", marginTop : 40}}>Submit Recipe</Button>
                </Container>
            </NewRecipeContext.Provider>
        </BaseHerbifyLayoutWithTitle>
    )
    
}