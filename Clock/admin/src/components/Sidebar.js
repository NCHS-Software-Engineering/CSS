import { Link } from 'react-router-dom';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Drawer } from '@mui/material';

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

function Sidebar(props) // props.width 
{
    return (
        <Box sx={{width: props.width, paddingTop: 1, borderRight: 1, marginRight: 1}}>
            <Drawer>
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
                                    <CalendarTodayRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Calendar"}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <Divider/>
                    <ListItem disablePadding>
                        <Link to="/defaultWeek" style={{width: "100%"}}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DateRangeRoundedIcon/>
                                </ListItemIcon>
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
                                <ListItemIcon>
                                    <LogoutRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Log Out"}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

export default Sidebar;