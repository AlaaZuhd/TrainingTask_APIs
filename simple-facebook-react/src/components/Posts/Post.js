import {useEffect, useState} from 'react';
import logo from '../../logo.svg';
import '../App.css';


function Post(props) {

    let content = (props.authorization ?
        <div className="Post">
            <h3>Post NO.{props.post.id}</h3>
            <hr/>
            <div>
                <p>Title</p>
                <p>{props.post.title}</p>
            </div>

            <div>
                <p>Owner</p>
                <p>{props.post.owner}</p>
            </div>

            <div>
                <p>Description</p>
                <p>{props.post.description}</p>
            </div>

            <div>
                <p>Create Date</p>
                <p>{props.post.create_date}</p>
            </div>

            <div>
                <p>Updated Date</p>
                <p>{props.post.updated_date}</p>
            </div>

            <div>
                <p>Comments</p>
                <p>{props.post.comments}</p>
            </div>
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

export default Post;
