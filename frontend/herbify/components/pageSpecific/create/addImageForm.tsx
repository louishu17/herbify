import React, { useContext } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';
import Image from 'next/image';

export const ImageForm: React.FC = () => {
  const { imageFile, setImageFile } = useContext(NewRecipeContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files && event.target.files[0];
    if (uploadedFile) {
      setImageFile(uploadedFile);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Recipe Image</Typography>
      <label htmlFor="image-upload">
        <Button
          variant="contained"
          component="span"
          sx={{ marginTop: 2 }}
        >
          Upload Image
        </Button>
      </label>
      <input
        type="file"
        id="image-upload"
        onChange={handleFileChange}
        accept=".jpg"
        style={{ display: 'none' }}
      />
      {imageFile ? (
        <Image
          src={imageFile ? URL.createObjectURL(imageFile) : ''}
          alt="pic"
          width={250}
          height={200}
        />
      ) : null}
    </Container>
  );
};
