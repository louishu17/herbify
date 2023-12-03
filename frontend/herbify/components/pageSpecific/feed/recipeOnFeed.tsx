import { RecipeInfoFromFeed } from "@/pages/api/feed";
import { Avatar, Typography, Box, Stack, Link as MuiLink, Card, CardActionArea, CardContent, CardMedia, IconButton } from "@mui/material";
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
        <Card sx={{ width: 275, m: 2, boxShadow: 3, borderRadius: borderRadiusValue }}>
            <CardActionArea>
                <Link href={`/recipes/${info.id}`} passHref>
                    <MuiLink underline="none">
                        <CardMedia sx={{ borderRadius: borderRadiusValue }}>
                            <ImageToDisplay imageSrc={imageSrc ?? ""} isLoading={isLoadingImg} isError={isErrorLoadingImg} />
                        </CardMedia>
                    </MuiLink>
                </Link>
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
                    <IconButton onClick={handleLikeClick} aria-label="like" disabled={isLoadingImg}>
                        {userLiked ? <FavoriteIcon style={{color: "red"}} /> : <FavoriteBorderIcon />}
                    </IconButton>   
                </CardContent>
            </CardActionArea>
        </Card>
    );

}

interface FeedImageProps{
    isLoading : boolean;
    isError : boolean;
    imageSrc : string;
}
export const ImageToDisplay: React.FC<FeedImageProps> = ({ isLoading, isError, imageSrc }) => {
    // Define a common border radius value
    const borderRadiusValue = '5px'; // or you can use a value from the theme

    if (isLoading) {
        return (
            <Box width={250} height={200} display="flex" justifyContent="center" alignItems="center" sx={{ borderRadius: borderRadiusValue }}>
                <HerbifyLoadingCircle />
            </Box>
        );
    } else if (isError) {
        return <Typography variant="body2" color="error" sx={{ borderRadius: borderRadiusValue }}>Error Loading Image</Typography>;
    } else if (imageSrc) {
        return (
            <div style={{ borderRadius: borderRadiusValue, overflow: 'hidden', width: '100%', height: '100%' }}>
                <Image src={imageSrc} alt="Recipe" layout="responsive" width={250} height={200} objectFit="cover" />
            </div>
        );
    } else {
        return <Typography variant="body2" sx={{ borderRadius: borderRadiusValue }}>No image available</Typography>;
    }
};