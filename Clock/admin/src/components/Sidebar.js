import { Link } from 'react-router-dom';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon, IconButton } from '@mui/material';

/**/
const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

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
/**/

function Sidebar(props) // props.width 
{
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };
    
    //sx={{width: props.width, paddingTop: 1, marginRight: 1}}

    return (
        <Box >
            <Drawer variant="permanent" open={open}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                    marginRight: 5,
                    ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftRoundedIcon/>
                </IconButton>
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