import React, { createContext, useContext, useState, useRef } from "react";
import { Snackbar, Alert } from "@mui/material";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [currentAuthPage, setCurrentPage] = useState("loginPage");

  const handleAuthPageTransition = (page) => {
    const pagesList = ["loginPage", "forgotPassPage", "otpPage"];
    if (pagesList.includes(page)) {
      setCurrentPage(page);
    } else {
      console.error(`Invalid page: ${page}`);
    }
  };

  //------------ SnackBar Logic

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // 'success', 'error', 'info', 'warning'
  const [snackbarKey, setSnackbarKey] = useState(0); // Key to force re-render

  // search results, key is used to identify the table
  const [searchResults, setSearchResults] = useState({
    key: "",
    searchTerm: "",
  });

  const [disabledList, setDisabledList] = useState({
    key: "",
  });

  const showSnackbar = (msg, sev = "success") => {
    // Update snackbar key to force re-render
    setSnackbarKey((prevKey) => prevKey + 1);

    setMessage(msg);
    setSeverity(sev);
    setOpen(true);

    // Clear any existing timer and start a new one
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 3000); // Snackbar will auto-hide after 3 seconds
  };

  const handleClose = () => {
    setOpen(false);
    // Clear the timer when manually closing
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const timerRef = useRef(null);

  const value = {
    currentAuthPage,
    handleAuthPageTransition,
    showSnackbar,
    searchResults,
    setSearchResults,
    disabledList, 
    setDisabledList
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <Snackbar
        key={snackbarKey} // Key to force re-render
        open={open}
        autoHideDuration={null} // We manage the auto-hide manually
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}
