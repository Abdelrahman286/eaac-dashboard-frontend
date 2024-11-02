import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DownloadIcon from "@mui/icons-material/Download";
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
  Button,
  Grid,
} from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

const HeaderActions = () => {
  const handleDropdownChange = (name, value) => {
    setSessionForm({
      ...sessionForm,
      [name]: value,
    });
  };

  const groups = [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
  ];

  const sessions = [
    { id: 1, name: "session 1" },
    { id: 2, name: "session 2" },
  ];

  const students = [
    { id: 1, name: "student  1" },
    { id: 2, name: "student 2" },
  ];
  return (
    <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Row 1 - Group/Round, Session, and Instructor */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          gap: 1,
        }}
      >
        {/* Autocomplete for Group/Round */}
        <Box sx={{ flex: 1, minWidth: "200px" }}>
          <Autocomplete
            options={groups}
            getOptionLabel={(option) => option.name || ""}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Group/Round"
                margin="normal"
                fullWidth
              />
            )}
          />
        </Box>

        {/* Autocomplete for Session */}
        <Box sx={{ flex: 1, minWidth: "200px" }}>
          <Autocomplete
            options={sessions}
            getOptionLabel={(option) => option.name || ""}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Session"
                margin="normal"
                fullWidth
              />
            )}
          />
        </Box>

        {/* Autocomplete for Instructor */}
        <Box sx={{ flex: 1, minWidth: "200px" }}>
          <Autocomplete
            options={students}
            getOptionLabel={(option) => option.name || ""}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Student"
                margin="normal"
                fullWidth
              />
            )}
          />
        </Box>
      </Box>

      {/* Row 3 - Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: { sm: "flex-end" },
          marginLeft: "auto",

          width: {
            xs: "100%",
            sm: "100%",
            md: "70%",
            lg: "50%",
          },
        }}
      >
        {/* Show Attendance Report Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            sx={{
              width: "280px", // Constant width
              paddingY: 0.1,
              height: "32px",
            }}
          >
            Show Attendance Report
          </Button>
        </Box>

        {/* Export XLS Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            sx={{
              width: "140px", // Constant width
              paddingY: 0.1,
              height: "32px",
            }}
          >
            Export XLS
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderActions;
