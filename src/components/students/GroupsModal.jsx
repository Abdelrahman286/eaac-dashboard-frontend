import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// MUI
import { Box, TextField, Tabs, Tab, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Components (Tabs)
import EnrollTab from "./EnrollTab";
import TransferTab from "./TransferTab";
import UnenrollTab from "./UnenrollTab";

// requests
import { getRoundsFn, getClientBalanceFn } from "../../requests/students";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// utils
import { getDataForTableRows } from "../../utils/tables";

const GroupsModal = ({ closeFn, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  // State to manage active tab
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // retrieve groups in which the student is enrolled

  const { data: groupsList, isLoading: groupsLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getRoundsFn(
        {
          numOfElements: "2000",
          studentId: data?.id,
          //   studentId: 9,
        },
        token,
        { isFormData: true }
      );
    },

    queryKey: ["studentGroups", data?.id],
  });
  const groups = getDataForTableRows(groupsList?.success?.response?.data);

  // get Client Balance
  const { data: clientBalanceObj, isLoading: clientBalanceLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getClientBalanceFn(
        {
          //   numOfElements: "2000",
          studentId: data?.id,
        },
        token,
        { isFormData: false }
      );
    },

    queryKey: ["clientBalance", data?.id],
  });
  const clientBalance = clientBalanceObj?.success?.response?.Balance;

  return (
    <Box>
      {/* student info */}
      <Box
        sx={{
          padding: 4,
          border: "1px solid #d1d1d1",
          //   border: "1px solid #3463d0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
          borderRadius: "20px",
        }}
      >
        {/* first main row  */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {/* first sub row */}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField
              label="Name (Ar)"
              value={data?.Name || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Mobile"
              value={data?.PhoneNumber || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Company"
              value={data?.company || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Box>
          {/* second sub row */}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField
              label="Name (En)"
              value={data?.Name || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Email"
              value={data?.Email || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Branch"
              value={data?.BranchID?.name_en || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Box>
        </Box>

        {/* current groups for the students  */}
        <Box>
          <Autocomplete
            sx={{ marginTop: "14px" }}
            multiple
            id="tags-readOnly"
            options={groups?.map((option) => option?.Name_en) || []}
            // defaultValue={
            //   groups?.length ? groups.map((option) => option?.Name_en) : []
            // }
            value={
              groups?.length ? groups.map((option) => option?.Name_en) : []
            }
            readOnly
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{ shrink: true }}
                label="Groups Enrolled In"
                placeholder={
                  groupsLoading
                    ? "Loading..."
                    : !groups || groups.length == 0
                    ? "No groups found"
                    : "Groups"
                }
              />
            )}
          />
        </Box>

        {/* Second main row  */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            width: "100%",
            paddingTop: "20px",
          }}
        >
          <Box
            sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Membership Code"
              value={data?.membership?.MembershipCode || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Expiration Date"
              value={data?.membership?.endAt || "-"}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Box>

          <TextField
            label="Client Balance"
            value={clientBalanceLoading ? "Loading..." : clientBalance || "-"}
            fullWidth
            size="small"
            sx={{ flex: 1 }}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              style: {
                color: `${
                  String(clientBalance).startsWith("-") ? "red" : "green"
                }`,
              },
            }}
          />

          <TextField
            sx={{ flex: 1 }}
            label="Notes"
            value={data.Notes || "-"}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>

      {/* Tabs (Enroll , transfer , unEnroll) */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: 2, minHeight: "32px", marginTop: "20px" }}
      >
        <Tab label="Enroll to Group" sx={{ minHeight: "32px" }} />
        <Tab label="Transfer to Group" sx={{ minHeight: "32px" }} />
        <Tab label="UnEnroll/Cancel Enrollment" sx={{ minHeight: "32px" }} />
      </Tabs>

      {/* Conditional rendering based on active tab */}
      {activeTab === 0 && <EnrollTab closeFn={closeFn} data={data}></EnrollTab>}
      {activeTab === 1 && (
        <TransferTab
          groups={groups}
          closeFn={closeFn}
          data={data}
        ></TransferTab>
      )}
      {activeTab === 2 && (
        <UnenrollTab
          groups={groups}
          closeFn={closeFn}
          data={data}
        ></UnenrollTab>
      )}
    </Box>
  );
};

export default GroupsModal;
