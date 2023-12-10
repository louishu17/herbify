import React from 'react';
import { useEffect, useState } from 'react';
import {  BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Grid, Paper, Typography, Modal, Box, Avatar, Button} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFetchProfile, useUserID, useFollow, fetchFollowedBy, fetchFollowing, fetchLiked, fetchRated, fetchSessionId } from '@/lib/profileHooks';
import { RecipesSection } from '@/components/pageSpecific/profile/recipesSection';
import { HerbifyLoadingContainer } from '@/components/shared/loading';
import { ProfileListModal } from '@/components/pageSpecific/profile/followModal';
import { User } from "@/components/pageSpecific/search/searchResultsUser";
import { Recipe } from "@/components/pageSpecific/search/searchResultsRecipe";
import { INVALID_S3_FILENAME, useImageForProfilePic } from '@/lib/profilePicHooks';
import { withAuth } from '@/lib/authCheck';

export const getServerSideProps = withAuth();

const FollowersClickableArea = styled(Button)({
  background: 'none',
  border: 'none',
  boxShadow: 'none',
  padding: 0,
  margin: 0,
  textTransform: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'inherit', // Preserves the original text color
  '&:hover': {
    background: 'none',
    color: 'inherit',
  },
});

const ProfileGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
  justifyContent: 'center', // Center align the content
  width: '100%', // Ensure full width
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '600px', // Set a maximum width for the profile information
  margin: 'auto', // Center the paper in the grid
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
  const {data : profilePicSrc, isLoading : isLoadingProfilePicSrc, isError : isErrorLoadingProfilePicSrc} = useImageForProfilePic(profileData ? profileData.user[0].profilePicS3Filename : INVALID_S3_FILENAME);

  const currFollowers = profileData ? profileData.followers : 0
  
  const avatarStyle = { width: '100px', height: '100px' };

  const [sessionUserId, setSessionUserId] = useState(-1);
  const [numFollowers, setNumFollowers] = useState(0);
  const { isFollowing, toggleFollow } = useFollow(userId, numFollowers, setNumFollowers);

  const [openModal, setOpenModal] = useState(false);
  const [modalProfileData, setModalProfileData] = useState<User[]>([]);
  const [modalRecipeData, setModalRecipeData] = useState<Recipe[]>([]);
  const [isRecipes, setIsRecipes] = useState<boolean>(true);
  const [isRatings, setisRatings] = useState<boolean>(true);

  const handleOpenModal = async (getType: string) => {
    let followersList: User[] = [];
    let recipesList: Recipe[] = [];

    const currId = userId === -1 ? sessionUserId : userId;

    if (getType === "followers") { 
      followersList = await fetchFollowedBy(currId);
      setIsRecipes(false);
      setisRatings(false);
    }
    if (getType === "following") { 
      followersList = await fetchFollowing(currId);
      setIsRecipes(false);
      setisRatings(false);
    }
    if (getType === "liked") { 
      recipesList = await fetchLiked(currId);
      setIsRecipes(true);
      setisRatings(false);
    }
    if (getType === "rated") { 
      recipesList = await fetchRated(currId, );
      setIsRecipes(true);
      setisRatings(true);
    }

    setModalProfileData(followersList);
    setModalRecipeData(recipesList);

    setOpenModal(true)
  };
  
  const handleCloseModal = () => setOpenModal(false);

  let followButton = null;
  let likedModal = null;
  let ratedModal = null;

  useEffect(() => {
    const getSessionId = async () => {
      const id = await fetchSessionId();

      // TODO: Remove this hardcoding
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
    await toggleFollow();
  };

  
  if (userId !== -1 && sessionUserId && userId !== sessionUserId) {
    followButton = (
      <Button variant="contained" onClick={handleFollowClick}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    );
  }

  if (userId === -1) {
    likedModal = (
      <Grid item xs={4} sm={2.5} container direction="column" alignItems="center">
      <FollowersClickableArea onClick={() => handleOpenModal("liked")}>
        <Typography variant="h6">View</Typography>
        <Typography variant="body2">Liked Posts</Typography>
      </FollowersClickableArea>
    </Grid>
    );

    ratedModal = (
      <Grid item xs={4} sm={2.5} container direction="column" alignItems="center">
      <FollowersClickableArea onClick={() => handleOpenModal("rated")}>
        <Typography variant="h6">View</Typography>
        <Typography variant="body2">Rated Posts</Typography>
      </FollowersClickableArea>
    </Grid>
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
          <Grid container alignItems="center" spacing={2} width = {"100%"}>
            <Grid item>
              <Avatar 
                alt={profileData.user[0].firstName} 
                src={(profilePicSrc && !isLoadingProfilePicSrc && !isErrorLoadingProfilePicSrc) ? profilePicSrc : INVALID_S3_FILENAME}
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
                    <FollowersClickableArea onClick={() => handleOpenModal("followers")}>
                      <Typography variant="h6"><b>{numFollowers}</b></Typography>
                      <Typography variant="body2">Followers</Typography>
                    </FollowersClickableArea>
                  </Grid>
                  <Grid item xs={4} sm={2.5} container direction="column" alignItems="center">
                    <FollowersClickableArea onClick={() => handleOpenModal("following")}>
                      <Typography variant="h6"><b>{profileData.following}</b></Typography>
                      <Typography variant="body2">Following</Typography>
                    </FollowersClickableArea>
                  </Grid>
                  <Grid item>
                    {likedModal}
                  </Grid>
                  <Grid item>
                    {ratedModal}
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography>{profileData.user[0].bio}</Typography>
                </Grid>
              </Grid>
              <Grid item>
                {followButton}
              </Grid>
              <ProfileListModal 
                open={openModal} 
                handleClose={handleCloseModal} 
                profiles={modalProfileData}
                recipes={modalRecipeData}
                isRecipes={isRecipes}
                isRatings={isRatings}
              />
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
    <BaseHerbifyLayoutWithTitle title="" > {/* Ensure full width */}
      <Box sx={{ width: '100%' }}>
        {body}
      </Box>
    </BaseHerbifyLayoutWithTitle>
  );
  
}
