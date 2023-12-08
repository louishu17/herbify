import React, { useState, useContext } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  IconButton, // Import IconButton from Material-UI
} from '@mui/material';
import { Delete } from '@mui/icons-material'; // Import the Delete icon from Material-UI icons
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';

export const IngredientsForm: React.FC = () => {
  const { ingredients, setIngredients: setNewIngredients } = useContext(NewRecipeContext);

  const handleAddIngredient = () => {
    setNewIngredients([...ingredients, '']);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setNewIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setNewIngredients(updatedIngredients);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Ingredients</Typography>
      {ingredients.map((ingredient, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <TextField
            label={`Ingredient ${index + 1}`}
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            fullWidth
            margin="dense"
          />
          <IconButton
            aria-label={`Delete Ingredient ${index + 1}`}
            onClick={() => handleRemoveIngredient(index)}
          >
            <Delete />
          </IconButton>
        </div>
      ))}

      <Button variant="outlined" onClick={handleAddIngredient}>
        Add More
      </Button>
    </Container>
  );
};
