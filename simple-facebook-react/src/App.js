import { useState } from 'react';
import logo from './logo.svg';
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
    let pageView = ""
    if(pageState.currentPage === "home"){
        pageView = (
            <div>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer">
            Learn React
            </a>
            </div>
        )
    } else if (pageState.currentPage === "login") {
        // pageView = <Login onSubmitUser={LoginRequest} />
        pageView = <Login onSubmitUser={LoginRequest} currentPage={pageState.currentPage} />
    } else if (pageState.currentPage === "logout") {

    } else if (pageState.currentPage === "users") {

    } else if (pageState.currentPage === "posts") {

    } else if (pageState.currentPage === "comments") {

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
    let l =             <Login onSubmitUser={LoginRequest} currentPage={pageState.currentPage} />


    return (
        <div className="App">
            <Header className="App-header" loggedIn={pageState.isLoggedIn} onRefClick={currentPageHandler} onSubmitUser={LoginRequest}>
            </Header>

{/*            <Router>*/}
{/*                <div className="App">*/}
{/*    /!*<ul>*!/*/}
{/*    /!*  <li>*!/*/}
{/*    /!*    <Link to="/login">Home</Link>*!/*/}
{/*    /!*  </li>*!/*/}
{/*    /!*  <li>*!/*/}
{/*    /!*    <Link to="/about">About Us</Link>*!/*/}
{/*    /!*  </li>*!/*/}
{/*    /!*  <li>*!/*/}
{/*    /!*    <Link to="/contact">Contact Us</Link>*!/*/}
{/*    /!*  </li>*!/*/}
{/*    /!*</ul>*!/*/}

{/*</div>*/}


{/*                /!*<Route exact path='/about' component={About}></Route>*!/*/}
{/*                /!*<Route exact path='/contact' component={Contact}></Route>*!/*/}
{/*            </Router>*/}

            {/*<Logout ></Logout>*/}
            {/*// i have to add th epage view here to know when to display and when to hide*/}
            {/*<Login onSubmitUser={LoginRequest} currentPage={pageState.currentPage} />*/}
            {/*<Home ></Home>*/}


        </div>
    );
}

export default App;
