import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/Instructors.css";
// MUI
import { Box, TextField, Autocomplete } from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";

// Requests
import { getBranchesFn, editProfileFn } from "../../requests/profiles";

// validations
import { validateEdit } from "./validate";

// utils
import { getDataForTableRows } from "../../utils/tables";

// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const MutationForm = ({ onClose, isEditData, data }) => {
  //nationality ---> Project
  //facebook ---> Materials/Hands-Out
  //job title ---> Certificate

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
          companyId: 1,
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

  //   initialize edit data filling
  useEffect(() => {
    if (!isEditData || !data) return;

    // Name ,  JobTitle ,  PhoneNumber , GovIssuedID ,  Email , WhatsappNumber , BirthDate (d/m/y) , CourseID.id

    // FacebookUrl , Nationality
    const rawFormData = {
      id: [data.id],
      name: data?.Name || "",
      jobTitle: data?.JobTitle || "",
      phone: data?.PhoneNumber || "",
      govIssuedId: data?.GovIssuedID || "",
      email: data?.Email || "",
      whatsappNum: data?.WhatsappNumber || "",
      courseId: data?.CourseID?.id || "",
      birthDate: data?.BirthDate,
      branchId: data?.BranchID || "",
      facebookUrl: data?.FacebookUrl || "",
      Nationality: data?.Nationality || "",
    };

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editProfile,
    isPending: editLoading,
    isError: isEditError,
    error: editingError,
  } = useMutation({
    mutationFn: editProfileFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["profiles-pagination"]);
      queryClient.invalidateQueries(["profiles-list"]);
      showSnackbar("Profiles Edited Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Faild to edit Profile Data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    const errors = validateEdit(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      editProfile({
        reqBody: formData,
        token,
      });
    }
  };

  return (
    <div className="admin-form-page">
      <form>
        <div className="admin-form">
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
                label="Certificate"
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
                label="WhatsApp Number"
                name="whatsappNum"
              />

              <TextField
                id="facebookUrl"
                onChange={handleFormChange}
                error={Boolean(formErrors?.facebookUrl)}
                helperText={formErrors?.facebookUrl}
                value={formData?.facebookUrl || ""}
                label="Materials/Hands-Out"
                name="facebookUrl"
              />

              {/* birthdate */}
              <TextField
                error={Boolean(formErrors?.birthDate)}
                helperText={formErrors?.birthDate}
                label="Birth Date"
                type="date"
                value={formData?.birthDate ? formData.birthDate : ""}
                onChange={(e) => {
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

              <TextField
                id="govIssuedId"
                onChange={handleFormChange}
                error={Boolean(formErrors?.govIssuedId)}
                helperText={formErrors?.govIssuedId}
                value={formData?.govIssuedId || ""}
                label="Government ID"
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
                id="nationality"
                onChange={handleFormChange}
                error={Boolean(formErrors?.nationality)}
                helperText={formErrors?.nationality}
                value={formData?.nationality || ""}
                label="Project"
                name="nationality"
              />

              <TextField
                id="password"
                onChange={handleFormChange}
                error={Boolean(formErrors?.password)}
                helperText={formErrors?.password}
                value={formData?.password || ""}
                label={isEditData ? "password" : "Password *"}
                name="password"
              />

              <TextField
                id="confirmPassword"
                onChange={handleFormChange}
                error={Boolean(formErrors?.confirmPassword)}
                helperText={formErrors?.confirmPassword}
                value={formData?.confirmPassword || ""}
                label={isEditData ? "Confirm Password" : "Confirm Password *"}
                name="confirmPassword"
              />
            </Box>
          </Box>
        </div>

        <div className="form-actions">
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
        </div>
      </form>
    </div>
  );
};

export default MutationForm;
