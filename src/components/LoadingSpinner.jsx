import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingSpinner = ({ minWidth, width, minHeight, height }) => {
  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: minWidth || "auto", // Default to 'auto' if not provided
    width: width || "auto", // Default to 'auto' if not provided
    minHeight: minHeight || "auto", // Default to 'auto' if not provided
    height: height || "auto", // Default to 'auto' if not provided
  };

  return (
    <Box sx={loaderStyle}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;
