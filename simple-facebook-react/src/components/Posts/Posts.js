import {useEffect, useState, useContext} from 'react';
import '../App.css';
import Post from "./Post.js"
import Comment from "../Comments/Comment.js"
import {Modal, Button} from "react-bootstrap"
import checkToken from "../CheckToken";
import "../../style.css"
import AuthContext from "../../Context/AuthContext";

function Posts(props) {

    const authContext = useContext(AuthContext)

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
    const [showCommentsState, setShowCommentsState] = useState(false)
    const [isLoggedin, setIsLoggedin] = useState(true)

    let posts = []

    useEffect(async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            getPosts('http://127.0.0.1:8000/posts/')
            setIsLoggedin(true)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
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

    const getPrevPage = async () => {
        if(prevPage !== null && localStorage.getItem("token") !== "" && await checkToken() === true){
            getPosts(prevPage)
            setIsLoggedin(true)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const getNextPage = async() => {
        if(nextPage !== null && localStorage.getItem("token") !== "" && await checkToken() === true){
            getPosts(nextPage)
            setIsLoggedin(true)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const hideModal = async () => {
        if(localStorage.getItem("token") !== "" && await checkToken() === true) {
            getPosts("http://localhost:8000/posts/")
            setModalState({show: false});
            setIsLoggedin(true)
            authContext.setLoggedInState(true)
        } else {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    const showModal = async (value) => {
        if(localStorage.getItem("token") !== "" && await checkToken() === true) {
            setPostId(value)
            setModalState({show: true});
            setIsLoggedin(true)
            authContext.setLoggedInState(true)
        } else  {
            setIsLoggedin(false)
            authContext.setLoggedInState(false)
        }
    }

    let content =
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
                <div className="row row-cols-1 row-cols-lg-1 row-cols-xl-2 mb=2 text-center cont ">
                    {postState.map((post) =>
                        <div className="col">
                            <Post key={post.id}
                                  post={post}
                                  authorization={props.authorization}
                                  numberOfComments={post.comments.length}
                                  disabled={true}
                                  showModal={showModal}
                            />
                        </div>
                    )}
                </div>
            </ul>
            {postId !== null &&
            <Modal show={modalState.show} centered>
                <Modal.Body>
                    <Post key={postId.updated_date}
                          post={postId}
                          authorization={props.authorization}
                          numberOfComments={postId.comments.length}
                          disabled={false}
                          showModal={showModal}
                          hideModal={hideModal}
                    />
                    <div className="post-comments">
                        {showCommentsState && postId["comments"].map((comment) =>
                            <Comment key={comment.id}
                                     comment={comment}
                                     disabled={true}
                                     authorization={props.authorization}
                            />)
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideModal}>Close</Button>
                </Modal.Footer>
            </Modal>
            }
        </div>
    let error =
        <div>
            You need to login to view this page
        </div>

    return (
        <div>
            {isLoggedin && content}
            {!isLoggedin && error}
        </div>
    );
}

export default Posts;
