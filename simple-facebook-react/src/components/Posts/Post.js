import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import "../../style.css"
import "./posts.css"
import User from "../Users/User";
import Comment from "../Comments/Comment";
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Modal} from "react-bootstrap"
import checkToken from "../CheckToken";

function Post(props) {

    let date = new Date(props.post.create_date)
    let formatedDate = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
    const [postCreateDate, setPostCreateDate] = useState(formatedDate)
    date = new Date(props.post.updated_date)
    formatedDate = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
    const [postUpdatedDate, setPostUpdatedDate] = useState(formatedDate)
    const [postTitle, setPostTitle] = useState(props.post.title)
    const [postOwnerId, setPostOwnerId] = useState(props.post.owner)
    const [postDescription, setPostDescription] = useState(props.post.description)
    const [postNumberOfComments, setPostNumberOfComments] = useState(props.numberOfComments)
    const [showComments, setShowComments] = useState(true)
    const [postOwner, setPostOwner] = useState("")
    const [showPostOwnerState, setShowPostOwnerState] = useState(false)
    const [commentState, setCommentState] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorState, setErrorState] = useState({"errorMessage": ""})

    let comments = []

    const titleChangeHandler = (event) => {
        event.preventDefault()
        setPostTitle(event.target.value)
        if (event.target.value.length > 0)
            props.post.title = event.target.value
    }

    const descriptionChangeHandler = (event) => {
        event.preventDefault()
        setPostDescription(event.target.value)
        if (event.target.value.length > 0)
            props.post.description = event.target.value
    }

    const numberOfCommentsChangeHandler = (event) => {
        event.preventDefault()
        setPostNumberOfComments(event.target.value)
    }

    const displayPost = (event) => {
        event.preventDefault()
        alert("hi")
        props.showModal(props.post)
    }

    const getComment = async (url) => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }
            };
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                comments.push(data)
            }
            else {
                throw "Invalid request to get the comment"
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
    }

    const getPostComments = async (urlsList) => {
        try {
            comments = []
            setCommentState([])
            urlsList.map(url => {
                getComment(url)
            })
            setCommentState(comments)
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
    }

    const viewPostComments = async (value) => {
        setShowComments(false)
        let urlsList = []
        for(let i=0; i< props.post.comments.length; i++)
            urlsList.push(props.post.comments[i])
        if(localStorage.getItem("token") && checkToken() === true) {
            getPostComments(urlsList)
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }

    const hidePostComments = async (event) => {
        event.preventDefault()
        setShowComments(true)
        if(localStorage.getItem("token") && checkToken() === true) {
            setShowComments(true)
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }

    const getUser = async (url) => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: {'Content-Type': 'application/json', "Authorization": "token " + token}
            };
            setIsLoading(true)
            const response = await fetch(url, requestOptions)
            if (response.status === 200 && response.ok) {
                let data = await response.json()
                console.log("from get user")
                console.log(data)
                setPostOwner(data)
            } else {
                throw "Invalid request to get the user"
            }
        } catch (error) {
            setErrorState({"errorMessage": error})
        }
    }

    const showPostOwner = async (event) => {
        event.preventDefault()
        alert("here")
        if(localStorage.getItem("token") && await checkToken() === true) {
            setShowPostOwnerState(true)
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }

    const hidePostOwner = async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            setShowPostOwnerState(false)
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }

    const deletePost = async (event) => {
        event.preventDefault()
        const post = props.post
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token },
                // body: JSON.stringify({ title: post.title, description: post.description })
            };
            const url = "http://localhost:8000/posts/" + post.id + "/"
            const response = await fetch(url, requestOptions)
            if(response.status == 204 && response.ok){
                // let data = await response.json()
                props.hideModal(props.post)
            }
            else {
                throw new Error("Invalid request to delete the post")
            }
        } catch(error) {
            alert(error.message)
            setErrorState({"errorMessage": error.message})
        }
    }

    const updatePost = async (event) => {
        event.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token },
                body: JSON.stringify({ title: postTitle, description: postDescription })
            };
            const url = "http://localhost:8000/posts/" + props.post.id + "/"
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                props.post = data
            }
            else {
                throw new Error("Invalid request to update the post")
            }
        } catch(error) {
            setErrorState({"errorMessage": error.message})
        }
    }

    useEffect(async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            getUser('http://localhost:8000/users/' + postOwnerId + '/')
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [commentState])

    let postCard = (
        <Card className="text-center">
            <Card.Header><h3>Post NO.{props.post.id}</h3></Card.Header>
            <Card.Body>
            <Card.Title className="d-flex justify-content-center">
                <div className="field-container">
                    <label htmlFor="post_title">Title</label>
                    <input type="text" id="post_title" value={postTitle} placeholder="Enter the title"
                           required="True" onChange={titleChangeHandler} disabled={props.disabled}/>
                </div>
                Written By: <a href="" onClick={showPostOwner}>{postOwner.user_name}</a>,
            </Card.Title>
            <div className="cardText">
                <div className="field-container">
                    <label htmlFor="post_description"  >Description</label>
                    <input type="text" id="post_description" value={postDescription}
                           placeholder="Enter the description" required="True" onChange={descriptionChangeHandler}
                           disabled={props.disabled}/>
                </div>
            </div>
            {
                props.disabled && <Button className="open-post-btn" onClick={displayPost}>Open Post</Button>
            }
            {
                !props.disabled && <Button className="update-post-btn" onClick={updatePost}>Update Post</Button>
            }
            {
                !props.disabled && showComments &&
                <Button className="view-post-comments-btn" onClick={viewPostComments}>View Post Comments</Button>
            }
            {
                !props.disabled && !showComments &&
                <Button className="hide-post-comments-btn" onClick={hidePostComments}>Hide Post Comments</Button>
            }
            {
                !props.disabled && <Button className="delete-post-btn" onClick={deletePost}>Delete Post</Button>
            }
            </Card.Body>
            <Card.Footer className="text-muted">Created at: {postCreateDate}, Updated at: {postUpdatedDate}</Card.Footer>
        </Card>
    )

    let content =
            <div className="Post">

                {
                    showPostOwnerState &&
                    <div>
                        <Modal show={showPostOwnerState} centered>
                            <Modal.Body>
                            <User key={postOwnerId} user={postOwner}/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={hidePostOwner}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                }

            </div>
    let error =
            <div>
                You need to login to view this page
            </div>

    return (
        <div className="post-page-container">
            {isLoading && content}
            {!isLoading && error}
            {<div className="post-comments">
                {!showComments
                    && commentState.map( (comment) =>
                    <Comment key={comment.id}
                          comment={comment}
                          disabled={true}
                          authorization={props.authorization}
                    />)
                }
            </div>}
        </div>
    );
}

export default Post;
