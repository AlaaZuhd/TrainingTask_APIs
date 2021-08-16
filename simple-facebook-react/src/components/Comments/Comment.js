import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import "../../style.css"
import {Redirect} from "react-router-dom";
import Modal from "../Modal";
import User from "../Users/User";

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
    const [commentPost, setCommentPost] = useState(props.comment.post)
    const [editState, setEditState] = useState(false)
    const [deleteState, setDeleteState] = useState(false)
    const [commentOwner, setCommentOwner] = useState("")
    const [showCommentOwnerState, setShowCommentOwnerState] = useState(false)
    const [isLoggedin, setIsLoggedin] = useState(props.authorization)
    const [isLoading, setIsLoading] = useState(false)

    const contentChangeHandler = (event) => {
        event.preventDefault()
        setCommentContent(event.target.value)
        if(event.target.value.length > 0)
            props.comment.content = event.target.value
    }

    // const ownerChangeHandler = (event) => {
    //     event.preventDefault()
    //     setCommentOwnerId(event.target.value)
    // }

    const imageChangeHandler = (event) => {
        event.preventDefault()
        setCommentImage(event.target.files[0])
        props.comment.image = event.target.files[0]
    }

    const createDateChangeHandler = (event) => {
        event.preventDefault()
        setCommentCreateDate(event.target.value)
    }

    const updatedDateChangeHandler = (event) => {
        event.preventDefault()
        setCommentUpdatedDate(event.target.value)
    }

    const postChangeHandler = (event) => {
        event.preventDefault()
        setCommentUpdatedDate(event.target.value)
    }


    const updateComment = async (event) => {
        event.preventDefault()
        setEditState(false)
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token },
                body: JSON.stringify({'content': props.comment.content})
            };
            const url = "http://localhost:8000/comments/" + props.comment.id + "/"
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                date = new Date(data.updated_date)
                dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
                setCommentUpdatedDate(dd)
            }
            else {
                throw "Invalid request to update the comment"
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
        }

    }

    const displayComment = (event) => {
        event.preventDefault()
        setEditState(true)

        // props.displayComment(props.post)
    }

    const cancelUpdating = (event) => {
        event.preventDefault()
        setEditState(false)
        // props.cancelUpdatingComment(props.post)
    }

    const delComment = async () => {
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
                // let data = await response.json()
                // getPosts("http://localhost:8000/posts/")
            }
            else {
                throw "Invalid request to delete the post"
            }
        } catch(error) {
            alert(error)
            // setErrorState({"errorMessage": error})
        }
    }

    const deleteComment = (event) => {
        event.preventDefault()
        delComment()
        // props.deleteComment(props.post)
        setDeleteState(true)
        // window.location.reload(false);

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

    const showCommentOwner = (event) => {
        event.preventDefault()
        setShowCommentOwnerState(true)
    }

    const hideCommentOwner = () => {
        setShowCommentOwnerState(false)
    }

    useEffect(() => {
        if(localStorage.getItem("token"))
            setIsLoggedin(true)
        else
            setIsLoggedin(false)
        getUser('http://localhost:8000/users/' + commentOwnerId + '/')
    }, [])

    let content = (isLoggedin ?
        <div className="Comment">
            <h3>Comment NO.{props.comment.id}</h3>
            <hr/>
            <form>
                <div className="field-container">
                    <label htmlFor="comment_content">Content</label>
                    <input type="text" id="comment_content" value={commentContent} placeholder="Enter the content" required="True" onChange={contentChangeHandler} disabled={!editState}/>
                </div>

                <div className="field-container">
                    <label htmlFor="comment_owner">Owner</label>
                    <p> <a href="" onClick={showCommentOwner}>{commentOwner.user_name}</a> </p>
                    {/*<input type="text" id="comment_owner" value={commentOwnerId} placeholder="Enter the Owner name" required="True" onChange={ownerChangeHandler} disabled="true"/>*/}
                </div>

                <div className="field-container">
                    <label htmlFor="comment_post">Post</label>
                    <input type="number" id="comment_post" value={commentPost} placeholder="Enter the related post" required="True" onChange={postChangeHandler} disabled="true"/>
                </div>

                <div className="field-container">
                    <label htmlFor="comment_image">Image</label>
                    {/*<img src={commentImage} />*/}
                    <input type="file" id="comment_image" src={commentImage} placeholder="Choose an image" required="True" onChange={imageChangeHandler} disabled={!editState}/>
                </div>

                <div className="field-container">
                    <label htmlFor="comment_create_date">Created Date</label>
                    <input type="date" id="comment_create_date" value={commentCreateDate} placeholder="Enter the created date" required="True" onChange={createDateChangeHandler} disabled="true"/>
                </div>

                <div className="field-container">
                    <label htmlFor="comment_updated_date">Updated Date</label>
                    <input type="date" id="comment_updated_date" value={commentUpdatedDate} required="True" onChange={updatedDateChangeHandler} disabled="true"/>
                </div>
            </form>
            <div>
                {!editState && <button className="edit-comment-btn" onClick={displayComment}>Edit</button>}
                {!editState && <button className="delete-comment-btn" onClick={deleteComment}>Delete Comment</button>}
                {editState && <button className="update-comment-btn" onClick={updateComment}>Update Comment</button>}
                {editState && <button className="cancel-updating-comment-btn" onClick={cancelUpdating}>Cancel</button>}
            </div>
            {
                showCommentOwnerState &&
                <Modal show={showCommentOwnerState} handleCloseModal={hideCommentOwner}>
                    <User key={commentOwnerId} user={commentOwner}/>
                </Modal>
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
