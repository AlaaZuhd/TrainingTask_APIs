import '../style.css'
import './Modal.css';

const Modal = (props) => {
    const showHideClassName = props.show ? "modal display-block" : "modal display-none";
    const handleClose = () => {
        props.handleCloseModal()
    }

    return (
    <div className={showHideClassName}>
        <section className="modal-main">
            {props.children}
            <button type="button" onClick={handleClose}>
                Close
            </button>
        </section>
    </div>
    );
};

export default Modal