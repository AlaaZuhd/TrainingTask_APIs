import {useEffect, useState, useContext} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import "../../style.css"
import User from "../Users/User";
import Post from "../Posts/Post";
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Modal} from "react-bootstrap"
import AuthContext from "../../Context/AuthContext";
import "./stylee.css"

import axios from "axios"
import checkToken from "../CheckToken";

function Comment(props) {

    const authContext = useContext(AuthContext)

    let date = new Date(props.comment.create_date)
    let dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
    const [commentCreateDate, setCommentCreateDate] = useState(dd)
    date = new Date(props.comment.updated_date)
    dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
    const [commentUpdatedDate, setCommentUpdatedDate] = useState(dd)

    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [commentContent, setCommentContent] = useState(props.comment.content)
    const [commentOwnerId, setCommentOwnerId] = useState(props.comment.owner)
    const [commentImage, setCommentImage] = useState(props.comment.image)
    const [commentPostId, setCommentPostId] = useState(props.comment.post)
    const [editState, setEditState] = useState(false)
    const [deleteState, setDeleteState] = useState(false)
    const [commentOwner, setCommentOwner] = useState("")
    const [commentPost, setCommentPost] = useState("")
    const [showCommentOwnerState, setShowCommentOwnerState] = useState(false)
    const [showCommentPostState, setShowCommentPostState] = useState(false)
    const [isLoggedin, setIsLoggedin] = useState(props.authorization)
    const [isLoading, setIsLoading] = useState(false)

    const contentChangeHandler = (event) => {
        event.preventDefault()
        setCommentContent(event.target.value)
        if(event.target.value.length > 0)
            props.comment.content = event.target.value
    }

    const imageChangeHandler = (event) => {
        event.preventDefault()
        setCommentImage(event.target.files[0])
        props.comment.image = event.target.files[0]
    }

    const updatedDateChangeHandler = (event) => {
        event.preventDefault()
        setCommentUpdatedDate(event.target.value)
    }


    const updateComment = async (event) => {
        event.preventDefault()
        setEditState(false)
        let form_data = new FormData();
        // form_data.append('image', props.comment.image, props.comment.image.name);
        form_data.append('content', props.comment.content);
        const url = "http://localhost:8000/comments/" + props.comment.id + "/"
        const token = localStorage.getItem("token")
        axios.patch(url, form_data, {
                    headers: {
                        'content-type': 'multipart/form-data', "Authorization" : "token " + token
                    }
        }).then(response => {
              console.log(response.data);
              if(response.status === 200 && response.ok){
                let data = response.json()
                date = new Date(data.updated_date)
                dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
                setCommentUpdatedDate(dd)
            }
            else {
                throw new Error("Invalid request to update the comment")
            }
            }).catch(error => {
                setErrorState({"errorMessage": error})
            });
    }

    const displayComment = async (event) => {
        event.preventDefault()
        if(localStorage.getItem("token") && await checkToken() === true) {
            setEditState(true)
            setIsLoggedin(true)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const cancelUpdating = async (event) => {
        event.preventDefault()
        if(localStorage.getItem("token") && await checkToken() === true) {
            setEditState(false)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const deleteComment = async (event) => {
        event.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token },
                // body: JSON.stringify({ title: post.title, description: post.description })
            };
            const url = "http://localhost:8000/comments/" + props.comment.id + "/"
            const response = await fetch(url, requestOptions)
            if(response.status == 204 && response.ok){

            }
            else {
                throw "Invalid request to delete the post"
            }
        } catch(error) {
            alert(error)
            setErrorState({"errorMessage": error})
        }
        setDeleteState(true)
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
                setCommentOwner(data)
            } else {
                throw "Invalid request to get the user"
            }
        } catch (error) {
            setErrorState({"errorMessage": error})
        }
    }

    const getPost = async (url) => {
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
                setCommentPost(data)
                setIsLoading(false)
            } else {
                throw new Error("Invalid request to get the user")
            }
        } catch (error) {
            alert(error.message)
            setErrorState({"errorMessage": error.message})
        }
    }

    const showCommentOwner = async (event) => {
        event.preventDefault()
        if(localStorage.getItem("token") && await checkToken() === true) {
            setShowCommentOwnerState(true)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const hideCommentOwner = async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            setShowCommentOwnerState(false)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const showCommentPost = async (event) => {
        event.preventDefault()
        if(localStorage.getItem("token") && await checkToken() === true) {
            setShowCommentPostState(true)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const hideCommentPost = async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            setShowCommentPostState(false)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    useEffect(async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            setIsLoggedin(true)
            authContext.setLoggedInState(true)
            setCommentOwnerId(props.comment.owner)
            setCommentPostId(props.comment.post)
            if(props.comment.owner)
                getUser('http://localhost:8000/users/' + props.comment.owner + '/')
            if(props.comment.post)
            getPost('http://localhost:8000/posts/' + props.comment.post + '/')
        }
        else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }, [])

    let commentCard = (
        <Card className="text-center">
            <Card.Img className="cardImage" variant="top" src={props.comment.image} width="100px" />
            <Card.Header>Comment NO.{props.comment.id}</Card.Header>
            <Card.Body>
            <Card.Title className="cardTitle">Written By: <a href="" onClick={showCommentOwner}>{commentOwner.user_name}</a>,
                        <br />
                        On Post: <a href="" onClick={showCommentPost}>{commentPost.title}</a>
            </Card.Title>
            <div className="cardText">
                <div className="field-container">
                    <label htmlFor="">Content</label>
                    <input type="text" id="comment_content" value={commentContent} placeholder="Enter the content" required="True" onChange={contentChangeHandler} disabled={!editState}/>
                </div>
                <div className="field-container">
                    <label htmlFor="comment_image" className={editState? "showElement": "hideElement"}>Change Image</label>
                    <input type={editState? "file": "hidden"} id="comment_image" placeholder="Choose an image" required="True" onChange={imageChangeHandler} disabled={!editState} />
                </div>
            </div>
            <div className="buttons commentCardButtons">
            {!editState && <Button className="edit-comment-btn b" onClick={displayComment}>Edit</Button>}
            {!editState && <Button className="delete-comment-btn" onClick={deleteComment}>Delete Comment</Button>}
            {editState && <Button className="update-comment-btn" onClick={updateComment}>Update Comment</Button>}
            {editState && <Button className="cancel-updating-comment-btn" onClick={cancelUpdating}>Cancel</Button>}
            </div>
            </Card.Body>
            <Card.Footer className="text-muted">Created at: {commentCreateDate}, Updated at: {commentUpdatedDate}</Card.Footer>
        </Card>
    )

    let content =
        <div className="Comment">
            {commentCard}

            {
                showCommentOwnerState &&

                <Modal show={showCommentOwnerState} centered>
                    <Modal.Body>
                        <User key={commentOwnerId+commentContent} user={commentOwner}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={hideCommentOwner}>Close</Button>
                    </Modal.Footer>
                </Modal>
            }

            {
                showCommentPostState &&
                <Modal show={showCommentPostState} centered>
                    <Modal.Body>
                        <Post key={commentPost.updated_date}
                              post={commentPost}
                              authorization={props.authorization}
                              numberOfComments={commentPost.comments.length}
                              disabled={false}
                              showModal={showCommentPost}
                              hideModal={hideCommentPost}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={hideCommentPost}>Close</Button>
                    </Modal.Footer>
                </Modal>
            }
        </div>
    let error =
        <div>
            You don't have the permissions to view the comment
        </div>


    return (
        <div className="comment-page-container">
            {!deleteState && isLoggedin && content}
            {!isLoggedin && error}
        </div>
    );
}

export default Comment;
