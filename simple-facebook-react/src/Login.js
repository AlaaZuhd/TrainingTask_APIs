import loginLogo from './images/login.png';
import { useState } from 'react';

function Login(props) {

    const [userInput, setUserInput] = useState({
        userEmail: "",
        userPassword: "",
    })
    const [pageState_, setPageState_] = useState({
        currentPage: props.currentPage
    })

    console.log(pageState_.currentPage)

    const emailChangeHandler = (event) => {
        event.preventDefault()
        setUserInput((prevState) => {
            return {...prevState, userEmail: event.target.value}
        })
    }

    const passwordChangeHandler = (event) => {
        event.preventDefault()
        setUserInput((prevState) => {
            return {...prevState, userPassword: event.target.value}
        })
    }

    const submitHandler = (event) => {
        event.preventDefault()
        // const user = {
        //     userEmail: userInput.userEmail,
        //     userPassword: userInput.userPassword,
        // };
        setUserInput({userEmail: "", userPassword: ""})
        // props.onSubmitUser(user);


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userInput.userEmail, password: userInput.userPassword })
        };
        fetch('http://127.0.0.1:8000/login', requestOptions)
            .then(response => {
                // console.log(response.status)
                if(response.status === 200){
                    console.log("hi")
                    return response.json()
                }
                else {
                    throw "Email or Password is invalid"
                }
            })
            .then(data => {
                // console.log(data)
                let user =  {isLoggedIn: true, userEmail: userInput.userEmail, userPassword: userInput.userPassword, token: data.token}
                console.log(user.userEmail)
                props.onSubmitUser(user);
            })
            .catch(error => { // i have to display something on the screen instead of the console
                console.log(error)
                let user =  {isLoggedIn: false, username: userInput.userEmail, password: userInput.userPassword, token: ""}
                props.onSubmitUser(user);
            })
        }

    let content = (pageState_.currentPage === "login") ?
        (<div className="login-cbase-container">
            <img src={loginLogo} className="Login-logo" alt="logo" width="100px" height="100px"/>
            <form onSubmit={submitHandler}>
                <div className="field-container">
                    <label htmlFor="login_user_email">Email</label>
                    <input type="text" id="login_user_email" value={userInput.userEmail} placeholder="Enter your email" required="True" onChange={emailChangeHandler}/>
                </div>
                <div>
                    <label htmlFor="login_user_password">Password</label>
                    <input type="password" id="login_user_password" value={userInput.userPassword} placeholder="Enter your password" required="True" onChange={passwordChangeHandler}/>
                </div>
                <div>
                    <input type="submit"value="Login" />
                </div>
            </form>
            <p>If you don't have an account Create one <a href="/logout">Create Account</a></p>
        </div>) :
        (<div></div>)

    return (
        <div>
            {content}
        </div>
    )
}

export default Login;
