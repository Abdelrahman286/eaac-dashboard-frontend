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
  Divider,
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

// components
import SearchableDropdown from "../SearchableDropdown";
const groups = [
  { id: 1, name: "Group 1" },
  { id: 2, name: "Group 2" },
];
const UnenrollTab = () => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const handleRoundSelect = (selectedRound) => {
    console.log("Selected round:", selectedRound);

    console.log(selectedRound);
  };

  return (
    <Box>
      <Box
        sx={{
          paddingBottom: "40px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <SearchableDropdown
          styles={{ width: "60%" }}
          isFromData={false}
          requestParams={{ studentId: 1 }}
          label="Round"
          fetchData={getRoundsFn}
          queryKey="rounds"
          getOptionLabel={(option) => `${option.Name_en}`}
          getOptionId={(option) => option.id} // Custom ID field
          onSelect={handleRoundSelect}
        ></SearchableDropdown>

        {/* round data card  */}
        <Box
          sx={{
            // flex: 1,
            padding: 2,
            // maxWidth: 400,
            width: "90%",
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Round Data
          </Typography>

          <Box sx={{ marginBottom: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Group Capacity:
            </Typography>
            <Typography variant="body1">2/25</Typography>
          </Box>

          <Box sx={{ marginBottom: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Group Name
            </Typography>
            <Typography variant="body1">Round #121</Typography>
          </Box>

          <Box sx={{ marginBottom: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Course Name
            </Typography>
            <Typography variant="body1">Accounting</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Course Code
            </Typography>
            <Typography variant="body1">A321</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Room
            </Typography>
            <Typography variant="body1">4234</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Start Date
            </Typography>
            <Typography variant="body1">22/3/2020</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              End Date
            </Typography>
            <Typography variant="body1">22/3/2020</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Non Members Price
            </Typography>
            <Typography variant="body1">1200</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Members Price
            </Typography>
            <Typography variant="body1">1500</Typography>
          </Box>
        </Box>

        {/* unenroll actions  */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                paddingLeft: "10px",
                marginBottom: 1,
                display: "flex",
                gap: 2,

                padding: 3,
                marginTop: "14px",
                borderRadius: "20px",
                border: "1px dashed gray",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Paid Amount For the Course
              </Typography>
              <Typography variant="body1">1200</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "16px 10px",
            }}
          >
            <TextField
              id="Refund(EGP)"
              //   onChange={handleFormChange}
              //   error={Boolean(formErrors?.nameEn)}
              //   helperText={formErrors?.nameEn}
              //   value={}
              InputLabelProps={{ shrink: true }}
              label="Refund(EGP)"
              name="Refund(EGP)"
              size="small"
            />

            <Autocomplete
              options={groups}
              getOptionLabel={(option) => option.name || ""}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Method"
                  margin="normal"
                  fullWidth
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Button sx={{ margin: 2 }} variant="contained" color="error">
              Unenroll Student & Refund
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UnenrollTab;
