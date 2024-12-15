import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../styles/Instructors.css";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Checkbox,
  TextareaAutosize,
  FormControl,
  FormHelperText,
  FormGroup,
  Typography,
  FormControlLabel,
} from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";

// Requests
import {
  getPermissionsList,
  getAdminPermissions,
  editUserPermissions,
} from "../../requests/admins";

// validations
import { validateAdd, validateEdit } from "./validate";

// utils
import { getDataForTableRows } from "../../utils/tables";

const Permissions = ({ onClose, id }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // get permissions list
  const { data: permissionsList, isLoading: permissionsLoading } = useQuery({
    queryFn: () => {
      return getPermissionsList(
        {
          numOfElements: "2000",
        },
        token,
        {
          isFormData: true,
        }
      );
    },

    queryKey: ["permissionsList"],
  });
  const permissions = getDataForTableRows(
    permissionsList?.success?.response?.data
  );

  // user permissions
  const { data: userPermissionsList, isLoading: userPermissionsLoading } =
    useQuery({
      queryFn: () => {
        return getAdminPermissions(
          {
            numOfElements: "2000",
            userId: id,
          },
          token,
          {
            isFormData: true,
          }
        );
      },

      queryKey: ["userPermissionsList"],
    });
  const userPermissions = getDataForTableRows(
    userPermissionsList?.success?.response?.data
  );

  console.log(userPermissions);

  // categorizing permissions list
  const categorizedData = permissions.reduce((acc, obj) => {
    const model = obj.Model;
    if (!acc[model]) {
      acc[model] = [];
    }
    acc[model].push(obj);
    return acc;
  }, {});

  const [selected, setSelected] = useState({});

  const handleCheckboxChange = (id) => {
    setSelected((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div>
      <Box sx={{ padding: 2 }}>
        {Object.keys(categorizedData).map((model) => (
          <Box key={model} sx={{ marginBottom: 4 }}>
            {/* Display the Model name */}
            <Typography variant="h6" gutterBottom>
              {model}
            </Typography>
            {/* Grid container for checkboxes */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 1,
              }}
            >
              {categorizedData[model].map((item) => {
                return (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={!!selected[item.id]}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    }
                    label={item.Name_en}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Permissions;
