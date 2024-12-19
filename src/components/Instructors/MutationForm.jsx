import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/Instructors.css";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  FormControl,
  FormHelperText,
} from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";

// Requests
import {
  editInstructorFn,
  createInstrctorFn,
  getBranchesFn,
  getCoursesFn,
} from "../../requests/instructors";

// validations
import {
  validateAddInstructor,
  validateEditInstuctor,
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

  // send course data
  const {
    mutate: sendInstructorData,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createInstrctorFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["instructor-pagination"]);
      queryClient.invalidateQueries(["instructor-list"]);
      showSnackbar("Instructor Added Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at adding new Instructor", error);
      showSnackbar("Failed to Add New Instructor", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAddInstructor(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      sendInstructorData({
        reqBody: formData,
        token,
      });
    }
  };

  //   initialize edit data filling
  useEffect(() => {
    if (!isEditData || !data) return;
    console.log(data);
    // Handle edit data initialization

    // Name ,  JobTitle ,  PhoneNumber , GovIssuedID ,  Email , WhatsappNumber , BirthDate (d/m/y) , CourseID.id
    const rawFormData = {
      id: [data.InstructorID],
      branchId: data?.BranchID?.id || "",
      name: data?.Name || "",
      jobTitle: data?.JobTitle || "",
      phone: data?.PhoneNumber || "",
      govIssuedId: data?.GovIssuedID || "",
      email: data?.Email || "",
      whatsappNum: data?.WhatsappNumber || "",
      courseId: data?.CourseID?.id || "",
      birthDate: data?.BirthDate,
    };

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editInstructor,
    isPending: editLoading,
    isError: isEditError,
    error: editingError,
  } = useMutation({
    mutationFn: editInstructorFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["instructor-pagination"]);
      queryClient.invalidateQueries(["instructor-list"]);
      showSnackbar("Instructor Edited Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at editing Instructor data", error);
      showSnackbar("Faild to edit Instructor Data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    const errors = validateEditInstuctor(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      editInstructor({
        reqBody: formData,
        token,
      });
    }
  };

  return (
    <div className="instructor-form-page">
      <form>
        <div className="instructor-form">
          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              padding: 2,
              width: "100%",
            }}
          >
            {/* Left Side */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                id="name"
                onChange={handleFormChange}
                error={Boolean(formErrors?.name)}
                helperText={formErrors?.name}
                value={formData?.name || ""}
                label="Instructor Name *"
                name="name"
              />

              <TextField
                id="jobTitle"
                onChange={handleFormChange}
                error={Boolean(formErrors?.jobTitle)}
                helperText={formErrors?.jobTitle}
                value={formData?.jobTitle || ""}
                label="Job Title *"
                name="jobTitle"
              />

              <TextField
                id="phone"
                onChange={handleFormChange}
                error={Boolean(formErrors?.phone)}
                helperText={formErrors?.phone}
                value={formData?.phone || ""}
                label="Phone *"
                name="phone"
              />

              <TextField
                id="whatsappNum"
                onChange={handleFormChange}
                error={Boolean(formErrors?.whatsappNum)}
                helperText={formErrors?.whatsappNum}
                value={formData?.whatsappNum || ""}
                label="WhatsApp Number *"
                name="whatsappNum"
              />

              {/* birthdate */}
              <TextField
                error={Boolean(formErrors?.birthDate)}
                helperText={formErrors?.birthDate}
                label="Birth Date *"
                type="date"
                value={formData?.birthDate ? formData.birthDate : ""}
                onChange={(e) => {
                  console.log(e.target.value);
                  const inputDate = e.target.value; // YYYY-MM-DD
                  setFormData({ ...formData, birthDate: inputDate });
                }}
                // to prevent the label from going inside the input field
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Box>

            {/* Right Side */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Autocomplete
                loading={branchesLoading}
                value={
                  branches.find((branch) => branch.id === formData.branchId) ||
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

              {/* Course Id */}
              <Autocomplete
                loading={coursesLoading}
                value={
                  courses.find((course) => course.id === formData.courseId) ||
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
              <TextField
                id="govIssuedId"
                onChange={handleFormChange}
                error={Boolean(formErrors?.govIssuedId)}
                helperText={formErrors?.govIssuedId}
                value={formData?.govIssuedId || ""}
                label="Government ID *"
                name="govIssuedId"
              />
              <TextField
                id="email"
                onChange={handleFormChange}
                error={Boolean(formErrors?.email)}
                helperText={formErrors?.email}
                value={formData?.email || ""}
                label="Email *"
                name="Email"
              />

              <TextField
                label="Notes"
                placeholder="notes"
                id="notes"
                onChange={handleFormChange}
                value={formData?.notes || ""}
                multiline
                minRows={4}
                fullWidth
                variant="outlined"
                style={{
                  padding: 1,
                  borderRadius: 4,
                }}
              />
            </Box>
          </Box>
        </div>

        <div className="form-actions">
          {isAddError && (
            <p className="invalid-message">
              {addError?.responseError?.failed?.response?.msg ||
                "An Error Occurred, please try Again"}
            </p>
          )}
          {isEditError && (
            <p className="invalid-message">
              {editingError?.responseError?.failed?.response?.msg ||
                "An Error Occurred, please try Again"}
            </p>
          )}

          {isEditData && (
            <FormButton
              isLoading={editLoading}
              buttonText="Edit"
              className="main-btn form-add-btn"
              onClick={handleEdit}
              type="submit"
            />
          )}

          {!isEditData && (
            <FormButton
              isLoading={addLoading}
              buttonText="Add"
              className="main-btn form-add-btn"
              onClick={handleSubmit}
              type="submit"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default MutationForm;
