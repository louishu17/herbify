// components/IngredientsForm.tsx
import React, { useState, useContext} from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';


export const IngredientsForm: React.FC = () => {
  const {ingredients, setIngredients: setNewIngredients} = useContext(NewRecipeContext);

  const handleAddIngredient = () => {
    setNewIngredients([...ingredients, '']);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setNewIngredients(updatedIngredients);
  };


  return (
    <Container maxWidth="md">
        <Typography variant="h4">Ingredients</Typography>
      {ingredients.map((ingredient, index) => (
        <TextField
          key={index}
          label={`Ingredient ${index + 1}`}
          value={ingredient}
          onChange={(e) => handleIngredientChange(index, e.target.value)}
          fullWidth
          margin="dense"
        />
      ))}

      <Button variant="outlined" onClick={handleAddIngredient} >
        Add More
      </Button>

      </Container>
  );
};

