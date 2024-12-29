import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DownloadIcon from "@mui/icons-material/Download";
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

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// excel
import ExportToExcel from "../ExportToExcel";

// utils
import { getDataForTableRows } from "../../utils/tables";
import { getStudentFn, getReceiptTypes } from "../../requests/receipts";

// components
import SearchableDropdown from "../SearchableDropdown";

// They aren't handled in the backend
const receiptTypes = [
  { id: 1, value: "Received Payments" },
  { id: 2, value: "Refund" },
  { id: 3, value: "Expenses" },
];

const Header = ({ excelData, onFilterChange }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  // receipt types
  const { data: receiptTypesObj, isLoading: receiptTypesLoading } = useQuery({
    queryFn: () => {
      return getReceiptTypes(
        {
          numOfElements: "2000",
        },
        token,
        { isFormData: false }
      );
    },

    queryKey: ["receiptTypes"],
  });
  const receiptTypes = getDataForTableRows(
    receiptTypesObj?.success?.response?.data
  );

  const [formData, setFormData] = useState({});

  const handleFilters = () => {
    onFilterChange(formData);
  };

  // Excel export
  const headers = [
    { key: "UserID.Name", label: "Student Name" },
    { key: "companyName", label: "Company Name" },
    { key: "UserID.PhoneNumber", label: "Phone" },

    { key: "MembershipCode", label: "Membership Code" },
    { key: "startAt", label: "Issue Date" },
    { key: "endAt", label: "Expire Date" },

    { key: "StatusID.Name_en", label: "Membership Status" },
    { key: "Image", label: "Client Photo" },

    { key: "newCardStatus", label: "Card Status" },
    { key: "membershipType", label: "Membership Type" },
  ];

  return (
    <div className="header-wrapper">
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
            <TextField
              value={formData?.search || ""}
              onChange={(e) => {
                setFormData({ ...formData, search: e.target.value || "" });
              }}
              size={"small"}
              label="Search Receipts"
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              value={
                receiptTypes.find(
                  (item) => item.id == formData?.paymentTypeId
                ) || null
              }
              onChange={(e, value) => {
                setFormData({ ...formData, paymentTypeId: value?.id || "" });
              }}
              sx={{
                flex: 1,
              }}
              options={receiptTypes || []}
              getOptionLabel={(option) => `${option?.Name_en}` || ""}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Receipt Type" fullWidth />
              )}
            />
          </Box>

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
            ></SearchableDropdown>
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
          {/* Show Attendance Report Button */}

          {/* Export XLS Button */}

          <ExportToExcel
            data={excelData}
            fileName={"Memberships"}
            headers={headers}
          ></ExportToExcel>
        </Box>
      </Box>
    </div>
  );
};

export default Header;
