import React from "react";
import { RecipeInfoFromFeed } from "@/pages/api/feed";
import { Avatar, Typography, Box, Stack, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useImageForRecipe } from "@/lib/imageHooks";
import { HerbifyLoadingCircle } from "../../shared/loading";
interface RecipeOnFeedProps {
    info : RecipeInfoFromFeed;
}

export const RecipeOnFeed : React.FC<RecipeOnFeedProps> = (props : RecipeOnFeedProps) => {
    const {data : imageSrc, isLoading : isLoadingImg, isError : isErrorLoadingImg} = useImageForRecipe(props.info.imageS3Filename);
    
    return (
        <Link href={"/recipes/"+props.info.id} passHref>
            <MuiLink underline="none">
                <Box
                    border={1}
                    borderColor="primary.main"
                    borderRadius={4}
                    p={2}
                    textAlign={"center"}
                    alignContent={"center"}
                    justifyContent={"center"}
                    marginTop={2}
                    width={275}
                    marginLeft={50}
                >
                    <Stack direction="row" spacing={2} marginBottom={2}>
                        <Avatar
                                    src={imageSrc}
                                    alt="Profile Picture"
                                    sx={{ width: 50, height: 50, marginBottom: 1 }}
                                />
                        <Typography variant="h5">{props.info.title}</Typography>
                    </Stack>
                    <ImageToDisplay imageSrc={imageSrc ? imageSrc : ""} isLoading={isLoadingImg} isError={isErrorLoadingImg}/>
                    <Typography variant="h5" marginTop={3} color={"red"}>{props.info.caption}</Typography>
                </Box>
            </MuiLink>
        </Link>

    )

}

interface FeedImageProps{
    isLoading : boolean;
    isError : boolean;
    imageSrc : string;
}
const ImageToDisplay : React.FC<FeedImageProps> = (props : FeedImageProps) => {
    if (props.isLoading){
        return (
            <Box width={250} height={200}>
                <HerbifyLoadingCircle/>
            </Box>
        );
    } else if (props.isError){
        return <Typography>Error Loading Image</Typography>
    } else if (props.imageSrc){
        return <Image src={props.imageSrc} alt="pic" width={250} height={200} ></Image>
    } else {
        return <p>huh</p>
    }
}