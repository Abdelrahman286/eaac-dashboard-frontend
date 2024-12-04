import React, { useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Button,
} from "@mui/material";
import "../../../styles/rounds.css";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// Requests
import { addBranchFn, getCitiesFn } from "../../../requests/companies";
// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// valdiation
import { validateAddBranch } from "./validateBranches";

// icons
import AddIcon from "@mui/icons-material/Add";

const AddNewBranch = ({ id }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //-------------------- Cities -------------------------

  const { data: citiesList, isLoading: citiesLoading } = useQuery({
    queryFn: () => {
      return getCitiesFn(
        {
          numOfElements: "2000",
          //   provenceId: formData?.provinceId,
          provenceId: 1,
        },
        token,
        {
          isFormData: true,
        }
      );
    },

    retry: 2,

    queryKey: ["cities"],
  });

  // Data transformation : to only return arrays
  const citiesObj = citiesList?.success?.response?.data;
  const cities = getDataForTableRows(citiesObj);

  const {
    mutate: addBranch,
    isPending: addLoading,
    isError: isError,
    error: error,
  } = useMutation({
    mutationFn: addBranchFn,
    onSuccess: () => {
      setShowAddForm(false);
      queryClient.invalidateQueries(["companyBranches"]);
      showSnackbar("New Branch Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Faild to add New Branch", "error");
    },
  });
  const handleSubmit = () => {
    const errors = validateAddBranch(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      const newObj = {
        ...formData,
        companyId: id,
      };
      addBranch({ reqBody: newObj, token });
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        // border: "1px solid #b1a7a6",
        borderRadius: "14px",
        padding: "20px 10px",
      }}
    >
      {!showAddForm && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            color="success"
            startIcon={<AddIcon />} // Optional: add the icon if needed
            onClick={(e) => {
              setShowAddForm(true);
            }}
          >
            Add Branch
          </Button>
        </Box>
      )}
      {showAddForm && (
        <>
          {/* first row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <TextField
              error={Boolean(formErrors?.nameAr)}
              helperText={formErrors?.nameAr}
              value={formData?.nameAr || ""}
              onChange={handleFormChange}
              id="nameAr"
              name="nameAr"
              size="small"
              label="Name (AR) *"
              fullWidth
            />
            <TextField
              error={Boolean(formErrors?.nameEn)}
              helperText={formErrors?.nameEn}
              value={formData?.nameEn || ""}
              onChange={handleFormChange}
              id="nameEn"
              name="nameEn"
              size="small"
              label="Name (EN) *"
              fullWidth
            />

            <TextField
              error={Boolean(formErrors?.branchCode)}
              helperText={formErrors?.branchCode}
              value={formData?.branchCode || ""}
              onChange={handleFormChange}
              id="branchCode"
              name="branchCode"
              size="small"
              label="Branch Code *"
              fullWidth
            />
          </Box>

          {/* second row */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <TextField
              error={Boolean(formErrors?.descriptionAr)}
              helperText={formErrors?.descriptionAr}
              value={formData?.descriptionAr || ""}
              onChange={handleFormChange}
              id="descriptionAr"
              size="small"
              label="Description"
              name="descriptionAr"
              fullWidth
            />
            <TextField
              error={Boolean(formErrors?.mainPhone)}
              helperText={formErrors?.mainPhone}
              value={formData?.mainPhone || ""}
              onChange={handleFormChange}
              id="mainPhone"
              size="small"
              label="Phone Number"
              name="mainPhone"
              fullWidth
              type="number"
            />
          </Box>

          {/* third row */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <TextField
              sx={{
                display: "flex",
                flex: 1,
              }}
              error={Boolean(formErrors?.address)}
              helperText={formErrors?.address}
              value={formData?.address || ""}
              onChange={handleFormChange}
              id="address"
              size="small"
              label="Address *"
              name="address"
              fullWidth
            />

            <Autocomplete
              size="small"
              sx={{
                display: "flex",
                flex: 1,
              }}
              onChange={(e, value) => {
                setFormData({ ...formData, cityId: value?.id });
              }}
              value={cities.find((item) => item.id == formData.cityId) || null}
              loading={citiesLoading}
              options={cities}
              getOptionLabel={(option) => option?.Name_en}
              renderInput={(params) => (
                <TextField
                  error={Boolean(formErrors?.cityId)}
                  helperText={formErrors?.cityId}
                  id="cityId"
                  {...params}
                  label="City *"
                  sx={{ marginBottom: "8px" }}
                  autoComplete="off"
                  autoCorrect="off"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {addLoading ? "Loading..." : "Add Branch"}
            </Button>
          </Box>

          {isError && (
            <p className="invalid-message">
              {" "}
              {error?.responseError?.failed?.response?.msg ||
                "An Error Occurred, please try Again"}
            </p>
          )}
        </>
      )}
    </Box>
  );
};

export default AddNewBranch;
