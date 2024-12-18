import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import "../../../styles/accounting.css";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// utils
import {
  getPaymentMethodsFn,
  reconcile,
} from "../../../requests/accountPaytments";

// validation
import { validateReconcile } from "./validate";

// utils
import { getDataForTableRows } from "../../../utils/tables";

const Reconcile = ({ onClose }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token, user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    accountantId: user?.id || "",
  });
  const [formErrors, setFormErrors] = useState({});

  // fix z index issue for header inputs
  useEffect(() => {
    const header = document.querySelector(".header-wrapper");

    if (header) {
      header.style.zIndex = 0;
      // Capture and store original zIndex values
      const childElements = header.querySelectorAll("*");
      const originalZIndexes = Array.from(childElements).map(
        (element) => element.style.zIndex
      );

      // Set zIndex to 0 for all elements inside the header
      childElements.forEach((element) => {
        element.style.zIndex = 0;
      });

      // Cleanup function to restore original zIndex values
      return () => {
        childElements.forEach((element, index) => {
          element.style.zIndex = originalZIndexes[index];
        });
      };
    }
  }, []);

  // payment methods (Method_en)
  const { data: paymentMethodsList, isLoading: paymentMethodLoading } =
    useQuery({
      queryFn: () => {
        return getPaymentMethodsFn(
          {
            numOfElements: "2000",
          },
          token,
          { isFormData: false }
        );
      },

      queryKey: ["paymentMethods"],
    });
  const paymentMethods = getDataForTableRows(
    paymentMethodsList?.success?.response?.data
  );

  const {
    mutate: addPayment,
    isPending: addLoading,
    isError: isError,
    error: addError,
  } = useMutation({
    mutationFn: reconcile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accountPayments-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["accountPayments-list"],
      });
      showSnackbar("Payment Submitted Successfully", "success");
      onClose();
    },
    onError: (error) => {
      showSnackbar("Error At Adding New Payment", "error");
    },
  });
  const handleSubmit = () => {
    const errors = validateReconcile(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      addPayment({
        reqBody: cleanedFormData,
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  return (
    <div>
      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 1 }}
      >
        {/* payment inputs  */}
        <Box>
          {/* payment methods  */}
          <Autocomplete
            style={{ margin: "10px 0px" }}
            loading={paymentMethodLoading}
            value={
              paymentMethods.find(
                (item) => item.id == formData?.paymentMethodId
              ) || null
            }
            onChange={(e, value) => {
              setFormData({ ...formData, paymentMethodId: value?.id || "" });
            }}
            options={paymentMethods}
            getOptionLabel={(option) => option.Method_en || ""}
            size="small"
            renderInput={(params) => (
              <TextField
                id="paymentMethod"
                error={Boolean(formErrors?.paymentMethodId)}
                helperText={formErrors?.paymentMethodId}
                {...params}
                label="Payment Method"
                fullWidth
              />
            )}
          />

          {/* payment amount */}
          <TextField
            id="paymentAmount"
            onChange={(e) => {
              setFormData({ ...formData, paymentAmount: e.target.value || "" });
            }}
            error={Boolean(formErrors?.paymentAmount)}
            helperText={formErrors?.paymentAmount}
            value={formData?.paymentAmount || ""}
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Reconcile Value (EGP)"
            name="paymentAmount"
            size="small"
            style={{ margin: "10px 0px" }}
          />

          <TextField
            id="Notes"
            onChange={(e) => {
              setFormData({ ...formData, notes: e.target.value || "" });
            }}
            error={Boolean(formErrors?.notes)}
            helperText={formErrors?.notes}
            value={formData?.notes || ""}
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Notes"
            name="Notes"
            size="small"
            rows={3}
            multiline
            style={{ margin: "10px 0px" }}
          />
        </Box>

        {isError && (
          <p className="invalid-message">
            {addError?.responseError?.failed?.response?.msg ||
              "An Error Occurred, please try Again"}
          </p>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => {
              handleSubmit();
            }}
            size="small"
            variant="contained"
            color="success"
            sx={{
              minWidth: "130px", // Constant width
              paddingY: 0.1,
              height: "40px",
              padding: "16px 4px",
              borderRadius: "20px",
            }}
          >
            {addLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reconcile"
            )}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Reconcile;
