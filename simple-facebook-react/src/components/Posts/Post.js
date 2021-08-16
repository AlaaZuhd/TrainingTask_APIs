import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import "../../style.css"
import "./posts.css"
import Modal from "../Modal";
import ChangePassword from "../Users/ChangePassword";
import User from "../Users/User";

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
    const [isLoading, setIsLoading] = useState(false)
    const [serrorState, setErrorState] = useState({"errorMessage": ""})

    const titleChangeHandler = (event) => {
        event.preventDefault()
        setPostTitle(event.target.value)
        if (event.target.value.length > 0)
            props.post.title = event.target.value
    }

    const ownerChangeHandler = (event) => {
        event.preventDefault()
        setPostOwnerId(event.target.value)
    }

    const descriptionChangeHandler = (event) => {
        event.preventDefault()
        setPostDescription(event.target.value)
        if (event.target.value.length > 0)
            props.post.description = event.target.value
    }

    const createDateChangeHandler = (event) => {
        event.preventDefault()
        setPostCreateDate(event.target.value)
    }

    const updatedDateChangeHandler = (event) => {
        event.preventDefault()
        setPostUpdatedDate(event.target.value)
    }

    const numberOfCommentsChangeHandler = (event) => {
        event.preventDefault()
        setPostNumberOfComments(event.target.value)
    }

    const displayPost = (event) => {
        event.preventDefault()
        props.showModal(props.post)
    }

    const updatePost = (event) => {
        event.preventDefault()
        props.updatePost(props.post)
    }

    const viewPostComments = (event) => {
        event.preventDefault()
        setShowComments(false)
        props.viewPostComments(props.post)
    }

    const hidePostComments = (event) => {
        event.preventDefault()
        setShowComments(true)
        props.hidePostComments(props.post)
    }

    const deletePost = (event) => {
        event.preventDefault()
        props.deletePost(props.post)
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
                setPostOwner(data)
            } else {
                throw "Invalid request to get the user"
            }
        } catch (error) {
            setErrorState({"errorMessage": error})
        }
    }

    const showPostOwner = (event) => {
        event.preventDefault()
        setShowPostOwnerState(true)
    }

    const hidePostOwner = () => {
        setShowPostOwnerState(false)
    }

    useEffect(() => {
        getUser('http://localhost:8000/users/' + postOwnerId + '/')
    }, [])

    let content = (localStorage.getItem("token") !== "" ?
            <div className="Post">
                <h3>Post NO.{props.post.id}</h3>
                {/*<hr />*/}
                <form>
                    <div className="field-container">
                        <label htmlFor="post_title">Title</label>
                        <input type="text" id="post_title" value={postTitle} placeholder="Enter the title"
                               required="True" onChange={titleChangeHandler} disabled={props.disabled}/>
                    </div>

                    <div className="field-container">
                        <label htmlFor="post_owner">Owner</label>
                        <p> <a href="" onClick={showPostOwner}>{postOwner.user_name}</a> </p>
                        {/*<input type="text" id="post_owner" value={postOwnerId} placeholder="Enter the Owner name"*/}
                        {/*       required="True" onChange={ownerChangeHandler} disabled="true"/>*/}
                    </div>

                    <div className="field-container">
                        <label htmlFor="post_description">Description</label>
                        <input type="text" id="post_description" value={postDescription}
                               placeholder="Enter the description" required="True" onChange={descriptionChangeHandler}
                               disabled={props.disabled}/>
                    </div>

                    <div className="field-container">
                        <label htmlFor="post_create_date">Created Date</label>
                        <input type="date" id="post_create_date" value={postCreateDate}
                               placeholder="Enter the created date" required="True" onChange={createDateChangeHandler}
                               disabled="true"/>
                    </div>

                    <div className="field-container">
                        <label htmlFor="post_updated_date">Updated Date</label>
                        <input type="date" id="post_updated_date" value={postUpdatedDate} required="True"
                               onChange={updatedDateChangeHandler} disabled="true"/>
                    </div>

                    <div className="field-container">
                        <label htmlFor="post_number_of_comments">Number of comments on this post</label>
                        <input type="number" id="post_number_of_comments" value={postNumberOfComments} required="True"
                               onChange={numberOfCommentsChangeHandler} disabled="true"/>
                    </div>
                </form>
                <div>
                    {props.disabled && <button className="open-post-btn" onClick={displayPost}>Open Post</button>}
                    {!props.disabled && <button className="update-post-btn" onClick={updatePost}>Update Post</button>}
                    {!props.disabled && showComments &&
                    <button className="view-post-comments-btn" onClick={viewPostComments}>View Post Comments</button>}
                    {!props.disabled && !showComments &&
                    <button className="hide-post-comments-btn" onClick={hidePostComments}>Hide Post Comments</button>}
                    {!props.disabled && <button className="delete-post-btn" onClick={deletePost}>Delete Post</button>}
                </div>

                {
                    showPostOwnerState &&
                    <Modal show={showPostOwnerState} handleCloseModal={hidePostOwner}>
                        <User key={postOwnerId} user={postOwner}/>
                    </Modal>
                }

            </div> :
            <div>
                You need to login to view this page
            </div>
    )

    return (
        <div className="post-page-container">
            {content}
        </div>
    );
}

export default Post;
