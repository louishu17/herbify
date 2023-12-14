import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Typography, Box, Button, TextField } from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState, useEffect} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from '../utils/axiosInstance';
import { useRouter } from "next/router";
import { isAuthorized } from '@/lib/authCheck';
import PageTransition from '@/components/shared/pageTransition';
import HerbifyLayout from "@/components/shared/layouts/herbifyLayout";
import HomeButton from "@/components/shared/homeButton";

interface LoginFormValues {
    email: string;
    password: string;
}
  
const initialValues: LoginFormValues = {
    email: "",
    password: "",
};

const loginValidationSchema = YupObject({
	email: YupString().email('Invalid email address').required('Required'),
	password: YupString().required('Required'),
});


export default function LoginPage(){
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();
    
    useEffect(() => {
        const checkAuthorization = async () => {
            const authorized = await isAuthorized();
            if (authorized) {
                router.push('/feed');
            }
        };

        checkAuthorization();
    }, [router]);

    const loginUser = async (values: LoginFormValues) => {
        try {
            const response = await axios.post('/login', values, {withCredentials: true});
            setErrorMessage("User logged in");

            setTimeout(() => {
                router.push("/feed");
            }, 0);
        } catch (error) {
            console.error(error);

            if ((error as any).response) {
                if ((error as any).response.status === 401) {
                    setErrorMessage("Incorrect email or password");
                } else if ((error as any).response.status === 500) {
                    setErrorMessage("An error occurred during login");
                } else if ((error as any).response.status === 402) {
                    setErrorMessage("No user for this email");
                }
            } else {
                setErrorMessage("An unexpected error occurred");
            }
        }
    };

    const handleSubmit = (values : LoginFormValues) => {
        loginUser(values);
    }
    return (
        <HerbifyLayout>
            <PageTransition>
                <Box sx={{ my: 4, mx: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', my: 4 }}>
                        {HomeButton("/")}
                    </Box>
                    <Typography variant="h4" sx={{ mb: 2 }}>Log in to Your Account</Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Don't have an account? <Button color="primary" onClick={() => router.push('/register')}>Register</Button>
                    </Typography>
                    <HerbifyForm
                        handleSubmit={handleSubmit}
                        initialValues={initialValues}
                        validationSchema={loginValidationSchema}
                        textFields={[
                            { name: "email", type: "email" },
                            { name: "password", type: "password" },
                        ]}
                        errorMessage={errorMessage}
                        submitButtonText="Log In"
                    />
                </Box>
            </PageTransition>
        </HerbifyLayout>
    )
}