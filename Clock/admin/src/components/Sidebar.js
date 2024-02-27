import "../styles/App.css";
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


/* Code pulled from  https://mui.com/material-ui/react-tabs/#nav-tabs */
function LinkTab(props) {
    return (
      <Tab
        component="a"
        aria-current={props.selected && 'page'}
        {...props}
        sx={{color: "primary.contrast"}}
      />
    );
};

LinkTab.propTypes = {
    selected: PropTypes.bool,
};


export default function Sidebar() {
    const [value, setValue] = React.useState('/');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Box sx={{ width: '15%', bgcolor: 'primary' }}>
            <List style={{ color: '#FFFFFF' }}>
                <ListItem disablePadding>
                    <LinkTab label="Preview" href="/preview" />
                </ListItem>
                <Divider />

                <ListItem disablePadding>
                    <LinkTab label="Calendar" href="/calendar" />
                </ListItem>
                <Divider />
                
                <ListItem disablePadding>
                    <LinkTab label="Default" href="/defaultWeek" />
                </ListItem>
                <Divider />

                <ListItem disablePadding>
                    <LinkTab label="Schedules" href="/schedules" />
                </ListItem>
                <Divider />

                <ListItem disablePadding>
                    <LinkTab label="Log Out" href="/" />
                </ListItem>
            </List>
        </Box>
    );
}