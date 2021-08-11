import registerLogo from './images/register.png';
import { useState } from 'react';
// import { Form, Field } from 'react-advanced-form'


function Register({history}) {

    const [userInput, setUserInput] = useState({
        userEmail: "",
        userPassword: "",
        userUsername: "",
        userBirthdate: "",
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

    const usernameChangeHandler = (event) => {
        event.preventDefault()
        setUserInput((prevState) => {
            return {...prevState, userUsername: event.target.value}
        })
    }

    const birthdateChangeHandler = (event) => {
        event.preventDefault()
        setUserInput((prevState) => {
            return {...prevState, userBirthdate: event.target.value}
        })
    }

    const registerUser = async (setUserInput) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({user_name: userInput.userEmail,
                                            password: userInput.userPassword,
                                            email: userInput.userEmail,
                                            birth_date: userInput.userBirthdate})
            };
            const response = await fetch('http://127.0.0.1:8000/users/', requestOptions)
            if(response.status === 201 && response.ok){
                console.log(response)
                const data = await response.json()
                if (window.confirm('Click OK to activate your account')) {
                    window.open(data["activation link"], '_blank');
                };
                history.push("./login")
                // localStorage.setItem('token', data.token)
                // setState({loggedIn: true})
                // redirerction = (state.loggedIn === "true" ? <Redirect to="/" /> : <Login/>)
                // history.push("./")
            }
            else {
                throw "Entered data is invalid"
            }
        } catch(error) {
            // let user =  {isLoggedIn: false, username: userInput.userEmail, password: userInput.userPassword, token: ""}
            // form.setError(error)
            console.log(error.message)
        }
    }

    const submitHandler = (event) => {
        event.preventDefault()
        // detect if the user enter a valid data. (why to do validation in the backend and we will do it here too)
        registerUser(setUserInput) // create user
        // setUserInput({userEmail: "", userPassword: ""})
    }

    return (
        <div className="register-cbase-container">
            <img src={registerLogo} className="register-logo" alt="register logo" width="100px" height="100px"/>
            <form onSubmit={submitHandler}>

                <div className="field-container">
                    <label htmlFor="login_user_username">User Name</label>
                    <input type="text" id="login_user_username" value={userInput.userUsername} placeholder="Enter your username" required="True" onChange={usernameChangeHandler}/>
                </div>

                <div className="field-container">
                    <label htmlFor="login_user_email">Email</label>
                    <input type="email" id="login_user_email" value={userInput.userEmail} placeholder="Enter your email" required="True" onChange={emailChangeHandler}/>
                </div>

                <div className="field-container">
                    <label htmlFor="login_user_password">Password</label>
                    <input type="password" id="login_user_password" value={userInput.userPassword} placeholder="Enter your password" required="True" onChange={passwordChangeHandler}/>
                </div>

                <div className="field-container">
                    <label htmlFor="login_user_birthdate">Birth Date</label>
                    <input type="date" id="login_user_birthdate" value={userInput.userBirthdate} placeholder="Enter your birth date" required="True" onChange={birthdateChangeHandler}/>
                </div>

                <div className="field-container">
                    <input type="submit"value="Register" />
                </div>

            </form>

            <p>If you have an account then login <a href="/login">Log in</a></p>
        </div>
    )
}

export default Register;
