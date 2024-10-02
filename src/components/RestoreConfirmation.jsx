import React from "react";
import FormButton from "./FormButton";

const RestoreConfirmation = ({ restoreFn, closeFn, isLoading }) => {
  const handleRestore = () => {
    restoreFn();
  };
  const handleClose = () => {
    closeFn();
  };
  return (
    <div className="delete-confirmation">
      <p>Are you sure you want to restore this item?</p>

      <div className="actions">
        <FormButton
          onClick={handleClose}
          buttonText={"Cancel"}
          className="main-btn cancel-btn"
        ></FormButton>
        <FormButton
          onClick={handleRestore}
          buttonText={"Restore"}
          isLoading={isLoading}
          className="main-btn "
        ></FormButton>
      </div>
    </div>
  );
};

export default RestoreConfirmation;
