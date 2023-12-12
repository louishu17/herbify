import { sessionServerSide } from "@/lib/profileHooks";


export const isAuthorized = async () => {
    try {
        const inSession = await sessionServerSide();
        return !!inSession; // Return true if session exists, false otherwise
    } catch (error) {
        return false;
    }
};