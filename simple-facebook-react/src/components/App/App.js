import { useState } from 'react';
import logo from '../logo.svg';
import './App.css';
import Header from './Header.js';
import Login from "./Login";
import Home from "./Home.js"
import Logout from "./Logout"
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';

function App() {

    // const [pageState, setPageState] = useState({isLoggedIn: false, currentPage: "home"})
    // const [userState, setUserState] = useState({email: "", password: "", token: ""})
    // const LoginRequest = (loggedInData) => {
    //     setPageState( {isLoggedIn: true, currentPage: "home"})
    //     if(loggedInData.isLoggedIn){
    //         console.log(loggedInData.isLoggedIn)
    //         setUserState({...userState, email: loggedInData.userEmail, password: loggedInData.userPassword, token: loggedInData.token})
    //     }
    //     console.log(userState.email)
    // }
    //
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
        // setPageState({isLoggedIn: false, currentPage: "login"})
        // setPageState({...pageState, currentPage: value})
        // console.log("hi" + value)
        console.log("from app " + value)
        console.log(pageState.currentPage)
    }


    return (
        <div className="App">
            <Header className="App-header"
                    loggedIn={pageState.isLoggedIn}
                    onRefClick={currentPageHandler}
                    onSubmitUser={LoginRequest}>
            </Header>
        </div>
    );
}

export default App;
