import React, { useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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

// utils
import { getDataForTableRows } from "../../../utils/tables";

// Requests
import { getInstructorsFn, getRoomsFn } from "../../../requests/rounds";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

const AddNewSessions = ({ handleGoBack, data }) => {
  const { token } = useContext(UserContext);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  //----- rooms
  const { data: roomsList, isLoading: roomsLoading } = useQuery({
    queryFn: () => {
      return getRoomsFn(
        {
          numOfElements: "2000",
          //   companyId: "1",
        },
        token
      );
    },

    queryKey: ["rooms"],
  });
  const rooms = getDataForTableRows(roomsList?.success?.response?.data);

  //----- Instructors
  const { data: instructorsList, isLoading: instructorsLoading } = useQuery({
    queryFn: () => {
      return getInstructorsFn(
        {
          numOfElements: "2000",
          //   companyId: "1",
        },
        token
      );
    },

    queryKey: ["instructors"],
  });
  const instructors = getDataForTableRows(
    instructorsList?.success?.response?.data
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
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
        {selectedTab == 0 && (
          <OneByOneForm
            mainFormData={data}
            handleGoBack={handleGoBack}
            rooms={rooms}
            instructors={instructors}
          ></OneByOneForm>
        )}

        {selectedTab == 1 && (
          <div>
            <AddBulkForm
              mainFormData={data}
              handleGoBack={handleGoBack}
              rooms={rooms}
              instructors={instructors}
            ></AddBulkForm>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default AddNewSessions;
