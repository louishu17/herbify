import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { Typography, Box, Button } from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from '../utils/axiosInstance';
import { useRouter } from "next/router";
import { withAuthRedirect } from '@/lib/authCheck';
import PageTransition from '@/components/shared/pageTransition';
import HerbifyLayout from "@/components/shared/layouts/herbifyLayout";
import HomeButton from "@/components/shared/homeButton";

export const getServerSideProps = withAuthRedirect();

interface RegisterFormValues {
    email: string;
    password: string;
}
  
const initialValues: RegisterFormValues = {
    email: "",
    password: "",
};

const registerValidationSchema = YupObject({
	email: YupString().email('Invalid email address').required('Required'),
	password: YupString().required('Required'),
});

export default function RegisterPage(){
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();

    // const handleSubmit = (values : RegisterFormValues) => {
    //    setErrorMessage("Register functionality is not finished yet");
    // }

    const registerUser = async (values: RegisterFormValues) => {
        try {
            const response = await axios.post('/register', values, {withCredentials: true});

            setErrorMessage("User created");

            if (response.status === 201) {
                router.push('/settings');
            }
            
        } catch (error) {
            console.error(error);

            if ((error as any).response) {
                if ((error as any).response.status === 400) {
                    setErrorMessage("User with this email already exists");
                } else if ((error as any).response.status === 500) {
                    setErrorMessage("An error occurred during registration");
                }
            } else {
                setErrorMessage("An unexpected error occurred");
            }
        }
    };

    const handleSubmit = (values: RegisterFormValues) => {
        registerUser(values);
    };

    return (
        <HerbifyLayout>
            <PageTransition>
                <Box sx={{ my: 4, mx: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', my: 4 }}>
                        {HomeButton("/")}
                    </Box>
                    <Typography variant="h4" sx={{ mb: 2 }}>Create a New Account</Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Already have an account? <Button color="primary" onClick={() => router.push('/login')}>Log In</Button>
                    </Typography>

                    <HerbifyForm
                        handleSubmit={handleSubmit}
                        initialValues={initialValues}
                        validationSchema={registerValidationSchema}
                        textFields={[
                            { name: "email", type: "email" },
                            { name: "password", type: "password" },
                        ]}
                        errorMessage={errorMessage}
                        submitButtonText="Create Account"
                    />
                </Box>
            </PageTransition>
        </HerbifyLayout>
    )
}