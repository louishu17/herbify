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
  
  const avatarStyle = { width: '100px', height: '100px' };

  let body = null;
  if (isLoading){
    body = <HerbifyLoadingContainer/>
  } else if (isError) {
    body = <Typography>Error</Typography>
  } else if (profileData){
    body = (

      <ProfileGrid spacing={2}>
        <ProfileGrid item xs={10}>
        <ProfilePaper elevation={0}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar 
                alt={profileData.user[0].firstName} 
                src="/static/images/avatar/1.jpg" 
                style={avatarStyle} 
              />
            </Grid>
            <Grid item xs>
              <Grid container alignItems="center" spacing={2}>
              <Grid item xs={4} sm={2.5} marginLeft={10}>
                <Grid container direction="column" alignItems="flex-start" spacing={2}>
                  <Grid item>
                    <Typography variant="h5">{profileData.user[0].firstName}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1"><b>0</b> Posts</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{profileData.user[0].bio}</Typography>
                  </Grid>
                </Grid>
              </Grid>
                <Grid item xs={4} sm={2.5} marginTop={1}>
                  <Typography variant="body1"><b>{profileData.followers}</b> Followers</Typography>
                </Grid>
                <Grid item xs={4} sm={2.5} marginTop={1}>
                  <Typography variant="body1"><b>{profileData.following}</b> Following</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ProfilePaper>


        </ProfileGrid>
        <RecipesSection/>
      </ProfileGrid>
    );
  } else {
    body = <Typography>Error</Typography>
  }
  return (
    <BaseHerbifyLayoutWithTitle title="">
      {body}
    </BaseHerbifyLayoutWithTitle>
  );
  
}
