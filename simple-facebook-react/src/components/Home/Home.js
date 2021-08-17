import { useState } from 'react';
import logo from '../../logo.svg';
import '../App.css';
import Login from "../Login/Login";
import Error from "../Error"

function Home(props) {

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

    let currentPageHandler = (value) => {
        setPageState((prevState) => {
            return {...prevState, currentPage: value}
        })
        console.log(pageState.currentPage)
    }
    console.log(props.authorization)

    let content = (props.authorization ?
        <div className="App">
            {props.authorization}
            <div>
                <img src={logo} className="App-logo" alt="logo" />
                <p>Edit <code>src/App.js</code> and save to reload.</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer">
                Learn React
                </a>
            </div>
        </div>:
        <Error type="Autorization" errorMessage="You are not allowed to be here, you need to login"/>
    )

    return (
        <div>
            {content}
        </div>
    );
}

export default Home;
