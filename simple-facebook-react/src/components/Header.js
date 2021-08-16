import {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import Login from "./Login/Login";
import Home from "./Home/Home"
import Logout from "./Logout/Logout"
import Register from "./Register/Register";
import Posts from "./Posts/Posts"
import Comments from "./Comments/Comments"
import Profile from './Users/Profile'
import { useHistory } from "react-router-dom";


function Header() {

    const [pageState, setPageState] = useState({isLoggedIn: false, currentPage: "home"})
    const [userState, setUserState] = useState({email: "", password: "", token: ""})



    let logoutPageHandler = (event) => {
        setPageState({"isLoggedIn": false})
    }

    // const LoginRequest = (loggedInData) => {
    //     setPageState( {isLoggedIn: true, currentPage: "home"})
    //     if(loggedInData.isLoggedIn){
    //         console.log(loggedInData.isLoggedIn)
    //         setUserState({...userState, email: loggedInData.userEmail, password: loggedInData.userPassword, token: loggedInData.token})
    //     }
    //     console.log(userState.email)
    // }

    // let loginOrLogout = (pageState.isLoggedIn === true ?
    //     <Link className="me-3 py-2 text-dark text-decoration-none"
    //        to="/logout" onClick={logoutPageHandler} >Log out</Link> :
    //     <Link className="me-3 py-2 text-dark text-decoration-none"
    //        to="/login" >Log in</Link>
    // )

    let welcomeMessage = (pageState.isLoggedIn ?
        "Welcome You are logged in":
        "Welcome you are not logged in"
    )

    return (
        <Router>
            <header>
                <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                    <div className=" d-flex align-items-center ">
                            {/*{pageState.isLoggedIn && <p>Welcome You are logged in</p>}*/}
                            {/*{!pageState.isLoggedIn && <p>Welcome You are not logged in</p>}*/}
                        {welcomeMessage}
                    </div>
                    <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="/home">Home</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="/my-profile">My Profile</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="/posts">Posts</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                              to="/my-comments">My Commnets</Link>
                        {pageState.isLoggedIn && <Link className="me-3 py-2 text-dark text-decoration-none"
                              to="/logout" onClick={logoutPageHandler} >Log out</Link>}
                        {!pageState.isLoggedIn && <Link className="me-3 py-2 text-dark text-decoration-none"
                              to="/login" >Log in</Link>}
                        {!pageState.isLoggedIn && <Link className="py-2 text-dark text-decoration-none"
                              to="/register">Register</Link>}
                    </nav>
                </div>
            </header>

            <Route exact path='/home' component={ () => <Home authorization={pageState.isLoggedIn} />} />
            <Route exact path='/my-profile' component={ () => <Profile authorization={pageState.isLoggedIn} />} />
            <Route exact path='/posts' component={ () => <Posts authorization={pageState.isLoggedIn} />}  />
            <Route exact path='/my-comments' component={ () => <Comments authorization={pageState.isLoggedIn} />} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/logout' component= {() => <Logout authorization={pageState.isLoggedIn} />} />
            <Route exact path="/register" component={Register} />

        </Router>
    )
}

export default Header;
