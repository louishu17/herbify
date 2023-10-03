import React from "react";
import { useDirections, useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import {Typography, Container, List, ListItem} from "@mui/material";
import { HerbifyLoadingCircle } from "@/components/shared/loading";

interface DirectionsSectionProps{

}
export const DirectionsSection : React.FC<DirectionsSectionProps> = (props : DirectionsSectionProps) => {
    return (
        <Container>
            <Typography variant="h3">Directions</Typography>
            <DirectionsBody/>
        </Container>
        

    )
}


const DirectionsBody : React.FC = () => {
    const recipeID = useRecipeID();
    const {data : Directions, isLoading, isError} = useDirections(recipeID);
    if (isLoading){
        return <HerbifyLoadingCircle/>
    } else if (isError) {
        return <Typography>An error occurred while loading the Directions</Typography>
    } else if (Directions){
        return (
            <Container maxWidth="md">
                <List>
                    {Directions.directions.map((direction) => <ListItem key={direction} ><Typography>{direction}</Typography></ListItem>)}
                </List>
            </Container>
        )
    }
   
}