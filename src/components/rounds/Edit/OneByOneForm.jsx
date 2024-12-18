import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// styles
import "../../../styles/rounds.css";
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";

// icons
import AddIcon from "@mui/icons-material/Add";

// validation
import { validateRoundRow } from "../../../utils/validateRounds";
import OneByOneSessionsList from "../OneByOneSessionsList";

// utils
import { URL } from "../../../requests/main";
import {
  convertDateFromDashToSlash,
  ensureSecondsInTime,
  convertDateFormat,
  formatDate2,
} from "../../../utils/functions";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// Requests
import {
  checkSessionConflictFn,
  createSessionsFn,
} from "../../../requests/rounds";

const OneByOneForm = ({ mainFormData, handleGoBack, rooms, instructors }) => {
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
  const [isConflictExist, setIsConflictExist] = useState(false);
  const [conflictsList, setConflictsList] = useState([]);
  const [localCheckData, setLocalCheckData] = useState(false);

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
      setLocalCheckData(false);
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

  const handleDeleteRow = (index) => {
    setLocalCheckData(false);
    setSessionsList((prevSessionsList) =>
      prevSessionsList.filter((_, i) => i !== index)
    );
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
  }, [sessionsList]);

  // check sessions conflicts
  const {
    mutate: checkSessionConflict,
    isPending: checkLoading,
    isError: isCheckError,
    error: checkError,
    data: checkData,
  } = useMutation({
    onError: (error) => {
      console.log("error at checking sessions conflicts ");
    },
    mutationFn: checkSessionConflictFn,
    onSuccess: (res) => {
      setConflictsList(res);
      setLocalCheckData(true);
    },
  });

  // check if there's conflict and assign it to a state
  useEffect(() => {
    if (checkData?.length > 0) {
      const isConflict = checkData.some(
        (session) =>
          Array.isArray(session?.conflicts) && session.conflicts.length > 0
      );
      setIsConflictExist(isConflict);
    } else {
      setIsConflictExist(false);
    }
  }, [checkData]);

  const handleCheckConflict = () => {
    if (Array.isArray(sessionsList) && sessionsList.length > 0) {
      const dataToCheckConflict = sessionsList.map((ele) => {
        return {
          startDate: convertDateFromDashToSlash(ele?.sessionDate),
          endDate: convertDateFromDashToSlash(ele?.sessionDate),
          startTime: ensureSecondsInTime(ele?.sessionStartTime),
          endTime: ensureSecondsInTime(ele?.sessionEndTime),
          roomId: ele?.sessionRoomId,
          instructorId: ele?.instructorId,
          branchId: mainFormData?.BranchID?.id,
        };
      });

      checkSessionConflict({
        reqBody: {
          sessions: dataToCheckConflict,
        },
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  // send sessions data
  const {
    mutate: sendSessions,
    isPending: addLoading,
    data: sessionFetchedData,
    error: addError,
    isError: isAddError,
  } = useMutation({
    onSuccess: (res) => {
      queryClient.invalidateQueries(["roundSessions"]);
      handleGoBack();
      showSnackbar("Sessions Added Successfully", "success");
    },
    onError: (error) => {
      //   console.log(error);
      console.log("Error at adding new sessions ");
    },
    mutationFn: createSessionsFn,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newObj = {
      nameAr: mainFormData?.Name_ar,
      nameEn: mainFormData?.Name_en,
      numberOfSessions: mainFormData?.NumberOfSessions,
      courseId: mainFormData?.CourseID?.id,
      roomId: mainFormData?.RoomID?.id,
      instructorId: mainFormData?.InstructorID?.id,
      branchId: mainFormData?.BranchID?.id,
      roundCode: mainFormData?.RoundCode,
      sessionDinamicallyFlag: 0,
      roundId: mainFormData?.id,
    };

    const formattedSessionList = sessionsList.map((session) => {
      console.log(mainFormData);
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
        nameEn: sessionName,
        startTime: `${sessionStartTime}:00`,
        endTime: `${sessionEndTime}:00`,
        sessionDate: convertDateFormat(sessionDate),
        descriptionEn: sessionDescription || "-",
        roomId: sessionRoomId,
        instructorId: instructorId,
        roundId: mainFormData?.id,
        branchId: mainFormData?.BranchID?.id,
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

    // BUG in the API where it's not needed
    // newObj.weekDays = ["monday", "Friday", "thursday"];

    sendSessions({
      reqBody: newObj,
      token,
      config: {
        isFormData: false,
      },
    });
  };
  return (
    <div>
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
                    rooms.find(
                      (item) => item.id == sessionForm?.sessionRoomId
                    ) || null
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

        {/* case : 1 check data exist and conflict */}

        <Box style={{ padding: "20px 0px" }}>
          {localCheckData && isConflictExist ? (
            <Button
              sx={{
                marginLeft: "20px",
              }}
              variant="contained"
              color="primary"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              {addLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Accept Conflict"
              )}
            </Button>
          ) : (
            ""
          )}

          {/* case : 2 check data exist and there's no conflict */}

          {localCheckData && !isConflictExist ? (
            <Button
              sx={{
                marginLeft: "20px",
              }}
              variant="contained"
              color="success"
              onClick={(e) => {
                handleSubmit(e);
              }}
              disabled={addLoading}
            >
              {addLoading ? (
                <CircularProgress
                  size={24} // Adjust the spinner size as needed
                  color="inherit" // Inherit color from the button's color
                />
              ) : (
                "Add Sessions"
              )}
            </Button>
          ) : (
            ""
          )}

          {/* case : 3 check data does not exist */}

          {!localCheckData && sessionsList?.length !== 0 ? (
            <Button
              sx={{
                marginLeft: "20px",
              }}
              variant="contained"
              color="primary"
              onClick={(e) => {
                handleCheckConflict();
              }}
            >
              {checkLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Sessions"
              )}
            </Button>
          ) : (
            ""
          )}
        </Box>
        {isAddError ? (
          <p className="invalid-message">
            {addError?.responseError?.failed?.response?.msg ||
              "An Error Occured, Please Try Again"}
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default OneByOneForm;
