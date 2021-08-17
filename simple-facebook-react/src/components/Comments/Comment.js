import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import "../../style.css"
import {Redirect} from "react-router-dom";
import Modal_ from "../Modal_";
import User from "../Users/User";
import Post from "../Posts/Post";

import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col} from "react-bootstrap"

import axios from "axios"

function Comment(props) {

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
        alert(event.target.value)
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
        // try {
        //     const token = localStorage.getItem("token")
        //     const requestOptions = {
        //         method: 'PATCH',
        //         headers: { 'Content-Type': "multipart/form-data", "Authorization" : "token " + token },
        //         body: fd
        //     };
        //     console.log(fd.get("image"))
        //     const url = "http://localhost:8000/comments/" + props.comment.id + "/"
        //     const response = await fetch(url, requestOptions)
        //     alert("after fetch")
        //     if(response.status === 200 && response.ok){
        //         let data = await response.json()
        //         date = new Date(data.updated_date)
        //         dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
        //         setCommentUpdatedDate(dd)
        //     }
        //     else {
        //         throw new Error("Invalid request to update the comment")
        //     }
        // } catch(error) {
        //     console.log(error.message)
        //     setErrorState({"errorMessage": error})
        // }

    const displayComment = (event) => {
        event.preventDefault()
        setEditState(true)
    }

    const cancelUpdating = (event) => {
        event.preventDefault()
        setEditState(false)
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

    const showCommentOwner = (event) => {
        event.preventDefault()
        setShowCommentOwnerState(true)
    }

    const hideCommentOwner = () => {
        setShowCommentOwnerState(false)
    }

    const showCommentPost = (event) => {
        event.preventDefault()
        setShowCommentPostState(true)
    }

    const hideCommentPost = () => {
        setShowCommentPostState(false)
    }


    useEffect(() => {
        if(localStorage.getItem("token"))
            setIsLoggedin(true)
        else
            setIsLoggedin(false)
        setCommentOwnerId(props.comment.owner)
        setCommentPostId(props.comment.post)
        if(props.comment.owner)
            getUser('http://localhost:8000/users/' + props.comment.owner + '/')
        if(props.comment.post)
        getPost('http://localhost:8000/posts/' + props.comment.post + '/')
    }, [])

    let commentCard = (
        <Card className="text-center">
            <Card.Img className="cardImage" variant="top" src={props.comment.image} width="100px" />
            <Card.Header>Comment NO.{props.comment.id}</Card.Header>
            <Card.Body>
            <Card.Title className="cardTitle">Written By: <a href="" onClick={showCommentOwner}>{commentOwner.user_name}</a>,
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
            {!editState && <Button className="edit-comment-btn" onClick={displayComment}>Edit</Button>}
            {!editState && <Button className="delete-comment-btn" onClick={deleteComment}>Delete Comment</Button>}
            {editState && <Button className="update-comment-btn" onClick={updateComment}>Update Comment</Button>}
            {editState && <Button className="cancel-updating-comment-btn" onClick={cancelUpdating}>Cancel</Button>}
            </Card.Body>
            <Card.Footer className="text-muted">Created at: {commentCreateDate}, Updated at: {commentUpdatedDate}</Card.Footer>
        </Card>
    )

    let content = (isLoggedin ?
        <div className="Comment">
            {commentCard}
            {/*<h3>Comment NO.{props.comment.id}</h3>*/}
            {/*<hr/>*/}
            {/*<form>*/}
            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="comment_content">Content</label>*/}
            {/*        <input type="text" id="comment_content" value={commentContent} placeholder="Enter the content" required="True" onChange={contentChangeHandler} disabled={!editState}/>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="comment_owner">Owner</label>*/}
            {/*        <p> <a href="" onClick={showCommentOwner}>{commentOwner.user_name}</a> </p>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="comment_post">Post</label>*/}
            {/*        <p> <a href="" onClick={showCommentPost}>{commentPost.title}</a> </p>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="comment_image">Image</label>*/}
            {/*        <img src={commentImage} />*/}
            {/*        <input type="file" id="comment_image" placeholder="Choose an image" required="True" onChange={imageChangeHandler} disabled={!editState}/>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="comment_create_date">Created Date</label>*/}
            {/*        <input type="date" id="comment_create_date" value={commentCreateDate} required="True" disabled="true"/>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="comment_updated_date">Updated Date</label>*/}
            {/*        <input type="date" id="comment_updated_date" value={commentUpdatedDate} required="True" onChange={updatedDateChangeHandler} disabled="true"/>*/}
            {/*    </div>*/}
            {/*</form>*/}
            {/*<div>*/}
            {/*    {!editState && <button className="edit-comment-btn" onClick={displayComment}>Edit</button>}*/}
            {/*    {!editState && <button className="delete-comment-btn" onClick={deleteComment}>Delete Comment</button>}*/}
            {/*    {editState && <button className="update-comment-btn" onClick={updateComment}>Update Comment</button>}*/}
            {/*    {editState && <button className="cancel-updating-comment-btn" onClick={cancelUpdating}>Cancel</button>}*/}
            {/*</div>*/}



            {
                showCommentOwnerState &&
                    alert("hi again") &&
                <Modal_ show={showCommentOwnerState} handleCloseModal={hideCommentOwner}>
                    <User key={commentOwnerId+commentContent} user={commentOwner}/>
                </Modal_>
            }

            {
                showCommentPostState &&
                <Modal_ show={showCommentPostState} handleCloseModal={hideCommentPost}>
                    <Post key={commentPost.updated_date}
                      post={commentPost}
                      authorization={props.authorization}
                      numberOfComments={commentPost.comments.length}
                      disabled={false}
                      showModal={showCommentPost}
                      hideModal={hideCommentPost}
                />
                </Modal_>
            }
        </div>
        :
        <div>
            You don't have the permissions to view the comment
        </div>
    )


    return (
        <div className="comment-page-container">
            {!deleteState && content}
            {/*{deleteState && <Redirect to="./my-comments" />}*/}
        </div>
    );
}

export default Comment;
