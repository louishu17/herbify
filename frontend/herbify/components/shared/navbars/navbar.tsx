import React, {ReactNode} from 'react';
import { AppBar, Drawer, List, ListItem, ListItemText, Toolbar, Typography, Button, PropTypes } from '@mui/material'
import { useRouter, NextRouter } from 'next/router';
import { handleLogout } from '@/lib/logoutHooks';




interface HerbifyNavBarGivenOptionsProps {
    options : ReactNode;
}

const HerbifyNavBarGivenOptions : React.FC<HerbifyNavBarGivenOptionsProps> = (props : HerbifyNavBarGivenOptionsProps) => {

  return (
    <Drawer variant="permanent">
      <List>
        <ListItem style={{justifyContent: 'center'}}>
            <img src={`/icons/herbify-logo.svg`} style={{ width: '100px', height: 'auto'}}/>
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
    return (
        <div>
            {optionDescriptions.map((description, index) => {
                if (description.isLogoutButton) {
                    return (
                        <ListItem key={index}>
                            <img src={`/icons/${description.icon}`} width={"45px"} height={"45px"}/>
                            <Button color="inherit" onClick={() => {handleLogout(router)}}>{description.text}</Button>
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



