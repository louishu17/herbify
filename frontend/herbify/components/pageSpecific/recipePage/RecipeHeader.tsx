import { Typography, Container } from "@mui/material";
import { useBasicRecipeInfo, useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import { HerbifyLoadingCircle } from "@/components/shared/loading";

interface RecipeHeaderProps {

}
export const RecipeHeader: React.FC<RecipeHeaderProps> = (props: RecipeHeaderProps) => {
    const recipeID = useRecipeID();
    const { data, isLoading, isError } = useBasicRecipeInfo(recipeID);
    if (isLoading) {
        return <HerbifyLoadingCircle />;
    } else if (data && !isError) {

        return (
            <Container >
                <Typography variant="h2">{data.title}</Typography>
                <Typography variant="h6">{data.author}</Typography>
            </Container>
        );
    } else {
        return <Typography>Error</Typography>;
    }
};
