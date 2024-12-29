import React, { useEffect, useState, useContext } from "react";
import {
  FormControl,
  TextField,
  Input,
  InputLabel,
  FormHelperText,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Autocomplete,
  Select,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import FormButton from "../FormButton";
import ContactsTable from "./Contacts";

import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
import { getDataForTableRows } from "../../utils/tables";

// requets functions
import {
  getCitiesFn,
  createCompanyFn,
  editCompanyFn,
  getCountriesFn,
  getProvincesFn,
} from "../../requests/companies";

// validation function
import {
  validateAddCompany,
  validateEditCompany,
} from "../../utils/requestValidations";

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState([]);

  // State to store the selected files

  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const [imageErrorMsg, setImageErrorMsg] = useState(false);
  const [contacts, setContacts] = useState([]);

  const companyTypes = [
    { id: "2", type: "Client" },
    { id: "3", type: "Vendor" },
  ];

  // Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to an array
    setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files to the list
  };

  // Handle file deletion
  const handleDeleteFile = (indexToDelete) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToDelete)
    );
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    // check if user upload non image data
    if (!selectedImage?.type?.startsWith("image")) {
      return setImageErrorMsg(true);
    }
    if (selectedImage) {
      setFormData({ ...formData, logo: [selectedImage] });
      setImage(URL.createObjectURL(selectedImage));
      setImageErrorMsg(false);
    }
  };

  //------------------------ countries--------------------

  const { data: countriesList, isLoading: countriesLoading } = useQuery({
    queryFn: () => {
      return getCountriesFn(
        {
          numOfElements: "2000",
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    retry: 2,

    queryKey: ["countries"],
  });

  // Data transformation : to only return arrays
  const countriesObj = countriesList?.success?.response?.data;
  const countries = getDataForTableRows(countriesObj);

  //------------------------ provinces --------------------

  const { data: provincesList, isLoading: provincesLoading } = useQuery({
    queryFn: () => {
      return getProvincesFn(
        {
          numOfElements: "2000",
          countryId: formData?.countryId,
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    enabled: !!formData?.countryId,
    retry: 2,

    queryKey: ["provinces", formData?.countryId],
  });

  // Data transformation : to only return arrays
  const provincesObj = provincesList?.success?.response?.data;
  const provinces = getDataForTableRows(provincesObj);

  //-------------------- Cities -------------------------

  const { data: citiesList, isLoading: citiesLoading } = useQuery({
    queryFn: () => {
      return getCitiesFn(
        {
          numOfElements: "2000",
          provenceId: formData?.provinceId,
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    enabled: !!formData?.provinceId,
    retry: 2,

    queryKey: ["cities", formData?.provinceId, formData?.countryId], // add countryId here from formData-----------------------------
  });

  // Data transformation : to only return arrays
  const citiesObj = citiesList?.success?.response?.data;
  const cities = getDataForTableRows(citiesObj);

  //--------------------------------------------------------------
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle contacts data
  const handleContactsChange = (contactsData) => {
    const newContactsData = contactsData.map(({ id, ...rest }) => rest);
    setContacts(newContactsData);
  };

  //append the contacts to formData
  useEffect(() => {
    setFormData({ ...formData, contacts: contacts });
  }, [contacts]);

  // append file attachment to the formData
  useEffect(() => {
    if (files?.length > 0) {
      setFormData({ ...formData, attach: files });
    }
  }, [files]);

  // submit form Data
  const {
    mutate: sendCompanyData,
    isPending: addCompanyLoading,
    isError: isAddCompanyError,
    error: addError,
  } = useMutation({
    mutationFn: createCompanyFn,
    onSuccess: () => {
      // Invalidate the query with key 'company-list'
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["company-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["company-list"],
      });
      console.log("company added successfully");
      showSnackbar("Company Added Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at adding new Company", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateAddCompany(formData);
    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      sendCompanyData({
        reqBody: formData,
        token,
        config: {
          isFormData: true,
        },
      });
    }
  };

  useEffect(() => {
    if (!isEditData || !data) return;
    const rawFormData = {
      id: [data.id],
      nameAr: data?.Name_ar || "",
      nameEn: data?.Name_en || "",
      notes: data?.Notes || "",
      taxCardNumber: data?.TaxCardNumber || "",
      mainPhone: data?.MainPhone || "",
      business: data?.Business || "",
      commercialRegistrationNumber: data?.CommercialRegistrationNumber || "",
      addressString: data?.HqAdressID?.Address || "",
      companyCode: data?.ClientCode || "",
      statusId: data?.StatusID,
      // company type
      clientFlag: data?.DeginoviaClient.code || "",

      // country
      countryId: data?.HqAdressID2?.countryData?.id || "",
      // provence
      provinceId: data?.HqAdressID2?.provenceData?.id || "",
      // city
      cityId: data?.HqAdressID2?.cityData?.id || "",
    };

    setImage(data?.Logo);
    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, []);

  const {
    mutate: editCompanyData,
    isPending: editCompanyPending,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: editCompanyFn,
    onSuccess: () => {
      // Invalidate the query with key 'company-list'
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["company-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["company-list"],
      });
      console.log("company Edited successfully");
      showSnackbar("Company is Edited Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at editing Company data", error);
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    const errors = validateEditCompany(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      editCompanyData({
        reqBody: formData,
        token,
      });
    }
  };

  return (
    <div className="company-form-page">
      <form>
        <div className="company-form">
          <div className="left">
            <Box
              sx={{
                // backgroundColor: "#f4f4f494",
                padding: "10px",
                borderRadius: "8px",
                // margin: "20px 0",
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "4px",
                  fontWeight: "400",
                  fontSize: "15px",
                }}
              >
                Company Name
              </Typography>

              {/* TextField Components */}
              <TextField
                error={Boolean(formErrors?.nameEn)}
                id="nameEn"
                value={formData?.nameEn || ""}
                label="Company Name (English) *"
                sx={{ width: "48%", marginY: "4px", marginRight: "8px" }}
                helperText={formErrors?.nameEn}
                fullWidth
                onChange={handleFormChange}
              />

              <TextField
                error={Boolean(formErrors?.nameAr)}
                helperText={formErrors?.nameAr}
                value={formData.nameAr || ""}
                id="nameAr"
                label="Company Name (Arabic) *"
                sx={{ width: "48%", marginY: "4px" }}
                fullWidth
                onChange={handleFormChange}
              />
            </Box>

            <Box
              sx={{
                // backgroundColor: "#f4f4f494",
                padding: "10px",
                borderRadius: "8px",
                margin: "8px 0px",
              }}
            >
              {/* TextField Components */}
              <TextField
                disabled={isEditData}
                id="companyCode"
                error={Boolean(formErrors?.companyCode)}
                helperText={formErrors?.companyCode}
                value={formData.companyCode || ""}
                onChange={handleFormChange}
                label="Company Code"
                sx={{ width: "48%", marginY: "4px", marginRight: "8px" }}
                fullWidth
              />

              <TextField
                error={Boolean(formErrors?.mainPhone)}
                helperText={formErrors?.mainPhone}
                id="mainPhone"
                value={formData?.mainPhone || ""}
                label="Main Phone *"
                sx={{ width: "48%", marginY: "4px" }}
                fullWidth
                // type="number"
                type="tel"
                onChange={handleFormChange}
              />
            </Box>

            <Box
              sx={{
                // backgroundColor: "#f4f4f494",
                padding: "10px",
                borderRadius: "8px",
                margin: "8px 0px",
              }}
            >
              {/* TextField Components */}
              <TextField
                id="commercialRegistrationNumber"
                value={formData?.commercialRegistrationNumber || ""}
                label="Commercial Registration No."
                sx={{ width: "48%", marginY: "4px", marginRight: "8px" }}
                helperText=""
                fullWidth
                onChange={handleFormChange}
              />

              <TextField
                error={Boolean(formErrors?.taxCardNumber)}
                helperText={formErrors?.taxCardNumber || ""}
                id="taxCardNumber"
                value={formData.taxCardNumber || ""}
                label="Tax Registration No."
                sx={{ width: "48%", marginY: "4px" }}
                fullWidth
                type="number"
                onChange={handleFormChange}
              />
            </Box>

            <Box
              sx={{
                padding: "10px",
                borderRadius: "8px",
                margin: "8px 0px",
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "8px", // Adds space below the title
                  fontWeight: "400",
                  fontSize: "15px",
                }}
              >
                {"Business Lines (Fields of Work)"}
              </Typography>

              {/* TextField and Select side by side */}
              <Box
                sx={
                  {
                    //   display: "flex",
                    //   alignItems: "center",
                    //   justifyContent: "center",
                    //   gap: "8px",
                  }
                }
              >
                {/* TextField Component */}
                <TextField
                  value={formData?.business || ""}
                  id="business"
                  label="Business Lines"
                  sx={{ flexGrow: 1 }}
                  helperText=""
                  onChange={handleFormChange}
                  fullWidth
                />

                {/* Select Dropdown Component */}
                <Autocomplete
                  sx={{
                    padding: "4px 0px",
                    marginTop: "10px",
                  }}
                  fullWidth
                  options={companyTypes} // Array of options
                  getOptionLabel={(option) => option?.type}
                  onChange={(e, newValue) =>
                    setFormData({ ...formData, clientFlag: newValue?.id || "" })
                  }
                  value={
                    companyTypes.find(
                      (item) => item.id == formData.clientFlag
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      id="clientFlag"
                      error={Boolean(formErrors?.clientFlag)}
                      helperText={formErrors?.clientFlag || ""}
                      {...params}
                      label="Company Type *" // The label for the Autocomplete
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  )}
                />
              </Box>
            </Box>

            <Box
              sx={{
                // backgroundColor: "#f4f4f494",
                padding: "10px",
                borderRadius: "8px",
                // margin: "20px 0",
                marginTop: "-20px",
                // background: "red",
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "4px",
                  fontWeight: "400",
                  fontSize: "15px",
                }}
              >
                {"Attachments"}
              </Typography>

              {/* File Input */}
              <TextField
                id="outlined-multiline-flexible"
                sx={{
                  width: "100%",
                  marginY: "4px",
                  marginRight: "8px",
                }}
                helperText=""
                fullWidth
                required
                type="file"
                InputProps={{
                  inputProps: { multiple: true },
                }}
                onChange={handleFileChange} // Handle file selection
              />

              {/* Display the list of selected files */}
              {files.length > 0 && (
                <List>
                  {files.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </div>
          <div className="right">
            {/* Box for Image Upload and Preview */}
            <Box
              sx={{
                // backgroundColor: "#f4f4f494",
                padding: "10px",
                borderRadius: "8px",
                marginLeft: "10px",
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "8px", // Adjust margin for spacing
                  fontWeight: "400",
                  fontSize: "15px",
                }}
              >
                Company Logo
              </Typography>

              {/* Image Input */}
              <TextField
                id="image-upload"
                sx={{ marginBottom: "2px" }} // Space between input and image
                type="file"
                helperText="Upload an image"
                fullWidth
                InputProps={{
                  inputProps: { accept: "image/*" },
                }}
                onChange={handleImageChange} // Handle image selection
              />

              {/* Display the selected image */}
              {image && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "8px",
                  }}
                >
                  <img
                    src={image}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      borderRadius: "8px",
                    }}
                  />

                  {imageErrorMsg && (
                    <p className="invalid-message">
                      Please upload an image file
                    </p>
                  )}

                  <IconButton
                    onClick={() => {
                      setFormData({ ...formData, logo: [] });
                      setImage(null);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/*-------------------- HQ ADDRESS ----------------- */}
            <Box
              sx={{
                // backgroundColor: "#f4f4f494",
                padding: "0px 10px",
                borderRadius: "8px",
                marginLeft: "10px",
                // marginTop: "10px",
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "12px",
                  fontWeight: "400",
                  fontSize: "15px",
                }}
              >
                HQ Address
              </Typography>

              {/* Country Autocomplete */}

              <Autocomplete
                onChange={(e, value) => {
                  setFormData({
                    ...formData,
                    countryId: value?.id,
                    provinceId: null,
                    cityId: null,
                  });
                }}
                value={
                  countries.find((item) => item.id == formData?.countryId) ||
                  null
                }
                options={countries}
                loading={countriesLoading}
                getOptionLabel={(option) => option?.Name_en}
                //disabled
                renderInput={(params) => (
                  <TextField
                    error={Boolean(formErrors?.countryId)}
                    helperText={formErrors?.countryId}
                    autoComplete="off"
                    autoCorrect="off"
                    {...params}
                    label="Country *"
                    sx={{ marginBottom: "8px" }}
                  />
                )}
              />

              {/* Province Autocomplete */}
              <Autocomplete
                onChange={(e, value) => {
                  setFormData({
                    ...formData,
                    provinceId: value?.id,
                    cityId: null,
                  });
                }}
                value={
                  provinces.find((item) => item.id == formData?.provinceId) ||
                  null
                }
                options={provinces}
                loading={provincesLoading}
                getOptionLabel={(option) => option?.Name_en}
                // disabled

                renderInput={(params) => (
                  <TextField
                    error={Boolean(formErrors?.provinceId)}
                    helperText={formErrors?.provinceId}
                    autoComplete="off"
                    autoCorrect="off"
                    {...params}
                    label="Province *"
                    sx={{ marginBottom: "8px" }}
                  />
                )}
              />

              {/* City Autocomplete */}
              <Autocomplete
                onChange={(e, value) => {
                  setFormData({ ...formData, cityId: value?.id });
                }}
                value={
                  cities.find((item) => item.id == formData.cityId) || null
                }
                loading={citiesLoading}
                options={cities}
                getOptionLabel={(option) => option?.Name_en}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(formErrors?.cityId)}
                    helperText={formErrors?.cityId}
                    id="cityId"
                    // onChange={handleFormChange}
                    {...params}
                    label="City *"
                    sx={{ marginBottom: "8px" }}
                    autoComplete="off"
                    autoCorrect="off"
                  />
                )}
              />

              {/* Address Text Input */}
              <TextField
                error={Boolean(formErrors?.addressString)}
                helperText={formErrors?.addressString}
                value={formData?.addressString || ""}
                label="Address *"
                sx={{ marginBottom: "8px" }}
                fullWidth
                id="addressString"
                onChange={handleFormChange}
              />
            </Box>

            {/*-------------------- Notes ----------------- */}
            <Box
              sx={{
                // backgroundColor: "#f4f4f494",
                padding: "0px 10px",
                marginLeft: "10px",
                borderRadius: "8px",
                // marginTop: "10px",
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "12px",
                  fontWeight: "400",
                  fontSize: "15px",
                }}
              >
                Notes
              </Typography>

              {/* Textarea Input */}
              <TextField
                error={Boolean(formErrors?.notes)}
                helperText={formErrors?.notes}
                value={formData?.notes || ""}
                id="notes"
                multiline
                rows={2}
                label="Notes"
                sx={{ width: "100%" }}
                onChange={handleFormChange}
              />
            </Box>

            {/* {!isEditData && (
              <ContactsTable
                error={formErrors?.contacts}
                isError={Boolean(formErrors?.contacts)}
                onContactsChange={handleContactsChange}
              ></ContactsTable>
            )} */}
          </div>
        </div>
        {!isEditData && (
          <ContactsTable
            error={formErrors?.contacts}
            isError={Boolean(formErrors?.contacts)}
            onContactsChange={handleContactsChange}
          ></ContactsTable>
        )}

        <div className="form-actions">
          {isAddCompanyError && (
            <p className="invalid-message">
              {addError?.responseError?.failed?.response?.msg ||
                "An Error Occurred, please try Again"}
            </p>
          )}

          {isEditError && (
            <p className="invalid-message">
              {editError?.responseError?.failed?.response?.msg ||
                "An Error Occurred, please try Again"}
            </p>
          )}

          {isEditData && (
            <FormButton
              isLoading={editCompanyPending}
              buttonText="Edit"
              className="main-btn form-add-btn"
              onClick={handleEdit}
              type="submit"
            ></FormButton>
          )}

          {!isEditData && (
            <FormButton
              isLoading={addCompanyLoading}
              buttonText="Add"
              className="main-btn form-add-btn"
              onClick={handleSubmit}
              type="submit"
            ></FormButton>
          )}
        </div>
      </form>
    </div>
  );
};

export default MutationForm;
