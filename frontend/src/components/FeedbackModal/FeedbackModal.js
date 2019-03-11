import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import success from 'assets/success.svg';
import error from 'assets/error.svg';
import Button from '../Button/Button';

class FeedbackModal extends React.Component {
    componentDidUpdate() {
        const { showSuccessModal, handleModalClose } = this.props;

        if (showSuccessModal) {
            setTimeout(() => handleModalClose(), 1500);
        }
    }

    render() {
        const { showSuccessModal, showErrorModal, handleModalClose } = this.props;
        return (
            <Modal
                size="sm"
                show={showSuccessModal || showErrorModal}
                onHide={handleModalClose}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Body>
                    {showSuccessModal && (
                        <>
                            <img src={success} alt="success icon" />
                            <h4>Updated and saved!</h4>
                        </>
                    )}
                    {showErrorModal && (
                        <>
                            <img src={error} alt="error icon" />
                            <h4>
                                Something went wrong...
                                <br />
                                Unfortunately, we could not update and save your new threshold.
                            </h4>
                            <Button
                                secondary
                                handleOnClick={handleModalClose}
                            >
                                Back to dashboard
                            </Button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

FeedbackModal.propTypes = {
    showSuccessModal: PropTypes.bool.isRequired,
    showErrorModal: PropTypes.bool.isRequired,
    handleModalClose: PropTypes.func.isRequired,
};

export default FeedbackModal;
