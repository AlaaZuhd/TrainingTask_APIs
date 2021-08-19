import {useCallback, useContext, useEffect, useState} from "react";
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
import AuthContext from "../Context/AuthContext";
import Error from "./Error";

function Header() {

    const authContext = useContext(AuthContext)
    let log = authContext.loggedInState

    const [pageState, setPageState] = useState({isLoggedIn: false, currentPage: "home"})
    const [userState, setUserState] = useState({email: "", password: "", token: ""})


    let logoutPageHandler = (event) => {
        setPageState({"isLoggedIn": false})
    }

    let welcomeMessage = (log?
        "Welcome, You are logged in":
        "Welcome, Please login to continue"
    )

    return (
        <Router>
            <header>
                <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                    <div className=" d-flex align-items-center ">
                        {welcomeMessage}
                    </div>
                    <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                        {authContext.loggedInState && <Link className="me-3 py-2 text-dark text-decoration-none"
                                  to="/home">Home</Link>}
                        {authContext.loggedInState && <Link className="me-3 py-2 text-dark text-decoration-none"
                            to="/my-profile">My Profile</Link> }
                        {authContext.loggedInState && <Link className="me-3 py-2 text-dark text-decoration-none"
                            to="/posts">Posts</Link>}
                        {authContext.loggedInState && <Link className="me-3 py-2 text-dark text-decoration-none"
                            to="/my-comments">My Commnets</Link>
                        }
                        {log && <Link className="me-3 py-2 text-dark text-decoration-none"
                              to="/logout" onClick={logoutPageHandler} >Log out</Link>}
                        {!log && <Link className="me-3 py-2 text-dark text-decoration-none"
                              to="/login" >Log in</Link>}
                        {!log && <Link className="py-2 text-dark text-decoration-none"
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
