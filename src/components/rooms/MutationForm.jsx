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
// Requests
import { editRoomFn, createRoomFn, getBranchesFn } from "../../requests/rooms";
// validations
import { validateAddRoom } from "../../utils/requestValidations";
// utils
import { getDataForTableRows } from "../../utils/tables";

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    pcFlag: "0",
    specialNeedsFlag: "0",
    screenFlag: "0",
    whiteBoardFlag: "0",
  });
  const [formErrors, setFormErrors] = useState({});

  // --------- request data for dropdowns -----------

  // branches
  const { data: branchesList, isLoading: branchesLoading } = useQuery({
    queryFn: () => {
      return getBranchesFn(
        {
          numOfElements: "2000",
          companyId: "1",
        },
        token
      );
    },

    queryKey: ["branches"],
  });
  const branches = getDataForTableRows(branchesList?.success?.response?.data);

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
  useEffect(() => {
    if (!isEditData || !data) return;

    // Handle edit data initialization
    const rawFormData = {
      id: [data.id],
      branchId: data?.BranchID?.id || "",
      capacity: data?.Capacity || "",
      descriptionEn: data?.Description_en || "",
      nameAr: data?.Name_ar || "",
      nameEn: data?.Name_en || "",
      roomCode: data?.RoomCode || "",
      screenFlag: data?.ScreenFlag || "",
      specialNeedsFlag: data?.SpecialNeedsFlag || "",
      whiteBoardFlag: data?.WhiteBoardFlag || "",
      pcFlag: data?.PcFlag || "",
    };

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [isEditData, data]);

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
    e.preventDefault();

    const errors = validateAddRoom(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      editRoom({
        reqBody: formData,
        token,
      });
    }
  };

  return (
    <div className="course-form-page">
      <form>
        <div className="course-form">
          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            {/* Left Side */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Autocomplete
                loading={branchesLoading}
                value={
                  branches.find((branch) => branch.id == formData.branchId) ||
                  null
                }
                options={branches}
                getOptionLabel={(option) => option?.Name_en}
                onChange={(e, value) => {
                  setFormData({ ...formData, branchId: value?.id || "" });
                }}
                renderInput={(params) => (
                  <TextField
                    id="branchId"
                    error={Boolean(formErrors?.branchId)}
                    helperText={formErrors?.branchId}
                    {...params}
                    label="Branch *"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                )}
              />
              <TextField
                id="nameEn"
                onChange={handleFormChange}
                error={Boolean(formErrors?.nameEn)}
                helperText={formErrors?.nameEn}
                value={formData?.nameEn || ""}
                label="Room Name (EN) *"
                name="roomName"
              />

              <TextField
                id="nameAr"
                onChange={handleFormChange}
                error={Boolean(formErrors?.nameAr)}
                helperText={formErrors?.nameAr}
                value={formData?.nameAr || ""}
                label="Room Name (AR) *"
                name="roomName"
              />

              <TextField
                id="roomCode"
                onChange={handleFormChange}
                error={Boolean(formErrors?.roomCode)}
                helperText={formErrors?.roomCode}
                value={formData?.roomCode || ""}
                label="Room Code *"
                name="roomCode"
              />
              <TextField
                id="capacity"
                onChange={handleFormChange}
                error={Boolean(formErrors?.capacity)}
                helperText={formErrors?.capacity}
                value={formData?.capacity || ""}
                label="Room Capacity *"
                name="capacity"
                type="number"
              />
            </Box>

            {/* Right Side */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Room Description *"
                placeholder="Room Description/Notes"
                id="descriptionEn"
                onChange={handleFormChange}
                // error={formErrors?.descriptionEn ? true : undefined} //
                error={Boolean(formErrors?.descriptionEn)}
                helperText={formErrors?.descriptionEn}
                value={formData?.descriptionEn || ""}
                multiline
                minRows={4}
                fullWidth
                variant="outlined"
                style={{
                  padding: 1,
                  borderRadius: 4,
                }}
              />

              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="screenFlag"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          screenFlag: e.target.checked ? "1" : "0",
                        })
                      }
                      checked={formData?.screenFlag == "1"} // Ensure this is properly handled
                      name="hasProjector"
                    />
                  }
                  label="Has Projector?"
                />
                <FormHelperText></FormHelperText>
              </FormControl>

              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="pcFlag"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pcFlag: e.target.checked ? "1" : "0",
                        })
                      }
                      checked={formData?.pcFlag == "1"} // Ensure this is properly handled
                      name="hasComputers"
                    />
                  }
                  label="Has Computers?"
                />
                <FormHelperText></FormHelperText>
              </FormControl>

              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="whiteBoardFlag"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whiteBoardFlag: e.target.checked ? "1" : "0",
                        })
                      }
                      checked={formData?.whiteBoardFlag == "1"} // Ensure this is properly handled
                      name="hasWhiteBoard"
                    />
                  }
                  label="Has White Board?"
                />
                <FormHelperText></FormHelperText>
              </FormControl>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="specialNeedsFlag"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialNeedsFlag: e.target.checked ? "1" : "0",
                        })
                      }
                      checked={formData?.specialNeedsFlag == "1"} // Ensure this is properly handled
                      name="isAccessible"
                    />
                  }
                  label="Is Accessible (Special Needs)?"
                />
                <FormHelperText></FormHelperText>
              </FormControl>
            </Box>
          </Box>
        </div>

        <div className="form-actions">
          {isEditError && (
            <p className="invalid-message">
              {editingRoomError?.responseError?.failed?.response?.msg ||
                "An Error Occured, please try again"}
            </p>
          )}

          {isAddRoomError && (
            <p className="invalid-message">
              {addRoomError?.responseError?.failed?.response?.msg ||
                "An Error Occured, please try again"}
            </p>
          )}

          {isEditData && (
            <FormButton
              isLoading={editRoomLoading}
              buttonText="Edit"
              className="main-btn form-add-btn"
              onClick={handleEdit}
              type="submit"
            />
          )}

          {!isEditData && (
            <FormButton
              isLoading={addRoomLoading}
              buttonText="Add"
              className="main-btn form-add-btn"
              onClick={handleSubmit}
              type="submit"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default MutationForm;
