// @ts-nocheck
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
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { useImageForProfilePic } from "@/lib/profilePicHooks";
import CommentsModal from '../../commentsModal';
import CommentIcon from '@mui/icons-material/Comment';
import { useComments, usePostComment } from "@/lib/recipePage/commentRecipeHooks";
import Rating from '@mui/material/Rating';

interface RecipeComment {
    id: number;
    text: string;
    user_id: number;
}

interface RecipeOnFeedProps {
    info : RecipeInfoFromFeed;
    isProfile? : boolean;
}

const AttributeTags = ({ info }) => {
    const attributes = [
        { key: 'isGlutenFree', color: '#f6e8b1' }, // pastel yellow
        { key: 'isVegan', color: '#a4d5ba' }, // pastel green
        { key: 'isHighProtein', color: '#d2a679' }, // pastel brown
        { key: 'isKeto', color: '#c3aed6' }, // pastel purple
        { key: 'isKidFriendly', color: '#ffdab9' }, // pastel peach
        { key: 'isNutFree', color: '#a9a9a9' }, // pastel grey
        { key: 'isSpicy', color: '#ffcccc' }, // pastel red
        { key: 'isVegetarian', color: '#c6ecc6' } // pastel mint
    ];

    const tagElements = attributes
        .filter(attr => info[attr.key])
        .map(attr => (
            <Box key={attr.key} sx={{ 
                borderRadius: '7.5px', // Half of the original 10px
                backgroundColor: attr.color,
                color: '#05353B',
                padding: '1px 2.5px', // Half of the original 2px 5px
                margin: '2.5px', // Half of the original 5px
                fontSize: '0.75rem' // Optional: adjust font size to scale down the text as well
              }}>
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
    const [modalOpen, setModalOpen] = useState(false);
    const [comments, setComments] = useState<RecipeComment[]>([]); // Use the Comment interface from commentsModal.tsx

    const [userLiked, setUserLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const info = props.info;

    const displayLikes = props.isProfile !== null && props.isProfile !== true;

    const { data: commentsResponse, isLoading, isError, refetch } = useComments(info.recipeID);

    const { mutate: postComment } = usePostComment({
        onSuccess: () => {
            refetch(); // Refetch comments after posting
        },
        onError: (error) => {
            // Handle error
            console.error('Error posting comment:', error);
        },
    });

    const handleCommentSubmit = (text: string, parentID?: number) => {
        postComment({ recipeID: props.info.recipeID, text, parentID }); // Include recipeID here
    };

    function relativeTime(datetimeStr) {
        const givenTime = new Date(datetimeStr);
        const currentTime = new Date();
    
        // Convert both dates to UTC midnight for accurate day comparison
        const utcGivenTime = new Date(Date.UTC(givenTime.getFullYear(), givenTime.getMonth(), givenTime.getDate()));
        const utcCurrentTime = new Date(Date.UTC(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()));
    
        // Calculate the difference in days
        const diff = utcCurrentTime - utcGivenTime;
        const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
        // Rest of your logic...
        if (daysDiff === 0) {
            // Calculate hours and minutes difference for same day
            const timeDiff = currentTime.getTime() - givenTime.getTime();
            const minutesDiff = Math.floor(timeDiff / 60000);
            const hoursDiff = Math.floor(minutesDiff / 60);
    
            if (hoursDiff === 0) {
                if (minutesDiff <= 1) {
                    return "just now";
                }
                return `${minutesDiff} minutes ago`;
            }
            if (hoursDiff === 1) {
                return "an hour ago";
            }
            return `${hoursDiff} hours ago`;
        } else if (daysDiff === 1) {
            return "yesterday";
        } else if (daysDiff > 1 && daysDiff < 30) {
            return `${daysDiff} days ago`;
        } else {
            // Format date as "Month day" for older dates
            return givenTime.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
        }
    }
    
    const totalTime = info.hours * 60 + info.minutes;

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

    const handleOpenModal = () => {
        // Fetch comments here if needed
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    
    const borderRadiusValue = '30px'; 
    return (
        <Card elevation={0} sx={{ 
            height: 340,
            width: 320,
            borderRadius: borderRadiusValue,
            background: 'linear-gradient(180deg, #FEF6F0 0%, #F9E9E0 100%)',
            marginBottom: 2
        }}>
            <Box sx={{ position: 'relative' }}>
                <Link href={`/recipes/${info.recipeID}`} passHref>
                    <MuiLink underline="none">
                        <CardMedia sx={{ borderRadius: borderRadiusValue }}>
                            <Box sx={{ 
                                marginTop: 3,
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%' // Ensure the container has a height
                                }}>
                                <ImageToDisplay sx={{marginTop: '30px',}} imageSrc={recipeImageSrc ?? ""} isLoading={isLoadingRecipeImg} isError={isErrorLoadingRecipeImg} />
                            </Box>
                        </CardMedia>
                        <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={(profilePicImgSrc && !isLoadingProfilePic && !isErrorLoadingProfilePic) ? profilePicImgSrc : INVALID_S3_FILENAME}
                                alt="Profile Picture"
                                sx={{ width: 50, height: 50, borderRadius: borderRadiusValue }}
                            />
                            <Typography variant="h6" component="div" style={{
                                color: "#05353B", 
                                fontSize: "20px",
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: '1.5em',
                                
                                }}
                            >
                                {info.title}
                            </Typography>
                            </Stack>
                            
                            {info.createdDate ? <Typography variant="caption" color="text.secondary" noWrap>
                            {relativeTime(info.createdDate)}
                            </Typography>: <Typography variant="caption" color="text.secondary" noWrap> {" "} </Typography>}
                            
                            
                        </CardContent>
                    </MuiLink>
                </Link>
                {displayLikes ? <CardActions disableSpacing>
                    <Stack direction="column" alignItems="center">
                            <IconButton 
                                onClick={handleLikeClick} 
                                aria-label="add to favorites" 
                                disabled={isLoadingRecipeImg}
                                sx={{
                                    position: 'absolute',
                                    top: 30, // Adjust top as needed
                                    right: 33, // Adjust right as needed
                                    color: 'primary.main', // Or 'error.main' if you want a red heart without userLiked condition
                                    backgroundColor: 'rgba(255, 255, 255, 0.65)', // Example: white background with 50% opacity
                                    '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly less transparent on hover
                                    },
                                    borderRadius: '50%', // Circular button
                                    padding: '13px',
                                    
                                }}
                            >
                                {userLiked ? <FavoriteIcon style={{color: "red", fontSize: '20px', position: 'relative', bottom: 7}} /> : <FavoriteBorderIcon style={{color: "gray", fontSize: '20px', position: 'relative', bottom: 7}}/>}
                                <Typography variant="body2" color="text.secondary" sx={{
                                    position: 'absolute',
                                    top: 25, // Adjust top as needed
                            }}>{likes}</Typography>
                            </IconButton>
                            <IconButton 
                                onClick={handleOpenModal} 
                                aria-label="show comments"
                                sx={{
                                    position: 'absolute',
                                    top: 90, // Adjust top as needed
                                    right: 33, // Adjust right as needed
                                    
                                    backgroundColor: 'rgba(255, 255, 255, 0.65)', // Example: white background with 50% opacity
                                    '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly less transparent on hover
                                    },
                                    borderRadius: '50%', // Circular button
                                    padding: '13px',
                                    
                                }}>
                                <CommentIcon style={{color: "gray"}}/>
                            </IconButton>
                    </Stack>
                        {info.numRatings > 0 ? 
                            <Rating 
                                sx={{
                                    position: 'relative',
                                    bottom: 20, // Adjust top as needed
                                    left: 170, // Adjust right as needed
                                }}
                                name="read-only" 
                                value={info.avgRating}  
                                precision={0.5} 
                                readOnly /> 
                            : <Box sx={{
                                height: 27
                            }}/>
                        }
                        {commentsResponse && <CommentsModal open={modalOpen} handleClose={handleCloseModal} comments={commentsResponse.comments} onCommentSubmit={handleCommentSubmit}  />}
                        
                </CardActions> : <Box sx={{
                                    height: 60}}></Box>}
                <Stack direction="row" spacing={1} alignItems="center" sx={
                    {
                        position: 'absolute',
                        bottom: 26,
                        left: 16,
                        width: '100%',
                    }
                }>
                    <AccessTimeFilledIcon/>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {totalTime} minutes
                    </Typography>
                </Stack>
                <Box   sx={
                    {
                        position: 'absolute',
                        bottom: -8,
                        left: 14,
                    }}><AttributeTags info={info}/></Box>
                
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
                <Image 
                    unoptimized
                    src={imageSrc} 
                    alt="Recipe" 
                    width={275}
                    height={170}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',  // This will cover the area of the container
                        objectPosition: 'center' // Center the image within the element
                    }}
                />
            </div>
        );
    } else {
        return <Typography variant="body2" sx={{ borderRadius: borderRadiusValue }}>No image available</Typography>;
    }
};
