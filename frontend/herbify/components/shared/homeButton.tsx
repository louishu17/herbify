import React from 'react';
import { useRouter } from 'next/router';
import { IconButton } from '@mui/material';

const HomeButton = (path: string) => {
    const router = useRouter();

    return (
        <IconButton 
            onClick={() => router.push('/')} 
            sx={{ 
                padding: 0, 
                flexShrink: 0, // prevent the button from shrinking
                '&:hover': { bgcolor: 'transparent' } 
            }}
        >
            <img src={'/icons/herbify-logo.svg'} alt="Herbify Logo" style={{ width: '20%', height: 'auto' }} />
        </IconButton>
    );
};

export default HomeButton;