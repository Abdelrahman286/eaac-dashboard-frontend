import React from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Full height loading screen
    }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingSpinner;
