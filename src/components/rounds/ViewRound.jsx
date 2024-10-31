import React, { useState, useEffect, useContext } from "react";
import { Box, TextField, Typography } from "@mui/material";

// components
import SessionsList from "./SessionsList";

const ViewRound = ({ onClose, roundData }) => {
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            padding: "10px 0px",
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            label="Round Name"
            value={roundData?.Name_en || ""}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Room"
            value={roundData?.RoomID?.Name_en || ""}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            padding: "10px 0px",
            display: "flex",
            gap: 1,
            borderBottom: "1px solid #b1a7a6",
          }}
        >
          <TextField
            label="Course"
            value={roundData?.CourseID?.Name_en || ""}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Branch"
            value={roundData?.BranchID?.Name_en || ""}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Instructor"
            value={roundData?.InstructorID?.Name || ""}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Box>

      <Typography
        variant="h5"
        align="center"
        fontWeight={400}
        color="primary"
        sx={{ padding: "10px 0px" }}
      >
        Sessions
      </Typography>
      <div>
        <SessionsList roundId={roundData.id}></SessionsList>
      </div>
    </div>
  );
};

export default ViewRound;
