import React, { useState, useContext, useEffect } from "react";
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
  getOptionId,
  onSelect,
  requestParams = {},
  isFromData = false,
  initialValue = null,
  styles,
  isError = false,
  helperText = "",
}) => {
  const { token } = useContext(UserContext);

  const [inputValue, setInputValue] = useState(""); // State for input text
  const [searchTerm, setSearchTerm] = useState(""); // State for triggering query
  const [selectedId, setSelectedId] = useState(""); // State for selected option ID

  const { data: list, isLoading } = useQuery({
    retry: 1,
    queryFn: () => {
      if (!searchTerm) return { success: { response: { data: [] } } };
      return fetchData({ search: searchTerm, ...requestParams }, token, {
        isFromData: isFromData,
      });
    },
    queryKey: [queryKey, searchTerm],
    enabled: !!searchTerm, // Only enable query if searchTerm has a value
  });

  const options = getDataForTableRows(list?.success?.response?.data) || [];

  // Set initial value on mount
  useEffect(() => {
    if (initialValue) {
      const initialId = getOptionId(initialValue);
      setSelectedId(initialId);
      setInputValue(getOptionLabel(initialValue));
    }
  }, [initialValue, getOptionId, getOptionLabel]);

  // Update searchTerm only when inputValue changes, with a delay for debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (
        inputValue &&
        inputValue !==
          getOptionLabel(
            options.find((item) => getOptionId(item) === selectedId)
          )
      ) {
        setSearchTerm(inputValue);
      }
    }, 300); // Adjust debounce time as needed
    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, options, selectedId, getOptionLabel, getOptionId]);

  return (
    <Box sx={{ ...styles }}>
      <Autocomplete
        sx={{ width: "100%" }}
        value={options.find((item) => getOptionId(item) === selectedId) || null}
        getOptionLabel={getOptionLabel}
        size="small"
        options={options}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            error={isError}
            helperText={helperText}
            {...params}
            label={label}
            // margin="normal"
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
        inputValue={inputValue}
        onInputChange={(e, value) => {
          setInputValue(value); // Update only inputValue, not searchTerm
        }}
        onChange={(e, value) => {
          const selectedOptionId = value ? getOptionId(value) : "";
          setSelectedId(selectedOptionId);
          onSelect(value);
          setInputValue(getOptionLabel(value) || ""); // Display selected label without triggering a new search
        }}
      />
    </Box>
  );
};

export default SearchableDropdown;
