import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const FeedbackModal = ({ showSuccessModal, showErrorModal, handleModalClose }) => (
    <Modal
        size="sm"
        show={showSuccessModal || showErrorModal}
        onHide={handleModalClose}
        aria-labelledby="contained-modal-title-vcenter"
    >
        <Modal.Body>
            {showSuccessModal && (
                <>
                    <i className="fas fa-check" />
                    <h4>Threshold successfully saved</h4>
                </>
            )}
            {showErrorModal && (
                <>
                    <i className="fas fa-exclamation-triangle" />
                    <h4>There was an error saving the threshold</h4>
                </>
            )}
        </Modal.Body>
    </Modal>
);

FeedbackModal.propTypes = {
    showSuccessModal: PropTypes.bool.isRequired,
    showErrorModal: PropTypes.bool.isRequired,
    handleModalClose: PropTypes.func.isRequired,
};

export default FeedbackModal;
