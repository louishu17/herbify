import { NextRouter } from 'next/router';

export const handleLogout = async (router : NextRouter) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/logout', {
            method: 'POST',
            credentials: 'include', // Needed if you're using cookies
            // Add headers if required, e.g., Content-Type, Authorization
        });
        const data = await response.json();
        console.log(data.message); // "Logout successful"
        router.push('/login');

        // Redirect to login page or update state as needed
    } catch (error) {
        console.error('Logout failed', error);
    }
};