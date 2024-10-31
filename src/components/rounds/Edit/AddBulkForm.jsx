import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../../styles/rounds.css";
import { Box, TextField, Autocomplete, Button, Checkbox } from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// icons
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// components
import FormButton from "../../FormButton";
import CircularProgress from "@mui/material/CircularProgress";
import ViewRoundsWithConflict from "../ViewRoundsWithConflict";

// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  convertDateFromDashToSlash,
  convertDateFormat,
} from "../../../utils/functions";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

// validations
import { validateAddBulkInEdit } from "../../../utils/validateRounds";

// requests
import { URL } from "../../../requests/main";
import { createSessionsFn } from "../../../requests/rounds";

// Days map
const daysOfWeek = [
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
];
const AddBulkForm = ({ mainFormData, handleGoBack, rooms, instructors }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [selectedDays, setSelectedDays] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isConflictExist, setIsConflictExist] = useState(false);
  const [localCheckData, setLocalCheckData] = useState(false);

  const handleInputChange = (e) => {
    setLocalCheckData(false);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDropdownChange = (name, value) => {
    setLocalCheckData(false);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // get all sessions with suggestions
  const {
    mutate: getSessionsWithConflicts,
    isPending: sessionsWithConflictLoading,
    data: sessionsWithConflicts,
  } = useMutation({
    onSuccess: (res) => {
      // console.log(res);
      setLocalCheckData(true);
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

      const response = await fetch(
        `${URL}/round/getSessionDateTimes`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // create round mutation
  const {
    mutate: sendSessionsData,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createSessionsFn,

    onSuccess: () => {
      console.log("new sessions added");
      queryClient.invalidateQueries(["roundSessions"]);

      handleGoBack();
      showSnackbar("Sessions Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Add New sessions", "error");
      //   console.log("Error at adding new Round", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit after generating sessions

    // if (!(sessionsWithConflicts?.length > 0)) return;

    const {
      sessionNameDynamic,
      instructorId,
      weekDays,
      roomId,
      sessionStartTime,
      sessionEndTime,
      endDate,
      startDate,
      ...rest
    } = formData;

    const dataObj = {
      startDate: convertDateFormat(startDate),
      endDate: convertDateFormat(endDate),
      sessionStartTime: `${sessionStartTime}:00`,
      sessionEndTime: `${sessionEndTime}:00`,
      roundId: mainFormData?.id,
      roomId,
      instructorId,
      branchId: mainFormData?.BranchID?.id,
      weekDays,
      sessionNameDynamic: sessionNameDynamic,
      sessionDescriptionDynamic: "...",
      sessionDinamicallyFlag: 1,
    };

    sendSessionsData({
      reqBody: dataObj,
      token,
      config: {
        isFormData: false,
      },
    });
  };

  const generateSessions = (e) => {
    e.preventDefault();
    const errors = validateAddBulkInEdit(formData);
    const {
      //   sessionNameDynamic,
      instructorId,
      roomId,
      weekDays,
      sessionStartTime,
      sessionEndTime,
      endDate,
      startDate,
      ...rest
    } = formData;

    const dataObj = {
      startDate: convertDateFromDashToSlash(startDate),
      endDate: convertDateFromDashToSlash(endDate),
      startTime: `${sessionStartTime}:00`,
      endTime: `${sessionEndTime}:00`,
      weekDays,
      roomId,
      instructorId,
      branchId: mainFormData?.BranchID?.id,
    };

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      getSessionsWithConflicts(dataObj);
    }
  };

  // check if there's conflict and assign it to a state
  useEffect(() => {
    if (sessionsWithConflicts?.length > 0) {
      let isConflict = false;
      sessionsWithConflicts.forEach((session) => {
        if (Array.isArray(session?.conflicts) && session.conflicts.length > 0) {
          isConflict = true;
        }
      });

      setIsConflictExist(isConflict);
    } else {
      setIsConflictExist(false);
    }
  }, [sessionsWithConflicts]);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          width: "100%",
        }}
      >
        {/* Second Row */}
        <Box sx={{ flex: "1 1 30%" }}>
          <TextField
            error={Boolean(formErrors?.sessionNameDynamic)}
            helperText={formErrors?.sessionNameDynamic}
            value={formData?.sessionNameDynamic || ""}
            onChange={handleInputChange}
            size="small"
            label="Session Name *"
            name="sessionNameDynamic"
            fullWidth
            margin="normal"
          />
        </Box>
        <Box sx={{ flex: "1 1 30%" }}>
          <TextField
            error={Boolean(formErrors?.sessionStartTime)}
            value={formData.sessionStartTime || ""}
            helperText={formErrors?.sessionStartTime}
            onChange={handleInputChange}
            label="Start Time *"
            type="time"
            size="small"
            name="sessionStartTime"
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
            value={formData.sessionEndTime || ""}
            helperText={formErrors?.sessionEndTime}
            onChange={handleInputChange}
            size="small"
            label="End Time *"
            name="sessionEndTime"
            type="time"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box sx={{ flex: "1 1 30%" }}>
          <TextField
            error={Boolean(formErrors?.startDate)}
            value={formData.startDate || ""}
            helperText={formErrors?.startDate}
            onChange={handleInputChange}
            label="Start Date *"
            name="startDate"
            type="date"
            size="small"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box sx={{ flex: "1 1 30%" }}>
          <TextField
            error={Boolean(formErrors?.endDate)}
            helperText={formErrors?.endDate}
            value={formData.endDate || ""}
            onChange={handleInputChange}
            label="End Date *"
            name="endDate"
            type="date"
            size="small"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box
          style={{
            width: "100%",
            display: "flex",
            gap: 4,
            flexDirection: "row",
          }}
        >
          {/* Room and instructor fields  */}

          <Autocomplete
            sx={{ flex: 1 }}
            value={rooms.find((item) => item.id == formData?.roomId) || null}
            getOptionLabel={(option) => {
              return `${option?.Name_en} ( ${option?.RoomCode})`;
            }}
            size="small"
            options={rooms}
            renderInput={(params) => (
              <TextField
                error={Boolean(formErrors?.roomId)}
                helperText={formErrors?.roomId}
                {...params}
                label="Room *"
                margin="normal"
                fullWidth
              />
            )}
            onChange={(e, value) => {
              handleDropdownChange("roomId", value?.id);
            }}
          />

          <Autocomplete
            sx={{ flex: 1 }}
            value={
              instructors.find(
                (item) => item.InstructorID == formData?.instructorId
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

        <Box
          sx={{
            flex: "1 1 30%",
          }}
        >
          <Autocomplete
            sx={{ marginTop: "16px", width: "100%" }}
            size="small"
            fullWidth
            multiple
            options={daysOfWeek}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            value={selectedDays || []}
            onChange={(event, newValue) => {
              setSelectedDays(newValue);
              setFormData({
                ...formData,
                weekDays: newValue.map((day) => day.value),
              });
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                  {option.label}
                </li>
              );
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                error={Boolean(formErrors?.weekDays)}
                helperText={formErrors?.weekDays}
                {...params}
                label="Days *"
                placeholder="Days"
              />
            )}
          />
        </Box>
      </Box>

      <div
        className="sumbit-actions"
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          sx={{
            marginLeft: "20px",
          }}
          variant="contained"
          color="success"
          onClick={generateSessions}
          startIcon={<DownloadForOfflineIcon />}
          disabled={sessionsWithConflictLoading}
        >
          {sessionsWithConflictLoading ? (
            <CircularProgress size={24} sx={{ marginRight: 1 }} />
          ) : (
            "Generate Sessions"
          )}
        </Button>
      </div>

      <div className="added-sessions-list">
        <ViewRoundsWithConflict
          data={sessionsWithConflicts || []}
          mainFormData={mainFormData}
        ></ViewRoundsWithConflict>
      </div>

      {!isConflictExist && localCheckData ? (
        <div className="submit-form">
          <FormButton
            style={{ width: "200px" }}
            isLoading={addLoading}
            onClick={handleSubmit}
            buttonText="Submit"
            className="main-btn form-add-btn"
            type="submit"
          />
        </div>
      ) : (
        ""
      )}

      {isConflictExist && localCheckData ? (
        <div className="submit-form">
          <p className="invalid-message" style={{ padding: "4px" }}>
            Please be aware that some sessions may conflict with others, which
            could lead to potential issues.
          </p>
          <FormButton
            style={{ width: "200px" }}
            isLoading={addLoading}
            onClick={handleSubmit}
            buttonText="Submit Anyway"
            className="main-btn form-add-btn"
            type="submit"
          />
        </div>
      ) : (
        ""
      )}
      {isAddError && (
        <p className="invalid-message">
          {addError?.responseError?.failed?.response?.msg ||
            "An Error Occured, Please Try Again"}
        </p>
      )}
    </div>
  );
};

export default AddBulkForm;
