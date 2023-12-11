import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchSessionIdServerSide } from "@/lib/profileHooks";

export const withAuth = () => async (context: GetServerSidePropsContext) => {
    try {
        const sessionId = await fetchSessionIdServerSide(context.req.headers.cookie || "");
        console.log(context.req.headers);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(context.req.headers.cookie);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(sessionId);
        
        if (!sessionId) {
            console.log("No session, redirecting to login");
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }
    } catch (error) {
        console.log("Error during session check, redirecting to login", error);
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return { props: {} };
};

export const withAuthRedirect = () => async (context: GetServerSidePropsContext) => {
    try {
        console.log("withAuthRedirect");
        const sessionId = await fetchSessionIdServerSide(context.req.headers.cookie || "");
        console.log(sessionId);
        if (sessionId) {
            return {
                redirect: {
                    destination: '/feed',
                    permanent: false,
                },
            };
        }
    } catch (error) {
        // Handle errors, possibly log them
        console.log("redirecting to login");
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return { props: {} };
};