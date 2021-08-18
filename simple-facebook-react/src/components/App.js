import { useState } from 'react';
import logo from '../logo.svg';
import './App.css';
import Header from './Header.js';
import Login from "./Login/Login";
import Home from "./Home/Home.js"
import Logout from "./Logout/Logout"
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import AuthContext, {AuthContextProvider} from "../Context/AuthContext";
function App() {

    const [pageState, setPageState] = useState({isLoggedIn: false, currentPage: "home"})
    const [userState, setUserState] = useState({email: "", password: "", token: ""})
    const LoginRequest = (loggedInData) => {
        setPageState( {isLoggedIn: true, currentPage: "home"})
        if(loggedInData.isLoggedIn){
            console.log(loggedInData.isLoggedIn)
            setUserState({...userState, email: loggedInData.userEmail, password: loggedInData.userPassword, token: loggedInData.token})
        }
        console.log(userState.email)
    }



    let currentPageHandler = (value) => {
        setPageState((prevState) => {
            return {...prevState, currentPage: value}
        })
    }


    return (
        <div className="App">
            <AuthContextProvider>
            <Header className="App-header"
                    loggedIn={pageState.isLoggedIn}
                    onRefClick={currentPageHandler}
                    onSubmitUser={LoginRequest}>
            </Header>
            </AuthContextProvider>
        </div>
    );
}

export default App;
