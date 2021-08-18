import { useState } from 'react';
import './App.css';
import Header from './Header.js';
import AuthContextProvider from "../../Context/AuthContext"

function App() {

    const [state, setState] = useState(false)
    const [pageState, setPageState] = useState({isLoggedIn: false, currentPage: "home"})
    const [userState, setUserState] = useState({email: "", password: "", token: ""})

    let currentPageHandler = (value) => {
        setPageState((prevState) => {
            return {...prevState, currentPage: value}
        })
    }

    const LoginRequest = (loggedInData) => {
        setPageState( {isLoggedIn: true, currentPage: "home"})
        if(loggedInData.isLoggedIn){
            console.log(loggedInData.isLoggedIn)
            setUserState({...userState, email: loggedInData.userEmail, password: loggedInData.userPassword, token: loggedInData.token})
        }
        console.log(userState.email)
    }

    return (
        <div className="App">
            <AuthContextProvider>
                <Header className="App-header"
                        loggedIn={pageState.isLoggedIn}
                        onRefClick={currentPageHandler}
                        onSubmitUser={LoginRequest}>
                </Header>
            </AuthContextProvider>
        </div>
    );
}

export default App;
