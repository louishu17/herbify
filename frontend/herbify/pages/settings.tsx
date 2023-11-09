import { BaseHerbifyLayout, BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import {Typography} from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import React, {useState} from "react";
import {object as YupObject, string as YupString} from 'yup';
import axios from 'axios';

interface SetUserProfileFormValues {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    dateOfBirth: string;
    pronouns: string;
    phoneNumber: string;
    bio: string;
}
  
const initialValues: SetUserProfileFormValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    pronouns: "",
    phoneNumber: "",
    bio: "",
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const setUserProfileValidationSchema = YupObject({
    firstName: YupString().required('Required'),
    middleName: YupString().notRequired(),
    lastName: YupString().required('Required'),
    suffix: YupString().notRequired(),
    dateOfBirth: YupString().required('Required'),
    pronouns: YupString().required('Required'),
    phoneNumber: YupString().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
    bio: YupString().required('Required'),
});

export default function SetProfilePage(){
    const [errorMessage, setErrorMessage] = useState<string>("");

    // const handleSubmit = (values : RegisterFormValues) => {
    //    setErrorMessage("Register functionality is not finished yet");
    // }

    const setUserProfile = async (values: SetUserProfileFormValues) => {

        try {
            const response = await axios.post('http://127.0.0.1:5000/set-profile', values, {withCredentials: true});

            setErrorMessage("User updated");

            // setTimeout(() => {
            //     window.location.href = '/login';
            // }, 1000);
        } catch (error) {
            console.error(error);

            if ((error as any).response) {
                if ((error as any).response.status === 400) {
                    setErrorMessage("User with this email already exists");
                } else if ((error as any).response.status === 500) {
                    setErrorMessage("An error occurred during updating user");
                }
            } else {
                setErrorMessage("An unexpected error occurred");
            }
        }
    };

    const handleSubmit = (values: SetUserProfileFormValues) => {
        setUserProfile(values);
    };

    return (
        <BaseHerbifyLayoutWithTitle title="Set Profile">
            <HerbifyForm
                handleSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={setUserProfileValidationSchema}
                textFields={[
                    { name: "firstName", type: "text" },
                    { name: "middleName", type: "text" },
                    { name: "lastName", type: "text" },
                    { name: "suffix", type: "text" },
                    { name: "dateOfBirth", type: "text" },
                    { name: "pronouns", type: "text" },
                    { name: "phoneNumber", type: "text" },
                    { name: "bio", type: "text" },
                ]}
                errorMessage={errorMessage}
            />
        </BaseHerbifyLayoutWithTitle>
    )
}