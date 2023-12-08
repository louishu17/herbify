import { createContext } from 'react';

interface NewRecipeContextType {
    title: string;
    setTitle: (newTitle: string) => void;
    imageFile: File | null;
    setImageFile: (image: File) => void;
    caption: string;
    setCaption: (newCaption: string) => void;
    ingredients: string[];
    setIngredients: (newIngredients: string[]) => void;
    directions: string[];
    setDirections: (newDirections: string[]) => void;
    tags: string[];
    setTags: (newTags: string[]) => void;
    hours: number;
    setHours: (newHours: number) => void;
    minutes: number;
    setMinutes: (newMinutes: number) => void;
}

export const NewRecipeContext = createContext<NewRecipeContextType>({
    title: '',
    setTitle: (newTitle: string) => {},
    imageFile: null,
    setImageFile: (image: File) => {},
    caption: '',
    setCaption: (newCaption: string) => {},
    ingredients: [''],
    setIngredients: (newIngredients: string[]) => {},
    directions: [''],
    setDirections: (newDirections: string[]) => {},
    tags: [''],
    setTags: (newTags: string[]) => {},
    hours: 0, 
    setHours: (newHours: number) => {},
    minutes: 0, 
    setMinutes: (newMinutes: number) => {},
});
