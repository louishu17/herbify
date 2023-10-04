import React, {ReactNode} from 'react';
import { AppBar, Drawer, List, ListItem, ListItemText, Toolbar, Typography, Button, PropTypes } from '@mui/material'
import { useRouter, NextRouter } from 'next/router';




interface HerbifyNavBarGivenOptionsProps {
    options : ReactNode;
}

const HerbifyNavBarGivenOptions : React.FC<HerbifyNavBarGivenOptionsProps> = (props : HerbifyNavBarGivenOptionsProps) => {

  return (
    <Drawer variant="permanent">
      <List>
        <ListItem>
            <img src={`/icons/herbify-icon.svg`}/>
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
                    <ListItem>
                        <img src={`/icons/${description.icon}`}/>
                        <Button color="inherit" onClick={() => router.push(description.route)} key={index}>{description.text}</Button>
                    </ListItem>
                )
            })}
        </div>
    );
}



