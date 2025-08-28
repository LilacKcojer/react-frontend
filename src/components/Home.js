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

    let dataset = [
        {
            completions: 0,
            month: 'Jan',
        },
        {
            completions: 0,
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
            completions: 0,
            month: 'May',
        },
        {
            completions: 0,
            month: 'Jun',
        },
        {
            completions: 0,
            month: 'Jul',
        },
        {
            completions: 0,
            month: 'Aug',
        },
        {
            completions: 0,
            month: 'Sep',
        },
        {
            completions: 0,
            month: 'Oct',
        },
        {
            completions: 0,
            month: 'Nov',
        },
        {
            completions: 0,
            month: 'Dec',
        },
    ]

    
    
    const [task, setTask] = React.useState('');
    const [score, setScore] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [history, setHistory] = React.useState([]);
    const [formattedHistory, setFormattedHistory] = React.useState(dataset);
    const [goalsCompleted, setGoalsCompleted] = React.useState(0);

    useEffect(() => {
        const init = async() => {
            currentGoals = await getGoals(user.signInDetails.loginId);
            currentGoals = currentGoals.Item.items[0];
            console.log(currentGoals);

            if(currentGoals.task != null){
                setTask(currentGoals.task);
            }
            if(currentGoals.username != null){
                setUsername(currentGoals.username);
            }
            if(currentGoals.score !== ""){
                setGoalScore(currentGoals.score);
                setScore(currentGoals.score);
            }
            if(currentGoals.history != null){
                setHistory(currentGoals.history);
                setGoalsCompleted(currentGoals.history.length);
                for(var i = 0; i < currentGoals.history.length; i++){
                    for(var j = 0; j < 12; j++){
                        if(currentGoals.history[i].includes(dataset[j].month)){
                            dataset[j].completions+=1;
                        }
                    }
                    
                }
                setFormattedHistory(dataset);
                console.log("dataset: " + dataset);
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
                <Typography variant="h6"><Typography sx={{color:'green'}} variant="h6" component="span">{goalsCompleted}</Typography> goals completed</Typography>
                <br/>
                <Typography variant="h6"><Typography sx={{color:'green'}} variant="h6" component="span">{(actualScore/goalScore * 100).toFixed(1)}</Typography> % current progress </Typography>
            </Paper>   

            <Paper sx={{padding:1}} elevation={0}>
                <BarChart
                    dataset={formattedHistory}
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
