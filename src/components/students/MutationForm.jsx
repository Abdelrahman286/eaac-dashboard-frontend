import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/students.css";
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
  editStudentFn,
  createStudentFn,
  getBranchesFn,
  getCompaniesFn,
} from "../../requests/students";

// validations
import {
  validateAddStudent,
  validateEditStudent,
} from "../../utils/validateStudents";

// utils
import { getDataForTableRows } from "../../utils/tables";
import {
  convertDateFormat,
  convertDateFormatStudent,
} from "../../utils/functions";

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [previewImg, setPreviewImg] = useState("");
  const [imageErrorMsg, setImageErrorMsg] = useState(false);

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

  // companies
  const { data: vendorsList, isLoading: vendorsLoading } = useQuery({
    queryFn: () => {
      return getCompaniesFn(
        {
          numOfElements: "9999",
        },
        token,
        { isFormData: true }
      );
    },

    queryKey: ["vendors"],
  });
  const companies = getDataForTableRows(vendorsList?.success?.response?.data);

  // send course data
  const {
    mutate: sendStudentData,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createStudentFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["student-pagination"]);
      queryClient.invalidateQueries(["student-list"]);
      showSnackbar("Student Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Add New Student", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAddStudent(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      const uuid = crypto.randomUUID();
      const newObj = {
        password: uuid,
        ...formData,
        birthDate: convertDateFormat(formData.birthDate),
      };

      // modify request keys (password , date)
      sendStudentData({
        reqBody: newObj,
        token,
        config: { isFormData: true },
      });
    }
  };

  //   initialize edit data filling
  useEffect(() => {
    if (!isEditData || !data) return;

    // Handle edit data initialization
    // Name ,  JobTitle ,  PhoneNumber , GovIssuedID ,  Email , WhatsappNumber , BirthDate (d/m/y) , CourseID.id
    const rawFormData = {
      id: [data.id],
      branchId: data?.BranchID?.id || "",
      name: data?.Name || "",
      phone: data?.PhoneNumber || "",
      govIssuedId: data?.GovIssuedID || "",
      email: data?.Email || "",
      whatsappNum: data?.WhatsappNumber || "",
      birthDate: convertDateFormatStudent(data?.BirthDate),
      notes: data?.Notes,
      companyId: data?.CompanyID?.id || "",
    };

    if (data?.Image) {
      setPreviewImg(data.Image);
    }

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editStudent,
    isPending: editLoading,
    isError: isEditError,
    error: editingError,
  } = useMutation({
    mutationFn: editStudentFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["student-pagination"]);
      queryClient.invalidateQueries(["student-list"]);
      showSnackbar("Student Edited Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Faild to edit Student Data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    const errors = validateEditStudent(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      const newObj = {
        ...formData,
        birthDate: convertDateFormat(formData?.birthDate),
      };
      // modify request keys
      editStudent({
        reqBody: newObj,
        token,
        config: { isFormData: true },
      });
    }
  };

  const handleImgInput = (e) => {
    const selectedImage = e.target.files[0];

    // check if user upload non image data
    if (!selectedImage?.type?.startsWith("image")) {
      return setImageErrorMsg(true);
    }
    if (selectedImage) {
      setPreviewImg(URL.createObjectURL(selectedImage));
      setFormData({ ...formData, image: [selectedImage] });
      setImageErrorMsg(false);
    }
  };
  return (
    <div className="student-form-page">
      <form>
        <div className="student-form">
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
                label="Student Name *"
                name="name"
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

              {/* birthdate  dd/mm/yyyy */}
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

              {/* company id */}
              <Autocomplete
                loading={vendorsLoading}
                value={
                  companies.find((item) => item.id == formData?.companyId) ||
                  null
                }
                onChange={(e, value) => {
                  setFormData({ ...formData, companyId: value?.id || "" });
                }}
                options={companies}
                getOptionLabel={(option) => option.Name_en || ""}
                // size="small"
                renderInput={(params) => (
                  <TextField
                    id="vendorId"
                    {...params}
                    label="Company *"
                    error={Boolean(formErrors?.companyId)}
                    helperText={formErrors?.companyId}
                    fullWidth
                  />
                )}
              />

              <TextField
                value={formData?.notes || ""}
                id="notes"
                name="notes"
                multiline
                rows={2}
                label="Notes"
                sx={{ width: "100%" }}
                onChange={handleFormChange}
              />
            </Box>

            {/* Right Side */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Photo"
                variant="outlined"
                fullWidth
                type="file"
                error={Boolean(formErrors?.image)}
                helperText={formErrors?.image}
                id="image"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleImgInput}
              />

              {imageErrorMsg && (
                <p className="invalid-message">Please upload an image file</p>
              )}

              {previewImg && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      overflow: "hidden",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={previewImg || ""}
                      alt={""}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Box>
              )}

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

              {/* Course Id */}

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
            </Box>
          </Box>
        </div>

        <div className="form-actions">
          {isEditError && (
            <p className="invalid-message">
              {`${editingError?.responseError?.failed?.response?.msg}  
                 ${
                   addError?.responseError?.failed?.response?.errors?.email ||
                   ""
                 }` || "An Error Ocurred"}
            </p>
          )}

          {isAddError && (
            <p className="invalid-message">
              {`${addError?.responseError?.failed?.response?.msg || ""} 
              
              ${
                addError?.responseError?.failed?.response?.errors?.email || ""
              }` || "An Error Ocurred"}
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
