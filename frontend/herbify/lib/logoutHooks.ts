import { NextRouter } from 'next/router';

export const handleLogout = async (router : NextRouter) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/logout', {
            method: 'POST',
            credentials: 'include',
        });
        const data = await response.json();
        console.log(data.message);

        document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        router.push('/login');
    } catch (error) {
        console.error('Logout failed', error);
    }
};