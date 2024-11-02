import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// contexts
import { UserContext } from "../contexts/UserContext";

// utils
import { getDataForTableRows } from "../utils/tables";

const SearchableDropdown = ({
  label,
  fetchData,
  queryKey,
  getOptionLabel,
  getOptionId, // New prop to extract the ID
  onSelect,
  requestParams = {}, // Additional request parameters
  isFromData = false,
}) => {
  const { token } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const { data: list, isLoading } = useQuery({
    retry: 1,
    queryFn: () => {
      if (!searchTerm) return { success: { response: { data: [] } } }; // Return empty data if search is empty
      return fetchData({ search: searchTerm, ...requestParams }, token, {
        isFromData: isFromData,
      });
    },
    queryKey: [queryKey, searchTerm],
    enabled: !!searchTerm, // Enable query only if searchTerm is not empty
  });

  const options = getDataForTableRows(list?.success?.response?.data) || [];

  return (
    <Box sx={{ padding: 2 }}>
      <Autocomplete
        sx={{ flex: 1 }}
        value={options.find((item) => getOptionId(item) === selectedId) || null}
        getOptionLabel={getOptionLabel}
        size="small"
        options={options}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            margin="normal"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        onInputChange={(e, value) => {
          setSearchTerm(value); // Update search term
        }}
        onChange={(e, value) => {
          const selectedOptionId = value ? getOptionId(value) : "";
          setSelectedId(selectedOptionId); // Set selectedId based on custom ID
          onSelect(value); // Pass selected value back to parent component
        }}
      />
    </Box>
  );
};

export default SearchableDropdown;
