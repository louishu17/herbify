import React, {ReactNode} from 'react';
import { AppBar, Toolbar, Typography, Button, PropTypes } from '@mui/material'
import { useRouter, NextRouter } from 'next/router';




interface HerbifyNavBarGivenOptionsProps {
    options : ReactNode;
}

const HerbifyNavBarGivenOptions : React.FC<HerbifyNavBarGivenOptionsProps> = (props : HerbifyNavBarGivenOptionsProps) => {

    return (
        <AppBar position={"sticky"} color={"primary"} >
            <Toolbar>
                <Typography variant="h5" style={{ flexGrow: 1 }}>
                    Herbify
                </Typography>
                {props.options}
            </Toolbar>
        </AppBar>
    )
}

HerbifyNavBarGivenOptions.defaultProps = {
    options : undefined

}

export interface OptionDescription {
    text : string;
    route : string;
}

interface HerbifyNavBarGivenOptionDescriptionsProps {
    optionDescriptions : OptionDescription[];
    colorIsPrimary? : boolean;
}

export const HerbifyNavBarGivenOptionDescriptions : React.FC<HerbifyNavBarGivenOptionDescriptionsProps> = (props : HerbifyNavBarGivenOptionDescriptionsProps) => {
    const router = useRouter();
    return <HerbifyNavBarGivenOptions options={descriptionsToOptions(props.optionDescriptions, router)}/>
}



HerbifyNavBarGivenOptionDescriptions.defaultProps = {
    optionDescriptions : [],
    colorIsPrimary : true, 
}

export const descriptionsToOptions = (optionDescriptions : OptionDescription[], router : NextRouter) : ReactNode => {
    return (
        <div>
            {optionDescriptions.map((description, index) => {
                return (
                    <Button color="inherit" onClick={() => router.push(description.route)} key={index}>{description.text}</Button>
                )
            })}
        </div>
    );
}



