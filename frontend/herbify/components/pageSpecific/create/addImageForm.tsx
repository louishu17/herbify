import React, { useContext, useRef, useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';
import Image from "next/image";

export const ImageForm: React.FC = () => {
    const { imageFile, setImageFile } = useContext(NewRecipeContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageUrl(url);

            // Clean up the URL on unmount or when imageFile changes
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [imageFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files && event.target.files[0];
        if (uploadedFile) {
            setImageFile(uploadedFile);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="center" mt={2}>
                <Button 
                    variant="contained" 
                    onClick={handleButtonClick}
                    startIcon={<span role="img" aria-label="camera">📷</span>} 
                >
                    Upload Recipe Image
                </Button>
            </Box>
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".jpg, .jpeg, .png" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
            />
            <Box display="flex" justifyContent="center" mt={3}>
                {imageUrl && (
                    <Image 
                        src={imageUrl} 
                        alt="Uploaded Recipe" 
                        width={250} 
                        height={200} 
                    />
                )}
            </Box>
        </Container>
    );
};
