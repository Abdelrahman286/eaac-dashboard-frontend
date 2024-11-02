import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Button,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// requests
import { getRoundsFn } from "../../requests/students";

// utils
import { getDataForTableRows } from "../../utils/tables";

const EnrollTab = () => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const { data: roundsList, isLoading: roundsLoading } = useQuery({
    queryFn: () => {
      return getRoundsFn(
        {
          numOfElements: "9000",
        },
        token
      );
    },

    queryKey: ["rounds"],
  });
  const rounds = getDataForTableRows(roomsList?.success?.response?.data);
  

  return (
    <Box sx={{ padding: 2 }}>
      {/* <Autocomplete
        sx={{ flex: 1 }}
        value={rooms.find((item) => item.id == formData?.roomId) || null}
        getOptionLabel={(option) => {
          return `${option?.Name_en} ( ${option?.RoomCode})`;
        }}
        size="small"
        options={rounds}
        renderInput={(params) => (
          <TextField
            // error={Boolean(formErrors?.roomId)}
            // helperText={formErrors?.roomId}
            {...params}
            label="Round *"
            margin="normal"
            fullWidth
          />
        )}
        onChange={(e, value) => {
          //   handleDropdownChange("roomId", value?.id);
          console.log(value);
        }}
      /> */}
    </Box>
  );
};

export default EnrollTab;
