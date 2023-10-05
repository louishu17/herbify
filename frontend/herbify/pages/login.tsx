import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography} from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
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
    const handleSubmit = (values : LoginFormValues) => {
        setErrorMessage("Login functionality is not finished yet");
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