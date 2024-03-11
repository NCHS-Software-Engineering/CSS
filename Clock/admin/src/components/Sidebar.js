import { Link } from 'react-router-dom';

import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

function Sidebar(props) // props.width 
{
    return (
        <Box sx={{width: props.width, paddingTop: 1, borderRight: 1, marginRight: 1}}>
            <List>
                <ListItem disablePadding>
                    <Link to="/preview" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemText primary={"Preview"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link to="/layout" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemText primary={"Layout"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link to="/calendar" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemText primary={"Calendar"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link to="/defaultWeek" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemText primary={"Default Week"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link to="/schedules" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemText primary={"Schedules"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link to="/" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemText primary={"Log Out"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
            </List>
        </Box>
    );
}

export default Sidebar;