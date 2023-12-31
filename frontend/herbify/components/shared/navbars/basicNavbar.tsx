import React from 'react';
import { HerbifyNavBarGivenOptionDescriptions, OptionDescription } from './navbar';


export const BasicHerbifyNavBar : React.FC = () => {
    let optionDescriptions : OptionDescription[] = [
        {text : "Home", route : "/feed", icon: 'home-icon.svg'},
        {text : "Search", route : "/search", icon: 'search-icon.svg'},
        {text : "Create", route : "/recipes/create", icon: 'create-icon.svg'},
        {text : "Leaderboard", route : "/leaderboard", icon : 'leaderboard-icon.svg'},
        {text : "Profile", route : "/profile/-1", icon: 'profile-icon.svg'},
        {text : "Set Profile", route : "/settings", icon: 'settings-icon.svg'},
        {text : "Logout", route : "/logout", icon: 'login-icon.svg', isLogoutButton: true,}
    ];

    return (
        <div>
            <HerbifyNavBarGivenOptionDescriptions optionDescriptions={optionDescriptions}/>
        </div>
    );
}