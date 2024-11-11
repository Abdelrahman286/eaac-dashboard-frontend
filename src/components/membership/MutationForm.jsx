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
} from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";
import SearchableDropdown from "../SearchableDropdown";

// Requests
import { editRoomFn, createRoomFn, getBranchesFn } from "../../requests/rooms";
import { getStudentFn } from "../../requests/membership";

// validations
import { validateAddRoom } from "../../utils/requestValidations";

// utils
import { getDataForTableRows } from "../../utils/tables";

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [selectedStudent, setSelectedStudent] = useState({});
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
          label="Student"
          fetchData={getStudentFn}
          queryKey="studentForMemebership"
          getOptionLabel={(option) => `${option?.Name}- ${option?.id}`}
          getOptionId={(option) => option.id} // Custom ID field
        ></SearchableDropdown>
      </Box>
    </div>
  );
};

export default MutationForm;
