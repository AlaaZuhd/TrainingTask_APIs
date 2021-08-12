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
import { useHistory } from "react-router-dom";


function Header({history}) {

    const [pageState, setPageState] = useState({isLoggedIn: false, currentPage: "home"})
    const [userState, setUserState] = useState({email: "", password: "", token: ""})
    ///////////// revist this
    let loginPageHandler = (value) => {
        console.log("from header")
        setPageState({"isLoggedIn": value})
        console.log(pageState.isLoggedIn)
        // if(event) {
        //     history.push("./")
        // }
    }

    let logoutPageHandler = (event) => {
        setPageState({"isLoggedIn": false})
    }

    const LoginRequest = (loggedInData) => {
        setPageState( {isLoggedIn: true, currentPage: "home"})
        if(loggedInData.isLoggedIn){
            console.log(loggedInData.isLoggedIn)
            setUserState({...userState, email: loggedInData.userEmail, password: loggedInData.userPassword, token: loggedInData.token})
        }
        console.log(userState.email)
    }

    let loginOrLogout = (pageState.isLoggedIn === true ?
        <Link className="me-3 py-2 text-dark text-decoration-none"
           to="/logout" onClick={logoutPageHandler} >Log out</Link> :
        <Link className="me-3 py-2 text-dark text-decoration-none"
           to="/login" >Log in</Link>
    )

    return (
        <Router>
            <header>
                <div>
                    {pageState.isLoggedIn && <p>Welcome You are logged in</p>}
                    {!pageState.isLoggedIn && <p>Welcome You are not logged in</p>}
                </div>
                <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                    <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="/">Home</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="http://127.0.0.1:8000/ECW#products">Users</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="/posts">Posts</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                              to="/my_cart">Commnets</Link>
                        {loginOrLogout}
                        <Link className="py-2 text-dark text-decoration-none"
                              to="/register">Register</Link>
                    </nav>
                </div>
            </header>
            <Route exact path='/' component={ () => <Home authorization={pageState.isLoggedIn} />}  >
            </Route>
            <Route exact path='/posts' component={ () => <Posts authorization={pageState.isLoggedIn} />}  >
            </Route>
            <Route exact path='/login' component= {() => <Login onLogin={loginPageHandler}/>}  >
            </Route>
            <Route exact path='/logout' component= {() => <Logout authorization={pageState.isLoggedIn} />} >
            </Route>
            <Route exact path="/register" component={Register}>
            </Route>
        </Router>
    )
}

export default Header;
