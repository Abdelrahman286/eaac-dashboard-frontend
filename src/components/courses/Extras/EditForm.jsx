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
import { editExtraFn } from "../../../requests/courses";

// validations
import { validateEdit } from "./validateExtras";

const EditForm = ({ extra, onCancel, courseId }) => {
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
      id,
      Name_en,
      Description_en,
      ExtraType,
      MemberPrice,
      NonMemberPrice,
    } = extra;

    const intialFill = {
      id: [id],
      name_en: Name_en || "",
      description_en: Description_en || "",
      extraType: ExtraType || "",
      memberPrice: MemberPrice || "",
      nonMemberPrice: NonMemberPrice || "",
    };

    setFormData(intialFill);
  }, []);

  // Edit Mutation
  const {
    mutate: editExtra,
    isPending: editLoading,
    isError,
    error,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Faild to edit Course Extra Data", "error");
    },
    mutationFn: editExtraFn,
    onSuccess: (res) => {
      onCancel();
      queryClient.invalidateQueries(["courseExtras"]);
      showSnackbar("Course Extra Data Edited Successfully", "success");
    },
  });

  const handleSubmit = () => {
    const errors = validateEdit(formData);

    console.log(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      editExtra({
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
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "10px",
            gap: 1,
          }}
        >
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
          <Button variant="outlined" color="error" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editLoading ? "Loading..." : "Edit Extra"}
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
