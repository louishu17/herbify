import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography, Stack, Container, Button, Grid} from "@mui/material";
import {IngredientsForm} from "@/components/pageSpecific/create/addIngredientsForm";
import {DirectionsForm} from "@/components/pageSpecific/create/addDirectionsForm";
import { createContext, useState } from "react";
import { NewRecipeContext } from "@/lib/createRecipePage/newRecipeContext";
import { AddTitleForm } from "@/components/pageSpecific/create/addTitleForm";
import axios from 'axios';

export default function CreateRecipePage() {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [directions, setDirections] = useState<string[]>(['']);
    const [title, setTitle] = useState<string>('');
    const [caption, setCaption] = useState<string>('');

    const createRecipe = async () => {
        try {
            const recipe_data = {
                postedByUserID: 1,
                title: title,
                caption: caption,
                ingredients: ingredients,
                steps: directions
            }

            const response = await axios.post('http://127.0.0.1:5000/create-recipe', recipe_data);
        }
        catch (error) {
            console.error(error);
            setErrorMessage("An unexpected error occurred");
        }
    }

    const handleSubmit = () => {
        createRecipe();
    }

    return (
        <BaseHerbifyLayoutWithTitle title="Create Recipe">
            <NewRecipeContext.Provider value={{title, setTitle, caption, setCaption, ingredients, setIngredients, directions, setDirections}}>
                <Container maxWidth="lg" >
                    <AddTitleForm/>
                    <Stack direction={"row"} spacing={6} >
                        <IngredientsForm/>
                        <DirectionsForm/>
                    </Stack>
                    <Button variant="contained" onClick={handleSubmit} style={{backgroundColor: "Highlight", marginTop : 40, display: "block", margin: "0 auto"}}>Submit Recipe</Button>
                </Container>
            </NewRecipeContext.Provider>
        </BaseHerbifyLayoutWithTitle>
    )
    
}