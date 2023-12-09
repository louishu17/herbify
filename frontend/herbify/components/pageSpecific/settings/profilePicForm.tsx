import React, { useState, useEffect, useRef } from "react";
import { useImageForProfilePic, INVALID_S3_FILENAME } from "@/lib/profilePicHooks";
import { useFetchProfile } from "@/lib/profileHooks";
import { Box, Avatar, Button } from "@mui/material";

interface ProfilePicFormProps {
    uid : number;
    newProfilePicFile : File | null;
    setNewProfilePicFile : (f : File) => void;
}

export const ProfilePicForm: React.FC<ProfilePicFormProps> = ({ uid, newProfilePicFile, setNewProfilePicFile }) => {
    const { data, isLoading: isLoadingProfile, isError: isErrorLoadingProfile } = useFetchProfile(uid);
    const { data: profilePicSrc, isLoading: isLoadingProfilePic, isError: isErrorLoadingProfilePic } = useImageForProfilePic(data ? data.user[0].profilePicS3Filename : INVALID_S3_FILENAME);

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files && event.target.files[0];
        if (uploadedFile) {
            setNewProfilePicFile(uploadedFile);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const [imgSrc, setImgSrc] = useState<string>(INVALID_S3_FILENAME);
    useEffect(() => {
        if (newProfilePicFile) {
            setImgSrc(URL.createObjectURL(newProfilePicFile));
        } else {
            setImgSrc((profilePicSrc && !isLoadingProfilePic && !isErrorLoadingProfilePic) ? profilePicSrc : INVALID_S3_FILENAME);
        }
    }, [profilePicSrc, isLoadingProfilePic, isErrorLoadingProfilePic, newProfilePicFile]);

    return (
        <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar 
                alt="Profile Pic" 
                src={imgSrc}
                sx={{ marginRight: 2, height: 100, width: 100 }}
            />
            <Button variant="contained" onClick={handleButtonClick}>Change Profile Photo</Button>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
                style={{ display: 'none' }}
            />
        </Box>
    );
};

