import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography} from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from 'axios';
import { useRouter } from "next/router";

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

    const loginUser = async (values: LoginFormValues) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', values);
            setErrorMessage("User logged in");

            setTimeout(() => {
                router.push("/feed");
            }, 1000);
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
        <BaseHerbifyLayoutWithTitle title="Login">
            <HerbifyForm
                handleSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={loginValidationSchema}
                textFields={[
                    { name: "email", type: "email" },
                    { name: "password", type: "password" },
                ]}
                errorMessage={errorMessage}
            />
        </BaseHerbifyLayoutWithTitle>
    )
}