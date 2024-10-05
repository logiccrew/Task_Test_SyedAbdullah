
import { Modal, Button } from 'react-bootstrap';

const Popup = ({ show, handleClose, handleApprove }: any) => {

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to proceed?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleApprove}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );

};

export default Popup;