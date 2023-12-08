import React, { useState, useContext } from 'react';
import {
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';

const tagOptions = [
  'Gluten Free',
  'Vegan',
  'High Protein',
  'Kid-Friendly',
  'Vegetarian',
  'Keto',
  'Spicy',
  'Quick & Easy',
  'Healthy',
  'Dairy-Free',
  'Nut-Free',
];

export const TagsForm: React.FC = () => {
  const { tags, setTags: setNewTags } = useContext(NewRecipeContext);
  const [uniqueTags, setUniqueTags] = useState(new Set(tags));

  const handleAddTag = () => {
    // Create a copy of the unique tags set and add the new tag
    const updatedUniqueTags = new Set(uniqueTags);
    updatedUniqueTags.add('');
    setUniqueTags(updatedUniqueTags);

    // Convert the set back to an array and update the context state
    setNewTags(Array.from(updatedUniqueTags));
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedUniqueTags = new Set(uniqueTags);

    // Remove the old tag value from the set and add the new one
    updatedUniqueTags.delete(tags[index]);
    updatedUniqueTags.add(value);

    // Convert the set back to an array and update the context state
    setUniqueTags(updatedUniqueTags);
    setNewTags(Array.from(updatedUniqueTags));
  };

  const handleRemoveTag = (index: number) => {
    const updatedUniqueTags = new Set(uniqueTags);

    // Remove the tag from the set
    updatedUniqueTags.delete(tags[index]);

    // Convert the set back to an array and update the context state
    setUniqueTags(updatedUniqueTags);
    setNewTags(Array.from(updatedUniqueTags));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Tags</Typography>
      {tags.map((tag, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <FormControl fullWidth margin="dense">
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
          <IconButton
            aria-label={`Delete Tag ${index + 1}`}
            onClick={() => handleRemoveTag(index)}
          >
            <Delete />
          </IconButton>
        </div>
      ))}

      <Button variant="outlined" onClick={handleAddTag}>
        Add More
      </Button>
    </Container>
  );
};
