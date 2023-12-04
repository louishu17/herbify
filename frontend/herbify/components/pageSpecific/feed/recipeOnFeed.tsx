import { RecipeInfoFromFeed } from "@/pages/api/feed";
import { Avatar, Typography, Box, Stack, Link as MuiLink, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useImageForRecipe } from "@/lib/imageHooks";
import { HerbifyLoadingCircle } from "../../shared/loading";
interface RecipeOnFeedProps {
    info : RecipeInfoFromFeed;
}

export const RecipeOnFeed : React.FC<RecipeOnFeedProps> = (props : RecipeOnFeedProps) => {
    const {data : imageSrc, isLoading : isLoadingImg, isError : isErrorLoadingImg} = useImageForRecipe(props.info.imageS3Filename);
    
    const info = props.info;
    const borderRadiusValue = '5px'; 

    return (
        <Link href={`/recipes/${info.id}`} passHref>
            <MuiLink underline="none">
                <Card sx={{ width: 275, m: 2, boxShadow: 3, borderRadius: borderRadiusValue }}>
                    <CardActionArea>
                    <CardMedia sx={{ height: 170, width: 275, borderRadius: borderRadiusValue }}>
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
                    </CardActionArea>
                </Card>
            </MuiLink>
        </Link>
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
