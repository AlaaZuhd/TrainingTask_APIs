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


function Header(props) {

    let loginPageHandler = (event) => {
        // event.preventDefault()
        console.log("from header")
        props.onRefClick("login")
    }

    let logoutPageHandler = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('http://127.0.0.1:8000/logout', requestOptions)
            .then(response => {
                console.log(response.status)
                if(response.status === 200){
                    console.log("hi")
                    // return response.json()
                }
                else {
                    throw "Email or Password is invalid"
                }
            })
            .then(data => {
                // console.log(data)
                // return {isLoggedIn: true, username: userInput.userEmail, password: userInput.userPassword}
            })
            .catch(error => {
                // return {isLoggedIn: false, username: userInput.userEmail, password: userInput.userPassword}
                // console.log(error)
            })

    }

    const [isLoggedIn, setIsLoggedIn] = useState({isLoggedIn: "false"})
    let loginOrLogout = (isLoggedIn.isLoggedIn === "true" ?
        <Link className="me-3 py-2 text-dark text-decoration-none"
           to="/logout" onClick={logoutPageHandler}>Log out</Link> :
        <Link className="me-3 py-2 text-dark text-decoration-none"
           to="/login" onClick={loginPageHandler} onSubmitHandler={props.onSubmitUser} >Log in</Link>
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
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/login' component={Login}></Route>
            <Route exact path='/logout' component={Logout}></Route>
            {/*<Route exact path='/login' component={Login}></Route>*/}
            {/*<Route exact path='/login' component={Login}></Route>*/}

        </Router>

    )
}

export default Header;
