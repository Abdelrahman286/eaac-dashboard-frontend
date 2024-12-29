import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../../styles/rounds.css";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// Requests
import {
  getInstructorsFn,
  getRoomsFn,
  checkSessionConflictFn,
  updateSessionFn,
} from "../../../requests/rounds";

// validations
import { validateEditSession } from "../../../utils/validateRounds";
import {
  convertDateFromDashToSlash,
  getConflictString,
  ensureSecondsInTime,
  convertDateFormat,
} from "../../../utils/functions";
// utils
import { getDataForTableRows } from "../../../utils/tables";

// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const EditSessionForm = ({ session, onCancel, roundId }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isConflictExist, setIsConflictExist] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");
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

  // --------- request data for dropdowns -----------
  //----- rooms
  const { data: roomsList, isLoading: roomsLoading } = useQuery({
    queryFn: () => {
      return getRoomsFn(
        {
          numOfElements: "9000",
        },
        token
      );
    },

    queryKey: ["rooms"],
  });
  const rooms = getDataForTableRows(roomsList?.success?.response?.data);

  //----- Instructors
  const { data: instructorsList, isLoading: instructorsLoading } = useQuery({
    queryFn: () => {
      return getInstructorsFn(
        {
          numOfElements: "9000",
        },
        token
      );
    },

    queryKey: ["instructors"],
  });
  const instructors = getDataForTableRows(
    instructorsList?.success?.response?.data
  );

  // initial data filling
  useEffect(() => {
    const {
      Description_en,
      EndTime,
      InstructorID,
      RoomID,
      SessionDate,
      StartTime,
      Name_en,
      BranchID,
    } = session;

    const intialFill = {
      nameEn: Name_en,
      sessionDate: SessionDate.split(" ")[0],
      startTime: StartTime.split(" ")[1],
      endTime: EndTime.split(" ")[1],
      roomId: RoomID?.id,
      instructorId: InstructorID?.id,
      descriptionEn: Description_en,
      branchId: BranchID?.id,
    };

    setFormData(intialFill);
  }, []);

  // Check Request
  const {
    mutate: checkSessionConflict,
    isPending: checkLoading,
    isError: isCheckError,
    error: checkError,
    data: checkData,
  } = useMutation({
    onError: (error) => {
      //   console.log("Error at editing Round data", error);
      //   showSnackbar("Faild to edit Round Data", "error");
    },
    mutationFn: checkSessionConflictFn,
    onSuccess: () => {
      setLocalCheckData(true);
    },
  });

  // check if there's conflict and assign it to a state
  useEffect(() => {
    if (checkData?.length > 0) {
      let isConflict = false;
      checkData.forEach((session) => {
        if (Array.isArray(session?.conflicts) && session.conflicts.length > 0) {
          isConflict = true;

          const conflictmsg = getConflictString(session?.conflicts);
          setConflictMessage(conflictmsg);
        }
      });
      setIsConflictExist(isConflict);
    } else {
      setIsConflictExist(false);
    }
  }, [checkData]);

  // Edit Mutation
  const {
    mutate: editSession,
    isPending: editLoading,
    isError: isEditError,
    error,
  } = useMutation({
    onError: (error) => {
      //   console.log(error.responseError?.failed?.response?.msg);
      //   console.log("Error at editing Session data", error);
      showSnackbar("Faild to edit Session Data", "error");
    },
    mutationFn: updateSessionFn,
    onSuccess: (res) => {
      onCancel();
      queryClient.invalidateQueries(["roundSessions"]);
      showSnackbar("Session Data Edited Successfully", "success");
    },
  });

  const handleCheckConflict = () => {
    const errors = validateEditSession(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      // make the check request

      // the keys for check request
      const dataToCheckConflict = {
        startDate: convertDateFromDashToSlash(formData?.sessionDate),
        endDate: convertDateFromDashToSlash(formData?.sessionDate),
        startTime: ensureSecondsInTime(formData?.startTime),
        endTime: ensureSecondsInTime(formData?.endTime),
        roomId: formData?.roomId,
        instructorId: formData.instructorId,
        branchId: formData?.branchId,
      };

      checkSessionConflict({
        reqBody: {
          sessions: [dataToCheckConflict],
        },
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  const handlSubmitEdit = () => {
    const errors = validateEditSession(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      // the keys for check request
      const dataToSubmit = {
        nameEn: formData.nameEn,
        descriptionEn: formData.descriptionEn,
        sessionDate: convertDateFormat(formData?.sessionDate), // dd/mm/yyyy
        startTime: ensureSecondsInTime(formData?.startTime),
        endTime: ensureSecondsInTime(formData?.endTime),
        roundId: roundId,
        instructorId: formData?.instructorId,
        roomId: formData.roomId,
        branchId: formData?.branchId,

        // additional data to pass the request
        nameAr: "",
        descriptionAr: "",
        statusId: null,
      };

      editSession({
        reqBody: {
          id: [session.id],
          session: [dataToSubmit],
        },
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  return (
    <div className="edit-session-inline-form">
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          error={Boolean(formErrors?.nameEn)}
          helperText={formErrors?.nameEn}
          value={formData?.nameEn || ""}
          onChange={handleInputChange}
          size="small"
          label="Session Name *"
          name="nameEn"
          fullWidth
          margin="normal"
        />
        <TextField
          error={Boolean(formErrors?.sessionDate)}
          value={formData.sessionDate || ""}
          helperText={formErrors?.sessionDate}
          onChange={handleInputChange}
          label="Date *"
          name="sessionDate"
          type="date"
          size="small"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          error={Boolean(formErrors?.startTime)}
          value={formData.startTime || ""}
          helperText={formErrors?.startTime}
          onChange={handleInputChange}
          label="Start Time *"
          type="time"
          size="small"
          name="startTime"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          error={Boolean(formErrors?.endTime)}
          value={formData.endTime || ""}
          helperText={formErrors?.endTime}
          onChange={handleInputChange}
          size="small"
          label="End Time *"
          name="endTime"
          type="time"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
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

      <TextField
        error={Boolean(formErrors?.descriptionEn)}
        helperText={formErrors?.descriptionEn}
        value={formData?.descriptionEn || ""}
        onChange={handleInputChange}
        size="small"
        label="Description "
        name="descriptionEn"
        fullWidth
        rows={2}
        margin="normal"
      />

      {isConflictExist && (
        <p
          style={{
            maxWidth: "320px",
            whiteSpace: "pre-line",
          }}
          className="invalid-message"
        >
          {conflictMessage}
        </p>
      )}

      {/*  Add server error here */}

      {isEditError && (
        <p className="invalid-message">
          {error?.responseError?.failed?.response?.msg ||
            "An Error Occured, please try again"}
        </p>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 1,
        }}
      >
        <Button
          variant="text"
          onClick={(e) => {
            onCancel();
          }}
        >
          Cancel
        </Button>

        {/* case : 1 check data exist and conflict */}

        {localCheckData && isConflictExist ? (
          <Button
            sx={{
              marginLeft: "20px",
            }}
            variant="contained"
            color="primary"
            onClick={(e) => {
              handlSubmitEdit();
            }}
          >
            {editLoading ? (
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
              handlSubmitEdit();
            }}
            disabled={editLoading} // Disable the button when loading
          >
            {editLoading ? (
              <CircularProgress
                size={24} // Adjust the spinner size as needed
                color="inherit" // Inherit color from the button's color
              />
            ) : (
              "Edit"
            )}
          </Button>
        ) : (
          ""
        )}

        {/* case : 3 check data does not exist */}

        {!localCheckData ? (
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
              <CircularProgress
                size={24} // Adjust the spinner size as needed
                color="inherit" // Inherit color from the button's color
              />
            ) : (
              "Edit"
            )}
          </Button>
        ) : (
          ""
        )}
      </Box>
    </div>
  );
};

export default EditSessionForm;
