import React, { useState, useEffect } from 'react';
import { Container, Avatar, Typography, Button } from '@mui/material';
import {
  useImageForProfilePic,
  INVALID_S3_FILENAME,
} from '@/lib/profilePicHooks';
import { useFetchProfile } from '@/lib/profileHooks';

interface ProfilePicFormProps {
  uid: number;
  newProfilePicFile: File | null;
  setNewProfilePicFile: (f: File) => void;
}

export const ProfilePicForm: React.FC<ProfilePicFormProps> = (
  props: ProfilePicFormProps
) => {
  const { data, isLoading: isLoadingProfile, isError: isErrorLoadingProfile } =
    useFetchProfile(props.uid);
  const {
    data: profilePicSrc,
    isLoading: isLoadingProfilePic,
    isError: isErrorLoadingProfilePic,
  } = useImageForProfilePic(
    data ? data.user[0].profilePicS3Filename : INVALID_S3_FILENAME
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files && event.target.files[0];
    if (uploadedFile) {
      props.setNewProfilePicFile(uploadedFile);
    }
  };

  const [imgSrc, setImgSrc] = useState<string>(INVALID_S3_FILENAME);
  useEffect(() => {
    if (props.newProfilePicFile) {
      setImgSrc(props.newProfilePicFile.name);
    } else {
      setImgSrc(
        profilePicSrc &&
          !isLoadingProfilePic &&
          !isErrorLoadingProfilePic
          ? profilePicSrc
          : INVALID_S3_FILENAME
      );
    }
  }, [profilePicSrc, isLoadingProfilePic, isErrorLoadingProfilePic, props.newProfilePicFile]);

  return (
    <Container style={{ marginBottom: 16 }}>
      <Avatar
        alt="Profile Pic"
        src={imgSrc}
        sx={{ marginRight: 2, height: 100, width: 100 }}
      />
      <Typography variant="h6">Change Profile Pic</Typography>
      <label htmlFor="profile-pic-upload">
        <Button
          variant="contained"
          component="span"
          sx={{ marginTop: 2 }}
        >
          Upload Image
        </Button>
      </label>
      <input
        type="file"
        id="profile-pic-upload"
        onChange={handleFileChange}
        accept=".jpg"
        style={{ display: 'none' }}
      />
    </Container>
  );
};
