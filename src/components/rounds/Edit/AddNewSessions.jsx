import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";
import "../../../styles/rounds.css";

// components
import OneByOneForm from "./OneByOneForm";
import AddBulkForm from "./AddBulkForm";

// icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddNewSessions = ({ handleGoBack, data }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
        {" "}
        <IconButton
          sx={{
            backgroundColor: "#f5f5f5", // Lighter grayish color
            "&:hover": {
              backgroundColor: "#eeeeee", // Slightly darker light gray on hover
            },
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8px",
          }}
          color=""
          aria-label="go back"
          onClick={handleGoBack}
        >
          <ArrowBackIcon />
        </IconButton>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Add one by one" />
          <Tab label="Add bulk sessions" />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* {selectedTab === 0 && (
          <OneByOneSection
            mainFormData={mainFormData}
            onClose={onClose}
            instructors={instructors}
            rooms={rooms}
          ></OneByOneSection>
        )}

        {selectedTab === 1 && (
          <div>
            <AddBulkSection
              mainFormData={mainFormData}
              onClose={onClose}
            ></AddBulkSection>
          </div>
        )} */}

        {selectedTab === 0 && (
          <OneByOneForm
            mainFormData={data}
            handleGoBack={handleGoBack}
          ></OneByOneForm>
        )}

        {selectedTab === 1 && (
          <div>
            <AddBulkForm></AddBulkForm>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default AddNewSessions;
