import {useEffect, useState} from 'react';
import '../App.css';
import "../../style.css"
import Comment from "./Comment.js"


function Comments(props) {

    const [errorState, setErrorState] = useState({"errorMessage": ""})
    const [commentState, setCommentState] = useState([])
    const [numberOfComments, setNumberOfComments] = useState(0)
    const [firstCommentCountInPage, setFirstCommentCountInPage] = useState(0)
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    let comments = []

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
                for(let j=0; j<numberOfComments; j++){
                    if(j===0)
                        setFirstCommentCountInPage(data.results[j].id) // back later, there is an error.
                    comments.push(data.results[j])
                }
            setCommentState(comments)
            }
            else {
                throw "Invalid request to get the comments"
            }
        } catch(error) {
            console.log(error)
            setErrorState({"errorMessage": error})
        }
    }


    useEffect(() => {
        if(props.authorization)
            getComments('http://127.0.0.1:8000/comments/')
    }, []);

    const getPrevPage = () => {
        if(prevPage !== null && props.authorization){
            getComments(prevPage)
        }
    }

    const getNextPage = () => {
        if(nextPage !== null && props.authorization){
            getComments(nextPage)
        }
    }

    let content = (props.authorization ?
        <div className="Comments">
            <div>
                <span>Comment NO.</span>
                <span id="firstPostCountInPage">{firstCommentCountInPage}</span>
                <span>&nbsp;of&nbsp;</span>
                <span>{numberOfComments}&nbsp;&nbsp;</span>
                <button className="prevBtn" onClick={getPrevPage} />
                &nbsp; &nbsp;
                <button className="nextBtn" onClick={getNextPage} />
            </div>
            <ul>
                {commentState.map((comment) =>
                    <Comment key={comment.id} comment={comment} authorization={props.authorization}/>
                )}
            </ul>
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

export default Comments;
