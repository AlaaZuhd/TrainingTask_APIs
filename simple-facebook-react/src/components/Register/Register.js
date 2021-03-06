import registerLogo from '../../images/register.png';
import { useState } from 'react';


function Register({history}) {

    const [errorState, setErrorState] = useState({"errorMessage": ""})
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
            setErrorState({"errorMessage": ""})
            const response = await fetch('http://127.0.0.1:8000/users/', requestOptions)
            if(response.status === 201 && response.ok){
                console.log(response)
                const data = await response.json()
                if (window.confirm('Click OK to activate your account')) {
                    window.open(data["activation link"], '_blank');
                };
                history.push("./login")
            }
            else if (response.status === 500){
                const data = await response.json()
                throw new Error(data["errorMessage"])
            }
            else {
                throw new Error("Entered data is invalid")
            }
        } catch(error) {
            setErrorState({"errorMessage": error.message})
        }
    }

    const submitHandler = (event) => {
        event.preventDefault()
        registerUser(setUserInput) // create user
    }

    return (
        <div className="register-cbase-container">
            <form onSubmit={submitHandler}>
                <fieldset>
                    <legend>Register Form</legend>
                    <legend><img src={registerLogo} className="register-logo" alt="register logo" width="100px" height="100px"/></legend>
                <div className="field-container register-form">
                    <label htmlFor="login_user_username">User Name</label>
                    <input type="text" id="login_user_username" value={userInput.userUsername} placeholder="Enter your username" required="True" onChange={usernameChangeHandler}/>
                </div>

                <div className="field-container register-form">
                    <label htmlFor="login_user_email">Email</label>
                    <input type="email" id="login_user_email" value={userInput.userEmail} placeholder="Enter your email" required="True" onChange={emailChangeHandler}/>
                </div>

                <div className="field-container register-form">
                    <label htmlFor="login_user_password">Password</label>
                    <input type="password" id="login_user_password" value={userInput.userPassword} placeholder="Enter your password" required="True" onChange={passwordChangeHandler}/>
                </div>

                <div className="field-container register-form">
                    <label htmlFor="login_user_birthdate">Birth Date</label>
                    <input type="date" id="login_user_birthdate" value={userInput.userBirthdate} placeholder="Enter your birth date" required="True" onChange={birthdateChangeHandler}/>
                </div>

                <div className="field-container register-form">
                    <input type="submit"value="Register" />
                </div>
            </fieldset>
            </form>
            <p>{errorState.errorMessage}</p>
            <p>If you have an account then login <a href="/login">Log in</a></p>
        </div>
    )
}

export default Register;
