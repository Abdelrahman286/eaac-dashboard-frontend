import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  FormControl,
  FormHelperText,
  Typography,
  Divider,
  Button,
} from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";
import SearchableDropdown from "../SearchableDropdown";

import {
  createMemebershipFn,
  getPaymentMethodsFn,
  getMemebershipPricesFn,
  renewMembershipFn,
} from "../../requests/membership";

// validations
import { validateAddMembership, validateRenew } from "./validation";

// utils
import { getDataForTableRows } from "../../utils/tables";
import {
  generateRandomNumber,
  convertDateFormat,
  convertDateFormatStudent,
  convertDateFromDashToSlash,
  convertDateFormatStudentReverse,
} from "../../utils/functions";

const membershipTypes = [
  { id: 1, value: "lifetime" },
  { id: 2, value: "student" },
];

const membershipCardStatus = [
  { id: 6, value: "Requested to print" },
  { id: 7, value: "Ready to Deliver" },
  { id: 8, value: "Deleivered" },
];

const Renew = ({ onClose, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    period: "Annual",
  });
  const [formErrors, setFormErrors] = useState({});

  const [selectedStudent, setSelectedStudent] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [previewImg, setPreviewImg] = useState("");

  // --------- request data for dropdowns -----------
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // fix z index issue for header inputs
  useEffect(() => {
    const header = document.querySelector(".header-wrapper");

    if (header) {
      header.style.zIndex = 0;
      // Capture and store original zIndex values
      const childElements = header.querySelectorAll("*");
      const originalZIndexes = Array.from(childElements).map(
        (element) => element.style.zIndex
      );

      // Set zIndex to 0 for all elements inside the header
      childElements.forEach((element) => {
        element.style.zIndex = 0;
      });

      // Cleanup function to restore original zIndex values
      return () => {
        childElements.forEach((element, index) => {
          element.style.zIndex = originalZIndexes[index];
        });
      };
    }
  }, []);

  // send course data
  const {
    mutate: renewMembership,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: renewMembershipFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["membership-pagination"]);
      queryClient.invalidateQueries(["membership-list"]);
      showSnackbar("Membership Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Add New Membership", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateRenew(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      renewMembership({
        reqBody: formData,
        token,
      });
    }
  };

  //   initialize edit data filling
  useEffect(() => {
    if (!data) return;
    // Handle edit data initialization
    const rawFormData = {
      clientId: data?.UserID?.id || "",
      membershipTypeId: data?.MembershipTypeID?.id || "",
      membershipCode: data?.MembershipCode || "",
      cardStatusId: data?.CardStatusID?.id,
      period: "Annual",

      startDate: convertDateFormatStudentReverse(data?.endAt) || "",

      //   statusId: data?.StatusID?.id || "",
    };

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [data]);

  // payment methods (Method_en)
  const { data: paymentMethodsList, isLoading: paymentMethodLoading } =
    useQuery({
      queryFn: () => {
        return getPaymentMethodsFn(
          {
            // numOfElements: "2000",
          },
          token,
          { isFormData: false }
        );
      },

      queryKey: ["paymentMethods"],
    });
  const paymentMethods = getDataForTableRows(
    paymentMethodsList?.success?.response?.data
  );

  // Membership prices
  const { data: membershipPricesList, isLoading: loadingMembershipPrices } =
    useQuery({
      queryFn: () => {
        return getMemebershipPricesFn(
          {
            // numOfElements: "2000",
          },
          token,
          { isFormData: false }
        );
      },

      queryKey: ["membershipPrices"],
    });
  const membershipPrices = getDataForTableRows(
    membershipPricesList?.success?.response?.data
  );

  const handleImgInput = (e) => {
    const selectedImage = e.target.files[0];

    setPreviewImg(URL.createObjectURL(selectedImage));
    setFormData({ ...formData, image: [selectedImage] });
  };

  const handleFeeChange = (membershiptType) => {
    if (!membershiptType?.value) return;
    if (Array.isArray(membershipPrices) && membershipPrices?.length !== 0) {
      let finalPrice = 0;

      // student membership price
      if (membershiptType?.value == "student") {
        finalPrice =
          membershipPrices.find((ele) => ele.Name_en == "Student")?.Fee || "";
      }
      // lifeTime membership price
      if (membershiptType?.value == "lifetime") {
        finalPrice =
          membershipPrices.find((ele) => ele.Name_en == "Life Time")?.Fee || "";
      }

      return finalPrice;
    } else {
      return "";
    }
  };

  return (
    <div className="membership-form-page">
      {/* Student Data */}
      <Box>
        {data?.id ? (
          <Box
            sx={{
              padding: 2,
              margin: "4px 0px",
              border: "1px solid #ddd",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Student Information
            </Typography>

            <Box sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Name
              </Typography>
              <Typography variant="body1">
                {data?.UserID.Name || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Phone Number
              </Typography>
              <Typography variant="body1">
                {data?.UserID.PhoneNumber || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />
            <Box sx={{ mb: 1, display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Membership Code
              </Typography>
              <Typography variant="body1">
                {data?.MembershipCode || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {data?.startAt || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  End Date
                </Typography>
                <Typography variant="body1">{data?.endAt || "N/A"}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Membership Status
              </Typography>
              <Typography variant="body1">
                {data?.StatusID?.Name_en || "N/A"}
              </Typography>
            </Box>
          </Box>
        ) : null}
      </Box>

      {/* new membership form */}
      <Box
        sx={{
          my: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Field 1 : Membership type */}
        <Autocomplete
          sx={{
            flex: 1,
          }}
          value={
            membershipTypes.find(
              (item) => item?.id == formData?.membershipTypeId
            ) || null
          }
          onChange={(e, value) => {
            setFormData({
              ...formData,
              fee: handleFeeChange(value),
              membershipTypeId: value?.id || "",
            });
          }}
          options={membershipTypes || []}
          getOptionLabel={(option) => `${option?.value}` || ""}
          size="small"
          renderInput={(params) => (
            <TextField
              error={Boolean(formErrors?.membershipTypeId)}
              helperText={formErrors?.membershipTypeId}
              {...params}
              label="Membership Type"
              fullWidth
            />
          )}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            size={"small"}
            label="Membership Code"
            variant="outlined"
            fullWidth
            type="number"
            value={formData?.membershipCode || ""}
            onChange={handleFormChange}
            id="membershipCode"
            name="membershipCode"
            error={Boolean(formErrors?.membershipCode)}
            helperText={formErrors?.membershipCode}
          />
          <Button
            color="success"
            variant="outlined"
            sx={{
              height: "40px",
            }}
            onClick={() => {
              setFormData({
                ...formData,
                membershipCode: generateRandomNumber(),
              });
            }}
          >
            Generate
          </Button>
        </Box>

        <TextField
          size={"small"}
          label="Start Date"
          variant="outlined"
          fullWidth
          type="Date"
          value={convertDateFormatStudent(formData?.startDate) || ""}
          id="startDate"
          error={Boolean(formErrors?.startDate)}
          helperText={formErrors?.startDate}
          onChange={(e) => {
            setFormData({
              ...formData,
              startDate: convertDateFormat(e.target.value),
            });
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          size={"small"}
          label="Photo"
          variant="outlined"
          fullWidth
          type="file"
          error={Boolean(formErrors?.image)}
          helperText={formErrors?.image}
          id="image"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleImgInput}
        />
        {previewImg && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 150, // Set width for the square
                height: 150, // Set height to match width, creating a square
                overflow: "hidden",
                borderRadius: 2, // Optional: Adds rounded corners
                display: "flex", // Centers image in the square
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={previewImg || ""}
                alt={""}
                sx={{
                  width: "100%", // Ensures the image covers the entire box
                  height: "100%",
                  objectFit: "cover", // Crops the image to fill the square without stretching
                }}
              />
            </Box>
          </Box>
        )}
        <TextField
          size={"small"}
          label="Membership Fees"
          variant="outlined"
          value={formData?.fee || ""}
          onChange={handleFormChange}
          id="fee"
          name="fee"
          fullWidth
          type="number"
          error={Boolean(formErrors?.fee)}
          helperText={formErrors?.fee}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Autocomplete
          loading={paymentMethodLoading}
          value={
            paymentMethods.find(
              (item) => item.id == selectedPaymentMethod?.id
            ) || null
          }
          onChange={(e, value) => {
            setSelectedPaymentMethod(value);
            setFormData({ ...formData, paymentMethodId: value?.id });
          }}
          options={paymentMethods}
          getOptionLabel={(option) => option.Method_en || ""}
          size="small"
          renderInput={(params) => (
            <TextField
              id="paymentMethod"
              error={Boolean(formErrors?.paymentMethodId)}
              helperText={formErrors?.paymentMethodId}
              {...params}
              label="Payment Method"
              fullWidth
            />
          )}
        />

        <Autocomplete
          sx={{
            flex: 1,
          }}
          value={
            membershipCardStatus.find(
              (item) => item.id == formData?.cardStatusId
            ) || null
          }
          onChange={(e, value) => {
            setFormData({ ...formData, cardStatusId: value?.id || "" });
          }}
          options={membershipCardStatus || []}
          getOptionLabel={(option) => `${option?.value}` || ""}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              error={Boolean(formErrors?.cardStatusId)}
              helperText={formErrors?.cardStatusId}
              label="Membership Card (Status)"
              fullWidth
            />
          )}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",

          pb: 1,
        }}
      >
        <FormButton
          style={{
            width: "180px",
          }}
          isLoading={addLoading}
          onClick={handleSubmit}
          buttonText="Renew Membership"
          className="main-btn form-add-btn"
        />
      </Box>

      {isAddError && (
        <p className="invalid-message">
          {addError?.responseError?.failed?.response?.msg ||
            "An Error Occurred, please try Again"}
        </p>
      )}
    </div>
  );
};

export default Renew;
