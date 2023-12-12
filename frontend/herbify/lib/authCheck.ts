import { sessionServerSide } from "@/lib/profileHooks";


export const isAuthorized = async () => {
    try {
        const inSession = await sessionServerSide();
        console.log(inSession);
        return !!inSession; // Return true if session exists, false otherwise
    } catch (error) {
        return false;
    }
};