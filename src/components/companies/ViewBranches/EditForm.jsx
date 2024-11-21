import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

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
import { editBranchFn } from "../../../requests/companies";

// validations
import { validateEditBranch } from "./validateBranches";

const EditForm = ({ branch, onCancel, companyId }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // initial data filling
  useEffect(() => {
    const { Name_ar, Name_en, Description_ar, MainPhone, id, BranchCode } =
      branch;

    const intialFill = {
      id: [id],
      nameAr: Name_ar,
      nameEn: Name_en,
      descriptionAr: Description_ar,
      mainPhone: MainPhone,
      branchCode: BranchCode,
    };

    setFormData(intialFill);
  }, []);

  // Edit Mutation
  const {
    mutate: editBranch,
    isPending: editLoading,
    isError,
    error,
  } = useMutation({
    onError: (error) => {
      //   console.log(error.responseError?.failed?.response?.msg);
      console.log("Error at editing Session data", error);
      showSnackbar("Faild to edit Session Data", "error");
    },
    mutationFn: editBranchFn,
    onSuccess: (res) => {
      onCancel();
      queryClient.invalidateQueries(["companyBranches"]);
      showSnackbar("Branch Data Edited Successfully", "success");
    },
  });

  const handleSubmit = () => {
    const errors = validateEditBranch(formData);

    console.log(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      editBranch({
        reqBody: formData,
        token,
      });
    }
  };

  return (
    <div
      style={{
        minWidth: "max-content",
        width: "100%",
      }}
    >
      <>
        {/* first row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            margin: "10px 0px",
          }}
        >
          <TextField
            error={Boolean(formErrors?.nameAr)}
            helperText={formErrors?.nameAr}
            value={formData?.name || ""}
            onChange={handleFormChange}
            id="nameAr"
            size="small"
            label="Name (AR) *"
            name="nameAr"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            error={Boolean(formErrors?.nameEn)}
            helperText={formErrors?.nameEn}
            value={formData?.nameEn || ""}
            onChange={handleFormChange}
            id="nameEn"
            name="nameEn"
            size="small"
            label="Name (EN) *"
            fullWidth
          />

          <TextField
            error={Boolean(formErrors?.branchCode)}
            helperText={formErrors?.branchCode}
            value={formData?.branchCode || ""}
            onChange={handleFormChange}
            id="branchCode"
            name="branchCode"
            size="small"
            label="Branch Code *"
            fullWidth
          />
          <TextField
            error={Boolean(formErrors?.descriptionAr)}
            helperText={formErrors?.descriptionAr}
            value={formData?.descriptionAr || ""}
            onChange={handleFormChange}
            id="descriptionAr"
            size="small"
            label="Description"
            name="descriptionAr"
            fullWidth
          />
          <TextField
            error={Boolean(formErrors?.mainPhone)}
            helperText={formErrors?.mainPhone}
            value={formData?.mainPhone || ""}
            onChange={handleFormChange}
            id="mainPhone"
            size="small"
            label="Phone Number"
            name="mainPhone"
            fullWidth
            type="number"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button variant="outlined" color="error" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editLoading ? "Loading..." : "Edit Branch"}
          </Button>
        </Box>

        {isError && (
          <p className="invalid-message">
            {" "}
            {error?.responseError?.failed?.response?.msg ||
              "An Error Occurred, please try Again"}
          </p>
        )}
      </>
    </div>
  );
};

export default EditForm;
