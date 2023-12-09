import { Modal, Box, List, ListItem, Avatar, ListItemText, Typography } from '@mui/material';
import Link from 'next/link';
import { UsersList, User } from "@/components/pageSpecific/search/searchResultsUser"; 
import { RecipesList, Recipe } from "@/components/pageSpecific/search/searchResultsRecipe"; 
import React from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, // Adjust the width as needed
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
  maxHeight: '80%', // Adjust the height as needed
};


interface ProfileListModalProps {
  open: boolean;
  handleClose: () => void;
  profiles: User[];
  recipes: Recipe[];
  isRecipes: boolean;
}

export const ProfileListModal: React.FC<ProfileListModalProps> = ({ open, handleClose, profiles, recipes, isRecipes }) => {
  // if isRecipes than UsersList else RecipesList

  console.log(profiles);
  console.log(recipes);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="profile-list-modal-title"
    >
      <Box sx={modalStyle}>
        {
          isRecipes ? 
          <RecipesList results={recipes} onClose={handleClose}/> :
          <UsersList results={profiles} onClose={handleClose}/>
        }
      </Box>
    </Modal>
  );
};
