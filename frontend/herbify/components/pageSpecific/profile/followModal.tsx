import { Modal, Box, List, ListItem, Avatar, ListItemText, Typography } from '@mui/material';
import Link from 'next/link';
import { SearchResultsUsers } from "@/components/pageSpecific/search/searchResultsUser"; 
import { User } from "@/components/pageSpecific/search/searchResultsUser";

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

import React from 'react';

interface ProfileListModalProps {
  open: boolean;
  handleClose: () => void;
  profiles: User[]; 
}

export const ProfileListModal: React.FC<ProfileListModalProps> = ({ open, handleClose, profiles }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="profile-list-modal-title"
    >
      <Box sx={modalStyle}>
        <SearchResultsUsers results={profiles} onClose={handleClose}/>
      </Box>
    </Modal>
  );
};
