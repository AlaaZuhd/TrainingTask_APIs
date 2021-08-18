const checkToken = async () => {
    try {
        const token = localStorage.getItem("token")
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }
        };
        const response = await fetch("http://localhost:8000/check-token", requestOptions)
        if(response.status === 200 && response.ok){
            return true
        }
        else if (response.status === 401) {
            return false
        }
        else {
            return false
            throw "Invalid request to get the comments"
        }
    } catch(error) {
        console.log(error)
    }
}

export default checkToken