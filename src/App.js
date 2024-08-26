import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Home from "./components/Home";
import AddGoals from "./components/add-goals";
import Goals from "./components/goals";

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={Home({user, signOut})}></Route>
        <Route path="/goals" element={Goals({user, signOut})}></Route>
        <Route path="/add-goals" element={AddGoals({user, signOut})}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default withAuthenticator(App);
