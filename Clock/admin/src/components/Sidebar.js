import "../styles/App.css";
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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
        <Box sx={{ width: '15vw', bgcolor: 'basic.main', borderRight: 1, borderColor: 'primary.main' }} style={{ color: '#FFFFFF' }}>
            <List >
                <ListItem disablePadding sx={{ pl: 2 }}>
                    <LinkTab label="Preview" href="/preview" />
                </ListItem>
                <Divider />

                <ListItem disablePadding sx={{ pl: 2 }}>
                    <LinkTab label="Calendar" href="/calendar" />
                </ListItem>
                <Divider />
                
                <ListItem disablePadding sx={{ pl: 2 }}>
                    <LinkTab label="Default" href="/defaultWeek" />
                </ListItem>
                <Divider />

                <ListItem disablePadding sx={{ pl: 2 }}>
                    <LinkTab label="Schedules" href="/schedules" />
                </ListItem>
                <Divider />

                <ListItem disablePadding sx={{ pl: 2 }}>
                    <LinkTab label="Log Out" href="/" />
                </ListItem>
            </List>
        </Box>
    );
}