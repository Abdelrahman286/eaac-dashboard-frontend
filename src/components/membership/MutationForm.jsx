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

// Requests
import { editRoomFn, createRoomFn, getBranchesFn } from "../../requests/rooms";
import { getStudentFn, getPaymentMethodsFn } from "../../requests/membership";

// validations
import { validateAddRoom } from "../../utils/requestValidations";

// utils
import { getDataForTableRows } from "../../utils/tables";
import { generateRandomNumber } from "../../utils/functions";

// dummy data
const membershipTypes = [
  { id: 1, value: "student" },
  { id: 2, value: "lifetime" },
];

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [selectedStudent, setSelectedStudent] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});

  const handleSelectStudent = (_selectedStudent) => {
    console.log(_selectedStudent);
    setSelectedStudent(_selectedStudent);
  };

  // --------- request data for dropdowns -----------
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // send course data
  const {
    mutate: sendRoomData,
    isPending: addRoomLoading,
    isError: isAddRoomError,
    error: addRoomError,
  } = useMutation({
    mutationFn: createRoomFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["room-pagination"]);
      queryClient.invalidateQueries(["room-list"]);
      showSnackbar("Room Added Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at adding new Room", error);
      showSnackbar("Failed to Add New Room", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAddRoom(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      sendRoomData({
        reqBody: formData,
        token,
      });
    }
  };

  //   initialize edit data filling
  //   useEffect(() => {
  //     if (!isEditData || !data) return;

  //     // Handle edit data initialization
  //     const rawFormData = {
  //       id: [data.id],
  //       branchId: data?.BranchID?.id || "",
  //       capacity: data?.Capacity || "",
  //       descriptionEn: data?.Description_en || "",
  //       nameAr: data?.Name_ar || "",
  //       nameEn: data?.Name_en || "",
  //       roomCode: data?.RoomCode || "",
  //       screenFlag: data?.ScreenFlag || "",
  //       specialNeedsFlag: data?.SpecialNeedsFlag || "",
  //       whiteBoardFlag: data?.WhiteBoardFlag || "",
  //       pcFlag: data?.PcFlag || "",
  //     };

  //     // Remove properties with empty string, null, or undefined values
  //     const newFormData = Object.fromEntries(
  //       Object.entries(rawFormData).filter(([_, value]) => value)
  //     );

  //     console.log(newFormData);

  //     setFormData(newFormData);
  //   }, [isEditData, data]);

  const {
    mutate: editRoom,
    isPending: editRoomLoading,
    isError: isEditError,
    error: editingRoomError,
  } = useMutation({
    mutationFn: editRoomFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["room-pagination"]);
      queryClient.invalidateQueries(["room-list"]);
      showSnackbar("Room is Edited Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at editing Room data", error);
      showSnackbar("Faild to edit Room Data", "error");
    },
  });

  const handleEdit = (e) => {
    // e.preventDefault();
    // const errors = validateAddRoom(formData);
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    // } else {
    //   setFormErrors({});
    //   editRoom({
    //     reqBody: formData,
    //     token,
    //   });
    // }
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

  const handleImgInput = (e) => {
    // const selectedImage = e.target.files[0];
    // console.log(selectedImage);

    // // check if user upload non image data
    // if (!selectedImage?.type?.startsWith("image")) {
    //   return setImageErrorMsg(true);
    // }
    // if (selectedImage) {
    //   setFormData({ ...formData, logo: [selectedImage] });
    //   setImage(URL.createObjectURL(selectedImage));
    //   setImageErrorMsg(false);
    // }

    setFormData({ ...formData, img: URL.createObjectURL(e.target.files[0]) });
  };

  return (
    <div className="membership-form-page">
      {/* student data section  */}
      <Box>
        <SearchableDropdown
          styles={{
            width: "600px",
            // padding: "0px",
            // marginTop: "-12px",
          }}
          //   isError={Boolean(formErrors?.group)}
          //   helperText={formErrors?.group}
          //   error={true}
          onSelect={handleSelectStudent}
          isFromData={false}
          label="Student *"
          fetchData={getStudentFn}
          queryKey="studentForMemebership"
          getOptionLabel={(option) => `[${option?.id}] - ${option?.Name} `}
          getOptionId={(option) => option.id} // Custom ID field
        ></SearchableDropdown>
      </Box>

      {/* Student Data */}
      <Box>
        {selectedStudent?.id ? (
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
                {selectedStudent?.Name || "N/A"}
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
                {selectedStudent?.PhoneNumber || "N/A"}
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
                {selectedStudent?.CourseID?.CourseCode || "N/A"}
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
                  {selectedStudent?.StartDate?.split(" ")[0] || "N/A"}
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
                <Typography variant="body1">
                  {selectedStudent?.EndDate?.split(" ")[0] || "N/A"}
                </Typography>
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
                {selectedStudent?.CourseID?.NonMemberPrice || "N/A"}
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
        <Typography
          sx={{ textAlign: "center", mt: 1 }}
          variant="body2"
          color="text.secondary"
        >
          New Membership
        </Typography>
        <Autocomplete
          sx={{
            flex: 1,
          }}
          //   value={students.find((item) => item.id == clientId) || null}
          //   onChange={(e, value) => {
          //     handleStudentSelect(value);
          //   }}
          //   loading={studentLoading}
          options={membershipTypes || []}
          getOptionLabel={(option) => `${option?.value}` || ""}
          size="small"
          renderInput={(params) => (
            <TextField {...params} label="Membership Type" fullWidth />
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
            label="Memebership Code"
            variant="outlined"
            fullWidth
            type="number"
            value={formData?.membershipCode || ""}
            onChange={handleFormChange}
            id="membershipCode"
          />
          <Button
            color="success"
            variant="outlined"
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
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          size={"small"}
          label="End Date"
          variant="outlined"
          fullWidth
          type="Date"
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
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleImgInput}
        />

        {formData?.img && (
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
                src={formData?.img || ""}
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
          readOnly
          value="1200"
          fullWidth
          type="number"
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
          onChange={(e, value) => setSelectedPaymentMethod(value)}
          options={paymentMethods}
          getOptionLabel={(option) => option.Method_en || ""}
          size="small"
          renderInput={(params) => (
            <TextField
              id="paymentMethod"
              error={Boolean(formErrors?.paymentMethod)}
              helperText={formErrors?.paymentMethod}
              {...params}
              label="Payment Method"
              fullWidth
            />
          )}
        />

        <TextField
          label="Notes"
          placeholder="Notes"
          id="notes"
          //   onChange={handleFormChange}
          //   error={Boolean(formErrors?.descriptionEn)}
          //   helperText={formErrors?.descriptionEn}
          //   value={formData?.descriptionEn || ""}
          multiline
          minRows={2}
          fullWidth
          variant="outlined"
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          pb: 2,
        }}
      >
        <FormButton
          style={{
            width: "180px",
          }}
          //   isLoading={addRoomLoading}
          //   onClick={handleSubmit}
          //   type="submit"
          buttonText="Pay Membership"
          className="main-btn form-add-btn"
        />
      </Box>
    </div>
  );
};

export default MutationForm;
