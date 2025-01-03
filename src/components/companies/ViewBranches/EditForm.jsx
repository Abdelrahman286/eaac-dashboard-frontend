import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";

// utils
import { getDataForTableRows } from "../../../utils/tables";
// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// Requests
import {
  editBranchFn,
  getCitiesFn,
  getProvincesFn,
} from "../../../requests/companies";

// validations
import { validateEditBranch } from "./validateBranches";

const EditForm = ({ branch, onCancel, companyId }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //-------------------- Provences -------------------------

  const { data: citiesList, isLoading: citiesLoading } = useQuery({
    queryFn: () => {
      return getProvincesFn(
        {
          numOfElements: "2000",
          countryId: "66",
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

  // initial data filling
  useEffect(() => {
    const { Name_ar, Name_en, Description_ar, MainPhone, id, BranchCode } =
      branch;


    const intialFill = {
      id: [id],
      nameAr: Name_ar || "",
      nameEn: Name_en || "",
      descriptionAr: Description_ar || "",
      mainPhone: MainPhone || "",
      branchCode: BranchCode || "",
      address: branch?.AddressID?.Address || "",
      cityId: branch?.AddressID?.CityID?.id || "",
    };

    setFormData(intialFill);
  }, []);

  // Edit Mutation
  const {
    mutate: editBranch,
    isPending: editLoading,
    isError,
    error,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Faild to edit Session Data", "error");
    },
    mutationFn: editBranchFn,
    onSuccess: (res) => {
      onCancel();
      queryClient.invalidateQueries(["companyBranches"]);
      showSnackbar("Branch Data Edited Successfully", "success");
    },
  });

  const handleSubmit = () => {
    const errors = validateEditBranch(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      editBranch({
        reqBody: formData,
        token,
      });
    }
  };

  return (
    <div
      style={{
        minWidth: "max-content",
        width: "100%",
      }}
    >
      <>
        {/* first row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            margin: "10px 0px",
          }}
        >
          <TextField
            error={Boolean(formErrors?.nameAr)}
            helperText={formErrors?.nameAr}
            value={formData?.nameAr || ""}
            onChange={handleFormChange}
            id="nameAr"
            size="small"
            label="Name (AR) *"
            name="nameAr"
            fullWidth
            InputLabelProps={{ shrink: true }}
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            margin: "10px 0px",
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
          <Button variant="outlined" color="error" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editLoading ? "Loading..." : "Edit Branch"}
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
    </div>
  );
};

export default EditForm;
