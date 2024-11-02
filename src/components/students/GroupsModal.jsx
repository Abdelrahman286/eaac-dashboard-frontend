import React, { useState } from "react";
import { Box, TextField, Tabs, Tab } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EnrollTab from "./EnrollTab";
import TransferTab from "./TransferTab";
import UnenrollTab from "./EnrollTab";

const GroupsModal = () => {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
              value="محمد علي أحمد"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Mobile"
              value="+201114442161"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Company"
              value="Ferro Oil Service"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Box>
          {/* second sub row */}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField
              label="Name (En)"
              value="Mohammed Ali Ahmed"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Email"
              value="mk@diginovia.com"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Branch"
              value="Alex branch"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Box>
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
              value="25458756985"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Expiration Date"
              value="10/11/2024"
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Box>

          <TextField
            label="Client Balance"
            value="-1200 EGP"
            fullWidth
            size="small"
            sx={{ flex: 1 }}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              style: { color: "red" },
            }}
          />
          <TextField
            label="Groups/Rounds"
            value="IT Round23, IT Management Round0025"
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            sx={{ flex: 1 }}
            label="Notes"
            value="Additional notes for the contact that can help in search"
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
      {activeTab === 0 && <EnrollTab></EnrollTab>}
      {activeTab === 1 && <TransferTab></TransferTab>}
      {activeTab === 2 && <UnenrollTab></UnenrollTab>}
    </Box>
  );
};

export default GroupsModal;
