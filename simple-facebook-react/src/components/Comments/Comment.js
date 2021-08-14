import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';


function Comment(props) {

    let content = (props.authorization ?
        <div className="Comment">
            <h3>Comment NO.{props.comment.id}</h3>
            <hr/>
            <div>
                <p>Content</p>
                <p>{props.comment.content}</p>
            </div>

            <div>
                <p>Owner</p>
                <p>{props.comment.owner}</p>
            </div>

            <div>
                <p>Post</p>
                <p>{props.comment.post}</p>
            </div>

            <div>
                <p>Image</p>
                <p>{props.comment.image}</p>
            </div>

            <div>
                <p>Create Date</p>
                <p>{props.comment.create_date}</p>
            </div>

            <div>
                <p>Updated Date</p>
                <p>{props.comment.updated_date}</p>
            </div>

        </div>
        :
        <div>
            You don't have the permissions to view the comment
        </div>
    )

    return (
        <div>
            {content}
        </div>
    );
}

export default Comment;
