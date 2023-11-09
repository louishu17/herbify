import React from 'react';
import {  BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFetchProfile, useUserID } from '@/lib/profileHooks';
import { RecipesSection } from '@/components/pageSpecific/profile/recipesSection';
import { HerbifyLoadingContainer } from '@/components/shared/loading';



const ProfileGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const RecipesGrid = styled(Grid)(({ theme }) => ({
  flexGrow: 1,
  marginTop: theme.spacing(2),
}));

const RecipeThumbnail = styled('img')({
  width: '100%',
  height: 'auto',
});

export default function ProfilePage() {

  const userId = useUserID();
  const {data : profileData, isLoading, isError} = useFetchProfile(userId);
  let body = null;
  if (isLoading){
    body = <HerbifyLoadingContainer/>
  } else if (isError) {
    body = <Typography>Error</Typography>
  } else if (profileData){
    body = (

      <ProfileGrid container spacing={2}>
      <ProfileGrid item xs={12}>
          <ProfilePaper elevation={4}>
          <Avatar alt={profileData.user[0].firstName} src="/static/images/avatar/1.jpg" />
          <Typography variant="h4">{profileData.user[0].firstName}</Typography>
          <Typography>{profileData.user[0].bio}</Typography>
          <Typography variant="body1">Followers: {profileData.followers}</Typography>
          <Typography variant="body1">Following: {profileData.following}</Typography>
          </ProfilePaper>
      </ProfileGrid>
        <RecipesSection/>
      </ProfileGrid>
    );
  } else {
    body = <Typography>Error</Typography>
  }
  return (
    <BaseHerbifyLayoutWithTitle title="Profile">
      {body}
    </BaseHerbifyLayoutWithTitle>
  );
  
}
