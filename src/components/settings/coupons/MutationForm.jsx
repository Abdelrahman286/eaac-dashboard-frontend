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
  createPromoCodeFn,
  updatePromoCodeFn,
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

  const [categoryType, setCategoryType] = useState("0");

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // send course data
  const {
    mutate: sendPromoCode,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createPromoCodeFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["promoCodes-pagination"]);
      queryClient.invalidateQueries(["promoCodes-list"]);
      showSnackbar("Coupon Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Add New  Coupon", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAdd(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      sendPromoCode({
        reqBody: formData,
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  //   initialize edit data filling
  useEffect(() => {
    if (!isEditData || !data) return;
    const rawFormData = {
      id: [data.id],
      voucherCode: data?.VoucherCode || "",
      discountPercentage: data?.DiscountPercentage || "",
    };

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setCategoryType(data?.PercentageFlag);
    setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editPromoCode,
    isPending: editLoading,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: updatePromoCodeFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["promoCodes-pagination"]);
      queryClient.invalidateQueries(["promoCodes-list"]);
      showSnackbar("Coupon is Edited Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to edit Coupon Data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();
    const errors = validateAdd(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      editPromoCode({
        reqBody: formData,
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

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
            <FormControl component="fieldset">
              <FormLabel>Choose Coupon Type</FormLabel>
              <RadioGroup
                aria-label="category-type"
                name="category-type"
                value={categoryType}
                onChange={(e) => {
                  setCategoryType(e.target.value);
                  setFormData({
                    ...formData,
                    percentageFlag: e.target.value,
                  });
                }}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Discount"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Percentage"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              id="voucherCode"
              onChange={handleFormChange}
              error={Boolean(formErrors?.voucherCode)}
              helperText={formErrors?.voucherCode}
              value={formData?.voucherCode || ""}
              label={"Promo Code *"}
            />

            {categoryType == 1 ? (
              // Perctentage Value
              <TextField
                id="discountPercentage"
                onChange={handleFormChange}
                error={Boolean(formErrors?.discountPercentage)}
                helperText={formErrors?.discountPercentage}
                value={formData?.discountPercentage || ""}
                label={"Percentage % *"}
                type="number"
              />
            ) : (
              // Discount value

              <TextField
                id="discountPercentage"
                onChange={handleFormChange}
                error={Boolean(formErrors?.discountPercentage)}
                helperText={formErrors?.discountPercentage}
                value={formData?.discountPercentage || ""}
                label={"Discount (EGP)*"}
                type="number"
              />
            )}
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
