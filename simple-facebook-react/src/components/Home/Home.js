import { useState } from 'react';
import logo from '../../logo.svg';
import '../App.css';
import Login from "../Login/Login";
import Error from "../Error"
import {Button, Modal} from "react-bootstrap";

function Home(props) {

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
            <div>
                <Error type="Autorization" errorMessage="You are not allowed to be here, you need to login"/>
            </div>
    )

    return (
        <div>
            {content}
        </div>
    );
}

export default Home;
