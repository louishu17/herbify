import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography} from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
interface RegisterFormValues {
    email: string;
    password: string;
}
  
const initialValues: RegisterFormValues = {
    email: "",
    password: "",
};

const registerValidationSchema = YupObject({
    username : YupString().nonNullable().required('Required'),
	email: YupString().email('Invalid email address').required('Required'),
	password: YupString().required('Required'),
});

export default function RegisterPage(){
    const [errorMessage, setErrorMessage] = useState<string>("");
    const handleSubmit = (values : RegisterFormValues) => {
        setErrorMessage("Register functionality is not finished yet");
    }
    return (
        <BaseHerbifyLayoutWithTitle title="Register">
            <HerbifyForm
                handleSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={registerValidationSchema}
                textFields={[
                    { name : "username", type : "username"},
                    { name: "email", type: "email" },
                    { name: "password", type: "password" },
                ]}
                errorMessage={errorMessage}
            />
        </BaseHerbifyLayoutWithTitle>
    )
}