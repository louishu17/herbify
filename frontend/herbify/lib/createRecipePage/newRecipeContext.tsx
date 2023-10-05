import { createContext } from 'react';

interface NewRecipeContextType {
    title : string;
    setTitle : (newTitle : string) => void;
    ingredients : string[];
    setIngredients : (newIngredients : string[]) => void;
    directions : string[];
    setDirections : (newDirections : string[]) => void;
};

export const NewRecipeContext = createContext<NewRecipeContextType>({
    title : '',
    setTitle : (newTitle : string) => {},
    ingredients : [''],
    setIngredients : (newIngredients : string[]) => {},
    directions : [''],
    setDirections : (newDirections : string[]) => {}
});
