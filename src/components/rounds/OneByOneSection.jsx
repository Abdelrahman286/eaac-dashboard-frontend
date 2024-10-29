import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Tabs, Tab, Box, TextField, Autocomplete, Button } from "@mui/material";
import "../../styles/rounds.css";

// components
import FormButton from "../FormButton";

// icons
import AddIcon from "@mui/icons-material/Add";

// validation

import { validateRoundRow } from "../../utils/validateRounds";
import FormSessionsTable from "./FormSessionsTable-old";
import OneByOneSessionsList from "./OneByOneSessionsList";

// utils
import { URL } from "../../requests/main";
import {
  convertDateFromDashToSlash,
  convertDateFormat,
  formatDate,
  formatDate2,
} from "../../utils/functions";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
const OneByOneSection = ({ mainFormData, onClose, instructors, rooms }) => {
  const { token } = useContext(UserContext);
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(true);
  const [sessionForm, setSessionForm] = useState({
    sessionName: "",
    sessionDescription: "",
    sessionDate: "",
    sessionStartTime: "",
    sessionEndTime: "",
    instructorId: "",
    sessionRoomId: "",
  });

  const [sessionsList, setSessionsList] = useState([]);

  // here we add room and instructor name to view them in the table
  const [sessionsView, setSessionsView] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [conflictsList, setConflictsList] = useState([]);

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

  // initial select for rooms and instructors
  useEffect(() => {
    setSessionForm({
      sessionName: "",
      sessionDescription: "",
      sessionDate: "",
      sessionStartTime: "",
      sessionEndTime: "",
      instructorId: `${mainFormData?.instructorId || " "}`,
      sessionRoomId: `${mainFormData?.roomId || " "}`,
    });
  }, [mainFormData.instructorId, mainFormData.roomId]);

  const addSessionRow = () => {
    // validate the entered session
    const errors = validateRoundRow(sessionForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      const newSessionsArray = [...sessionsList, sessionForm];

      const sortedSessions = newSessionsArray.sort((a, b) => {
        return new Date(a.sessionDate) - new Date(b.sessionDate);
      });

      // sort sessions based on date
      setSessionsList(sortedSessions);
      // clear session Add form except roomId & instructorId
      setSessionForm((prevState) => ({
        ...prevState,
        sessionName: "",
        sessionDescription: "",
        sessionDate: "",
      }));
    }
  };

  // Formate Session List to view instructor and Room Id Names
  useEffect(() => {
    const newList = sessionsList.map((session) => {
      if (session?.sessionRoomId && session?.instructorId) {
        const matchingRoom = rooms.find(
          (room) => room.id == session.sessionRoomId
        );

        const matchingInstrctor = instructors.find(
          (instructor) => instructor.InstructorID == session.instructorId
        );

        return {
          ...session,
          sessionRoomId: matchingRoom || session.sessionRoomId,
          instructorId: matchingInstrctor || session.instructorId,
        };
      }
      return session;
    });

    setSessionsView(newList);
  }, [sessionsList, rooms, instructors]);

  const handleDeleteRow = (index) => {
    setSessionsList((prevSessionsList) =>
      prevSessionsList.filter((_, i) => i !== index)
    );
  };

  // send sessions data
  const {
    mutate: sendSessions,
    isPending: addLoading,
    data: sessionFetchedData,
    error,
    isError,
  } = useMutation({
    onSuccess: (res) => {
      console.log("new round added");
      queryClient.invalidateQueries(["round-pagination"]);
      queryClient.invalidateQueries(["round-list"]);
      onClose();
      showSnackbar("Round Added Successfully", "success");
    },
    onError: (error) => {
      // Access the parsed error details here
      console.log("Error at adding new Round with one by one sessions");
      //   console.log(error.responseData?.failed?.response);
      setConflictsList(error.responseData?.failed?.response?.data);
    },
    mutationFn: async (reqObj) => {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": true,
          "X-Security-Key": "66d5b04289662",
        },
        body: JSON.stringify(reqObj),
      };

      const response = await fetch(`${URL}/round/createRound1`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error("Network response was not ok");
        error.responseData = errorData;
        throw error;
      }
      return response.json();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newObj = {
      nameAr: mainFormData.nameEn,
      nameEn: mainFormData.nameEn,
      numberOfSessions: 27,
      courseId: mainFormData.courseId,
      roomId: mainFormData.roomId,
      instructorId: mainFormData.instructorId,
      branchId: mainFormData.branchId,
      roundCode: mainFormData.nameEn,
      sessionDinamicallyFlag: 0,
    };

    const formattedSessionList = sessionsList.map((session) => {
      const {
        sessionName,
        sessionDescription,
        sessionDate,
        sessionStartTime,
        sessionEndTime,
        instructorId,
        sessionRoomId,

        ...rest
      } = session;
      return {
        ...session,
        startTime: `${sessionStartTime}:00`,
        endTime: `${sessionEndTime}:00`,
        sessionDate: convertDateFormat(sessionDate),
        nameEn: sessionName,
        descriptionEn: sessionDescription || "-",
        roomId: sessionRoomId,
        instructorId: instructorId,
      };
    });

    newObj.sessions = formattedSessionList;

    const { firstSessionDate, lastSessionDate } = sessionsList.reduce(
      (acc, curr) => {
        // Ensure curr.sessionDate is a valid date string
        if (!curr.sessionDate) {
          console.warn("Invalid sessionDate:", curr.sessionDate);
          return acc; // Skip invalid entries
        }

        const currDate = new Date(curr.sessionDate);

        // Check for valid date
        if (isNaN(currDate.getTime())) {
          console.warn("Invalid Date encountered:", curr.sessionDate);
          return acc; // Skip invalid dates
        }

        // Update firstSessionDate if the current date is earlier
        if (currDate < acc.firstSessionDate || acc.firstSessionDate === null) {
          acc.firstSessionDate = currDate;
        }

        // Update lastSessionDate if the current date is later
        if (currDate > acc.lastSessionDate || acc.lastSessionDate === null) {
          acc.lastSessionDate = currDate;
        }

        return acc;
      },
      {
        firstSessionDate: null, // Initial value for the earliest date
        lastSessionDate: null, // Initial value for the latest date
      }
    );

    newObj.startDate = formatDate2(firstSessionDate);
    newObj.endDate = formatDate2(lastSessionDate);

    sendSessions(newObj);
  };

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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              width: "100%",
            }}
          >
            {/* First Row */}
            <Box sx={{ flex: "1 1 30%" }}>
              <TextField
                size="small"
                error={Boolean(formErrors?.sessionName)}
                helperText={formErrors?.sessionName}
                label="Session Name *"
                name="sessionName"
                value={sessionForm?.sessionName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 30%" }}>
              <Autocomplete
                value={
                  rooms.find((item) => item.id == sessionForm?.sessionRoomId) ||
                  null
                }
                getOptionLabel={(option) => {
                  return `${option?.Name_en} ( ${option?.RoomCode})`;
                }}
                size="small"
                options={rooms}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(formErrors?.sessionRoomId)}
                    helperText={formErrors?.sessionRoomId}
                    {...params}
                    label="Room *"
                    margin="normal"
                    fullWidth
                  />
                )}
                onChange={(e, value) => {
                  handleDropdownChange("sessionRoomId", value?.id);
                }}
              />
            </Box>

            <Box sx={{ flex: "1 1 30%" }}>
              <TextField
                size="small"
                error={Boolean(formErrors?.sessionDate)}
                helperText={formErrors?.sessionDate}
                label="Session Date *"
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
                size="small"
                error={Boolean(formErrors?.sessionStartTime)}
                helperText={formErrors?.sessionStartTime}
                label="Start Time *"
                type="time"
                value={sessionForm.sessionStartTime}
                name="sessionStartTime"
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
                size="small"
                error={Boolean(formErrors?.sessionEndTime)}
                helperText={formErrors?.sessionEndTime}
                label="End Time *"
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
                value={
                  instructors.find(
                    (item) => item.InstructorID == sessionForm?.instructorId
                  ) || null
                }
                size="small"
                options={instructors}
                getOptionLabel={(option) => option?.Name || ""}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(formErrors?.instructorId)}
                    helperText={formErrors?.instructorId}
                    {...params}
                    label="Instructor *"
                    margin="normal"
                    fullWidth
                  />
                )}
                onChange={(e, value) => {
                  handleDropdownChange("instructorId", value?.InstructorID);
                }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <TextField
                size="small"
                value={sessionForm.sessionDescription}
                label="Description"
                multiline
                rows={2} // Specifies the number of rows (height of the text area)
                variant="outlined" // You can use "filled" or "standard" as well
                fullWidth
                placeholder="Session Describtion"
                name="sessionDescription"
                onChange={handleInputChange}
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

      <div className="added-sessions-list">
        <OneByOneSessionsList
          data={sessionsView}
          handleDeleteRow={handleDeleteRow}
          conflictArray={conflictsList}
        ></OneByOneSessionsList>
      </div>

      {sessionsList?.length > 0 ? (
        <div className="submit-form">
          <FormButton
            isLoading={addLoading}
            onClick={handleSubmit}
            buttonText="Submit"
            className="main-btn form-add-btn"
          />
        </div>
      ) : (
        ""
      )}

      {isError ? (
        <p className="invalid-message">
          {error.responseData?.failed?.response?.msg}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default OneByOneSection;
