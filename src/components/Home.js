import React, {useState, useEffect} from 'react';

const Home = ({user, signOut}) => {

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
    
    useEffect(() => {
        //addUsers();
    },[]);

    return (
        <>
            <h1>Hello {user.username}</h1>
            <h1>{users?.email}</h1>
            <button onClick={signOut}>Sign out</button>
        </>
    )
};

export default Home;
