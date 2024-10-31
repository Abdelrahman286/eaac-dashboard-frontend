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
} from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

const groups = [
  { id: 1, name: "Group 1" },
  { id: 2, name: "Group 2" },
];
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
    <Box sx={{ display: "flex", gap: 1 }}>
      {/* select fields */}

      <Box sx={{ display: "flex", gap: 1, flex: 3 }}>
        <Autocomplete
          sx={{ flex: 1 }}
          //   value={rooms.find((item) => item.id == formData?.roomId) || null}
          //   getOptionLabel={(option) => {
          //     return `${option?.Name_en} ( ${option?.RoomCode})`;
          //   }}
          options={groups}
          getOptionLabel={(option) => option.name || ""}
          size="small"
          renderInput={(params) => (
            <TextField
              //   error={Boolean(formErrors?.roomId)}
              //   helperText={formErrors?.roomId}
              {...params}
              label="Group/Round"
              margin="normal"
              fullWidth
            />
          )}
        />

        <Autocomplete
          sx={{ flex: 1 }}
          //   value={rooms.find((item) => item.id == formData?.roomId) || null}
          //   getOptionLabel={(option) => {
          //     return `${option?.Name_en} ( ${option?.RoomCode})`;
          //   }}
          options={sessions}
          getOptionLabel={(option) => option.name || ""}
          size="small"
          renderInput={(params) => (
            <TextField
              //   error={Boolean(formErrors?.roomId)}
              //   helperText={formErrors?.roomId}
              {...params}
              label="Sessions"
              margin="normal"
              fullWidth
            />
          )}
        />

        <Autocomplete
          sx={{ flex: 1 }}
          //   value={rooms.find((item) => item.id == formData?.roomId) || null}
          //   getOptionLabel={(option) => {
          //     return `${option?.Name_en} ( ${option?.RoomCode})`;
          //   }}
          options={students}
          getOptionLabel={(option) => option.name || ""}
          size="small"
          renderInput={(params) => (
            <TextField
              //   error={Boolean(formErrors?.roomId)}
              //   helperText={formErrors?.roomId}
              {...params}
              label="Students"
              margin="normal"
              fullWidth
            />
          )}
        />
      </Box>

      {/* Buttons */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          sx={{ paddingY: 0.1, minWidth: 90, height: "32px" }}
        >
          Export XLS
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          sx={{ paddingY: 0.1, minWidth: 90, height: "32px" }}
        >
          Show Attendence Report
        </Button>
      </Box>
    </Box>
  );
};

export default HeaderActions;
