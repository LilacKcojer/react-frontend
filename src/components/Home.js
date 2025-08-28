import React, {useState, useEffect} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { BarChart } from '@mui/x-charts/BarChart';




const Home = ({user, signOut}) => {

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        <List>  
            <ListItem key={"Home"} disablePadding>
                <ListItemButton href='/'>
                    <ListItemText primary={"Home"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Goals"} disablePadding>
                <ListItemButton href='/goals'>
                    <ListItemText primary={"Goal"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Sign out"} disablePadding>
                <ListItemButton onClick={signOut}>
                    <ListItemText primary={"Sign out"} />
                </ListItemButton>
            </ListItem>
        </List>
        </Box>
    );

    const theme = createTheme({
        palette: {
            mode: 'dark'
        }
    });
    const [users, setUsers] = useState(null);
    
    const requestBody = {
        email: 'email2@test.com'
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    const addUsers = async () => {
        const response = await fetch("https://huix8w2yq5.execute-api.us-west-2.amazonaws.com/prod/users", options)
        const data = await response.json();

        setUsers(data);
    
    }

    const dataset = [
        {
            completions: 1,
            month: 'Jan',
        },
        {
            completions: 1,
            month: 'Feb',
        },
        {
            completions: 0,
            month: 'Mar',
        },
        {
            completions: 0,
            month: 'Apr',
        },
        {
            completions: 2,
            month: 'May',
        },
        {
            completions: 4,
            month: 'June',
        },
        {
            completions: 1,
            month: 'July',
        },
        {
            completions: 3,
            month: 'Aug',
        },
        {
            completions: 0,
            month: 'Sept',
        },
        {
            completions: 1,
            month: 'Oct',
        },
        {
            completions: 0,
            month: 'Nov',
        },
        {
            completions: 1,
            month: 'Dec',
        },
    ]


    return (
        <>
            <head>
                <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
            </head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
            <Stack spacing={3} sx={{
            justifyContent: "flex-start",
            alignItems: "center"
            }}>
            <Box sx={{width:"100%"}}>
                <IconButton sx={{alignContent: "baseline"}} onClick={toggleDrawer(true)}>
                <Icon fontSize="large">menu</Icon>
                </IconButton>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
                </Drawer>
            </Box>
            <Typography variant="h3">Home</Typography>
            <Box sx={{height:100}}></Box>
            <Paper sx={{ width:"30%", padding:1}} elevation={1}>
                <Typography variant="h6"><Typography sx={{color:'green'}} variant="h6" component="span">XX</Typography> goals completed</Typography>
                <br/>
                <Typography variant="h6"><Typography sx={{color:'green'}} variant="h6" component="span">XX</Typography> % current progress </Typography>
            </Paper>   

            <Paper sx={{padding:1}} elevation={0}>
                <BarChart
                    dataset={dataset}
                    xAxis={[{ dataKey: 'month', scaleType: 'band'}]}
                    series={[{ dataKey: 'completions'}]}
                    yAxis={[{label: 'Goals Completed'}]}
                    width={700}
                    height={300}
                />
            </Paper>
            
            </Stack>
            </ThemeProvider>
        </>
    )
};

export default Home;
