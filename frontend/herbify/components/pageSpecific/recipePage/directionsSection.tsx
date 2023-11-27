import React, { useState } from "react";
import { useDirections, useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import { Typography, Container, List, ListItem, ListItemButton, ListItemIcon, Checkbox } from "@mui/material";
import { HerbifyLoadingCircle } from "@/components/shared/loading";

interface DirectionsSectionProps {
  // Your existing props
}

export const DirectionsSection: React.FC<DirectionsSectionProps> = (props: DirectionsSectionProps) => {
    return (
        <Container>
            <Typography variant="h3">Directions</Typography>
            <DirectionsBody/>
        </Container>
    );
}

const DirectionsBody: React.FC = () => {
    const recipeID = useRecipeID();
    const { data: Directions, isLoading, isError } = useDirections(recipeID);
    const [checked, setChecked] = useState<number[]>([]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    if (isLoading) {
        return <HerbifyLoadingCircle/>;
    } else if (isError) {
        return <Typography>An error occurred while loading the Directions</Typography>;
    } else if (Directions) {
        return (
            <Container maxWidth="md">
                <List>
                    {Directions.directions.map((direction, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(index) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <Typography 
                                    style={{
                                        textDecoration: checked.indexOf(index) !== -1 ? 'line-through' : 'none',
                                        color: checked.indexOf(index) !== -1 ? 'gray' : 'inherit'
                                    }}
                                >
                                    {index + 1}. {direction}
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        );
    } else {
        return null;
    }
}