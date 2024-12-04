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
import { addExtraFn } from "../../../requests/courses";
// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// valdiation
import { validateAdd } from "./validateExtras";

// icons
import AddIcon from "@mui/icons-material/Add";

const AddNewExtra = ({ id }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const {
    mutate: addExtra,
    isPending: addLoading,
    isError: isError,
    error: error,
  } = useMutation({
    mutationFn: addExtraFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["courseExtras"]);
      showSnackbar("New Extra Added Successfully", "success");
      setShowAddForm(false);
    },
    onError: (error) => {
      showSnackbar("Faild to add New Course Extra", "error");
    },
  });
  const handleSubmit = () => {
    const errors = validateAdd(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log(errors);
    } else {
      setFormErrors({});
      console.log(id);
      const newObj = {
        ...formData,
        courseId: id,
        sellSeparately: 0,
      };
      addExtra({ reqBody: newObj, token });
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
            Add Extra
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
              error={Boolean(formErrors?.name_en)}
              helperText={formErrors?.name_en}
              value={formData?.name_en || ""}
              onChange={handleFormChange}
              id="name_en"
              size="small"
              label="Name *"
              name="name_en"
              fullWidth
            />
            <TextField
              error={Boolean(formErrors?.description_en)}
              helperText={formErrors?.description_en}
              value={formData?.description_en || ""}
              onChange={handleFormChange}
              id="description_en"
              size="small"
              label="Description"
              name="description_en"
              fullWidth
            />
            <TextField
              error={Boolean(formErrors?.extraType)}
              helperText={formErrors?.extraType}
              value={formData?.extraType || ""}
              onChange={handleFormChange}
              id="extraType"
              size="small"
              label="Type"
              name="extraType"
              fullWidth
            />
            <TextField
              error={Boolean(formErrors?.memberPrice)}
              helperText={formErrors?.memberPrice}
              value={formData?.memberPrice || ""}
              onChange={handleFormChange}
              type="number"
              id="memberPrice"
              size="small"
              label="Member Price *"
              name="memberPrice"
              fullWidth
            />
            <TextField
              error={Boolean(formErrors?.nonMemberPrice)}
              helperText={formErrors?.nonMemberPrice}
              value={formData?.nonMemberPrice || ""}
              onChange={handleFormChange}
              type="nonMemberPrice"
              id="nonMemberPrice"
              size="small"
              label="Non Member Price *"
              name="nonMemberPrice"
              fullWidth
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
              {addLoading ? "Loading..." : "Add Extra"}
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

export default AddNewExtra;
