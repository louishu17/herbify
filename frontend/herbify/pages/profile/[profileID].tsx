import React from 'react';
import { useEffect, useState } from 'react';
import {  BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Grid, Paper, Typography, Box, Avatar, Button} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFetchProfile, useUserID, fetchSessionId, useFollow } from '@/lib/profileHooks';
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
  const {data : profileData, isLoading, isError, refetch } = useFetchProfile(userId);

  const currFollowers = profileData ? profileData.followers : 0
  
  const avatarStyle = { width: '100px', height: '100px' };

  const [sessionUserId, setSessionUserId] = useState(-1);
  const [numFollowers, setNumFollowers] = useState(0);
  const { isFollowing, toggleFollow } = useFollow(userId, numFollowers, setNumFollowers);

  let followButton = null;

  useEffect(() => {
    const getSessionId = async () => {
      const id = await fetchSessionId();
      
      setSessionUserId(id);
    };

    getSessionId();
  }, []);

  useEffect(() => {
    if (profileData) {
      setNumFollowers(profileData.followers);
    }
  }, [profileData]);

  const handleFollowClick = async () => {
    // Assuming toggleFollow makes the API call and returns a promise
    await toggleFollow();
    // Trigger re-fetch of profile data
    //refetch();
    //console.log(profileData?.followers)
  };

  
  if (userId !== -1 && sessionUserId && userId !== sessionUserId) {
    followButton = (
      <Button variant="outlined" color="primary" onClick={handleFollowClick}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    );
  }

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
              <Grid container direction="column" alignItems="flex-start" spacing={2}>
                <Grid item>
                  <Typography variant="h5">{profileData.user[0].firstName}</Typography>
                </Grid>
                <Grid item container justifyContent="center" spacing={2}>
                  <Grid item xs={4} sm={2.5} container direction="column" alignItems="center">
                    <Typography variant="h6"><b>{profileData.recipes.length}</b></Typography>
                    <Typography variant="body2">Posts</Typography>
                  </Grid>
                  <Grid item xs={4} sm={2.5} container direction="column" alignItems="center">
                    <Typography variant="h6"><b>{numFollowers}</b></Typography>
                    <Typography variant="body2">Followers</Typography>
                  </Grid>
                  <Grid item xs={4} sm={2.5} container direction="column" alignItems="center">
                    <Typography variant="h6"><b>{profileData.following}</b></Typography>
                    <Typography variant="body2">Following</Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography>{profileData.user[0].bio}</Typography>
                </Grid>
              </Grid>
              <Grid item>
                {followButton}
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
