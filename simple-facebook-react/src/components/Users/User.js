import {useEffect, useState} from 'react';
import '../App.css';
import "../../style.css"
import Modal_ from "../Modal_";
import Post from "../Posts/Post";
import Comment from "../Comments/Comment";
import ChangePassword from "./ChangePassword";
import {Redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, ListGroup, Dropdown} from "react-bootstrap"

function User(props) {

    let date = new Date(props.user.create_date)
    let dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
    const [userCreateDate, setUserCreateDate] = useState(dd)

    date = new Date(props.user.updated_date)
    dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
    const [userUpdatedDate, setUserUpdatedDate] = useState(dd)

    date = new Date(props.user.birth_date)
    dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
    const [userBirthdate, setUserBirthdate] = useState(dd)

    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [userUsername, setUserUsername] = useState(props.user.user_name)
    const [userEmail, setUserEmail] = useState(props.user.email)
    const [showCommentState, setShowCommentState] = useState(false)
    const [showPostState, setShowPostState] = useState(false)
    const [showChangePasswordState, setShowChangePasswordState] = useState(false)
    const [comment, setComment] = useState("")
    const [post, setPost] = useState("")
    const [modalState, setModalState] = useState({show: false})
    let commentsList = ""
    let postsList = ""

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
                setComment(data)
            }
            else {
                throw "Invalid request to get the comment"
            }
        } catch(error) {
            alert("error")
            setErrorState({"errorMessage": error})
        }
    }

    const getPost = async (url) => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }
            };
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                setPost(data)
            }
            else {
                throw "Invalid request to get the post"
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
    }

    const showComments = async (event) => {
        event.preventDefault()
        getComment(event.target.href)
        setShowCommentState(true)
    }

    const hideComment = (event) => {
        setShowCommentState(false)
    }

    const showPosts = async (event) => {
        event.preventDefault()
        await getPost(event.target.href)
        setShowPostState(true)
    }

    const hidePost = (event) => {
        setShowPostState(false)
    }

    const changePasswordUser = (event) => {
        event.preventDefault()
        setShowChangePasswordState(true)
    }

    const hideChangePassword = (event) => {
        setShowChangePasswordState(false)
    }

    if(props.user.comments)
        commentsList = props.user.comments.map((comment) => <Dropdown.Item key={comment} href={comment} target="_blank" onClick={showComments}>{comment}</Dropdown.Item>)
    if(props.user.posts)
        postsList = props.user.posts.map((post) => <Dropdown.Item onClick={showPosts} key={post} href={post}>{post}</Dropdown.Item>)

    const [editState, setEditState] = useState(false)
    const [deleteState, setDeleteState] = useState(false)
    const [isLoggedin, setIsLoggedin] = useState(props.authorization)

    const usernameChangeHandler = (event) => {
        event.preventDefault()
        setUserUsername(event.target.value)
        if(event.target.value.length > 0)
            props.user.username = event.target.value
    }

    const emailChangeHandler = (event) => {
        event.preventDefault()
        setUserEmail(event.target.value)
    }
    const birthdateChangeHandler = (event) => {
        event.preventDefault()
        setUserBirthdate(event.target.value)
    }

    const updatedDateChangeHandler = (event) => {
        event.preventDefault()
        setUserUpdatedDate(event.target.value)
    }


    const updateUser = async (event) => {
        event.preventDefault()
        setEditState(false)
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token },
                body: JSON.stringify({'user_name': userUsername, 'email': userEmail, 'birth_date': userBirthdate})
            };
            const url = "http://localhost:8000/users/" + props.user.id + "/"
            const response = await fetch(url, requestOptions)
            console.log(response)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                date = new Date(data.updated_date)
                dd = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))
                setUserUpdatedDate(dd)
            }
            else {
                throw new Error("Invalid request to update the user")
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
            alert(error.message)
        }

    }

    const editUser = (event) => {
        event.preventDefault()
        setEditState(true)
    }

    const cancelUpdatingOrDeleting = (event) => {
        event.preventDefault()
        setEditState(false)
        setDeleteState(false)
    }


    const deleteUser = async (event) => {
        event.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token },
            };
            const url = "http://localhost:8000/users/" + props.user.id + "/"
            const response = await fetch(url, requestOptions)
            if(response.status == 204 && response.ok){
                alert("Account deactivated Successfully")
            }
            else {
                throw new Error("Invalid request to delete the selected user")
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
        setDeleteState(true)
    }

    const hideModal = () => {
        setModalState({ show: false });
    }

    const showModal = (value) => {
        setPost(value)
        setModalState({ show: true });
    }


    useEffect(() => {
        if(localStorage.getItem("token"))
            setIsLoggedin(true)
        else
            setIsLoggedin(false)
    }, [])

    let userCard = (
        <Card className="text-center">
            <Card.Header><h3>User Id.{props.user.id}</h3></Card.Header>
            <Card.Body>
            <Card.Title className="d-flex justify-content-center">
                {/*<div className="field-container">*/}
                {/*    <label htmlFor="post_title">Title</label>*/}
                {/*    <input type="text" id="post_title" value={postTitle} placeholder="Enter the title"*/}
                {/*           required="True" onChange={titleChangeHandler} disabled={props.disabled}/>*/}
                {/*</div>*/}
                {/*Written By: <a href="" onClick={showPostOwner}>{postOwner.user_name}</a>,*/}
            </Card.Title>
            <div className="cardText">
                <div className="field-container">
                    <label htmlFor="user_username">Username</label>
                    <input type="text" id="user_username" value={userUsername} placeholder="Enter the username" required="True" onChange={usernameChangeHandler} disabled={!editState}/>
                </div>

                <div className="field-container">
                    <label htmlFor="user_email">Email</label>
                    <input type="email" id="user_email" value={userEmail} placeholder="Enter the email" required="True" onChange={emailChangeHandler} disabled={true} />
                </div>

                <div className="field-container">
                    <label htmlFor="user_birthdate">Birthdate</label>
                    <input type="date" id="user_birthdate" value={userBirthdate} placeholder="Enter the birthdate" required="True" onChange={birthdateChangeHandler} disabled={!editState}/>
                </div>
                <div className="d-flex justify-content-around">
                    <Dropdown className="dropDownList">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            User's Posts
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {postsList}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="dropDownList">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            User's Comments
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {commentsList}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {
                !editState && <Button className="edit-user-btn" onClick={editUser}>Edit</Button>
            }
            {
                !editState && <Button className="delete-user-btn" onClick={deleteUser}>Deactivate Account</Button>
            }
            {
                editState && <Button className="update-user-btn" onClick={updateUser}>Update</Button>
            }
            {
                (editState || deleteState) && <Button className="cancel-updating-deleting-user-btn" onClick={cancelUpdatingOrDeleting}>Cancel</Button>
            }
            {
                !editState && <Button className="change-password-btn" onClick={changePasswordUser}>Reset Password</Button>
            }
            <br />
            <br />
            {/*<h4>Users' Posts</h4>*/}
            {/*<ListGroup variant="flush">*/}
            {/*    {postsList}*/}
            {/*</ListGroup>*/}
            </Card.Body>
            <Card.Footer className="text-muted">Created at: {userCreateDate}, Updated at: {userUpdatedDate}</Card.Footer>
        </Card>
    )


    let content = (isLoggedin ?
        <div className="user">
            {userCard}
            {/*<h3>User NO.{props.user.id}</h3>*/}
            {/*<hr/>*/}
            {/*<form>*/}
            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="user_username">Username</label>*/}
            {/*        <input type="text" id="user_username" value={userUsername} placeholder="Enter the username" required="True" onChange={usernameChangeHandler} disabled={!editState}/>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="user_email">Email</label>*/}
            {/*        <input type="email" id="user_email" value={userEmail} placeholder="Enter the email" required="True" onChange={emailChangeHandler} disabled="true" />*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="user_birthdate">Birthdate</label>*/}
            {/*        <input type="date" id="user_birthdate" value={userBirthdate} placeholder="Enter the birthdate" required="True" onChange={birthdateChangeHandler} disabled={!editState}/>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="user_create_date">Created Date</label>*/}
            {/*        <input type="date" id="user_create_date" value={userCreateDate} required="True"disabled="true"/>*/}
            {/*    </div>*/}

            {/*    <div className="field-container">*/}
            {/*        <label htmlFor="user_updated_date">Updated Date</label>*/}
            {/*        <input type="date" id="user_updated_date" value={userUpdatedDate} required="True" onChange={updatedDateChangeHandler} disabled="true"/>*/}
            {/*    </div>*/}
            {/*</form>*/}
            {/*<div>*/}
            {/*    {!editState && <button className="edit-user-btn" onClick={editUser}>Edit</button>}*/}
            {/*    {!editState && <button className="delete-user-btn" onClick={deleteUser}>Deactivate Account</button>}*/}
            {/*    {editState && <button className="update-user-btn" onClick={updateUser}>Update</button>}*/}
            {/*    {(editState || deleteState) && <button className="cancel-updating-deleting-user-btn" onClick={cancelUpdatingOrDeleting}>Cancel</button>}*/}
            {/*    {!editState && <button className="change-password-btn" onClick={changePasswordUser}>Reset Password</button>}*/}
            {/*</div>*/}
            {/*<br />*/}
            {/*<br />*/}
            {/*<div>*/}
            {/*    /!*<h4>Users' Posts</h4>*!/*/}
            {/*    /!*<ListGroup variant="flush">*!/*/}
            {/*    /!*    {postsList}*!/*/}
            {/*    /!*</ListGroup>*!/*/}
            {/*    /!*<div className="posts-link-container">*!/*/}
            {/*    /!*    <h4>Users' Posts</h4>*!/*/}
            {/*    /!*    <ul>*!/*/}
            {/*    /!*        <h6>{postsList}</h6>*!/*/}
            {/*    /!*    </ul>*!/*/}
            {/*    /!*</div>*!/*/}
            {/*    /!*<div className="comments-link-container">*!/*/}
            {/*    /!*    <h4>Users' Comments</h4>*!/*/}
            {/*    /!*    <ul>*!/*/}
            {/*    /!*        <h6>{commentsList}</h6>*!/*/}
            {/*    /!*    </ul>*!/*/}
            {/*    /!*</div>*!/*/}
            {/*</div>*/}

             {
                showPostState &&
                <Modal_ show={showPostState} handleCloseModal={hidePost}>
                    <Post key={post.updated_date}
                      post={post}
                      authorization={props.authorization}
                      numberOfComments={post.comments.length}
                      disabled={false}
                      showModal={showModal}
                      hideModal={hideModal}
                    />
                </Modal_>
            }

            {
                showCommentState &&
                <Modal_ show={showCommentState} handleCloseModal={hideComment}>
                    <Comment key={comment.updated_date} comment={comment} authorization={true} disabled={true}/>
                </Modal_>
            }

            {
                showChangePasswordState &&
                <Modal_ show={showChangePasswordState} handleCloseModal={hideChangePassword}>
                    <ChangePassword />
                </Modal_>
            }

        </div>
        :
        <div>
            You don't have the permissions to view the user
        </div>
    )


    return (
        <div className="user-page-container">
            {!deleteState && content}
            {deleteState && <Redirect to="./login"/>}
        </div>
    );
}

export default User;
