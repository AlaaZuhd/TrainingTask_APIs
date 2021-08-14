import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import "../../style.css"
import "./posts.css"

function Post(props) {

    const [postTitle, setPostTitle] = useState(props.post.title)
    const [postOwner, setPostOwner] = useState(props.post.owner)
    const [postDescription, setPostDescription] = useState(props.post.description)
    const [postCreateDate, setPostCreateDate] = useState(props.post.create_date)
    const [postUpdatedDate, setPostUpdatedDate] = useState(props.post.updated_date)
    const [postNumberOfComments, setPostNumberOfComments] = useState(props.numberOfComments)

    const titleChangeHandler = (event) => {
        event.preventDefault()
        setPostTitle(event.target.value)
    }

    const ownerChangeHandler = (event) => {
        event.preventDefault()
        setPostOwner(event.target.value)
    }

    const descriptionChangeHandler = (event) => {
        event.preventDefault()
        setPostDescription(event.target.value)
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

    let content = (props.authorization ?
        <div className="Post" >
            <h3>Post NO.{props.post.id}</h3>
            {/*<hr />*/}
            <form>
                <div className="field-container">
                    <label htmlFor="post_title">Title</label>
                    <input type="text" id="post_title" value={postTitle} placeholder="Enter the title" required="True" onChange={titleChangeHandler} disabled={props.disabled}/>
                </div>

                <div className="field-container">
                    <label htmlFor="post_owner">Owner</label>
                    <input type="text" id="post_owner" value={postOwner} placeholder="Enter the Owner name" required="True" onChange={ownerChangeHandler} disabled="true"/>
                </div>

                <div className="field-container">
                    <label htmlFor="post_description">Description</label>
                    <input type="text" id="post_description" value={postDescription} placeholder="Enter the description" required="True" onChange={descriptionChangeHandler} disabled={props.disabled}/>
                </div>
                <div className="field-container">
                    <label htmlFor="post_create_date">Created Date</label>
                    <input type="date" id="post_create_date" value={postCreateDate} placeholder="Enter the created date" required="True" onChange={createDateChangeHandler} disabled="true"/>
                </div>

                <div className="field-container">
                    <label htmlFor="post_updated_date">Updated Date</label>
                    <input type="date" id="post_updated_date" value={postUpdatedDate} required="True" onChange={updatedDateChangeHandler} disabled="true"/>
                </div>

                <div className="field-container">
                    <label htmlFor="post_number_of_comments">Number of comments on this post</label>
                    <input type="number" id="post_number_of_comments" value={postNumberOfComments} required="True" onChange={numberOfCommentsChangeHandler} disabled="true"/>
                </div>
            </form>
            <button className="open-post-btn" onClick={displayPost}>Open Post</button>
        </div>:
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
