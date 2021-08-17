import '../style.css'


const Error = (props) => {

    const errorType = props.type
    const loginLink = <a href="/login">Login</a>

    return (
    <div className="error">
        <h2>Error Type: {props.type}</h2>
        <p>{props.errorMessage}</p>
        {(errorType=="Autorization") && loginLink}
    </div>
    );
};

export default Error