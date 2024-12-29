import React, { useState } from "react";
import { Tabs, Tab, Box, TextField, Autocomplete } from "@mui/material";
import "../../styles/rounds.css";

// components
import OneByOneSection from "./OneByOneSection";
import AddBulkSection from "./AddBulkSection";

const AddSessions = ({ mainFormData, onClose, instructors, rooms }) => {
  const [selectedTab, setSelectedTab] = useState(0);

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
        {selectedTab == 0 && (
          <OneByOneSection
            mainFormData={mainFormData}
            onClose={onClose}
            instructors={instructors}
            rooms={rooms}
          ></OneByOneSection>
        )}

        {selectedTab == 1 && (
          <div>
            <AddBulkSection
              mainFormData={mainFormData}
              onClose={onClose}
            ></AddBulkSection>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default AddSessions;
