import { useRouter } from 'next/router';

const INVALID_USER_ID = -1; // Use a value that makes sense for invalid user ID in your system

export const useUserID = (): number => {
    const router = useRouter();
    const { userId } = router.query; // Assuming the dynamic route segment is named `userId`

    if (typeof userId === 'string' && /^\d+$/.test(userId)) {
        return parseInt(userId);
    } else {
        return INVALID_USER_ID;
    }
};