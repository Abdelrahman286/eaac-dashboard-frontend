import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, TextField, Autocomplete, Button } from "@mui/material";
import "../../styles/rounds.css";

// components
import FormButton from "../FormButton";

// icons
import AddIcon from "@mui/icons-material/Add";

// validation

import { validateRoundRow } from "../../utils/validateRounds";

const instructors = [
  { id: 1, name: "Instructor 1" },
  { id: 2, name: "Instructor 2" },
  // Add more instructors here
];

const rooms = [
  { id: 1, name: "Room 101" },
  { id: 2, name: "Room 102" },
  // Add more rooms here
];

const OneByOneSection = () => {
  const [showAddForm, setShowAddForm] = useState(true);
  const [sessionForm, setSessionForm] = useState({
    sessionName: "",
    sessionDescribtion: "",
    sessionDate: "",
    sessionStartTime: "",
    sessionEndTime: "",
    instructorId: "",
    sessionRoomId: "",
  });

  const [sessionsList, setSessionsList] = useState([]);

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionForm({
      ...sessionForm,
      [name]: value,
    });
  };

  const handleDropdownChange = (name, value) => {
    setSessionForm({
      ...sessionForm,
      [name]: value,
    });
  };

  const addSessionRow = () => {
    // validate the entered session

    const errors = validateRoundRow(sessionForm);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      // format keys arrengement
      //   const newSessionObject = {
      //     sessionName: sessionForm.sessionName,
      //     sessionDescription: sessionForm.sessionDescription,
      //     sessionDate: sessionForm.sessionDate,
      //     sessionStartTime: sessionForm.sessionStartTime,
      //     sessionEndTime: sessionForm.sessionEndTime,
      //     instructorId: sessionForm.instructorId,
      //     sessionRoomId: sessionForm.sessionRoomId,
      //   };
      const newSessionObject = {
        sessionName: `${sessionForm.sessionName}`,
        sessionDescription: `${sessionForm?.sessionDescription || "-"}`,
        sessionDate: `${sessionForm.sessionDate}`,
        sessionStartTime: `${sessionForm.sessionStartTime}`,
        sessionEndTime: `${sessionForm.sessionEndTime}`,
        instructorId: `${sessionForm.instructorId}`,
        sessionRoomId: `${sessionForm.sessionRoomId}`,
      };
      for (const key in newSessionObject) {
        if (newSessionObject.hasOwnProperty(key)) {
          console.log(`${key}: ${newSessionObject[key]}`);
        }
      }
      //   console.log(newSessionObject);
      // add it to sessions list
    }
  };

  //   useEffect(() => {
  //     console.log(sessionForm);
  //   }, [sessionForm]);
  return (
    <div className="add-one-by-one">
      <div className="header">
        <Button
          variant="outlined"
          color="success"
          disabled={showAddForm}
          startIcon={<AddIcon />} // Optional: add the icon if needed
          onClick={(e) => {
            setShowAddForm(true);
          }}
        >
          Add Session
        </Button>
      </div>

      {showAddForm && (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {/* First Row */}
            <Box sx={{ flex: "1 1 30%" }}>
              <TextField
                error={Boolean(formErrors?.sessionName)}
                helperText={formErrors?.sessionName}
                label="Session Name"
                name="sessionName"
                value={sessionForm?.sessionName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 30%" }}>
              <Autocomplete
                options={rooms}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(formErrors?.sessionRoomId)}
                    helperText={formErrors?.sessionRoomId}
                    {...params}
                    label="Room"
                    margin="normal"
                    fullWidth
                  />
                )}
                onChange={(e, value) =>
                  handleDropdownChange("sessionRoomId", value?.id)
                }
              />
            </Box>

            <Box sx={{ flex: "1 1 30%" }}>
              <TextField
                error={Boolean(formErrors?.sessionDate)}
                helperText={formErrors?.sessionDate}
                label="Session Date"
                name="sessionDate"
                type="date"
                value={sessionForm.sessionDate}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            {/* Second Row */}
            <Box sx={{ flex: "1 1 30%" }}>
              <TextField
                error={Boolean(formErrors?.sessionStartTime)}
                helperText={formErrors?.sessionStartTime}
                label="Start Time"
                name="sessionStartTime"
                type="time"
                value={sessionForm.sessionStartTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box sx={{ flex: "1 1 30%" }}>
              <TextField
                error={Boolean(formErrors?.sessionEndTime)}
                helperText={formErrors?.sessionEndTime}
                label="End Time"
                name="sessionEndTime"
                type="time"
                value={sessionForm.sessionEndTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box sx={{ flex: "1 1 30%" }}>
              <Autocomplete
                options={instructors}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(formErrors?.instructorId)}
                    helperText={formErrors?.instructorId}
                    {...params}
                    label="Instructor"
                    margin="normal"
                    fullWidth
                  />
                )}
                onChange={(e, value) =>
                  handleDropdownChange("instructorId", value?.id)
                }
              />
            </Box>
          </Box>
        </>
      )}

      {showAddForm && (
        <div className="sumbit-actions" style={{ marginTop: "10px" }}>
          <Button
            variant="text"
            color="error"
            onClick={(e) => {
              setShowAddForm(false);
            }}
          >
            Cancel
          </Button>

          <Button
            sx={{
              marginLeft: "20px",
            }}
            variant="contained"
            color="success"
            onClick={(e) => {
              addSessionRow();
              setShowAddForm(true);
            }}
            startIcon={<AddIcon />} // Optional: add the icon if needed
          >
            Add
          </Button>
        </div>
      )}

      <div className="added-sessions-list">list</div>
    </div>
  );
};

export default OneByOneSection;
