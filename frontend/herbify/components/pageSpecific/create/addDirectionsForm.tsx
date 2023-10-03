// components/DirectionsForm.tsx
import React, { useState, useContext} from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';


export const DirectionsForm: React.FC = () => {
  const {directions, setDirections} = useContext(NewRecipeContext);

  const handleAddDirection = () => {
    setDirections([...directions, '']);
  };

  const handleDirectionChange = (index: number, value: string) => {
    const updatedDirections = [...directions];
    updatedDirections[index] = value;
    setDirections(updatedDirections);
  };


  return (
    <Container maxWidth="md">
        <Typography variant="h4">Directions</Typography>
      {directions.map((direction, index) => (
        <TextField
          key={index}
          label={`Direction ${index + 1}`}
          value={direction}
          onChange={(e) => handleDirectionChange(index, e.target.value)}
          fullWidth
          margin="dense"
        />
      ))}

      <Button variant="outlined" onClick={handleAddDirection} >
        Add More
      </Button>
      </Container>
  );
};
