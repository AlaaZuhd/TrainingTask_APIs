import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import Post from "./Post.js"


function Posts(props) {

    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [postState, setPostState] = useState([])
    let numberOfPosts = 0
    let posts = []
    let postsList = ""
    let pos = ""

    const getPosts = async () => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }
            };
            const response = await fetch('http://127.0.0.1:8000/posts/', requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                numberOfPosts = data["count"]
                let post = {}
                for (let i=0; i<numberOfPosts; i++) {
                    let numberOfPostInCurrentPage = data.results.length
                    for(let j=0; j<numberOfPostInCurrentPage; j++){
                        post = data.results[j]
                        posts.push(post)
                        if(post.comments.length > 0)
                        console.log(post.comments[0])
                    }
                    i += numberOfPostInCurrentPage -1
                    // make a request for the next page and save the data.
                    // i may later save the links of the different pages.
                    if(data.next) {
                        let innerResponse = await await fetch(data.next, requestOptions)
                        if(innerResponse.status === 200 && innerResponse.ok){
                           data = await innerResponse.json()
                        }
                    }
                }
                setPostState(posts)
            }
            else {
                throw "Invalid request to get the posts"
            }
        } catch(error) {
            console.log(error)
            console.log("i'm in catch help me")
            setErrorState({"errorMessage": error})
        }
    }


    useEffect(() => {
        if(props.authorization)
            getPosts()
    }, []);



    let content = (props.authorization ?
        <div className="Posts">
            <ul>
                {postState.map((post) =>
                    <Post key={post.id} post={post} authorization={props.authorization}/>
                )}
                {postsList}
            </ul>
        </div>:
        <div>
            You need to login to view this page
        </div>
    )

    return (
        <div>
            {content}
        </div>
    );
}

export default Posts;
