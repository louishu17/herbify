// components/DirectionsForm.tsx
import React, { useState, useContext} from 'react';
import { Button, TextField, Container } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';


export const AddTitleForm: React.FC = () => {
  const {title, setTitle} = useContext(NewRecipeContext);
  const {caption, setCaption} = useContext(NewRecipeContext);

  const handleDirectionChange = (value: string) => {
    setTitle(value); 
  };

  return (
    <Container maxWidth="md">
        <TextField
          label={"Recipe Title (e.g., 'Berry Tart')"}
          value={title}
          onChange={(e) => handleDirectionChange(e.target.value)}
          fullWidth
          InputProps={{
            style: { fontSize: 30 } 
          }}
          InputLabelProps={{
            style: { fontSize: 30 }
          }}
        />

        <TextField
          label= {"Short Description (e.g., 'A delightful treat for warm days')"}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          fullWidth
          multiline
          rows={3}
          InputProps={{
            style: { fontSize: 15 } 
          }}
          InputLabelProps={{
            style: { fontSize: 15 }
          }}
          style={{marginTop: '10'}}
        />
      </Container>
  );
};

