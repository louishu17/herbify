import axios from '../utils/axiosInstance';
import { useAuth } from './authContext';
import { abortFeedController, resetFeedController } from './feedHooks';

export const UseHandleLogout = () => {
    const { logout } = useAuth();

    const handleLogout = async () =>{
        try {
            const response = await axios.post('/logout', {}, { withCredentials: true });
            abortFeedController();
            resetFeedController();
            const data = await response.data;

            document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
    }
    return handleLogout
};