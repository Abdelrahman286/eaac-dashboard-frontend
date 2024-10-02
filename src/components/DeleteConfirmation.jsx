import React from "react";
import FormButton from "./FormButton";

const DeleteConfirmation = ({ deleteFn, closeFn, isLoading }) => {
  const handleDelete = () => {
    deleteFn();
  };
  const handleClose = () => {
    closeFn();
  };
  return (
    <div className="delete-confirmation">
      <p>Are you sure you want to delete this item?</p>

      <div className="actions">
        <FormButton
          onClick={handleClose}
          buttonText={"Cancel"}
          className="main-btn cancel-btn"
        ></FormButton>
        <FormButton
          onClick={handleDelete}
          buttonText={"Delete"}
          isLoading={isLoading}
          className="main-btn delete-btn"
        ></FormButton>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
