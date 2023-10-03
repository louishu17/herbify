import React, {ReactNode} from 'react';
import {Container, Typography} from '@mui/material';
import { BasicHerbifyNavBar } from '../navbars/basicNavbar';
import Footer from '../footer';

interface BaseLayoutProps {
    children: ReactNode;
};

export const BaseHerbifyLayout : React.FC<BaseLayoutProps> = (props:BaseLayoutProps) => {
    return (
        <Container maxWidth={false} style={{alignItems : 'center', justifyContent : 'center'}} component="main">
            <BasicHerbifyNavBar/>
            {props.children ? props.children : null}
            <Footer/>
        </Container>
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