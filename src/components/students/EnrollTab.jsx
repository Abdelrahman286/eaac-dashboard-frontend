import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const EnrollTab = () => {
  return (
    <div>
      {/* Enrollment Section */}
      <Box p={1.5} bgcolor="#f5f5f5" borderRadius={1}>
        <Typography variant="subtitle1" gutterBottom>
          Select Group/Round
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Input group/round name"
            fullWidth
            size="small"
            sx={{ flexBasis: "70%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Select
            fullWidth
            defaultValue="round12"
            size="small"
            sx={{ flexBasis: "28%" }}
          >
            <MenuItem value="round12">round 12 - IT management 8/2024</MenuItem>
            <MenuItem value="round52">round 52 - IT management 8/2024</MenuItem>
          </Select>
        </Box>

        {/* Group Round details */}
        <Typography variant="body2">
          Session#1 1/8/2024, Session#2 3/8/2024, Session#3 10/8/2024
        </Typography>
      </Box>

      {/* Group Details Section */}
      <Box p={1.5} mt={2} bgcolor="#f5f5f5" borderRadius={1}>
        <Typography variant="subtitle1" gutterBottom>
          Group/Round Details
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Group Capacity"
            value="2/25"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Group Name"
            value="Round52 - IT Management 8/2024"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Course Name"
            value="IT Management Course"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Course Code"
            value="CourseIT0012"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Room"
            value="Room002"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Start Date"
            value="1/8/2024"
            fullWidth
            size="small"
            sx={{ flexBasis: "32%" }}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>

      {/* Enroll & Pay Section */}
      <Box p={1.5} mt={2} bgcolor="#f5f5f5" borderRadius={1}>
        <Typography variant="subtitle1" gutterBottom>
          Enroll & Pay
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <TextField
            label="Course Price"
            value="1200 EGP"
            fullWidth
            size="small"
            sx={{ flexBasis: "49%" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Discount"
            value="500 EGP"
            fullWidth
            size="small"
            sx={{ flexBasis: "49%" }}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>

      {/* Actions */}
      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
        >
          Enroll & Pay
        </Button>
      </Box>
    </div>
  );
};

export default EnrollTab;
