// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { isAuthorized } from '@/lib/authCheck';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    console.log("authContext.tsx: isAuthenticated: " + isAuthenticated)

    const logout = () => {
        // Reset the authentication state
        setIsAuthenticated(false);

        // Redirect to login page
        router.push('/login');
    };
    useEffect(() => {
        const checkAuth = async () => {
            const authorized = await isAuthorized();
            console.log("authContext.tsx: checkAuth: authorized: " + authorized)
            if (!authorized) {
                if (router.pathname !== '/login' && router.pathname !== '/' && router.pathname !== '/register') {
                    router.push('/login');
                }
            } else {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, [router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};