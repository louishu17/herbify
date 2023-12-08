import { RecipeInfoFromFeed } from "@/pages/api/feed";
import { Avatar, Typography, Box, Stack, Link as MuiLink, Card, CardActionArea, CardContent, CardMedia, IconButton, CardActions } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { INVALID_S3_FILENAME, useImageForRecipe } from "@/lib/recipeImageHooks";
import { HerbifyLoadingCircle } from "../../shared/loading";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useLikeRecipe, useUnlikeRecipe } from "@/lib/recipePage/likeRecipeHooks";
import { useEffect, useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useImageForProfilePic } from "@/lib/profilePicHooks";

interface RecipeOnFeedProps {
    info : RecipeInfoFromFeed;
    isProfile? : boolean;
}

const AttributeTags = ({ info }) => {
    const attributes = [
        { key: 'isGlutenFree', color: '#ddcc66' },
        { key: 'isVegan', color: '#006c47' },
        { key: 'isHighProtein', color: '#964B00' },
        { key: 'isKeto', color: 'purple' },
        { key: 'isKidFriendly', color: 'orange' },
        { key: 'isNutFree', color: 'brown' },
        { key: 'isSpicy', color: '#ff1111' },
        { key: 'isVegetarian', color: '#90EE90' }
    ];

    const tagElements = attributes
        .filter(attr => info[attr.key])
        .map(attr => (
            <Box key={attr.key} sx={{ borderRadius: '5px', backgroundColor: attr.color, color: 'white', padding: '2px 5px', margin: '5px' }}>
                {attr.key.replace('is', '').replace(/([a-z])([A-Z])/g, '$1 $2')}
            </Box>
        ));

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100%' }}>
            {tagElements}
        </div>
    );
};

export const RecipeOnFeed : React.FC<RecipeOnFeedProps> = (props : RecipeOnFeedProps) => {
    const {data : recipeImageSrc, isLoading : isLoadingRecipeImg, isError : isErrorLoadingRecipeImg} = useImageForRecipe(props.info.imageS3Filename);
    const {data : profilePicImgSrc, isLoading : isLoadingProfilePic, isError : isErrorLoadingProfilePic} = useImageForProfilePic(props.info.profilePicS3Filename);

    
    const { mutate: like } = useLikeRecipe();
    const { mutate: unlike } = useUnlikeRecipe();

    const [userLiked, setUserLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const info = props.info;

    const displayLikes = props.isProfile !== null && props.isProfile !== true;

    useEffect(() => {
        if (info) {
            setUserLiked(info.userLiked);
            setLikes(info.numLikes);
        }
    }, [info]);

    const handleLikeClick = () => {
        if (userLiked) {
            // User has already liked the recipe, so unlike it
            unlike(info.recipeID.toString(), {
                onSuccess: () => {
                    setUserLiked(false);
                    setLikes(likes => likes - 1);
                }
            });
        } else {
            // User hasn't liked the recipe, so like it
            like(info.recipeID.toString(), {
                onSuccess: () => {
                    setUserLiked(true);
                    setLikes(likes => likes + 1);
                }
            });
        }
    };

    
    const borderRadiusValue = '5px'; 
    return (
        <Card sx={{ width: '100%', maxWidth: 275, m: 2, boxShadow: 3, borderRadius: borderRadiusValue }}>
            <Box sx={{ position: 'relative' }}>
                <Link href={`/recipes/${info.recipeID}`} passHref>
                    <MuiLink underline="none">
                        <CardMedia sx={{ borderRadius: borderRadiusValue }}>
                            <ImageToDisplay imageSrc={recipeImageSrc ?? ""} isLoading={isLoadingRecipeImg} isError={isErrorLoadingRecipeImg} />
                        </CardMedia>
                        <CardContent>
                            <Stack direction="row" spacing={2} marginBottom={2} alignItems="center">
                                <Avatar
                                    src={(profilePicImgSrc && !isLoadingProfilePic && !isErrorLoadingProfilePic) ? profilePicImgSrc : INVALID_S3_FILENAME}
                                    alt="Profile Picture"
                                    sx={{ width: 50, height: 50, borderRadius: borderRadiusValue }}
                                />
                                <Typography variant="h6" noWrap>
                                    {info.title}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {info.caption}
                            </Typography>
                        </CardContent>
                    </MuiLink>
                </Link>
                {displayLikes && <CardActions disableSpacing>
                            <IconButton onClick={handleLikeClick} aria-label="add to favorites" disabled={isLoadingRecipeImg}>
                                {userLiked ? <FavoriteIcon style={{color: "red"}} /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                                {likes} Likes
                            </Typography>
                </CardActions>}
                <AttributeTags info={info}/>
            </Box>
        </Card>
    );

}

interface FeedImageProps{
    isLoading : boolean;
    isError : boolean;
    imageSrc : string;
}
export const ImageToDisplay: React.FC<FeedImageProps> = ({ isLoading, isError, imageSrc }) => {
    const borderRadiusValue = '5px';

    if (isLoading) {
        return (
            <Box width={275} height={170} display="flex" justifyContent="center" alignItems="center" sx={{ borderRadius: borderRadiusValue }}>
                <HerbifyLoadingCircle />
            </Box>
        );
    } else if (isError) {
        return <Typography variant="body2" color="error" sx={{ borderRadius: borderRadiusValue }}>Error Loading Image</Typography>;
    } else if (imageSrc) {
        return (
            <div style={{ borderRadius: borderRadiusValue, overflow: 'hidden', width: 275, height: 170, position: 'relative' }}>
                <Image src={imageSrc} alt="Recipe" layout="fill" objectFit="cover" />
            </div>
        );
    } else {
        return <Typography variant="body2" sx={{ borderRadius: borderRadiusValue }}>No image available</Typography>;
    }
};
