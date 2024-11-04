import React, { useEffect, useState, useContext } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/rounds.css";
// MUI
import { Box, TextField, Autocomplete, IconButton } from "@mui/material";

// icons
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";
import AddSessions from "./AddSessions";

// Requests
import {
  getBranchesFn,
  getCoursesFn,
  getInstructorsFn,
  getRoomsFn,
} from "../../requests/rounds";

// validations
import {
  validateAddRound,
  validateEditRound,
} from "../../utils/requestValidations";

// utils
import { getDataForTableRows } from "../../utils/tables";

// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [pageIndex, setPageIndex] = useState(0);

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
          //   companyId: "1",
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
          numOfElements: "2000",
          //   companyId: "1",
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
          numOfElements: "2000",
          //   companyId: "1",
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
          numOfElements: "2000",
          //   companyId: "1",
        },
        token
      );
    },

    queryKey: ["instructors"],
  });
  const instructors = getDataForTableRows(
    instructorsList?.success?.response?.data
  );

  const moveNext = (e) => {
    e.preventDefault();
    // check all inputs before moving to next page
    const errors = validateAddRound(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setPageIndex(pageIndex + 1);
    }
  };

  return (
    <div className="round-form-page">
      <form>
        <div className="round-form">
          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              padding: 2,
              width: "100%",
            }}
          >
            {pageIndex == 0 ? (
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
                    onChange={handleFormChange}
                    error={Boolean(formErrors?.nameEn)}
                    helperText={formErrors?.nameEn}
                    value={formData?.nameEn || ""}
                    label="Round Name *"
                    name="nameEn"
                  />

                  <Autocomplete
                    loading={branchesLoading}
                    value={
                      branches.find(
                        (branch) => branch.id === formData.branchId
                      ) || null
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
                      rooms.find((room) => room.id === formData.roomId) || null
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
                      courses.find(
                        (course) => course.id === formData.courseId
                      ) || null
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
                              instructor?.InstructorID === formData.instructorId
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
                  {/* Attendance Percentage  */}
                  <TextField
                    id="attendancePercentage"
                    onChange={handleFormChange}
                    // error={Boolean(formErrors?.nameEn)}
                    // helperText={formErrors?.nameEn}
                    value={formData?.attendancePercentage || ""}
                    name="attendancePercentage"
                    label="Attendace Percentage Limit"
                    type="number"
                  />
                </Box>
              </>
            ) : (
              <div style={{ width: "100%", padding: "0", margin: "0" }}>
                <AddSessions
                  instructors={instructors}
                  rooms={rooms}
                  mainFormData={formData}
                  onClose={onClose}
                ></AddSessions>
              </div>
            )}
            {/* Left Side */}
          </Box>
        </div>

        <div className="form-actions">
          {pageIndex !== 0 ? (
            <FormButton
              buttonText="Go Back"
              className=" go-back-btn "
              onClick={(e) => {
                e.preventDefault();
                setPageIndex(0);
              }}
              icon={<NavigateBeforeIcon></NavigateBeforeIcon>}
            />
          ) : (
            ""
          )}
          {pageIndex == 0 ? (
            <FormButton
              buttonText="Next"
              className="main-btn form-add-btn"
              onClick={moveNext}
            />
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
};

export default MutationForm;
