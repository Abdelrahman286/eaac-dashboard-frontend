import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

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

import AddIcon from "@mui/icons-material/Add";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// excel
import ExportToExcel from "../../ExportToExcel";

// utils
import {
  getStudentFn,
  getRoundsFn,
  getPaymentMethodsFn,
} from "../../../requests/ClientPayments";

// components
import SearchableDropdown from "../../SearchableDropdown";
import Modal from "../../Modal";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import AddPayment from "./AddPayment";
import Refund from "./Refund";
import CorrectMovement from "./CorrectMovement";

// hooks
import useQueryParam from "../../../hooks/useQueryParams";

const Header = ({ excelData, onFilterChange }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token, hasPermission } = useContext(UserContext);

  const [formData, setFormData] = useState({});
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showCorrectMovement, setShowCorrectMovement] = useState(false);

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
    { key: "Credit", label: "Credit" },

    { key: "Debit", label: "Debit" },
    { key: "Balance", label: "Balance" },
  ];

  // rounds list
  const { data: groupsList, isLoading: groupsLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getRoundsFn(
        {
          numOfElements: "2000",
          ...(formData?.studentId && { studentId: formData?.studentId }),
        },
        token,
        { isFormData: true }
      );
    },

    queryKey: ["studentGroups", formData?.studentId],
  });
  const rounds = getDataForTableRows(groupsList?.success?.response?.data);

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

  // handle student table redirect
  const redirectStudentId = useQueryParam("studentTableId");
  useEffect(() => {
    if (redirectStudentId) {
      onFilterChange({
        studentId: redirectStudentId,
      });
    }
  }, [redirectStudentId]);

  return (
    <div className="header-wrapper">
      {showAddPayment && (
        <Modal
          classNames={"show-add-payment-modal"}
          title={"Add Payment"}
          onClose={() => setShowAddPayment(false)}
        >
          <AddPayment onClose={() => setShowAddPayment(false)}></AddPayment>
        </Modal>
      )}

      {showRefund && (
        <Modal
          classNames={"show-add-payment-modal"}
          title={"Refund Payment"}
          onClose={() => setShowRefund(false)}
        >
          <Refund onClose={() => setShowRefund(false)}></Refund>
        </Modal>
      )}

      {showCorrectMovement && (
        <Modal
          classNames={"show-add-payment-modal"}
          title={"Correct Movement"}
          onClose={() => setShowCorrectMovement(false)}
        >
          <CorrectMovement
            onClose={() => setShowCorrectMovement(false)}
          ></CorrectMovement>
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
            <SearchableDropdown
              onSelect={(_client) => {
                setFormData({ ...formData, studentId: _client?.id || "" });
              }}
              fetchData={getStudentFn}
              isFromData={false}
              label="Student"
              queryKey="studentForReceipt"
              getOptionLabel={(option) => `[${option?.id}] - ${option?.Name} `}
              getOptionId={(option) => option.id} // Custom ID field
              // to limit the number of elements in dropdown
              requestParams={{ numOfElements: 50 }}
            ></SearchableDropdown>
          </Box>

          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              value={
                rounds.find((item) => item.id == formData?.roundId) || null
              }
              onChange={(e, value) => {
                setFormData({ ...formData, roundId: value?.id || "" });
              }}
              loading={groupsLoading}
              options={rounds || []}
              getOptionLabel={(option) => option?.Name_en || ""}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Group/Round" fullWidth />
              )}
            />
          </Box>

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
                />
              )}
            />
          </Box>

          {/* Autocomplete for student */}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
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

          {hasPermission("Client Refund") && (
            <Button
              onClick={() => {
                setShowRefund(true);
              }}
              size="small"
              variant="contained"
              color="error"
              startIcon={<AddIcon />}
              sx={{
                minWidth: "100px",
                paddingY: 0.1,
                height: "40px",
                padding: "16px 4px",
                borderRadius: "20px",
              }}
            >
              Refund
            </Button>
          )}

          {hasPermission("Client Pay (Submit Payment)") && (
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
              Add Payment
            </Button>
          )}

          {hasPermission("Correct Movement") && (
            <Button
              onClick={() => setShowCorrectMovement(true)}
              size="small"
              variant="contained"
              // color="success"
              startIcon={<AddIcon />}
              sx={{
                minWidth: "190px", // Constant width
                paddingY: 0.1,
                height: "40px",
                padding: "16px 4px",
                borderRadius: "20px",
              }}
            >
              Correct Movement
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Header;
