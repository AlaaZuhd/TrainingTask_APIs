import loginLogo from '../../images/login.png';
import { useState } from 'react';
import "../../style.css"

function Login({history}) {

    const [state, setState]  =useState({loggedIn:true})
    const [errorState, setErrorState] = useState({"errorMessage": ""})

    const [userInput, setUserInput] = useState({
        userEmail: "",
        userPassword: "",
    })

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

    const loginUser = async (setUserInput) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userInput.userEmail, password: userInput.userPassword })
            };
            const response = await fetch('http://127.0.0.1:8000/login', requestOptions)
            console.log(response)
            if(response.status === 200 && response.ok){
                const data = await response.json()
                localStorage.setItem('token', data.token)
                setState({loggedIn: true})
                history.push("./home")
            }
            else {
                throw "Email or Password is invalid"
            }
        } catch(error) {
            console.log(error)
            setErrorState({"errorMessage": error})
        }
    }

    const submitHandler = (event) => {
        event.preventDefault()
        loginUser(setUserInput)
        setUserInput({userEmail: "", userPassword: ""})
    }

    return (
        <div className="login-cbase-container">
            <form onSubmit={submitHandler}>
                <fieldset>
                    <legend>Login Form</legend>
                    <legend><img src={loginLogo} className="Login-logo" alt="logo" width="100px" height="100px"/></legend>
                <div className="field-container">
                    <label htmlFor="login_user_email">Email</label>
                    <input type="email" id="login_user_email" value={userInput.userEmail} placeholder="Enter your email" required="True" onChange={emailChangeHandler}/>
                </div>
                <div className="field-container">
                    <label htmlFor="login_user_password">Password</label>
                    <input type="password" id="login_user_password" value={userInput.userPassword} placeholder="Enter your password" required="True" onChange={passwordChangeHandler}/>
                </div>
                <div className="field-container">
                    <input type="submit"value="Login" />
                </div>
                </fieldset>
            </form>
            <p>{errorState.errorMessage}</p>
            <p>If you don't have an account Create one <a href="/register">Create Account</a></p>
        </div>
    )
}

export default Login;
