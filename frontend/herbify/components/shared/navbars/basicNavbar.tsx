import React from 'react';
import { HerbifyNavBarGivenOptionDescriptions, OptionDescription } from './navbar';


export const BasicHerbifyNavBar : React.FC = () => {
    let optionDescriptions : OptionDescription[] = [
        {text : "Home", route : "/feed", icon: 'home-icon.svg'},
        {text : "Search", route : "/search", icon: 'search-icon.svg'},
        {text : "Notifications", route : "/feed", icon: 'notifications-icon.svg'},
        {text : "Create", route : "/recipes/create", icon: 'create-icon.svg'},
        {text : "Profile", route : "/profile/-1", icon: 'profile-icon.svg'},
        {text : "Settings", route : "/settings", icon: 'settings-icon.svg'},
        {text : "Login", route : "/login", icon: 'home-icon.svg'},
        {text : "Register", route : "/register", icon: 'home-icon.svg'}
    ];

    return <HerbifyNavBarGivenOptionDescriptions optionDescriptions={optionDescriptions}/>
}