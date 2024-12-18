import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DownloadIcon from "@mui/icons-material/Download";

import "../../../styles/accounting.css";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  InputAdornment,
} from "@mui/material";

// icons
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// excel
import ExportToExcel from "../../ExportToExcel";

// utils
import { getPaymentMethodsFn } from "../../../requests/accountPaytments";

// components
import SearchableDropdown from "../../SearchableDropdown";
import Modal from "../../Modal";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import AddPayment from "./AddPayment";
import Reconcile from "./Reconcile";

// import Refund from "./Refund";
// import CorrectMovement from "./CorrectMovement";

const Header = ({ excelData, onFilterChange }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token, hasPermission } = useContext(UserContext);

  const [formData, setFormData] = useState({});
  const [showAddPayment, setShowAddPayment] = useState(false);

  const [showReconcile, setShowReconcile] = useState(false);

  const handleFilters = () => {
    onFilterChange(formData);
  };

  // Excel export
  const headers = [
    { key: "Payor.Name", label: "Student Name" },
    { key: "Description", label: "Description" },
    { key: "Notes", label: "Notes" },

    { key: "RoundID.RoundCode", label: "Round Code" },
    { key: "PaymentMethodID.Method_en ", label: "Payment Method" },
    { key: "date", label: "Date" },

    { key: "time", label: "Time" },
    { key: "ExpenseTypeID.Name_en", label: "Type" },
    { key: "Credit", label: "Credit" },

    { key: "Debit", label: "Debit" },
    { key: "Balance", label: "Balance" },
  ];

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

  return (
    <div className="header-wrapper">
      {showAddPayment && (
        <Modal
          classNames={"show-add-expenses-modal"}
          title={"Add Expenses"}
          onClose={() => setShowAddPayment(false)}
        >
          <AddPayment onClose={() => setShowAddPayment(false)}></AddPayment>
        </Modal>
      )}

      {showReconcile && (
        <Modal
          classNames={"show-add-expenses-modal"}
          title={"Reconcile"}
          onClose={() => setShowReconcile(false)}
        >
          <Reconcile onClose={() => setShowReconcile(false)}></Reconcile>
        </Modal>
      )}

      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              loading={paymentMethodLoading}
              value={
                paymentMethods.find(
                  (item) => item.id == formData?.paymentMethodId
                ) || null
              }
              onChange={(e, value) => {
                setFormData({ ...formData, paymentMethodId: value?.id });
              }}
              options={paymentMethods}
              getOptionLabel={(option) => option.Method_en || ""}
              size="small"
              renderInput={(params) => (
                <TextField
                  id="paymentMethod"
                  //   error={Boolean(formErrors?.paymentMethodId)}
                  //   helperText={formErrors?.paymentMethodId}
                  {...params}
                  label="Payment Method"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Box>

          <TextField
            value={formData?.startDate || ""}
            onChange={(e) => {
              setFormData({ ...formData, startDate: e.target.value || "" });
            }}
            size={"small"}
            label="Start Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            value={formData?.endDate || ""}
            onChange={(e) => {
              setFormData({ ...formData, endDate: e.target.value || "" });
            }}
            size={"small"}
            label="End Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            onClick={handleFilters}
            variant="contained"
            color="primary"
            sx={{
              height: "40px",
              padding: 0,
              margin: 0,
            }}
          >
            Filter
          </Button>
        </Box>

        {/* Row 3 - Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 2,
            justifyContent: { sm: "flex-end" },
            marginLeft: "auto",

            width: {
              xs: "100%",
              sm: "100%",
              md: "70%",
              lg: "50%",
            },
          }}
        >
          {/* Export XLS Button */}

          <ExportToExcel
            data={excelData}
            fileName={"Memberships"}
            headers={headers}
          ></ExportToExcel>

          {hasPermission("Reconcile") && (
            <Button
              onClick={() => setShowReconcile(true)}
              size="small"
              variant="contained"
              color="warning"
              startIcon={<AddIcon />}
              sx={{
                minWidth: "130px", // Constant width
                paddingY: 0.1,
                height: "40px",
                padding: "16px 4px",
                borderRadius: "20px",
              }}
            >
              Reconcile
            </Button>
          )}

          {hasPermission("Add Expenses (Payments)") && (
            <Button
              onClick={() => setShowAddPayment(true)}
              size="small"
              variant="contained"
              // color="warning"
              startIcon={<AddIcon />}
              sx={{
                minWidth: "140px",
                paddingY: 0.1,
                height: "40px",
                padding: "16px 4px",
                borderRadius: "20px",
              }}
            >
              Add Expenses
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Header;
