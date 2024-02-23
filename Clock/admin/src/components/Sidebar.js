import "../styles/App.css";
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography'


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

    return (
        <Box sx={{ width: '20%', typography: 'body1' }}>
            <Typography variant="body1">
            <Tabs 
                orientation="vertical"
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{ display: 'flex' }}
            >
                <LinkTab label="Preview" href="/preview" />
                <LinkTab label="Calendar" href="/calendar" />
                <LinkTab label="Default" href="/defaultWeek" />
                <LinkTab label="Schedules" href="/schedules" />
                <LinkTab label="Log Out" href="/" />
            </Tabs>
            </Typography>
        </Box>
    );
}