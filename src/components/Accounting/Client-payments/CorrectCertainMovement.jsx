import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// MUI
import { Box, TextField, Button, CircularProgress } from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// requests

import { correctCertainMovement } from "../../../requests/ClientPayments";

const CorrectCertainMovement = ({ idToCorrect, onClose }) => {
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const { showSnackbar } = useContext(AppContext);

  const [noteText, setNoteText] = useState("");
  // fix z index issue for header inputs
  useEffect(() => {
    const header = document.querySelector(".header-wrapper");

    if (header) {
      header.style.zIndex = 0;
      // Capture and store original zIndex values
      const childElements = header.querySelectorAll("*");
      const originalZIndexes = Array.from(childElements).map(
        (element) => element.style.zIndex
      );

      // Set zIndex to 0 for all elements inside the header
      childElements.forEach((element) => {
        element.style.zIndex = 0;
      });

      // Cleanup function to restore original zIndex values
      return () => {
        childElements.forEach((element, index) => {
          element.style.zIndex = originalZIndexes[index];
        });
      };
    }
  }, []);

  const {
    mutate: correctMovement,
    isPending: loading,
    isError: isError,
    error: error,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Error At Correcting Movement", "error");
    },
    mutationFn: correctCertainMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientPayments-pagination"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clientPayments-list"],
      });
      showSnackbar("Payment Correction Submitted Successfully", "success");
      onClose();
    },
  });

  const handleSubmitNote = () => {
    if (noteText) {
      // send notes data

      correctMovement({
        reqBody: {
          notes: noteText,
          paymentId: idToCorrect,
        },
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  return (
    <div>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <TextField
          label="Notes"
          placeholder="Notes"
          //   id="descriptionEn"
          onChange={(e) => setNoteText(e.target.value)}
          value={noteText || ""}
          multiline
          minRows={4}
          fullWidth
          variant="outlined"
          style={{
            padding: 1,
            width: "400px",
            borderRadius: 4,
          }}
        />

        {/* <Button color="primary" variant="contained" onClick={handleSubmitNote}>
          Correct Movement
        </Button> */}

        <Button
          onClick={handleSubmitNote}
          size="small"
          variant="contained"
          color="success"
          sx={{
            minWidth: "160px", // Constant width
            paddingY: 0.1,
            height: "40px",
            padding: "16px 4px",
            borderRadius: "20px",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Correct Movement"
          )}
        </Button>
      </Box>
    </div>
  );
};

export default CorrectCertainMovement;
