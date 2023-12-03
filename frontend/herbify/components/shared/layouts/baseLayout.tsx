import React, {ReactNode} from 'react';
import {Container, Typography, Stack} from '@mui/material';
import { BasicHerbifyNavBar } from '../navbars/basicNavbar';
import Footer from '../footer';

interface BaseLayoutProps {
    children: ReactNode;
};

export const BaseHerbifyLayout : React.FC<BaseLayoutProps> = (props:BaseLayoutProps) => {
    return (
        <Stack direction="row" style={{justifyContent : 'center'}} component="main">
            <BasicHerbifyNavBar/>
            <div>
                {props.children ? props.children : null}
            </div>
            <Footer/>
        </Stack>
    )

}

interface BaseLayoutWithTitleProps {
    title : string;
    children : ReactNode;
}
export const BaseHerbifyLayoutWithTitle : React.FC<BaseLayoutWithTitleProps> = (props : BaseLayoutWithTitleProps) => {
    return (
        <BaseHerbifyLayout>
            <Typography variant="h2" align="center" marginTop={4} marginBottom={2}>{props.title}</Typography>
            {props.children ? props.children : null}
        </BaseHerbifyLayout>
    )
}