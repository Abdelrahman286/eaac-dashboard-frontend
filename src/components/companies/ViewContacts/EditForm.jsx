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

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// Requests
import { editContactFn } from "../../../requests/companies";

// validations
import { validateEditContact } from "./validateContacts";

const EditForm = ({ contact, onCancel, companyId }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // initial data filling
  useEffect(() => {
    const {
      Name,
      JobTitle,
      PhoneNum1,
      PhoneNum2,
      WhatsAppNum,
      Email1,
      Notes,
      id,
    } = contact;

    const intialFill = {
      id: [id],
      companyId: companyId,
      name: Name || "",
      jobTitle: JobTitle || "",
      phoneNum1: PhoneNum1 || "",
      phoneNum2: PhoneNum2 || "",
      whatsAppNum: WhatsAppNum || "",
      email1: Email1 || "",
      notes: Notes || "",
    };

    setFormData(intialFill);
  }, []);

  // Edit Mutation
  const {
    mutate: editContact,
    isPending: editLoading,
    isError,
    error,
  } = useMutation({
    onError: (error) => {
      //   console.log(error.responseError?.failed?.response?.msg);
      console.log("Error at editing Session data", error);
      showSnackbar("Faild to edit Session Data", "error");
    },
    mutationFn: editContactFn,
    onSuccess: (res) => {
      onCancel();
      queryClient.invalidateQueries(["companyContacts"]);
      showSnackbar("Contact Data Edited Successfully", "success");
    },
  });

  const handleSubmit = () => {
    const errors = validateEditContact(formData);

    console.log(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      editContact({
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
            error={Boolean(formErrors?.name)}
            helperText={formErrors?.name}
            value={formData?.name || ""}
            onChange={handleFormChange}
            id="name"
            size="small"
            label="Name *"
            name="Name"
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            error={Boolean(formErrors?.phoneNum1)}
            helperText={formErrors?.phoneNum1}
            value={formData?.phoneNum1 || ""}
            onChange={handleFormChange}
            id="phoneNum1"
            size="small"
            label="Phone 1"
            name="Name"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            error={Boolean(formErrors?.phoneNum2)}
            helperText={formErrors?.phoneNum2}
            value={formData?.phoneNum2 || ""}
            onChange={handleFormChange}
            id="phoneNum2"
            size="small"
            label="Phone 2*"
            name="Name"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            error={Boolean(formErrors?.whatsAppNum)}
            helperText={formErrors?.whatsAppNum}
            value={formData?.whatsAppNum || ""}
            onChange={handleFormChange}
            id="whatsAppNum"
            size="small"
            label="What'sApp"
            name="Name"
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
          />

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
            InputLabelProps={{ shrink: true }}
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
            {editLoading ? "Loading..." : "Edit Contact"}
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
