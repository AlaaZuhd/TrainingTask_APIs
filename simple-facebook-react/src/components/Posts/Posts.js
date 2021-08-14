import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';
import "../../style.css"
import Post from "./Post.js"
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
    let posts = []

    const getPosts = async (url) => {
        try {
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

    useEffect(() => {
        if(props.authorization)
            getPosts('http://127.0.0.1:8000/posts/')
    }, []);

    useEffect( () => {
        setPrevTitle(prevBtnTitle)
        setNextTitle(nextBtnTitle)
    }, [prevBtnTitle, nextBtnTitle])

    const getPrevPage = () => {
        if(prevPage !== null && props.authorization){
            getPosts(prevPage)
        }
    }

    const getNextPage = () => {
        if(nextPage !== null && props.authorization){
            getPosts(nextPage)
        }
    }

    const opacity = "opacity: 0.20;"

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

    const hideModal = () => {
        setModalState({ show: false });
    }

    const showModal = (value) => {
        alert("hi")
        setPostId(value)
        setModalState({ show: true });
    }
    let content = (props.authorization ?
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
                <Post key={postId["id"]}
                      post={postId}
                      authorization={props.authorization}
                      numberOfComments={postId.comments.length}
                      disabled={false}
                      showModal={showModal}
                />
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
