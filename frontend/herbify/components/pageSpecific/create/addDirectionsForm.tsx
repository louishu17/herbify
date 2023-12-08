// components/DirectionsForm.tsx
import React, { useState, useContext} from 'react';
import { Button, TextField, Container, Typography, IconButton } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';
import { Delete } from '@mui/icons-material'; // Import the Delete icon from Material-UI icons

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

  const handleRemoveDirection = (index: number) => {
    const updatedDirections = [...directions];
    updatedDirections.splice(index, 1);
    setDirections(updatedDirections);
  };


  return (
    <Container maxWidth="md">
        <Typography variant="h4">Directions</Typography>
      {directions.map((direction, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <TextField
          label={`Direction ${index + 1}`}
          value={direction}
          onChange={(e) => handleDirectionChange(index, e.target.value)}
          fullWidth
          margin="dense"
        />
        <IconButton
          aria-label={`Delete Direction ${index + 1}`}
          onClick={() => handleRemoveDirection(index)}
        >
          <Delete />
        </IconButton>
      </div>
      ))}

      <Button variant="outlined" onClick={handleAddDirection} >
        Add More
      </Button>
      </Container>
  );
};
