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
import { addContactFn } from "../../../requests/companies";
// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// valdiation
import { validateContacts } from "./validateContacts";

const AddNewContact = ({ id }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const {
    mutate: addContact,
    isPending: addLoading,
    isError: isError,
    error: error,
  } = useMutation({
    mutationFn: addContactFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyContacts"]);
      showSnackbar("New Contact Successfully", "success");
    },
    onError: (error) => {
      showSnackbar("Faild to add New Contact", "error");
    },
  });
  const handleSubmit = () => {
    const errors = validateContacts(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log(errors);
    } else {
      setFormErrors({});
      console.log("send");
      const newObj = {
        ...formData,
        branchId: 1,
        companyId: id,
        title: formData?.jobTitle,
      };
      addContact({ reqBody: newObj, token, isFormData: true });
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        border: "1px solid #b1a7a6",
        borderRadius: "14px",
        padding: "20px 10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <TextField
          error={Boolean(formErrors?.name)}
          helperText={formErrors?.name}
          value={formData?.name || ""}
          onChange={handleFormChange}
          id="name"
          size="small"
          label="Name *"
          name="Name"
          fullWidth
        />
        <TextField
          error={Boolean(formErrors?.jobTitle)}
          helperText={formErrors?.jobTitle}
          value={formData?.jobTitle || ""}
          onChange={handleFormChange}
          id="jobTitle"
          size="small"
          label="Job Title *"
          name="Name"
          fullWidth
        />
        <TextField
          error={Boolean(formErrors?.email1)}
          helperText={formErrors?.email1}
          value={formData?.email1 || ""}
          onChange={handleFormChange}
          id="email1"
          size="small"
          label="Email *"
          name="Name"
          fullWidth
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <TextField
          error={Boolean(formErrors?.phoneNum1)}
          helperText={formErrors?.phoneNum1}
          value={formData?.phoneNum1 || ""}
          onChange={handleFormChange}
          id="phoneNum1"
          size="small"
          label="Phone Number 1 *"
          name="Name"
          fullWidth
        />
        <TextField
          error={Boolean(formErrors?.phoneNum2)}
          helperText={formErrors?.phoneNum2}
          value={formData?.phoneNum2 || ""}
          onChange={handleFormChange}
          id="phoneNum2"
          size="small"
          label="Phone Number 2*"
          name="Name"
          fullWidth
        />
        <TextField
          error={Boolean(formErrors?.whatsAppNum)}
          helperText={formErrors?.whatsAppNum}
          value={formData?.whatsAppNum || ""}
          onChange={handleFormChange}
          id="whatsAppNum"
          size="small"
          label="What's App Number"
          name="Name"
          fullWidth
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <TextField
          error={Boolean(formErrors?.notes)}
          helperText={formErrors?.notes}
          value={formData?.notes || ""}
          onChange={handleFormChange}
          id="notes"
          size="small"
          label="Notes"
          name="Name"
          fullWidth
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {addLoading ? "Loading..." : "Add Contact"}
        </Button>
      </Box>

      {isError && (
        <p className="invalid-message">
          {" "}
          {error?.responseError?.failed?.response?.msg ||
            "An Error Occurred, please try Again"}
        </p>
      )}
    </Box>
  );
};

export default AddNewContact;
