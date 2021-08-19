import {useContext, useEffect, useState} from 'react';
import '../App.css';
import "../../style.css"
import Comment from "./Comment.js"
import checkToken from "../CheckToken"
import AuthContext from "../../Context/AuthContext";
import Error from "../Error";

function Comments(props) {

    const authContext = useContext(AuthContext)

    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [commentsState, setCommentsState] = useState([])
    const [numberOfComments, setNumberOfComments] = useState(0)
    const [firstCommentCountInPage, setFirstCommentCountInPage] = useState(0)
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)

    const [prevBtnTitle, setPrevBtnTitle] = useState("")
    const [nextBtnTitle, setNextBtnTitle] = useState("")
    const [nextTitle, setNextTitle] = useState("")
    const [prevTitle, setPrevTitle] = useState("")
    const [classNamePrevBtn, setClassNamePrevBtn] = useState("prevBtn")
    const [classNameNextBtn, setClassNameNextBtn] = useState("nextBtn")
    let comments = []

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


    const getComments = async (url) => {
        try {
            const token = localStorage.getItem("token")
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization" : "token " + token }
            };
            const response = await fetch(url, requestOptions)
            if(response.status === 200 && response.ok){
                let data = await response.json()
                setNumberOfComments(data["count"])
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

                let numberOfCommentsInCurrentPage = data.results.length
                for(let j=0; j< numberOfCommentsInCurrentPage; j++){
                    if(j===0)
                        setFirstCommentCountInPage(data.results[j].id) // back later, there is an error.
                    comments.push(data.results[j])
                }
                console.log(comments[0])
                setCommentsState([])
                setCommentsState(comments)
            }
            else {
                throw "Invalid request to get the comments"
            }
        } catch(error) {
            console.log(error)
            setErrorState({"errorMessage": error})
        }
    }


    useEffect(async () => {
        if(localStorage.getItem("token") && await checkToken() === true) {
            getComments('http://127.0.0.1:8000/comments/')
            authContext.setLoggedInState(true)
        } else {
            authContext.setLoggedInState(false)
        }
    }, []);

    const getPrevPage = async () => {
        if(prevPage !== null && localStorage.getItem("token") !== '' && await checkToken() === true){
            getComments(prevPage)
            authContext.setLoggedInState(true)
        } else {
            authContext.setLoggedInState(false)
        }
    }

    const getNextPage = async () => {
        if(nextPage !== null && localStorage.getItem("token") !== '' && await checkToken() === true){
            getComments(nextPage)
            authContext.setLoggedInState(true)
        } else {
            authContext.setLoggedInState(false)
        }
    }

    let content =
        <div className="Comments">
            <div>
                <span>Comment NO.</span>
                <span id="firstPostCountInPage">{firstCommentCountInPage}</span>
                <span>&nbsp;of&nbsp;</span>
                <span>{numberOfComments}&nbsp;&nbsp;</span>
                <button className={classNamePrevBtn} onClick={getPrevPage} title={prevTitle} />
                &nbsp; &nbsp;
                <button className={classNameNextBtn} onClick={getNextPage} title={nextTitle} />
            </div>
            <ul>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 mb-3 text-center cont">
                    {commentsState.map((comment) =>
                        <div className="col">
                            <Comment key={comment.updated_date+ comment.id} comment={comment} authorization={props.authorization} disabled={true}/>
                        </div>
                    )}
                </div>
            </ul>
        </div>

    return (
        <div>
            {authContext.loggedInState && content}
            {
                !authContext.loggedInState
                &&
                <div>
                    <Error type="Autorization" errorMessage="You are not allowed to be here, you need to login"/>
                </div>

            }
        </div>
    );
}

export default Comments;
