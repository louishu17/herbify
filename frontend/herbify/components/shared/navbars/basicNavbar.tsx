import React from 'react';
import { HerbifyNavBarGivenOptionDescriptions, OptionDescription } from './navbar';


export const BasicHerbifyNavBar : React.FC = () => {
    let optionDescriptions : OptionDescription[] = [
        {text : "Home", route : "/feed", icon: 'home-icon.svg'},
        {text : "Search", route : "/search", icon: 'search-icon.svg'},
        {text : "Notifications", route : "/feed", icon: 'notifications-icon.svg'},
        {text : "Create", route : "/recipes/create", icon: 'create-icon.svg'},
        {text : "Leaderboard", route : "/leaderboard", icon : 'leaderboard-icon.svg'},
        {text : "Profile", route : "/profile/-1", icon: 'profile-icon.svg'},
        {text : "Settings", route : "/settings", icon: 'settings-icon.svg'},
        {text : "Login", route : "/login", icon: 'login-icon.svg'},
        {text : "Register", route : "/register", icon: 'register-icon.svg'}
    ];

    return (
        <div style={{ width: '205px' }}>
            <HerbifyNavBarGivenOptionDescriptions optionDescriptions={optionDescriptions}/>
        </div>
    );
}