import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";
// components
import FormButton from "../../FormButton";

// Requests
import {
  createPaymentMethodFn,
  updatePaymentMethodFn,
  getBranchesFn,
} from "../../../requests/settings";

// validations
import { validateAdd } from "./validate";

// utils
import { getDataForTableRows } from "../../../utils/tables";

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // branches
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

  // send data
  const {
    mutate: createRecord,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createPaymentMethodFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["paymentMethods-pagination"]);
      queryClient.invalidateQueries(["paymentMethods-list"]);
      showSnackbar("Payment Method Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Add New Payment Method", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAdd(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      createRecord({
        reqBody: formData,
        token,
        config: {
          isFormData: true,
        },
      });
    }
  };

  //   initialize edit data filling
  useEffect(() => {
    if (!isEditData || !data) return;
    console.log(data);
    const rawFormData = {
      id: [data.id],
      nameAr: data?.Method_ar || "",
      nameEn: data?.Method_en || "",
      descriptionAr: data?.Description_ar || "",
      descriptionEn: data?.Description_en || "",
      branchId: data?.BranchID || "",
    };

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editRecord,
    isPending: editLoading,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: updatePaymentMethodFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["paymentMethods-pagination"]);
      queryClient.invalidateQueries(["paymentMethods-list"]);
      showSnackbar("Payment Method is Edited Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to edit Payment Method Data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();
    const errors = validateAdd(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      editRecord({
        reqBody: formData,
        token,
        config: {
          isFormData: true,
        },
      });
    }
  };

  // for DEBUG
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div>
      <form>
        <div>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              minWidth: "400px",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <TextField
              id="nameAr"
              onChange={handleFormChange}
              error={Boolean(formErrors?.nameAr)}
              helperText={formErrors?.nameAr}
              value={formData?.nameAr || ""}
              label={"Name (AR) *"}
            />
            <TextField
              id="nameEn"
              onChange={handleFormChange}
              error={Boolean(formErrors?.nameEn)}
              helperText={formErrors?.nameEn}
              value={formData?.nameEn || ""}
              label={"Name (EN) *"}
            />

            <TextField
              id="descriptionAr"
              onChange={handleFormChange}
              error={Boolean(formErrors?.descriptionAr)}
              helperText={formErrors?.descriptionAr}
              value={formData?.descriptionAr || ""}
              label={"Description (AR)"}
            />

            <TextField
              id="descriptionEn"
              onChange={handleFormChange}
              error={Boolean(formErrors?.descriptionEn)}
              helperText={formErrors?.descriptionEn}
              value={formData?.descriptionEn || ""}
              label={"Description (EN)"}
            />

            <Autocomplete
              loading={branchesLoading}
              value={
                branches.find((branch) => branch?.id == formData?.branchId) ||
                null
              }
              options={branches}
              getOptionLabel={(option) => option?.Name_en}
              onChange={(e, value) =>
                setFormData({ ...formData, branchId: value?.id || "" })
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
              {editError?.responseError?.failed?.response?.msg ||
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
