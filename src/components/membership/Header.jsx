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
import AddIcon from "@mui/icons-material/Add";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// excel
import ExportToExcel from "../ExportToExcel";

// utils
import { getDataForTableRows } from "../../utils/tables";

import { getStudentFn } from "../../requests/membership";

// components
import MutationForm from "./MutationForm";
import Modal from "../Modal";
import SearchableDropdown from "../SearchableDropdown";

// hooks
import useQueryParam from "../../hooks/useQueryParams";

// They aren't handled in the backend
const memebershipStatus = [
  { id: 1, value: "Active" },
  { id: 2, value: "Expired" },
];

const membershipCardStatus = [
  { id: 6, value: "Requested to print" },
  { id: 7, value: "Ready to Deliver" },
  { id: 8, value: "Deleivered" },
];

const membershipTypes = [
  { id: 1, value: "LifeTime" },
  { id: 2, value: "Student" },
];

const Header = ({ excelData, onFilterChange }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token, hasPermission } = useContext(UserContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});

  const handleAddMembership = () => {
    setShowAddForm(true);
  };

  const handleFilters = () => {
    onFilterChange(formData);
  };

  // Modified Rows
  const modifiedDataRows = excelData.map((ele) => {
    const { MembershipTypeID, CardStatusID, StatusID } = ele;
    let newCardStatus = "";
    let membershipType = "";

    // Card status
    if (CardStatusID?.id == 6) {
      newCardStatus = "Pending";
    } else if (CardStatusID?.id == 7) {
      newCardStatus = "Ready";
    } else if (CardStatusID?.id == 8) {
      newCardStatus = "Delivered";
    }

    // membership type
    if (MembershipTypeID?.id == 1) {
      membershipType = "Lifetime";
    } else if (MembershipTypeID?.id == 2) {
      membershipType = "Student";
    }

    // Return a new object with the original data and the roomFeatures
    return {
      ...ele,
      newCardStatus,
      membershipType,
    };
  });
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

  // handle student table redirect
  const redirectStudentId = useQueryParam("studentTableId");
  useEffect(() => {
    if (redirectStudentId) {
      onFilterChange({
        clientId: redirectStudentId,
      });
    }
  }, [redirectStudentId]);

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
              label="Search By Membership Code"
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
              sx={{
                flex: 1,
              }}
              options={memebershipStatus || []}
              onChange={(e, value) => {
                if (value?.id == 2) {
                  setFormData({ ...formData, disabled: 1 });
                } else {
                  setFormData({ ...formData, disabled: "" });
                }
              }}
              getOptionLabel={(option) => `${option?.value}` || ""}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Membership Status" fullWidth />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              sx={{
                flex: 1,
              }}
              value={
                membershipCardStatus.find(
                  (item) => item.id == formData?.cardStatusId
                ) || null
              }
              onChange={(e, value) => {
                setFormData({ ...formData, cardStatusId: value?.id || "" });
              }}
              options={membershipCardStatus || []}
              getOptionLabel={(option) => `${option?.value}` || ""}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Membership Card (Status)"
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
          <Box
            sx={{
              flex: 1,
            }}
          >
            <SearchableDropdown
              placeholderText="Please Start Typing to Show Results"
              onSelect={(_client) => {
                setFormData({ ...formData, clientId: _client?.id || "" });
              }}
              fetchData={getStudentFn}
              isFromData={false}
              label="Student"
              queryKey="studentForMemebership"
              getOptionLabel={(option) => `[${option?.id}] - ${option?.Name} `}
              getOptionId={(option) => option.id} // Custom ID field
              // to limit the number of elements in dropdown
              requestParams={{ numOfElements: 50 }}
            ></SearchableDropdown>
          </Box>
          <Autocomplete
            sx={{
              flex: 1,
            }}
            value={
              membershipTypes.find(
                (item) => item.id == formData?.membershipTypeId
              ) || null
            }
            onChange={(e, value) => {
              setFormData({ ...formData, membershipTypeId: value?.id || "" });
            }}
            options={membershipTypes || []}
            getOptionLabel={(option) => `${option?.value}` || ""}
            size="small"
            renderInput={(params) => (
              <TextField {...params} label="Membership Type" fullWidth />
            )}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {hasPermission("Add/Renew Membership") && (
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                sx={{
                  width: "180px",
                  paddingY: 0.1,
                  height: "40px",
                  padding: "16px 4px",
                  borderRadius: "20px",
                }}
                onClick={handleAddMembership}
              >
                Add Membership
              </Button>
            )}
          </Box>

          {/* Export XLS Button */}

          <ExportToExcel
            data={modifiedDataRows}
            fileName={"Memberships"}
            headers={headers}
          ></ExportToExcel>
        </Box>

        {showAddForm && (
          <Modal
            classNames={"h-70per"}
            title={"Add Membership"}
            onClose={() => setShowAddForm(false)}
          >
            <MutationForm onClose={() => setShowAddForm(false)}></MutationForm>
          </Modal>
        )}
      </Box>
    </div>
  );
};

export default Header;
