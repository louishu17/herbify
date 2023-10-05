// components/DirectionsForm.tsx
import React, { useState, useContext} from 'react';
import { Button, TextField, Container } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';


export const AddTitleForm: React.FC = () => {
  const {title, setTitle} = useContext(NewRecipeContext);

  const handleDirectionChange = (value: string) => {
    setTitle(value); 
  };

  return (
    <Container maxWidth="md">
        <TextField
          label={"Title"}
          value={title}
          onChange={(e) => handleDirectionChange( e.target.value)}
          fullWidth
          
        />
      </Container>
  );
};

