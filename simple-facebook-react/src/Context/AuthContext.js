// import React, {createContext, useState} from "react";
//
// export const AuthContext = createContext();
//
// const AuthContextProvider = (props) => {
//     const [loggedInState, setLoggedInState]= useState(true)
//     const setLoggingState = (value) => {
//         setLoggingState(value)
//     }
//     return (
//         <AuthContext.Provider value={{loggedInState, setLoggingState}}>
//             {props.children}
//         </AuthContext.Provider>
//     );
// }
//
// export default AuthContextProvider

import React, {createContext, useState} from "react"

const AuthContext = createContext({
    loggedInState: true
})

export const AuthContextProvider = (props) => {
    const [loggedInState, setLoggedInState] = useState(false)

    const loggInStateHandler = (value) => {
        setLoggedInState(value)
    }
    const contextValue = {
        loggedInState: loggedInState,
        setLoggedInState: loggInStateHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext
