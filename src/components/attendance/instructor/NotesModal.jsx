import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  FormControl,
  FormHelperText,
  Typography,
  Divider,
  Button,
} from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// requests

import { postInstructorAttendanceFn } from "../../../requests/attendance";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import { generateRandomNumber } from "../../../utils/functions";

const NotesModal = ({ data, onClose }) => {
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
    mutate: sendAttendanceData,
    isPending: attendanceLoading,
    isError: isAttendanceError,
    error: attendanceError,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Error At sending Notes", "error");
    },
    mutationFn: postInstructorAttendanceFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instructorAttendance-pagination"],
      });

      queryClient.invalidateQueries({
        queryKey: ["instructorAttendance-list"],
      });
      showSnackbar("Notes Submitted Successfully", "success");
      onClose();
    },
  });

  useEffect(() => {
    if (data?.Notes) {
      console.log(data);
      setNoteText(data?.Notes);
    }
  }, []);

  const handleSubmitNote = () => {
    if (noteText) {
      // send notes data

      sendAttendanceData({
        reqBody: {
          instructorId: data?.UserID,
          roundId: data?.RoundID?.id,
          sessionId: data?.SessionID?.id,
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

        <Button color="primary" variant="contained" onClick={handleSubmitNote}>
          Add Note
        </Button>
      </Box>
    </div>
  );
};

export default NotesModal;
