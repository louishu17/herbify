import React, { useEffect, useState } from 'react';
import { Typography, Container, Button, Box, Avatar } from "@mui/material";
import { useBasicRecipeInfo, useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import { HerbifyLoadingCircle } from "@/components/shared/loading";
import Link from "next/link";
import { useFetchProfile } from '@/lib/profileHooks';

interface RecipeHeaderProps {

}

export const RecipeHeader: React.FC<RecipeHeaderProps> = (props: RecipeHeaderProps) => {
    const [shared, setShared] = useState(false);

    const recipeID = useRecipeID();
    const { data, isLoading, isError } = useBasicRecipeInfo(recipeID);

    
    const avatarStyle = { width: '50px', height: '50px', marginRight: '15px' };

    const iconStyle = { width: '24px', height: '24px' };

    const handlePrint = () => {
        console.log('print');
        window.print();
    };

    const handleShare = () => {
        const urlToCopy = window.location.href;
        navigator.clipboard.writeText(urlToCopy)
            .then(() => {
                setShared(true);
                setTimeout(() => setShared(false), 5000);
            })
            .catch(err => {
                // Handle error (show error message, etc.)
            });
    };


    if (isLoading) {
        return <HerbifyLoadingCircle />;
    } else if (data && !isError) {
        return (
            <Container>
                <Typography variant="h2">{data.title}</Typography>
                <Box display="flex" flexDirection="row">
                    <Avatar 
                        src="/static/images/avatar/1.jpg" 
                        style={avatarStyle} 
                    />
                    <Link href={'/profile/'+data.author.split(" ")[1]}>
                        <Typography variant="h6">{data.author}</Typography>
                    </Link> 
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={-8}>
                    <Box display="flex" flexDirection="column" alignItems="center" marginRight="15px">
                        <Button 
                            style={{ 
                                borderRadius: '50%', 
                                padding: '10px', 
                                backgroundColor: '#E7FAFE',
                                marginBottom: '5px',
                                width: '50px',
                                height: '50px'
                            }} 
                            onClick={handlePrint}
                        >
                        <img src={'/icons/print-icon.svg'} alt="Print" style={iconStyle}/>
                        </Button>
                        <Typography variant="caption">Print</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Button 
                            style={{ 
                                borderRadius: '50%', 
                                padding: '10px', 
                                backgroundColor: shared ? '#60D8BA' : '#E7FAFE',
                                marginBottom: '5px',
                                width: '50px',
                                height: '50px'
                            }} 
                            onClick={handleShare}
                        >
                        <img src={shared ? '/icons/check-icon.svg' : '/icons/share-icon.svg'} alt={shared ? "Check" : "Share"} style={iconStyle}/>
                        </Button>
                        <Typography variant="caption">
                            {shared ? "Copied\nto\nclipboard" : "Share"}
                        </Typography>
                    </Box>
                </Box>
            </Container>
        );
    } else {
        return <Typography>Error</Typography>;
    }
};
