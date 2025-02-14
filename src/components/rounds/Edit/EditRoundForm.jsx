import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../../styles/rounds.css";
// MUI
import { Box, TextField, Autocomplete, IconButton } from "@mui/material";

// icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";
// components
import FormButton from "../../FormButton";

// Requests
import {
  EditRoundFn,
  getBranchesFn,
  getCoursesFn,
  getInstructorsFn,
  getRoomsFn,
} from "../../../requests/rounds";

// validations
import { validateEditRound } from "../../../utils/requestValidations";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import { convertDateFormat } from "../../../utils/functions";
// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const EditRoundForm = ({ data, onClose }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --------- request data for dropdowns -----------
  //----- branches
  const { data: branchesList, isLoading: branchesLoading } = useQuery({
    queryFn: () => {
      return getBranchesFn(
        {
          numOfElements: "2000",
          companyId: "1",
        },
        token
      );
    },

    queryKey: ["branches"],
  });
  const branches = getDataForTableRows(branchesList?.success?.response?.data);

  //----- courses
  const { data: coursesList, isLoading: coursesLoading } = useQuery({
    queryFn: () => {
      return getCoursesFn(
        {
          numOfElements: "9000",
        },
        token
      );
    },

    queryKey: ["courses"],
  });
  const courses = getDataForTableRows(coursesList?.success?.response?.data);

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
      BranchID,
      CourseID,
      InstructorID,
      RoomID,
      Name_en,
      AttendancePercentage,
      StartDate,
      EndDate,
    } = data;
    const newObj = {
      id: [data?.id],
      nameEn: Name_en,
      branchId: BranchID?.id || "",
      roomId: RoomID?.id || "",
      courseId: CourseID?.id || "",
      instructorId: InstructorID?.id || "",
      attendancePercentage: AttendancePercentage || "",
      //   startDate: StartDate.split(" ")[0],
      //   endDate: EndDate.split(" ")[0],
    };

    setFormData(newObj);
  }, []);

  // Edit Mutation
  const {
    mutate: editRound,
    isPending: editLoading,
    isError: isEditError,
    error,
  } = useMutation({
    onError: (error) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateEditRound(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      const newObj = {
        ...formData,
        // startDate: convertDateFormat(formData?.startDate),
        // endDate: convertDateFormat(formData?.endDate),
      };

      editRound({
        reqBody: newObj,
        token,
      });
    }
  };
  return (
    <div className="edit-round">
      <form>
        <div className="round-form">
          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  id="nameEn"
                  name="nameEn"
                  onChange={handleFormChange}
                  error={Boolean(formErrors?.nameEn)}
                  helperText={formErrors?.nameEn}
                  value={formData?.nameEn || ""}
                  label="Round Name *"
                />

                <Autocomplete
                  loading={branchesLoading}
                  value={
                    branches.find((branch) => branch.id == formData.branchId) ||
                    null
                  }
                  options={branches}
                  getOptionLabel={(option) => option?.Name_en}
                  onChange={(e, value) =>
                    setFormData({
                      ...formData,
                      branchId: value ? value.id : null,
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      id="branchId"
                      error={Boolean(formErrors?.branchId)}
                      helperText={formErrors?.branchId}
                      {...params}
                      label="Branch *"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  )}
                />

                <Autocomplete
                  loading={roomsLoading}
                  value={
                    rooms.find((room) => room.id == formData.roomId) || null
                  }
                  options={rooms}
                  getOptionLabel={(option) => {
                    //   return `${option?.Name_en} | ${option?.RoomCode}`;\
                    return `${option?.Name_en} ( ${option?.RoomCode})`;
                    //   return ` ${option?.RoomCode}`;
                  }}
                  onChange={(e, value) =>
                    setFormData({
                      ...formData,
                      roomId: value ? value.id : null,
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      id="roomId"
                      error={Boolean(formErrors?.roomId)}
                      helperText={formErrors?.roomId}
                      {...params}
                      label="Room *"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  )}
                />
                {/* edit start date */}
                {/* <TextField
                  value={formData?.startDate || ""}
                  id="startDate"
                  name="startDate"
                  onChange={handleFormChange}
                  size="small"
                  error={Boolean(formErrors?.startDate)}
                  helperText={formErrors?.startDate}
                  label="Start Date *"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                /> */}
              </Box>

              {/* Right Side */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Course Id */}
                <Autocomplete
                  loading={coursesLoading}
                  value={
                    courses.find((course) => course.id == formData.courseId) ||
                    null
                  }
                  options={courses}
                  getOptionLabel={(option) => option?.Name_en}
                  onChange={(e, value) =>
                    setFormData({
                      ...formData,
                      courseId: value ? value.id : null,
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      id="courseId"
                      error={Boolean(formErrors?.courseId)}
                      helperText={formErrors?.courseId}
                      {...params}
                      label="Course *"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  )}
                />
                <Autocomplete
                  loading={instructorsLoading}
                  value={
                    formData?.instructorId
                      ? instructors.find(
                          (instructor) =>
                            instructor?.InstructorID == formData.instructorId
                        ) || null
                      : null
                  }
                  options={instructors}
                  getOptionLabel={(option) => option?.Name}
                  onChange={(e, value) => {
                    setFormData({
                      ...formData,
                      instructorId: value ? value.InstructorID : null,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      id="instructorId"
                      error={Boolean(formErrors?.instructorId)}
                      helperText={formErrors?.instructorId}
                      {...params}
                      label="Instructor *"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  )}
                />
                {/* attendancePercentage */}
                <TextField
                  id="attendancePercentage"
                  onChange={handleFormChange}
                  error={Boolean(formErrors?.attendancePercentage)}
                  helperText={formErrors?.attendancePercentage}
                  value={formData?.attendancePercentage || ""}
                  name="attendancePercentage"
                  label="Attendace Percentage Limit"
                  type="number"
                />

                {/* end date */}
                {/* <TextField
                  value={formData?.endDate || ""}
                  id="endDate"
                  name="endDate"
                  onChange={handleFormChange}
                  size="small"
                  error={Boolean(formErrors?.endDate)}
                  helperText={formErrors?.endDate}
                  label="End Date *"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                /> */}
              </Box>
            </>
          </Box>
        </div>

        <div className="form-actions">
          <FormButton
            isLoading={editLoading}
            buttonText="Edit"
            className="main-btn "
            onClick={handleSubmit}
          />
        </div>
        {isEditError ? (
          <p className="invalid-message">
            {error.responseError?.failed?.response?.msg || "Error Occurred"}
          </p>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default EditRoundForm;
