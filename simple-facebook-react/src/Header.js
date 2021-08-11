import {useState} from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import Login from "./Login";
import Home from "./Home"
import Logout from "./Logout"
import Register from "./Register";


function Header(props) {

    let loginPageHandler = (event) => {
        // event.preventDefault()
        console.log("from header")
        props.onRefClick("login")
    }


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
    const [isLoggedIn, setIsLoggedIn] = useState({isLoggedIn: "false"})
    let loginOrLogout = (isLoggedIn.isLoggedIn === "false" ?
        <Link className="me-3 py-2 text-dark text-decoration-none"
           to="/logout" >Log out</Link> :
        <Link className="me-3 py-2 text-dark text-decoration-none"
           to="/login" onClick={loginPageHandler} onSubmitHandler={LoginRequest} >Log in</Link>
    )
    console.log(isLoggedIn.isLoggedIn)

    return (
        <Router>
            <header>
                <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                    <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="/">Home</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="http://127.0.0.1:8000/ECW#products">Users</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                           to="http://127.0.0.1:8000/ECW#category">Posts</Link>
                        <Link className="me-3 py-2 text-dark text-decoration-none"
                              to="/my_cart">Commnets</Link>
                        {loginOrLogout}
                        <Link className="py-2 text-dark text-decoration-none"
                              to="/register">Register</Link>
                    </nav>
                </div>
            </header>
            <Route exact path='/' component={Home}>
            </Route>
            <Route exact path='/login' component={Login}>
            </Route>
            <Route exact path='/logout' component={Logout}>
            </Route>
            <Route exact path="/register" component={Register}>
            </Route>
        </Router>
    )
}

export default Header;
