// components/IngredientsForm.tsx
import React, {  useContext} from 'react';
import {  Container, Typography } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';


export const ImageForm: React.FC = () => {

    const {imageFile, setImageFile} = useContext(NewRecipeContext);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files && event.target.files[0];
        if (uploadedFile) {
            setImageFile(uploadedFile);
        }
    };


    return (
        <Container maxWidth="md">
            <Typography variant="h4">Recipe Image</Typography>
            <input type="file" onChange={handleFileChange} accept=".jpg" />
        </Container>
    );
};
