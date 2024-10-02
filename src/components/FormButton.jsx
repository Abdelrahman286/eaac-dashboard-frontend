import React from "react";
import { CircularProgress } from "@mui/material";

const FormButton = ({ isLoading, buttonText, icon, ...props }) => {
  return (
    <button {...props} disabled={isLoading}>
      {isLoading && (
        <CircularProgress
          size={20}
          style={{ marginRight: "10px", color: "white" }} // Adjust color if needed
        />
      )}
      {buttonText}
      {icon ?? ""}
    </button>
  );
};

export default FormButton;
