import React, { useState } from "react";
import { Tabs, Tab, Box, TextField, Autocomplete } from "@mui/material";
import "../../styles/rounds.css";

// components

import OneByOneSection from "./OneByOneSection";

const AddSessions = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [sessionForm, setSessionForm] = useState({
    sessionName: "",
    sessionRoom: "",
    sessionDate: "",
    sessionStartTime: "",
    sessionEndTime: "",
    instructorId: null,
    roomId: null,
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Add one by one" />
        <Tab label="Add bulk sessions" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {selectedTab === 0 && <OneByOneSection></OneByOneSection>}

        {selectedTab === 1 && <div>Add bulk sessions form here</div>}
      </Box>
    </Box>
  );
};

export default AddSessions;
