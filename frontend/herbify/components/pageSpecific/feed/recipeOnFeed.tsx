import { RecipeInfoFromFeed } from "@/pages/api/feed";
import { Avatar, Typography, Box, Stack, Link as MuiLink, Card, CardActionArea, CardContent, CardMedia, IconButton, CardActions } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useImageForRecipe } from "@/lib/imageHooks";
import { HerbifyLoadingCircle } from "../../shared/loading";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useLikeRecipe, useUnlikeRecipe } from "@/lib/recipePage/likeRecipeHooks";
import { useEffect, useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';

interface RecipeOnFeedProps {
    info : RecipeInfoFromFeed;
}

export const RecipeOnFeed : React.FC<RecipeOnFeedProps> = (props : RecipeOnFeedProps) => {
    const {data : imageSrc, isLoading : isLoadingImg, isError : isErrorLoadingImg} = useImageForRecipe(props.info.imageS3Filename);
    const { mutate: like } = useLikeRecipe();
    const { mutate: unlike } = useUnlikeRecipe();



    const [userLiked, setUserLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const info = props.info;

    useEffect(() => {
        if (info) {
            setUserLiked(info.userLiked);
            setLikes(info.numLikes);
        }
    }, [info]);

    const handleLikeClick = () => {
        if (userLiked) {
            // User has already liked the recipe, so unlike it
            unlike(info.id, {
                onSuccess: () => {
                    console.log("unliked");
                    setUserLiked(false);
                    setLikes(likes => likes - 1);
                }
            });
        } else {
            // User hasn't liked the recipe, so like it
            like(info.id, {
                onSuccess: () => {
                    console.log("liked");
                    setUserLiked(true);
                    setLikes(likes => likes + 1);
                }
            });
        }
    };

    
    const borderRadiusValue = '5px'; 
    return (
        <Card sx={{ width: '100%', maxWidth: 345, m: 2, boxShadow: 3, borderRadius: borderRadiusValue }}>
            <Box sx={{ position: 'relative' }}>
                <Link href={`/recipes/${info.id}`} passHref>
                    <MuiLink underline="none">
                        <CardMedia sx={{ borderRadius: borderRadiusValue }}>
                            <ImageToDisplay imageSrc={imageSrc ?? ""} isLoading={isLoadingImg} isError={isErrorLoadingImg} />
                        </CardMedia>
                        <CardContent>
                            <Stack direction="row" spacing={2} marginBottom={2} alignItems="center">
                                <Avatar
                                    src={imageSrc}
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
                <CardActions disableSpacing>
                            <IconButton onClick={handleLikeClick} aria-label="add to favorites" disabled={isLoadingImg}>
                                {userLiked ? <FavoriteIcon style={{color: "red"}} /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                                {likes} Likes
                            </Typography>
                </CardActions>
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
