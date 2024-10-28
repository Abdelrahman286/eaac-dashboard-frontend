import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  Button,
  InputAdornment,
  MenuItem,
  IconButton,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EnrollTab from "./EnrollTab";

const GroupsModal = () => {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: 1, width: "95%", margin: "0 auto" }}>
      {/* Header */}
      <Typography variant="h6" align="center" gutterBottom>
        Manage Enrollment
      </Typography>

      <Typography variant="h6" align="center" color="primary" gutterBottom>
        #521
      </Typography>

      {/* Client/Student Info Section */}
      <Box mb={2} p={1.5} bgcolor="#f5f5f5" borderRadius={1}>
        <Typography variant="subtitle1" gutterBottom>
          Client/Student Info
        </Typography>

        {/* Row with 3 input fields */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Name (Ar)"
            value="محمد علي أحمد"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Mobile"
            value="+201114442161"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Name (En)"
            value="Mohammed Ali Ahmed"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
        </Box>

        {/* Second Row with 3 input fields */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Email"
            value="mk@diginovia.com"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Company"
            value="Ferro for Oil Services"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Branch"
            value="Alex branch"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
        </Box>

        {/* Third Row with 3 input fields */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Membership Code"
            value="25458756985"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Client Balance"
            value="-1200 EGP"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              style: { color: "red" },
            }}
          />
          <TextField
            label="Expiration Date"
            value="10/11/2024"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
        </Box>

        {/* Fourth Row with 2 input fields */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Groups/Rounds"
            value="IT Round23, IT Management Round0025"
            fullWidth
            size="small"
            sx={{ flexBasis: "49%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Notes"
            value="Additional notes for the contact that can help in search"
            fullWidth
            size="small"
            sx={{ flexBasis: "49%" }}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>

      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: 2, minHeight: "32px" }}
      >
        <Tab label="Enroll to Group" sx={{ minHeight: "32px" }} />
        <Tab label="Transfer to Group" sx={{ minHeight: "32px" }} />
        <Tab label="UnEnroll/Cancel Enrollment" sx={{ minHeight: "32px" }} />
      </Tabs>

      {/* Conditional rendering based on active tab */}
      {activeTab === 0 && <EnrollTab></EnrollTab>}
      {activeTab === 1 && (
        <Typography>Transfer to Group content goes here...</Typography>
      )}
      {activeTab === 2 && (
        <Typography>UnEnroll/Cancel Enrollment content goes here...</Typography>
      )}
    </Box>
  );
};

export default GroupsModal;
