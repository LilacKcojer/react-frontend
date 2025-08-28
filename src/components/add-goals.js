import React, {useState, useEffect} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';



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
    

    const addGoals = async (options) => {
        await fetch("https://hsw4k5p2qd.execute-api.us-west-2.amazonaws.com/prod/", options);
        //const data = await response.json();
    }

    const getGoals = async (email) => {
        const options = {
            method: 'GET'
        }
        const response = await fetch("https://hsw4k5p2qd.execute-api.us-west-2.amazonaws.com/prod/" + email, options)
        const body = await response.json();
        return body;
    }

    const getAimlabStats = async (username, task) => {
        const input = {"query":"\n  query GetProfile($username: String) {\n    aimlabProfile(username: $username) {\n      username\n      user {\n        id\n      }\n      ranking {\n        rank {\n          displayName\n        }\n        skill\n      }\n    }\n  }\n","variables":{"username": username}}
        
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }

        const response = await fetch("https://api.aimlab.gg/graphql", options)
            .then(function(result){
                return result.json();
            });

        console.log(response);

        const userId = response.data.aimlabProfile.user.id;

        console.log("user id: " + userId);
        
        const inputStats = {"query":"\n  query GetAimlabProfileAgg($where: AimlabPlayWhere!) {\n    aimlab {\n      plays_agg(where: $where) {\n        group_by {\n          task_id\n          task_name\n        }\n        aggregate {\n          count\n          avg {\n            score\n            accuracy\n          }\n          max {\n            score\n            accuracy\n            created_at\n          }\n        }\n      }\n    }\n  }\n","variables":{"where":{"is_practice":{"_eq":false},"score":{"_gt":0},"user_id":{"_eq": userId },"task_mode":{"_eq":42}}}}
        
        const optionsStats = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputStats),
        }

        const responseStats = await fetch("https://api.aimlab.gg/graphql", optionsStats)
            .then(function(result){
                return result.json();
            });;

        console.log("Stats:\n");
        console.log(responseStats);

        const data = responseStats.data.aimlab.plays_agg;

        for (var i = 0; i < data.length; i++){
            if(data[i].group_by.task_name === task){
                return data[i].aggregate.max.score;
            }
        } 
    }

    const [goalScore, setGoalScore] = React.useState(1);
    const [actualScore, setActualScore] = React.useState(0);
    const [displayScore, setDisplayScore] = React.useState(0);

    var currentGoals;
    var currentScoreAtGoals;

    

    
   
    const [task, setTask] = React.useState('');
    const [score, setScore] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [history, setHistory] = React.useState([]);

    useEffect(() => {
        const init = async() => {
            currentGoals = await getGoals(user.signInDetails.loginId);
            currentGoals = currentGoals.Item.items[0];
            console.log(currentGoals);

            if(currentGoals.task != null){
                setTask(currentGoals.task);
            }
            if(currentGoals.username != null){
                setUsername(currentGoals.username)
            }
            if(currentGoals.score !== ""){
                setGoalScore(currentGoals.score);
                setScore(currentGoals.score);
            }
            if(currentGoals.history != null){
                setHistory(currentGoals.history)
            }
            if(currentGoals.username != null && currentGoals.task !== ""){
                currentScoreAtGoals = await getAimlabStats(currentGoals.username, currentGoals.task);
                console.log(currentScoreAtGoals);
                setActualScore(currentScoreAtGoals);

                if(currentScoreAtGoals > currentGoals.score){
                    setDisplayScore(currentGoals.score);
                } else{
                    setDisplayScore(currentScoreAtGoals);
                }
            }
            
            

            
        }
        init();
    },[]);
  
    const [openBackdrop, setOpenBackdrop] = React.useState(false);

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    }

    const handleOpenBackdrop = () => {
        setOpenBackdrop(true);
    }
    const handleChangeScore = (event) => {
      setScore(event.target.value);
    };

    const handleChangeTask = (event) => {
        setTask(event.target.value);
    };

    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    };

    const onSubmit = async (task, score, username, history) => {
        const email = user.signInDetails.loginId;
        const items = [{task, score, username, history}];
        const input = {email, items};
        console.log(input)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        };
        try{
            await addGoals(options);
            window.location.reload();
        } catch(err){
            console.log(err);
        }
        
    }


    const completeGoal = () => {
        const new_history =
        [
                ...history,
                String(new Date())
        ]

        onSubmit('', '', username, new_history);
    }

    const onChangeGoal = () => {
        onSubmit(task, score, username, history);
    }

    const renderCheck = () => {
        if (actualScore >= goalScore){
            return <IconButton onClick={completeGoal}><Icon>check</Icon></IconButton>
        }
    }

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
                <Paper sx={[{padding:1}]} elevation={1}>
                        <Box sx={[{width:1/1, alignItems:"flex-end"}]}>{renderCheck()}</Box>
                        <Button onClick={handleOpenBackdrop}>
                        <Gauge
                        sx={{
                            fontSize:60
                        }}
                        value={Number(displayScore)}
                        valueMax={Number(goalScore)}
                        startAngle={-110}
                        endAngle={110}
                        width={600}
                        height={600}
                        text={`${actualScore} / ${goalScore}`}
                        />
                        </Button>
                </Paper>
            <Typography variant='h3'>{task}</Typography>
            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={openBackdrop}
                >
                <Paper elevation={1}>
                <Box
                component="form"
                noValidate
                autoComplete="off"
                >
                    <FormControl>
                        <InputLabel id="demo-simple-select-standard-label">Task</InputLabel>
                        <Select
                        width={200}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={task}
                        label="Task"
                        onChange={handleChangeTask}
                        >
                            <MenuItem value={"VT Floatshot Advanced S3"}>VT Floatshot Advanced S3</MenuItem>
                            <MenuItem value={"VT Shifttrack Advanced S3"}>VT Shifttrack Advanced S3</MenuItem>
                            <MenuItem value={"VT Jettrack Advanced S3"}>VT Jettrack Advanced S3</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                    width={200}
                    required
                    id="outlined-required"
                    label="Goal"
                    defaultValue="Goal"
                    value={score}
                    onChange={handleChangeScore}
                    />
                    <TextField
                    width={200}
                    required
                    id="outlined"
                    label="Username"
                    defaultValue="Username"
                    value={username}
                    onChange={handleChangeUsername}
                    />
                    <IconButton onClick={handleCloseBackdrop} sx={{alignContent:'flex-end'}}><Icon>close</Icon></IconButton>
                    <Button variant="contained" onClick={onChangeGoal} fullWidth>Change Goal</Button>
                    
                </Box>
                </Paper>
            </Backdrop>
            </Stack>
            </ThemeProvider>
        </>
    )
};

export default AddGoals;
