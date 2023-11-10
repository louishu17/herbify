import React, { useState, useContext } from 'react';
import { Button, Container, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';

const tagOptions = [
    'Gluten Free',
    'Lactose Free',
    'Vegan',
    '6 Minutes or Less',
    'Low Carb',
    'High Protein',
    'Kid-Friendly',
    'Vegetarian',
    'Paleo',
    'Keto',
    'Spicy',
    'Quick & Easy',
    'Comfort Food',
    'Healthy',
    'Dairy-Free',
    'Nut-Free',
    'No Added Sugar',
    'Grilled',
    'One-Pot',
    'Make-Ahead'
  ];


export const TagsForm: React.FC = () => {
  const { tags, setTags: setNewTags } = useContext(NewRecipeContext);

  const handleAddTag = () => {
    setNewTags([...tags, '']);
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setNewTags(updatedTags);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Tags</Typography>
      {tags.map((tag, index) => (
        <FormControl key={index} fullWidth margin="dense">
          <InputLabel id={`tag-label-${index}`}>{`Tag ${index + 1}`}</InputLabel>
          <Select
            labelId={`tag-label-${index}`}
            id={`tag-${index}`}
            value={tag}
            onChange={(e) => handleTagChange(index, e.target.value as string)}
            fullWidth
          >
            {tagOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Button variant="outlined" onClick={handleAddTag}>
        Add More
      </Button>
    </Container>
  );
};