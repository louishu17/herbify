import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Stack, Container, Button} from "@mui/material";
import {IngredientsForm} from "@/components/pageSpecific/create/addIngredientsForm";
import {DirectionsForm} from "@/components/pageSpecific/create/addDirectionsForm";
import { TagsForm } from "@/components/pageSpecific/create/addTagsForm";
import { ImageForm } from "@/components/pageSpecific/create/addImageForm";
import { useState } from "react";
import { NewRecipeContext } from "@/lib/createRecipePage/newRecipeContext";
import { AddTitleForm } from "@/components/pageSpecific/create/addTitleForm";
import axios from 'axios';
import { useRouter } from "next/router";

export default function CreateRecipePage() {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [directions, setDirections] = useState<string[]>(['']);
    const [title, setTitle] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [tags, setTags] = useState<string[]>(['']);
    const router = useRouter();

    const createRecipe = async () => {
        try {
            const recipe_data = {
                postedByUserID: 1,
                title: title,
                caption: caption,
                ingredients: ingredients,
                steps: directions
            }
            const formData = new FormData();

            // Append recipe data fields to the FormData object
            formData.append("nonImageData", JSON.stringify(recipe_data));

            // Append the selected file to the FormData object
            if (imageFile){
                formData.append('imageFile', imageFile);
            }
            

            const response = await axios.post('http://127.0.0.1:5000/create-recipe', formData, {withCredentials: true});

            router.push("/feed");
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
            <NewRecipeContext.Provider value={{title, setTitle, imageFile, setImageFile, caption, setCaption, ingredients, setIngredients, directions, setDirections, tags, setTags}}>
                <Container maxWidth="lg">
                    <Stack width={400} spacing={6} style={{paddingBottom:6}}>
                        <AddTitleForm/>
                        <ImageForm/>
                        <IngredientsForm/>
                        <DirectionsForm/>
                        <TagsForm/>
                    </Stack>
                    <Button variant="contained" onClick={handleSubmit} style={{backgroundColor: "Highlight", marginTop : 40, display: "block", margin: "0 auto"}}>Submit Recipe</Button>
                </Container>
            </NewRecipeContext.Provider>
        </BaseHerbifyLayoutWithTitle>
    )
    
}