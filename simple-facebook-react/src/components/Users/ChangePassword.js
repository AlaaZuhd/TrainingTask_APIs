import loginLogo from '../../images/login.png';
import { useState } from 'react';
// import { Form, Field } from 'react-advanced-form'
import { Redirect } from "react-router-dom";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import Home from "../Home/Home";
import { useHistory } from "react-router-dom";

import "../../style.css"

function ChangePassword() {

    const [state, setState]  =useState({loggedIn:true})
    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [userPassword, setUserPassword] = useState("")
    const [userConfirmedPassword, setUserConfirmedPassword] = useState("")

    const passwordChangeHandler = (event) => {
        event.preventDefault()
        setUserPassword(event.target.value)
    }

    const confirmedPasswordChangeHandler = (event) => {
        event.preventDefault()
        setUserConfirmedPassword(event.target.value)
    }

    const changePassword = async (url) => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token},
                body: JSON.stringify({ 'password': userPassword, 'confirm_password': userConfirmedPassword })
            };
            const response = await fetch('http://127.0.0.1:8000/users/change-password/', requestOptions)
            console.log(response)
            if(response.status === 200 && response.ok){
                // const data = await response.json()
                // console.log(data)
                // history.push("./login") // momken login again
            }
            else {
                throw "Error in changing the password"
            }
        } catch(error) {
            console.log(error)
            setErrorState({"errorMessage": error.message})
        }
    }

    const confirmPassword = () => {
        if(userConfirmedPassword === userPassword)
            return true
        else
            return false
    }

    const submitHandler = (event) => {
        event.preventDefault()
        const flag = confirmPassword()
        if(flag) // make a request to change password
            changePassword('http://localhost:8000/users/change-password/') // give the url
        else
            setErrorState("Passwords are not the same")
    }

    return (
        <div className="login-cbase-container">
            <form onSubmit={submitHandler}>
                <fieldset>
                    <legend>Reset Password</legend>
                <div className="field-container">
                    <label htmlFor="user_password1">New Password</label>
                    <input type="password" id="user_password1" value={userPassword} placeholder="Enter a new password" required="True" onChange={passwordChangeHandler}/>
                </div>
                <div className="field-container">
                    <label htmlFor="user_password2">Confirmed Password</label>
                    <input type="password" id="user_password12" value={userConfirmedPassword} placeholder="Enter the new password again" required="True" onChange={confirmedPasswordChangeHandler}/>
                </div>
                <div className="field-container">
                    <input type="submit"value="Reset Password" />
                </div>
                </fieldset>
            </form>
            <p>{errorState.errorMessage}</p>
        </div>
    )
}

export default ChangePassword;
