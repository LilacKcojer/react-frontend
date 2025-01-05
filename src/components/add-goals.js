import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AddGoals = ({user, signOut}) => {

    console.log(user);

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


    

    const addGoals = async (options) => {
        await fetch("https://hsw4k5p2qd.execute-api.us-west-2.amazonaws.com/prod/", options);
        //const data = await response.json();
    }

    const getGoals = async (email) => {
        const options = {
            method: 'GET'
        }
        return await fetch("https://hsw4k5p2qd.execute-api.us-west-2.amazonaws.com/prod/" + email, options)
    }

    const start_goal = getGoals(user.signInDetails.loginId);

    console.log(start_goal);
   
    const [task, setTask] = React.useState('');
    const [score, setScore] = React.useState('');
    const [username, setUsername] = React.useState('');
  
    const handleChangeScore = (event) => {
      setScore(event.target.value);
    };

    const handleChangeTask = (event) => {
        setTask(event.target.value);
    };

    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    };

    const onSubmit = async () => {
        const email = user.signInDetails.loginId;
        const items = [{task, score, username}];
        const input = {email, items};

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        };

        await addGoals(options);
    }


    return (
        <>
            <h1>Goals</h1>
            <Button onClick={toggleDrawer(true)}>Pages</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
            </Drawer>
            <button onClick={signOut}>Sign out</button>
            <div>
                <h2>Change goal</h2>
                <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <div>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={task}
                        label="Task"
                        onChange={handleChangeTask}
                    >
                        <MenuItem value={"VT Floatshot Advanced S3"}>VT Floatshot Advanced S3</MenuItem>
                        <MenuItem value={"VT Shifttrack Advanced S3"}>VT Shifttrack Advanced S3</MenuItem>
                        <MenuItem value={"VT Jettrack Advanced S3"}>VT Jettrack Advanced S3</MenuItem>
                    </Select>
                    <TextField
                    required
                    id="outlined-required"
                    label="Score"
                    defaultValue="Score"
                    value={score}
                    onChange={handleChangeScore}
                    />
                    <TextField
                    required
                    id="outlined-required"
                    label="Username"
                    defaultValue="Username"
                    value={username}
                    onChange={handleChangeUsername}
                    />
                    <Button variant="contained" onClick={onSubmit}>Add goal</Button>
                </div>
                </Box>
            </div>
        </>
    )
};

export default AddGoals;
