import { useState, useContext } from 'react';
import logo from '../../logo.svg';
import '../App.css';
import Login from "../Login/Login";
import Error from "../Error"
import {Button, Modal} from "react-bootstrap";
import AuthContext from "../../Context/AuthContext";

function Home(props) {

    const authContext = useContext(AuthContext)
    let content =
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
        </div>

    return (
        <div>
            {authContext.loggedInState && content}
            {
                !authContext.loggedInState
                &&
                <div>
                    <Error type="Autorization" errorMessage="You are not allowed to be here, you need to login"/>
                </div>

            }
        </div>
    );
}

export default Home;
