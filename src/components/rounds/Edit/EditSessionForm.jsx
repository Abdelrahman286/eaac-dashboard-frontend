import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../../styles/rounds.css";
// MUI

import {
  Tabs,
  Tab,
  Box,
  TextField,
  Autocomplete,
  Button,
  IconButton,
} from "@mui/material";

// icons
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";
// components
import FormButton from "../../FormButton";
import CustomIconButton from "../../CustomIconButton";
import LoadingSpinner from "../../../components/LoadingSpinner";

// Requests
import {
  EditRoundFn,
  getInstructorsFn,
  getRoomsFn,
  getSessionsFn,
  updateSessionFn,
} from "../../../requests/rounds";

// validations
import { validateEditSession } from "../../../utils/validateRounds";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const EditSessionForm = ({ session, onCancel }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (name, value) => {
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
    // "nameEn" : "Test Update Session",
    // "descriptionEn" : "Test Update Session Desc ",
    // "sessionDate" : "13/10/2024",
    // "startTime" : "7:00:00",
    // "endTime" : "7:30:00",
    // "roundId" : 32,
    // "instructorId" : 10,
    // "roomId" : 1,
    // const { BranchID, CourseID, InstructorID, RoomID, Name_en } = data;
    // const newObj = {
    //   id: [data?.id],
    //   nameEn: Name_en,
    //   branchId: BranchID?.id || "",
    //   roomId: RoomID?.id || "",
    //   courseId: CourseID?.id || "",
    //   instructorId: InstructorID?.id || "",
    // };
    // setFormData(newObj);
  }, []);

  // Edit Mutation
  const {
    mutate: editRound,
    isPending: editLoading,
    isError: isEditError,
    error,
  } = useMutation({
    onError: (error) => {
      //   console.log(error.responseError?.failed?.response?.msg);
      console.log("Error at editing Round data", error);
      showSnackbar("Faild to edit Round Data", "error");
    },
    mutationFn: EditRoundFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["round-pagination"]);
      queryClient.invalidateQueries(["round-list"]);
      showSnackbar("Round Edited Successfully", "success");
    },
  });

  const handleSubmit = (e) => {};

  const handleEditSession = () => {
    const errors = validateEditSession(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      //   editRound({
      //     reqBody: formData,
      //     token,
      //   });
    }
  };

  return (
    <div>
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

        <Button
          sx={{
            marginLeft: "20px",
          }}
          variant="contained"
          color="primary"
          onClick={(e) => {
            // addSessionRow();
            // setShowAddForm(true);
            handleEditSession();
          }}
        >
          Edit
        </Button>
      </Box>
    </div>
  );
};

export default EditSessionForm;
