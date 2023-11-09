import { useRouter } from 'next/router';

const INVALID_USER_ID = -1; // Use a value that makes sense for invalid user ID in your system

export const useUserID = (): number => {
    const router = useRouter();
    const { profileID } = router.query; // Assuming the dynamic route segment is named `userId`
    console.log(profileID);
    if (typeof profileID === 'string' && /^\d+$/.test(profileID)) {
        return parseInt(profileID);
    } else {
        return INVALID_USER_ID;
    }
};