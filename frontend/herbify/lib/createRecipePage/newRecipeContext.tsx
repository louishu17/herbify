import { createContext } from 'react';

interface NewRecipeContextType {
    title : string;
    setTitle : (newTitle : string) => void;
    caption: string;
    setCaption : (newCaption: string) => void;
    ingredients : string[];
    setIngredients : (newIngredients : string[]) => void;
    directions : string[];
    setDirections : (newDirections : string[]) => void;
};

export const NewRecipeContext = createContext<NewRecipeContextType>({
    title : '',
    setTitle : (newTitle : string) => {},
    caption: '',
    setCaption : (newCaption: string) => {},
    ingredients : [''],
    setIngredients : (newIngredients : string[]) => {},
    directions : [''],
    setDirections : (newDirections : string[]) => {}
});
