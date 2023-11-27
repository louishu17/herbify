import React, { useState } from "react";
import { useIngredients, useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import { Typography, Container, List, ListItem, ListItemButton, ListItemIcon, Checkbox } from "@mui/material";
import { HerbifyLoadingCircle } from "@/components/shared/loading";

interface IngredientsSectionProps{

}
export const IngredientsSection : React.FC<IngredientsSectionProps> = (props : IngredientsSectionProps) => {
    return (
        <Container>
            <Typography variant="h3">Ingredients</Typography>
            <IngredientsBody/>
        </Container>
        

    )
}


const IngredientsBody: React.FC = () => {
    const recipeID = useRecipeID();
    const { data: ingredients, isLoading, isError } = useIngredients(recipeID);
    const [checked, setChecked] = useState<string[]>([]);

    const handleToggle = (value: string) => () => {
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
        return <Typography>An error occurred while loading the ingredients</Typography>;
    } else if (ingredients) {
        return (
            <Container maxWidth="md">
                <List>
                    {ingredients.ingredients.map((ingredient, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton role={undefined} onClick={handleToggle(ingredient)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.includes(ingredient)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <Typography 
                                    style={{
                                        textDecoration: checked.includes(ingredient) ? 'line-through' : 'none',
                                        color: checked.includes(ingredient) ? 'gray' : 'inherit'
                                    }}
                                >
                                    {ingredient}
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