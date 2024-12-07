import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// MUI
import { Box, TextField, Button, CircularProgress } from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// requests
import { editReceiptNote } from "../../requests/receipts";

const EditNotes = ({ data, onClose }) => {
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
    mutate: sendNote,
    isPending: addLoading,
    isError: isError,
    error: addError,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Error At sending Notes", "error");
    },
    mutationFn: editReceiptNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["receipt-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["receipt-list"],
      });

      showSnackbar("Notes Submitted Successfully", "success");
      onClose();
    },
  });

  useEffect(() => {
    if (data?.Notes) {
      setNoteText(data?.Notes);
    }
  }, []);

  const handleSubmitNote = () => {
    if (noteText) {
      // send notes data
      sendNote({
        reqBody: {
          id: [data.id],
          notes: noteText,
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

        {isError && (
          <p className="invalid-message">
            {addError?.responseError?.failed?.response?.msg ||
              "An Error Occurred, please try Again"}
          </p>
        )}

        <Button color="primary" variant="contained" onClick={handleSubmitNote}>
          {addLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Note"
          )}
        </Button>
      </Box>
    </div>
  );
};

export default EditNotes;
