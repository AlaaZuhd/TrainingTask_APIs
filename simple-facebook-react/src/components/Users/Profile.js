import {useEffect, useState, useContext} from 'react';
import '../App.css';
import "../../style.css"
import User from './User'
import checkToken from "../CheckToken";
import AuthContext from "../../Context/AuthContext";

function Profile(props) {

    const authContext = useContext(AuthContext)

    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [isLoggedin, setIsLoggedin] = useState(true)
    const [user, setUser] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const getUser = async (url) => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }
            };
            setIsLoading(true)
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                setIsLoading(false)
                setUser(data)
            }
            else {
                throw "Invalid request to get the user"
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
    }

    useEffect(async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            setIsLoggedin(true)
            getUser('http://localhost:8000/users/me/' )
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }, [])


    let content =
        <div>
            {!isLoading && <User key={user.id} user={user} authorization={isLoggedin}/>}
            {isLoading && <p>Loading Profile ...</p>}
        </div>
    let error =
        <div>
            You don't have the permissions to view the user.
        </div>

    return (
        <div className="user-page-container">
            {isLoggedin && content}
        </div>
    );
}

export default Profile;
