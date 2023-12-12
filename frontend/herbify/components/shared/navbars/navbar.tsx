import React, {ReactNode} from 'react';
import { AppBar, Drawer, List, ListItem, Button,IconButton } from '@mui/material'
import { useRouter, NextRouter } from 'next/router';
import { useHandleLogout } from '@/lib/logoutHooks';
import HomeButton from '@/components/shared/homeButton';
import styles from './HerbifyNavBarGivenOptions.module.css';




interface HerbifyNavBarGivenOptionsProps {
    options : ReactNode;
}

const HerbifyNavBarGivenOptions : React.FC<HerbifyNavBarGivenOptionsProps> = (props : HerbifyNavBarGivenOptionsProps) => {
    const router = useRouter();
  return (
    <Drawer variant="permanent" className='no-print'>
      <List>
        <ListItem style={{justifyContent: 'center'}}>
        <IconButton 
            onClick={() => router.push('/feed')} 
            sx={{ 
                padding: 0, 
                '&:hover': { 
                    bgcolor: 'transparent', // Make hover background transparent
                } 
            }}
        >
            <img src={`/icons/herbify-logo.svg`} style={{ width: '100px', height: 'auto'}}/>
        </IconButton>
        </ListItem>
        {props.options}
      </List>
    </Drawer>
  );
}

HerbifyNavBarGivenOptions.defaultProps = {
    options : undefined

}

export interface OptionDescription {
    text : string;
    route : string;
    icon: string;
    isLogoutButton? : boolean;
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
    const handleLogout = useHandleLogout();
    return (
        <div>
            {optionDescriptions.map((description, index) => {
                if (description.isLogoutButton) {
                    return (
                        <ListItem key={index}>
                            <img src={`/icons/${description.icon}`} width={"45px"} height={"45px"}/>
                            <Button color="inherit" onClick={handleLogout}>{description.text}</Button>
                        </ListItem>
                    );
                }
                return (
                    <ListItem key={index}>
                        <img src={`/icons/${description.icon}`} width={"45px"} height={"45px"}/>
                        <Button color="inherit" onClick={() => router.push(description.route)}>{description.text}</Button>
                    </ListItem>
                );
            })}
        </div>
    );
}



