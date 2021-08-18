import React, {createContext, useState} from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [loggedInState, setLoggedInState]= useState(true)
    return (
        <AuthContext.Provider value={loggedInState}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider