import React from 'react';
import { HerbifyNavBarGivenOptionDescriptions, OptionDescription } from './navbar';


export const BasicHerbifyNavBar : React.FC = () => {
    let optionDescriptions : OptionDescription[] = [
        {text : "Explore", route : "/feed"},
        {text : "Create", route : "/recipes/create"},
        {text : "Login", route : "/login"},
        {text : "Register", route : "/register"}
    ];

    return <HerbifyNavBarGivenOptionDescriptions optionDescriptions={optionDescriptions}/>
}