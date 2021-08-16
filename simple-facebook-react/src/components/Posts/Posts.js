import {useEffect, useState} from 'react';
import '../App.css';
import "../../style.css"
import Post from "./Post.js"
import Comment from "../Comments/Comment.js"
import Modal from "../Modal"

function Posts(props) {

    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [postState, setPostState] = useState([])
    const [numberOfPosts, setNumberOfPosts] = useState(0)
    const [firstPostCountInPage, setFirstPostCountInPage] = useState(0)
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    const [prevBtnTitle, setPrevBtnTitle] = useState("")
    const [nextBtnTitle, setNextBtnTitle] = useState("")
    const [nextTitle, setNextTitle] = useState("")
    const [prevTitle, setPrevTitle] = useState("")
    const [classNamePrevBtn, setClassNamePrevBtn] = useState("prevBtn")
    const [classNameNextBtn, setClassNameNextBtn] = useState("nextBtn")
    const [modalState, setModalState] = useState({show: false})
    const [postId, setPostId] = useState(null)
    const [commentState, setCommentState] = useState([])
    const [showCommentsState, setShowCommentsState] = useState(false)
    const [updatedDateState, setUpdatedDateState] = useState(false)

    let posts = []
    let comments = []

    useEffect(() => {
        if(localStorage.getItem("token"))
            getPosts('http://127.0.0.1:8000/posts/')
    }, []);



    useEffect( () => {
        setPrevTitle(prevBtnTitle)
        setNextTitle(nextBtnTitle)
    }, [prevBtnTitle, nextBtnTitle])

    useEffect(() => {
        if(nextPage === null)
            setClassNameNextBtn("nextBtn addOpacity")
        else
            setClassNameNextBtn("nextBtn")
    }, [nextBtnTitle])

    useEffect(() => {
        if(prevPage === null)
            setClassNamePrevBtn("prevBtn addOpacity")
        else
            setClassNamePrevBtn("prevBtn")
    }, [prevBtnTitle])

    const getPosts = async (url) => {
        try {
            posts = []
            setPostState([])
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }
            };
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                setNumberOfPosts(data["count"])
                setNextPage(data["next"])
                setPrevPage(data["previous"])
                if(data["next"])
                    setNextBtnTitle("Next Page")
                else
                    setNextBtnTitle("")
                if(data["previous"])
                    setPrevBtnTitle("Previous Page")
                else
                    setPrevBtnTitle("")
                let numberOfPostInCurrentPage = data.results.length
                for(let j=0; j<numberOfPostInCurrentPage; j++){
                    if(j===0)
                        setFirstPostCountInPage(data.results[j].id)
                    posts.push(data.results[j])
                }
                setPostState(posts)
            }
            else {
                throw "Invalid request to get the posts"
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
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
            const token = localStorage.getItem("token")
            urlsList.map(url => {
                getComment(url)
            })
            setCommentState(comments)
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
    }



    const getPrevPage = () => {
        if(prevPage !== null && localStorage.getItem("token") !== "" ){
            getPosts(prevPage)
        }
    }

    const getNextPage = () => {
        if(nextPage !== null && localStorage.getItem("token") !== ""){
            getPosts(nextPage)
        }
    }

    const opacity = "opacity: 0.20;"

    const hideModal = () => {
        setModalState({ show: false });
    }

    const showModal = (value) => {
        setPostId(value)
        setModalState({ show: true });
    }

    const updatePost = async (post) => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token },
                body: JSON.stringify({ title: post.title, description: post.description })
            };
            const url = "http://localhost:8000/posts/" + post.id + "/"
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                // let posts = (postState.filter(post_ => post_.id === post.id).map(post_ => data))
                // setPostState(posts)
                let posts = []
                for(let i=0; i<postState.length; i++) {
                    if (postState[i].id === data.id) {
                        posts.push(data)
                        setPostId(data)
                    } else
                        posts.push(postState[i])
                }
                setPostState(posts)
                getPosts("http://localhost:8000/posts/")
            }
            else {
                throw "Invalid request to update the post"
            }
        } catch(error) {
            setErrorState({"errorMessage": error})
        }
    }

    const viewPostComments = async (value) => {
        setShowCommentsState(true)
        let urlsList = []
        for(let i=0; i< value.comments.length; i++)
            urlsList.push(value.comments[i])
        getPostComments(urlsList)
    }

    const hidePostComments = async (value) => {
        setShowCommentsState(false)
    }

    const deletePost = async (post) => {
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
                getPosts("http://localhost:8000/posts/")
            }
            else {
                throw "Invalid request to delete the post"
            }
        } catch(error) {
            alert(error)
            setErrorState({"errorMessage": error})
        }
    }

    let content = (localStorage.getItem("token") !== "" ?
        <div className="Posts">
            <div className="d-flex align-items-center justify-content-center">
                <span>Post NO.</span>
                <span id="firstPostCountInPage">{firstPostCountInPage}</span>
                <span>&nbsp;of&nbsp;</span>
                <span>{numberOfPosts} &nbsp;&nbsp;&nbsp;</span>
                <button className={classNamePrevBtn} onClick={getPrevPage} title={prevTitle} />
                &nbsp; &nbsp;
                <button className={classNameNextBtn} onClick={getNextPage} title={nextTitle}/>
            </div>
            <ul>
                {postState.map((post) =>
                    <Post key={post.id}
                          post={post}
                          authorization={props.authorization}
                          numberOfComments={post.comments.length}
                          disabled={true}
                          showModal={showModal}
                    />
                )}
            </ul>
            {postId !== null && <Modal show={modalState.show} handleCloseModal={hideModal}>
                <Post key={postId.updated_date}
                      post={postId}
                      authorization={props.authorization}
                      numberOfComments={postId.comments.length}
                      disabled={false}
                      showModal={showModal}
                      updatePost={updatePost}
                      viewPostComments={viewPostComments}
                      deletePost={deletePost}
                      hidePostComments={hidePostComments}
                />
                <div className="post-comments">
                    {showCommentsState && postId["comments"].map( (comment) =>
                        <Comment key={comment.id}
                              comment={comment}
                              comment={comment}
                              authorization={props.authorization}
                              // numberOfComments={post.comments.length}
                              // disabled={true}
                              // showModal={showModal}
                        />)
                    }
                </div>
            </Modal>}
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
