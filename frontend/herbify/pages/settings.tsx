import React, { useState, useEffect } from "react";
import axiosInstance from '../utils/axiosInstance';
import axios, { AxiosError } from 'axios'
import { useRouter } from "next/router";
import { Typography, Container } from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { HerbifyLoadingContainer } from '@/components/shared/loading';
import { object as YupObject, string as YupString, number as YupNumber } from 'yup';
import { useFetchProfile } from '@/lib/profileHooks';
import { ProfilePicForm } from "@/components/pageSpecific/settings/profilePicForm";
import { useAuth } from "@/lib/authContext";
import { fetchSessionId } from '@/lib/profileHooks';

interface SetUserProfileFormValues {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    birthday: string;
    pronouns: string;
    phoneNumber: string;
    bio: string;
}

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const setUserProfileValidationSchema = YupObject({
    firstName: YupString().required('Required'),
    middleName: YupString().notRequired(),
    lastName: YupString().required('Required'),
    suffix: YupString().notRequired(),
    birthday: YupString().required('Required'),
    pronouns: YupString().notRequired(),
    phoneNumber: YupString().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
    bio: YupString().required('Required'),
});

export default function SetProfilePage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [initialValues, setInitialValues] = useState<SetUserProfileFormValues>({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        birthday: '',
        pronouns: '',
        phoneNumber: '',
        bio: '',
    });
    const [newProfilePicFile, setNewProfilePicFile] = useState<File | null>(null);
    const [sessionUserId, setSessionUserId] = useState(-1);

    const { isAuthenticated } = useAuth();
    const { data: profileData, isLoading, isError } = useFetchProfile(sessionUserId);

    useEffect(() => {
        if (profileData && profileData.user && profileData.user.length > 0) {
            const date = new Date(profileData.user[0].dateOfBirth);
            setInitialValues({
                firstName: profileData.user[0].firstName,
                middleName: profileData.user[0].middleName,
                lastName: profileData.user[0].lastName,
                suffix: profileData.user[0].suffix,
                birthday: date.toString(),
                pronouns: profileData.user[0].pronouns,
                phoneNumber: profileData.user[0].phoneNumber,
                bio: profileData.user[0].bio,
            });
        }
    }, [profileData]);

    useEffect(() => {
        const getSessionId = async () => {
          const id = await fetchSessionId();
          
          if(sessionUserId !== id) {
            setSessionUserId(id);
            }
        };
    
        getSessionId();
      }, []);

    const updateProfileInDB = async (values : SetUserProfileFormValues) => {
        const combinedDate = values.birthday;
        const modifiedValues = {
            ...values,
            dateOfBirth: combinedDate,
        };
        axiosInstance.post('/set-profile', modifiedValues, { withCredentials: true });
        if (newProfilePicFile){
            const formData = new FormData();
            formData.append('imageFile', newProfilePicFile);    
            axiosInstance.post('/set-profile-pic', formData, {withCredentials: true});
        }
    }
    const setUserProfile = async (values: SetUserProfileFormValues) => {
        try {
            await updateProfileInDB(values);
            setErrorMessage("User updated");
        } catch (error) {
            console.error(error);

        // Check if the error is an Axios error
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError; // Typecasting the error to AxiosError
            if (axiosError.response) {
                if (axiosError.response.status === 400) {
                    setErrorMessage("User with this email already exists");
                } else if (axiosError.response.status === 500) {
                    setErrorMessage("An error occurred during updating user");
                }
            }
        } else {
            setErrorMessage("An unexpected error occurred");
        }
        }
    };

    const handleSubmit = (values: SetUserProfileFormValues) => {
        setUserProfile(values);
        router.push('/profile/-1')
    };

    let body = null;
    if (!isAuthenticated) {
        return null;
    }
    if (isLoading) {
        body = <HerbifyLoadingContainer />
    } else if (isError) {
        body = <Typography>Error</Typography>
    } else if (profileData && profileData.user && profileData.user.length > 0) {
        body = (
            <Container >
                <ProfilePicForm uid={sessionUserId} setNewProfilePicFile={setNewProfilePicFile} newProfilePicFile={newProfilePicFile}/>
                <HerbifyForm
                    handleSubmit={handleSubmit}
                    initialValues={initialValues}
                    validationSchema={setUserProfileValidationSchema}
                    textFields={[
                        { name: "firstName", type: "text" },
                        { name: "middleName", type: "text", optional: true },
                        { name: "lastName", type: "text" },
                        { name: "suffix", type: "text", optional: true },
                        { name: "birthday", type: "text", datePicker: true },
                        { name: "pronouns", type: "text", optional: true },
                        { name: "phoneNumber", type: "text" },
                        { name: "bio", type: "text" },
                    ]}
                    errorMessage={errorMessage}
                    submitButtonText="Set Profile"
                />
            </Container>
        )
    } else {
        body = <Typography>No user data available</Typography>
    }

    return (
        <BaseHerbifyLayoutWithTitle title="Set Profile">
            {body}
        </BaseHerbifyLayoutWithTitle>
    );
}
