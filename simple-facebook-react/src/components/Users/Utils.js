// get user function

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