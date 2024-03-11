import { Link } from 'react-router-dom';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Icon, ListItemIcon } from '@mui/material';

function Sidebar(props) // props.width 
{
    return (
        <Box sx={{width: props.width, paddingTop: 1, borderRight: 1, marginRight: 1}}>

            <List>
                <ListItem disablePadding>
                    <Link to="/preview" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ImageRoundedIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Preview"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <Link to="/layout" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <DashboardRoundedIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Layout"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <Link to="/calendar" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <TodayRoundedIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Calendar"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <Link to="/defaultWeek" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemText primary={"Default Week"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <Link to="/schedules" style={{width: "100%"}}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ScheduleRoundedIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Schedules"}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <Divider/>
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