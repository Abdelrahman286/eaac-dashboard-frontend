import React, { useState, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// contexts
import { AppContext } from "../contexts/AppContext";
import { UserContext } from "../contexts/UserContext";
// requests
import { getRoundsFn } from "../requests/students";

// utils
import { getDataForTableRows } from "../utils/tables";
import SearchableDropdown from "../components/SearchableDropdown";

const EnrollTab = () => {
  const handleRoundSelect = (selectedRound) => {
    console.log("Selected round:", selectedRound);
  };

  return (
    <Box sx={{ padding: 2 }}>
      test search
      <SearchableDropdown
        isFromData={false}
        requestParams={{ studentId: 1 }}
        label="Round"
        fetchData={getRoundsFn}
        queryKey="rounds"
        getOptionLabel={(option) => `${option.Name_en}`}
        getOptionId={(option) => option.id} // Custom ID field
        onSelect={handleRoundSelect}
      ></SearchableDropdown>
    </Box>
  );
};

export default EnrollTab;
