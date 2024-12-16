import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/Instructors.css";
// MUI
import {
  Box,
  Typography,
  FormControlLabel,
  Button,
  Checkbox,
  IconButton,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

// icons
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import DeselectIcon from "@mui/icons-material/Deselect";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// utils
import { getDataForTableRows } from "../../utils/tables";
// Requests
import {
  getPermissionsList,
  getAdminPermissions,
  editUserPermissions,
} from "../../requests/admins";

const Permissions = ({ onClose, id }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selected, setSelected] = useState({});

  // Get permissions list
  const { data: permissionsList, isLoading: permissionsListLoading } = useQuery(
    {
      queryFn: () =>
        getPermissionsList({ numOfElements: "2000" }, token, {
          isFormData: true,
        }),
      queryKey: ["permissionsList"],
    }
  );

  const permissions = getDataForTableRows(
    permissionsList?.success?.response?.data
  );

  // Get user permissions
  const { data: userPermissionsList, isLoading: userPermissionsLoading } =
    useQuery({
      queryFn: () =>
        getAdminPermissions({ numOfElements: "2000", userId: id }, token, {
          isFormData: true,
        }),
      queryKey: ["userPermissionsList"],
    });

  const userPermissions = getDataForTableRows(
    userPermissionsList?.success?.response?.data
  )[0]?.Permissions;

  const userPermissionsIds = userPermissions?.map((ele) => ele?.id);

  // Categorize permissions
  const categorizedData = permissions.reduce((acc, obj) => {
    const model = obj.Model;
    if (!acc[model]) acc[model] = [];
    acc[model].push(obj);
    return acc;
  }, {});

  // Initialize selected state with user permissions
  useEffect(() => {
    if (userPermissionsIds?.length !== 0) {
      const initialSelected = {};
      userPermissionsIds?.forEach((id) => {
        initialSelected[id] = true;
      });
      setSelected(initialSelected);
    }
  }, [userPermissions]);

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelected((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Select all permissions
  const handleSelectAll = () => {
    const allSelected = {};
    Object.keys(categorizedData).forEach((model) => {
      categorizedData[model].forEach((item) => {
        allSelected[item.id] = true;
      });
    });
    setSelected(allSelected);
  };

  // Deselect all permissions
  const handleDeselectAll = () => {
    setSelected({});
  };

  // send permissions data
  const {
    mutate: addPermissions,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: editUserPermissions,
    onSuccess: () => {
      setIsEditMode(false);
      queryClient.invalidateQueries(["permissionsList"]);
      queryClient.invalidateQueries(["userPermissionsList"]);
      showSnackbar("Permissions Added Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Modify Permissions", "error");
    },
  });

  // Save changes
  const handleSave = () => {
    const updatedPermissions = Object.keys(selected).filter(
      (id) => selected[id]
    );
    addPermissions({
      reqBody: {
        userId: id,
        permissionId: updatedPermissions,
      },
      token,
      config: {
        isFormData: false,
      },
    });
  };

  // Cancel changes
  const handleCancel = () => {
    setIsEditMode(false);
    const initialSelected = {};
    userPermissionsIds?.forEach((id) => {
      initialSelected[id] = true;
    });
    setSelected(initialSelected);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          //   justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          flexDirection: "column",
        }}
      >
        <Box width={"100%"}>
          {isEditMode ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  flexDirection: "row",
                  marginBottom: 1,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{ marginRight: 1 }}
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={!addLoading && <SaveIcon />}
                  onClick={handleSave}
                  disabled={addLoading}
                  color="success"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {addLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Box>

              {isEditMode && (
                <Box>
                  <Tooltip title="Select All" arrow>
                    <IconButton
                      onClick={handleSelectAll}
                      sx={{ marginRight: 1 }}
                      color="primary"
                    >
                      <SelectAllIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deselect All" arrow>
                    <IconButton onClick={handleDeselectAll} color="primary">
                      <DeselectIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditMode(true)}
            >
              Edit Permissions
            </Button>
          )}
        </Box>
      </Box>

      {permissionsListLoading || userPermissionsLoading ? (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CircularProgress></CircularProgress>
        </Box>
      ) : (
        ""
      )}

      {/* Permissions Grid */}
      {Object.keys(categorizedData).map((model) => (
        <Box key={model} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            {model}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 1,
            }}
          >
            {categorizedData[model].map((item) => (
              <Box key={item.id} sx={{ display: "flex", alignItems: "center" }}>
                {isEditMode ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selected[item.id]}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    }
                    label={item.Name_en}
                  />
                ) : (
                  <>
                    {userPermissionsIds?.includes(item.id) ? (
                      <CheckIcon color={"success"} sx={{ marginRight: 1 }} />
                    ) : (
                      <CloseIcon color={"error"} sx={{ marginRight: 1 }} />
                    )}
                    <Typography>{item.Name_en}</Typography>
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Permissions;
