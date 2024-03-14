// import { Link } from 'react-router-dom';
import Link from '@mui/material/Link';
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
const drawerWidth = 200;

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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

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
        <Box>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{display: 'flex', alignItems: 'center', justifyContent: open ? 'end' : 'center'}}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        sx={{
                        ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="close drawer"
                        onClick={handleDrawerClose}
                        sx={{
                        mr: 1.75,
                        ...(!open && { display: 'none'})
                        }}
                    >
                        <ChevronLeftRoundedIcon/>
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    <ListItem disablePadding>
                        <Link href="/preview" underline="none" style={{width: "100%"}}>
                            <ListItemButton sx={{justifyContent: open ? 'initial' : 'center'}}>
                                <ListItemIcon sx={{mr: 'auto', justifyContent: 'center',}}>
                                    <ImageRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Preview"} sx={{ opacity: open ? 1 : 0 }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link href="/layout" underline="none" style={{width: "100%"}}>
                            <ListItemButton sx={{justifyContent: open ? 'initial' : 'center'}}>
                                <ListItemIcon sx={{mr: 'auto', justifyContent: 'center',}}>
                                    <DashboardRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Layout"} sx={{ opacity: open ? 1 : 0 }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link href="/calendar" underline="none" style={{width: "100%"}}>
                            <ListItemButton sx={{justifyContent: open ? 'initial' : 'center'}}>
                                <ListItemIcon sx={{mr: 'auto', justifyContent: 'center',}}>
                                    <CalendarTodayRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Calendar"} sx={{ opacity: open ? 1 : 0 }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link href="/defaultWeek" underline="none" style={{width: "100%"}}>
                            <ListItemButton sx={{justifyContent: open ? 'initial' : 'center'}}>
                                <ListItemIcon sx={{mr: 'auto', justifyContent: 'center',}}>
                                    <DateRangeRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Default Week"} sx={{ opacity: open ? 1 : 0 }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link href="/schedules" underline="none" style={{width: "100%"}}>
                            <ListItemButton sx={{justifyContent: open ? 'initial' : 'center'}}>
                                <ListItemIcon sx={{mr: 'auto', justifyContent: 'center',}}>
                                    <ScheduleRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Schedules"} sx={{ opacity: open ? 1 : 0 }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <Divider/>
                    <ListItem disablePadding>
                        <Link href="/" underline="none" style={{width: "100%"}}>
                            <ListItemButton sx={{justifyContent: open ? 'initial' : 'center'}}>
                                <ListItemIcon sx={{mr: 'auto', justifyContent: 'center',}}>
                                    <LogoutRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Log Out"} sx={{ opacity: open ? 1 : 0 }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

export default Sidebar;