import { CircularProgress, Container } from "@mui/material";
import React from "react";

interface HerbifyLoadingCircleProps {

}
export const HerbifyLoadingCircle : React.FC<HerbifyLoadingCircleProps> = (props : HerbifyLoadingCircleProps) => {
    return <CircularProgress style={{margin : '0 auto'}} />

}

interface HerbifyLoadingContainerProps {
    
}
export const HerbifyLoadingContainer : React.FC<HerbifyLoadingContainerProps> = (props: HerbifyLoadingContainerProps) => {
    return (
        <Container maxWidth="sm" style={{display : "flex", alignItems: "center", justifyContent: "center"}}>
            <HerbifyLoadingCircle/>
        </Container>
    )
}