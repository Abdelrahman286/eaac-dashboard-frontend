import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/rounds.css";
// MUI
import { Box, TextField, Autocomplete, IconButton } from "@mui/material";

// icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";

// Requests
import {
  EditRoundFn,
  createRoundFn,
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
import AddSessions from "./AddSessions";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [pageIndex, setPageIndex] = useState(0);

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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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
  // send course data
  const {
    mutate: sendRoundData,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createRoundFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["round-pagination"]);
      queryClient.invalidateQueries(["round-list"]);
      showSnackbar("Round Added Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at adding new Round", error);
      showSnackbar("Failed to Add New Round", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAddRound(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      sendRoundData({
        reqBody: formData,
        token,
      });
    }
  };

  //   initialize edit data filling
  useEffect(() => {
    // if (!isEditData || !data) return;
    // console.log(data);
    // // Handle edit data initialization
    // // Name ,  JobTitle ,  PhoneNumber , GovIssuedID ,  Email , WhatsappNumber , BirthDate (d/m/y) , CourseID.id
    // const rawFormData = {
    //   id: [data.id],
    //   branchId: data?.BranchID?.id || "",
    //   name: data?.Name || "",
    //   jobTitle: data?.JobTitle || "",
    //   phone: data?.PhoneNumber || "",
    //   govIssuedId: data?.GovIssuedID || "",
    //   email: data?.Email || "",
    //   whatsappNum: data?.WhatsappNumber || "",
    //   courseId: data?.CourseID?.id || "",
    //   birthDate: data?.BirthDate,
    // };
    // // Remove properties with empty string, null, or undefined values
    // const newFormData = Object.fromEntries(
    //   Object.entries(rawFormData).filter(([_, value]) => value)
    // );
    // setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editRound,
    isPending: editLoading,
    isError: isEditError,
    error: editingError,
  } = useMutation({
    mutationFn: EditRoundFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["round-pagination"]);
      queryClient.invalidateQueries(["round-list"]);
      showSnackbar("Round Edited Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at editing Round data", error);
      showSnackbar("Faild to edit Round Data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    const errors = validateEditRound(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      EditRoundFn({
        reqBody: formData,
        token,
      });
    }
  };

  //   for DEBUG
  useEffect(() => {
    // console.log(formData);
  }, [formData]);

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
                      //   return `${option?.Name_en} | ${option?.RoomCode}`;
                      return ` ${option?.RoomCode}`;
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
                      instructors.find(
                        (instructor) => instructor.id === formData.instructorId
                      ) || null
                    }
                    options={instructors}
                    getOptionLabel={(option) => option?.Name}
                    onChange={(e, value) =>
                      setFormData({
                        ...formData,
                        instructorId: value ? value.id : null,
                      })
                    }
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
                </Box>
              </>
            ) : (
              <div style={{ width: "100%", padding: "0", margin: "0" }}>
                <AddSessions></AddSessions>
              </div>
            )}
            {/* Left Side */}
          </Box>
        </div>

        <div className="form-actions">
          {pageIndex !== 0 ? (
            <FormButton
              isLoading={addLoading}
              buttonText="Go Back"
              className=" go-back-btn "
              onClick={(e) => {
                e.preventDefault();
                setPageIndex(0);
              }}
              icon={<NavigateBeforeIcon></NavigateBeforeIcon>}
              type="submit"
            />
          ) : (
            ""
          )}
          {pageIndex == 0 ? (
            <FormButton
              buttonText="Next"
              className="main-btn form-add-btn"
              onClick={(e) => {
                e.preventDefault();
                setPageIndex(pageIndex + 1);
              }}
              type="submit"
            />
          ) : (
            ""
          )}

          {isEditError && pageIndex > 0 ? (
            <p className="invalid-message">{String(editingError)}</p>
          ) : (
            ""
          )}

          {isAddError && pageIndex > 0 ? (
            <p className="invalid-message">{String(addError)}</p>
          ) : (
            ""
          )}

          {isEditData && pageIndex !== 0 ? (
            <FormButton
              isLoading={editLoading}
              buttonText="Edit"
              className="main-btn form-add-btn"
              onClick={handleEdit}
              type="submit"
            />
          ) : (
            ""
          )}

          {!isEditData && pageIndex !== 0 ? (
            <FormButton
              isLoading={addLoading}
              buttonText="Add"
              className="main-btn form-add-btn"
              onClick={handleSubmit}
              type="submit"
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
