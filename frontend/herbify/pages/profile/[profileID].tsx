import React, { useState, useEffect } from 'react';
import { RecipeOnFeed } from "@/components/pageSpecific/feed/recipeOnFeed";
import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import axios from 'axios';
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useUserID } from '@/lib/profileHooks';
import { useImageForRecipe } from "@/lib/imageHooks";
import { ImageToDisplay } from "@/components/pageSpecific/feed/recipeOnFeed";


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
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    followers: 0,
    following: 0,
    recipes: [],
  });

  const userId = useUserID();
  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/profile/${userId}`, {withCredentials: true});
        console.log(response.data)
        const responseData = response.data;
        setProfileData({name: responseData.user[0].firstName + " " + responseData.user[0].lastName, bio: responseData.user[0].bio, followers: responseData.followers, following: responseData.following, recipes: responseData.recipes});
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  const recipeCheck = profileData && Array.isArray(profileData.recipes) && profileData.recipes && profileData.recipes.length !== 0
  console.log(profileData)

  
  return (
    <BaseHerbifyLayoutWithTitle title="Search">
        <ProfileGrid container spacing={2}>
        <ProfileGrid item xs={12}>
            <ProfilePaper elevation={4}>
            <Avatar alt={profileData.name} src="/static/images/avatar/1.jpg" />
            <Typography variant="h4">{profileData.name}</Typography>
            <Typography>{profileData.bio}</Typography>
            <Typography variant="body1">Followers: {profileData.followers}</Typography>
            <Typography variant="body1">Following: {profileData.following}</Typography>
            </ProfilePaper>
        </ProfileGrid>
        
        {recipeCheck && <RecipesGrid container spacing={2}>
            {profileData.recipes.map((recipe, index) => (
            <Grid item xs={4} key={index}>
                
                <Paper>
                <Box p={1}>
                
                </Box>
                </Paper>
            </Grid>
            ))}
        </RecipesGrid>}
        </ProfileGrid>
    </BaseHerbifyLayoutWithTitle>
  );
}
