import { NextRouter } from 'next/router';
import axios from '../utils/axiosInstance';

export const handleLogout = async (router : NextRouter) => {
    try {
        const response = await axios.post('/logout', {}, { withCredentials: true });
        const data = await response.data;
        console.log(data.message);

        document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        router.push('/login');
    } catch (error) {
        console.error('Logout failed', error);
    }
};