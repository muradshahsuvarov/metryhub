import React, { useState } from 'react';
import {
  Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem,
  ListItemIcon, ListItemText, Grid, Paper, styled, IconButton, useTheme, useMediaQuery, TextField, Button, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemSecondaryAction, Collapse, Card, CardContent, CardActions, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/DevicesOther';
import ListIcon from '@mui/icons-material/List';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Chart from 'react-apexcharts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ReactApexChart from 'react-apexcharts';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CheckIcon from '@mui/icons-material/Check';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationCard from './NotificationCard';
import AccountCard from './AccountCard';
import DeviceDataListCard from './DeviceDataListCard';
import ClientGlobeCard from './ClientGlobeCard';
  

const drawerWidth = 240;



const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const AnalyticDashboard = () => {

  const clientData = [
    { country: 'US', clients: 150 }, // United States
    { country: 'DE', clients: 80 },  // Germany
    { country: 'BR', clients: 60 },  // Brazil
    { country: 'IN', clients: 100 }, // India
    { country: 'CN', clients: 120 }, // China
    { country: 'RU', clients: 90 },  // Russia
    { country: 'AU', clients: 50 },  // Australia
    // ... add more countries as needed
];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDeviceForToggle, setSelectedDeviceForToggle] = useState(null);

    const [graphDialogOpen, setGraphDialogOpen] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState(null);

    const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
    const [selectedDeviceForSecurity, setSelectedDeviceForSecurity] = useState(null);

    
    // Sample graph data (you can customize this)
    const sampleGraphs = {
        statistics: {
          options: {
            chart: {
              id: 'statistics-chart',
              type: 'line',
              height: 350,
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            title: {
              text: 'Data Flow',
              align: 'center'
            }
          },
          series: [
            {
              name: "Statistics",
              data: [31, 40, 28, 51, 42, 109, 100, 40, 31, 35, 51, 49]
            }
          ]
        },
    };

    // State to show a copied message
    const [copied, setCopied] = useState(false);

    // Sample device token (you can replace it with a real one)
    const sampleDeviceToken = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

    const onCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSecurityMenuClick = (device) => {
        setSelectedDeviceForSecurity({ deviceToken: sampleDeviceToken });
        setSecurityDialogOpen(true);
    };

    const handleSecurityDialogClose = () => {
        setSecurityDialogOpen(false);
    };

    const handleGraphMenuClick = (graphType) => {
        console.log("Graph menu clicked:", graphType);
        if (sampleGraphs[graphType]) {
            setSelectedGraph(sampleGraphs[graphType]);
            setGraphDialogOpen(true);
        } else {
            console.error("Graph data not found for:", graphType);
        }
    };
    
      const handleGraphDialogClose = () => {
        setGraphDialogOpen(false);
        setSelectedGraph(null);
    };

    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
    setAnchorEl(null);
    };

    const iotDevices = [
        { id: 1, name: 'Temprature IoT', deviceToken: 'token123', isActive: true },
        { id: 2, name: 'Water Pressure', deviceToken: 'token456', isActive: false },
    // ... more devices
    ];

  const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon /> },
        { text: 'Register IoT Device', icon: <AddCircleOutlineIcon /> },
        { text: 'List IoT Devices', icon: <ListIcon /> },
    ];
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Dummy data for charts
  const chartData = {
    options: {
      chart: {
        id: 'basic-bar'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  };


    const handleToggleClick = (device) => {
        setSelectedDeviceForToggle(device);
        setDialogOpen(true);
    };

    const handleToggleConfirm = () => {
        console.log(`Toggling device: ${selectedDeviceForToggle.name}`);
        setDialogOpen(false);
    };

    const handleToggleCancel = () => {
        setDialogOpen(false);
    };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          {/* Add more items for the AppBar here */}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {sidebarItems.map((item, index) => (
          <ListItem button key={item.text}>
            <ListItemIcon sx={{ color: 'grey.300' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Grid container spacing={3}>
          {/* Cards and Charts here */}
          {/* Example Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'white', color: 'black' }}> {/* Updated bgcolor and color */}
                <Typography variant="h6" gutterBottom>
                Register IoT Device
                </Typography>
                <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <div>
                    <TextField
                    required
                    id="device-name"
                    label="Device Name"
                    defaultValue=""
                    variant="filled"
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                    />
                    <TextField
                    required
                    id="device-type"
                    label="Device Type"
                    defaultValue=""
                    variant="filled"
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                    />
                </div>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Register Device
                </Button>
                </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Revenue</Typography>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width="500"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'white', color: 'black' }}>
            <Typography variant="h6" gutterBottom>
              List IoT Devices
            </Typography>
            <List>
              {iotDevices.map((device) => (
                <>
                  <ListItem key={device.id}>
                    <ListItemIcon>
                      <FiberManualRecordIcon
                        sx={{ color: device.isActive ? '#1976D2' : 'grey' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={device.name} />
                    <IconButton
                      edge="end"
                      aria-label="settings"
                      onClick={(e) => handleClick(e)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="device-menu"
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleClose}
                      MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                    >
                    <MenuItem onClick={() => handleToggleClick(device)}>
                    {device.isActive ? "Turn Off" : "Turn On"}
                    </MenuItem>
                    <MenuItem onClick={() => handleGraphMenuClick('statistics')}>Statistics</MenuItem>
                    <MenuItem onClick={() => handleSecurityMenuClick(device)}>Security</MenuItem>
                    </Menu>
                    </ListItem>
                    <Divider sx={{ bgcolor: device.isActive ? '#1976D2' : 'grey' }} />
                    </>
                    ))}
                    </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <NotificationCard />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <AccountCard />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                     <DeviceDataListCard devices={iotDevices} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                     <ClientGlobeCard clientData={clientData} />
                </Grid>
          {/* Additional cards and charts can be added in a similar fashion */}
        </Grid>
      </Main>
      <Dialog open={securityDialogOpen} onClose={handleSecurityDialogClose} maxWidth="lg" fullWidth>
            <DialogTitle>Device Security</DialogTitle>
            <DialogContent>
                    <Paper sx={{
                        bgcolor: '#333',
                        color: 'white',
                        padding: '20px',
                        marginBottom: '10px',
                        wordBreak: 'break-all'
                    }}>
                    <Typography variant="body1" component="pre" style={{ fontSize: '1rem' }}>
                            {selectedDeviceForSecurity?.deviceToken}
                    </Typography>
                    </Paper>
                    <CopyToClipboard text={selectedDeviceForSecurity?.deviceToken} onCopy={onCopy}>
                    <Button variant="contained" color="primary" startIcon={copied ? <CheckIcon /> : <FileCopyIcon />}>
                    {copied ? 'Copied' : 'Copy Token'}
                    </Button>
                    </CopyToClipboard>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleSecurityDialogClose} color="primary">Close</Button>
            </DialogActions>
      </Dialog>
      <Dialog open={graphDialogOpen} onClose={handleGraphDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Device Statistics Overview</DialogTitle>
                <DialogContent>
                    {selectedGraph ? (
                        <ReactApexChart
                            options={selectedGraph.options}
                            series={selectedGraph.series}
                            type="line"
                            height={350}
                        />
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            No graph data available
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleGraphDialogClose} color="primary">Close</Button>
            </DialogActions>
       </Dialog>
       <Dialog open={dialogOpen} onClose={handleToggleCancel}>
        <DialogTitle>
        {selectedDeviceForToggle?.isActive ? "Turn Off Device" : "Turn On Device"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
        Are you sure you want to {selectedDeviceForToggle?.isActive ? "turn off" : "turn on"} {selectedDeviceForToggle?.name}?
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleToggleCancel} color="primary">
        Cancel
        </Button>
        <Button onClick={handleToggleConfirm} color="primary">
        {selectedDeviceForToggle?.isActive ? "Turn Off" : "Turn On"}
        </Button>
        </DialogActions>
    </Dialog>
    </Box>
  );
}

export default AnalyticDashboard;
