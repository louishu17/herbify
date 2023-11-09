import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography} from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from 'axios';
import { useRouter } from "next/router";

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
            const response = await axios.post('http://127.0.0.1:5000/register', values);

            setErrorMessage("User created");

            setTimeout(() => {
                window.location.href = '/set-profile';
            }, 1000);
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
        <BaseHerbifyLayoutWithTitle title="Register">
            <HerbifyForm
                handleSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={registerValidationSchema}
                textFields={[
                    { name: "email", type: "email" },
                    { name: "password", type: "password" },
                ]}
                errorMessage={errorMessage}
            />
        </BaseHerbifyLayoutWithTitle>
    )
}