import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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
                    <ListItemText primary={"Goals"} />
                </ListItemButton>
            </ListItem>
        </List>
        </Box>
    );


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


    return (
        <>
            <h1>&emsp;Home</h1>
            <div>
            &emsp; &emsp;
            <Button variant="outlined" onClick={toggleDrawer(true)}>Pages</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
            </Drawer>
            &emsp;
            <Button variant="outlined" onClick={signOut}>Sign out</Button>
            </div>
        </>
    )
};

export default Home;
