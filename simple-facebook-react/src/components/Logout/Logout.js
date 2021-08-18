import { useState } from 'react';
import React, { useEffect } from 'react';
import { Redirect } from "react-router-dom";

function Logout({history}) {

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
                alert("Logging out done successfully")
            }
            else {
                if(response.status === 401){
                    alert("You already not logged in ")
                }
            }
        } catch(error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        loggingOutUser()
    }, [])

    return (
        <div className="login-cbase-container">
            <Redirect to="./login" />

        </div>
    )
}

export default Logout;
