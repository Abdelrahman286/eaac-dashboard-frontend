import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/rounds.css";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import "../../styles/rounds.css";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// icons
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// components
import FormButton from "../FormButton";
import CircularProgress from "@mui/material/CircularProgress";
import ViewRoundsWithConflict from "./ViewRoundsWithConflict";

// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  convertDateFromDashToSlash,
  convertDateFormat,
} from "../../utils/functions";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

// validations
import { validateBulkSuggestion } from "../../utils/validateRounds";

// requests
import { URL } from "../../requests/main";
import { createRoundFn } from "../../requests/rounds";

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
const AddBulkSection = ({ mainFormData, onClose }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [selectedDays, setSelectedDays] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [isConflictExist, setIsConflictExist] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //   Add the data entered in the previous form
  useEffect(() => {
    const newObj = {
      nameAr: mainFormData.nameEn,
      nameEn: mainFormData.nameEn,
      numberOfSessions: 27,
      courseId: mainFormData.courseId,
      roomId: mainFormData.roomId,
      instructorId: mainFormData.instructorId,
      branchId: mainFormData.branchId,
      roundCode: mainFormData.nameEn,
      sessionDinamicallyFlag: 1,
      sessionDescriptionDynamic: "...",
    };

    setFormData({ ...newObj, ...formData });
  }, [mainFormData]);

  // get all sessions with suggestions
  const {
    mutate: getSessionsWithConflicts,
    isPending: sessionsWithConflictLoading,
    data: sessionsWithConflicts,
  } = useMutation({
    onSuccess: (res) => {},
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
    mutate: sendRoundData,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createRoundFn,

    onSuccess: () => {
      queryClient.invalidateQueries(["round-pagination"]);
      queryClient.invalidateQueries(["round-list"]);
      onClose();
      showSnackbar("Round Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Add New Round", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit after generating sessions
    if (sessionsWithConflicts?.length > 0) {
      // { reqBody, token, config }
      const { startDate, endDate, sessionStartTime, sessionEndTime, ...rest } =
        formData;

      // format time
      rest.sessionStartTime = `${sessionStartTime}:00`;
      rest.sessionEndTime = `${sessionEndTime}:00`;

      // format date
      // Assuming startDate and endDate are in YYYY-mm-dd format
      rest.startDate = convertDateFormat(startDate);
      rest.endDate = convertDateFormat(endDate);

      // attendance limit
      rest.attendancePercentage = mainFormData?.attendancePercentage || "0";

      sendRoundData({
        reqBody: rest,
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  const generateSessions = (e) => {
    e.preventDefault();
    const errors = validateBulkSuggestion(formData);
    const {
      nameAr,
      nameEn,
      numberOfSessions,
      courseId,
      roundCode,
      sessionNameDynamic,
      sessionStartTime,
      sessionEndTime,

      startDate,
      endDate,
      ...rest
    } = formData;

    // format time
    rest.startTime = `${sessionStartTime}:00`;
    rest.endTime = `${sessionEndTime}:00`;

    // format date
    rest.startDate = convertDateFromDashToSlash(startDate);
    rest.endDate = convertDateFromDashToSlash(endDate);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      getSessionsWithConflicts(rest);
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
    <div className="add-bulk-section">
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

      <div className="sumbit-actions" style={{ marginTop: "10px" }}>
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

      {!isConflictExist && (
        <div className="submit-form">
          <FormButton
            isLoading={addLoading}
            onClick={handleSubmit}
            buttonText="Submit"
            className="main-btn form-add-btn"
            type="submit"
          />
        </div>
      )}

      {isConflictExist && (
        <div className="submit-form">
          <p className="invalid-message" style={{ padding: "4px" }}>
            Please be aware that some sessions may conflict with others, which
            could lead to potential issues.
          </p>
          <FormButton
            isLoading={addLoading}
            onClick={handleSubmit}
            buttonText="Submit Anyway"
            className="main-btn form-add-btn"
            type="submit"
          />
        </div>
      )}

      {isAddError ? (
        <p className="invalid-message">
          {addError?.responseError?.failed?.response?.msg ||
            "An Error Occured, please try again"}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddBulkSection;
