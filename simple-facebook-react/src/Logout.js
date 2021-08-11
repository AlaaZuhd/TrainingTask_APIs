import { useState } from 'react';
import React, { useEffect } from 'react';
import { Redirect } from "react-router-dom";

function Logout(props) {

    let isLoggedOut = false
    const loggingOutUser = async () => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }, //  add the token to the header
            };
            const response = await fetch('http://127.0.0.1:8000/logout', requestOptions)
            if(response.status === 200 || response.ok){
                localStorage.removeItem("token")
                isLoggedOut = true
            }
            else {
                throw "Error in logging out"
            }
        } catch(error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if(!isLoggedOut)
            loggingOutUser ()
    });

    useEffect(() => {
        return () => {
            alert("Logging out done successfully")
        }
    })

    return (
        <div className="login-cbase-container">
            <Redirect to="./login" />
        </div>
    )
}

export default Logout;
