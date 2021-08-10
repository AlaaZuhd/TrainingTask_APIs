import {useState} from "react";

function Header(props) {

    let loginPageHandler = (event) => {
        event.preventDefault()
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
        <a className="me-3 py-2 text-dark text-decoration-none" href="/logout" onClick={logoutPageHandler}>Log out</a> :
        <a className="me-3 py-2 text-dark text-decoration-none" href="/login" onClick={loginPageHandler}>Log in</a>
    )
    console.log(isLoggedIn.isLoggedIn)

    return (
        <header>
            <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                    <a className="me-3 py-2 text-dark text-decoration-none"
                       href="http://127.0.0.1:8000/ECW#products">Home</a>
                    <a className="me-3 py-2 text-dark text-decoration-none"
                       href="http://127.0.0.1:8000/ECW#products">Users</a>
                    <a className="me-3 py-2 text-dark text-decoration-none"
                       href="http://127.0.0.1:8000/ECW#category">Posts</a>
                    <a className="me-3 py-2 text-dark text-decoration-none" href="/my_cart">Commnets</a>
                    {loginOrLogout}
                    <a className="py-2 text-dark text-decoration-none" href="/register">Register</a>
                </nav>
            </div>
        </header>
    )
}

export default Header;
