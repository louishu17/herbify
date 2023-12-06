import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Typography, Container } from "@mui/material";
import { HerbifyForm } from "@/components/shared/textForm";
import { BaseHerbifyLayoutWithTitle } from "@/components/shared/layouts/baseLayout";
import { HerbifyLoadingContainer } from '@/components/shared/loading';
import { object as YupObject, string as YupString, number as YupNumber } from 'yup';
import { useFetchProfile } from '@/lib/profileHooks';
import { ProfilePicForm } from "@/components/pageSpecific/settings/profilePicForm";

interface SetUserProfileFormValues {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    birthMonth: string;
    birthDay: string;
    birthYear: string;
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
    birthMonth: YupNumber().min(1).max(12).required('Month is required'),
    birthDay: YupNumber().min(1).max(31).required('Day is required'),
    birthYear: YupNumber().min(1900).max(new Date().getFullYear()).required('Year is required')
        .test('dateOfBirth', 'Date of Birth is not valid', function(value) {
            const { birthMonth, birthDay, birthYear } = this.parent;
            return new Date(birthYear, birthMonth - 1, birthDay).getFullYear() === birthYear;
        }),
    pronouns: YupString().required('Required'),
    phoneNumber: YupString().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
    bio: YupString().required('Required'),
});

export default function SetProfilePage() {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [initialValues, setInitialValues] = useState<SetUserProfileFormValues>({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        birthMonth: '',
        birthDay: '',
        birthYear: '',
        pronouns: '',
        phoneNumber: '',
        bio: '',
    });
    const [newProfilePicFile, setNewProfilePicFile] = useState<File | null>(null);
    const uid = 947;
    const { data: profileData, isLoading, isError } = useFetchProfile(uid);

    useEffect(() => {
        if (profileData && profileData.user && profileData.user.length > 0) {
            const date = new Date(profileData.user[0].dateOfBirth);
            setInitialValues({
                firstName: profileData.user[0].firstName,
                middleName: profileData.user[0].middleName,
                lastName: profileData.user[0].lastName,
                suffix: profileData.user[0].suffix,
                birthMonth: (date.getMonth()).toString(),
                birthDay: date.getDate().toString(),
                birthYear: date.getFullYear().toString(),
                pronouns: profileData.user[0].pronouns,
                phoneNumber: profileData.user[0].phoneNumber,
                bio: profileData.user[0].bio,
            });
        }
    }, [profileData]);

    const updateProfileInDB = async (values : SetUserProfileFormValues) => {
        const combinedDate = `${values.birthYear}-${values.birthMonth.padStart(2, '0')}-${values.birthDay.padStart(2, '0')}`;
        const modifiedValues = {
            ...values,
            dateOfBirth: combinedDate,
        };
        axios.post('http://127.0.0.1:5000/set-profile', modifiedValues, { withCredentials: true });
        if (newProfilePicFile){
            const formData = new FormData();
            formData.append('imageFile', newProfilePicFile);    
            axios.post('http://127.0.0.1:5000/set-profile-pic', formData, {withCredentials: true});
        }
    }
    const setUserProfile = async (values: SetUserProfileFormValues) => {
        try {
            await updateProfileInDB(values);
            setErrorMessage("User updated");
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    setErrorMessage("User with this email already exists");
                } else if (error.response.status === 500) {
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

    let body = null;
    if (isLoading) {
        body = <HerbifyLoadingContainer />
    } else if (isError) {
        body = <Typography>Error</Typography>
    } else if (profileData && profileData.user && profileData.user.length > 0) {
        body = (
            <Container >
                <ProfilePicForm uid={uid} setNewProfilePicFile={setNewProfilePicFile} newProfilePicFile={newProfilePicFile}/>
                <HerbifyForm
                    handleSubmit={handleSubmit}
                    initialValues={initialValues}
                    validationSchema={setUserProfileValidationSchema}
                    textFields={[
                        { name: "firstName", type: "text" },
                        { name: "middleName", type: "text" },
                        { name: "lastName", type: "text" },
                        { name: "suffix", type: "text" },
                        { name: "birthMonth", type: "text" },
                        { name: "birthDay", type: "text" },
                        { name: "birthYear", type: "text" },
                        { name: "pronouns", type: "text" },
                        { name: "phoneNumber", type: "text" },
                        { name: "bio", type: "text" },
                    ]}
                    errorMessage={errorMessage}
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
