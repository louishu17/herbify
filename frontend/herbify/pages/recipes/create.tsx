import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Stack, Container, Button, Box } from "@mui/material";
import {IngredientsForm} from "@/components/pageSpecific/create/addIngredientsForm";
import {DirectionsForm} from "@/components/pageSpecific/create/addDirectionsForm";
import { TagsForm } from "@/components/pageSpecific/create/addTagsForm";
import { ImageForm } from "@/components/pageSpecific/create/addImageForm";
import { useState } from "react";
import { NewRecipeContext } from "@/lib/createRecipePage/newRecipeContext";
import { AddTitleForm } from "@/components/pageSpecific/create/addTitleForm";
import { TimeForm } from "@/components/pageSpecific/create/addTimeForm";
import axios from 'axios';
import { useRouter } from "next/router";
import { withAuth } from '@/lib/authCheck';

// export const getServerSideProps = withAuth();

export default function CreateRecipePage() {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [directions, setDirections] = useState<string[]>(['']);
    const [title, setTitle] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [tags, setTags] = useState<string[]>(['']);
    const router = useRouter();

    const createRecipe = async () => {
        try {
            const recipe_data = {
                postedByUserID: 1,
                title: title,
                caption: caption,
                ingredients: ingredients,
                steps: directions,
                hours: hours,
                minutes: minutes,
                tags: tags
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
            <NewRecipeContext.Provider value={{title, setTitle, imageFile, setImageFile, caption, setCaption, ingredients, setIngredients, directions, setDirections, tags, setTags, hours, setHours, minutes, setMinutes}}>
            <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Stack spacing={6} style={{ width: '100%', maxWidth: 500, paddingBottom: 6 }}>
                        <ImageForm />
                        <Box bgcolor="#FFFAF7" p={2} borderRadius={2}>
                            <AddTitleForm />
                            <TimeForm />
                        </Box>
                        <Box bgcolor="#FFFAF7" p={2} borderRadius={2}>
                            <IngredientsForm />
                        </Box>
                        <Box bgcolor="#FFFAF7" p={2} borderRadius={2}>
                            <DirectionsForm />
                        </Box>
                        <Box bgcolor="#FFFAF7" p={2} borderRadius={2}>
                            <TagsForm />
                        </Box>
                    </Stack>
                    <Box style={{ width: '100%', maxWidth: 400, marginTop: 40, marginBottom: 40 }}>
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit} 
                            fullWidth
                            style={{ backgroundColor: "Highlight" }}
                        >
                            Submit Recipe
                        </Button>
                    </Box>
                </Container>
            </NewRecipeContext.Provider>
        </BaseHerbifyLayoutWithTitle>
    )
    
}