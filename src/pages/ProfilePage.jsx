import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Button,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// requests
import {
  getProfileData,
  getCountriesFn,
  getCompanyBranchesFn,
  editProfileFn,
} from "../requests/profile";

// utils
import { getDataForTableRows } from "../utils/tables";
// contexts
import { AppContext } from "../contexts/AppContext";
import { UserContext } from "../contexts/UserContext";

// validation
import { validateEditProfile } from "../utils/validateProfile";
// Define Custom Theme
const customTheme = createTheme({
  palette: {
    primary: {
      main: "#6200ea", // Custom purple
    },
    secondary: {
      main: "#03dac5", // Custom teal
    },
    background: {
      //   paper: "#f5f5f5", // Light gray background for sections
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#757575",
    },
  },
  typography: {
    h5: {
      fontWeight: "bold",
    },
    body1: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12, // Custom border radius for components
  },
});

const ProfileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
}));

const Section = styled(Box)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
}));

const UserProfile = () => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token, user, logout } = useContext(UserContext);

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const { data: userDataObj, isLoading: getUserLoading } = useQuery({
    queryFn: () => {
      return getProfileData(
        {
          id: user?.id,
        },
        token
      );
    },
    enabled: !!user?.id,

    queryKey: ["userProfileData"],
  });
  const userData = userDataObj?.success?.response?.data || {};

  useEffect(() => {
    const { Name, PhoneNumber, Email2, WhatsappNumber, FacebookUrl } = userData;

    if (userData?.id) {
      const newObj = {
        id: [userData?.id],
        name: userData?.Name || "",
        email2: userData?.Email2 || "",
        whatsappNum: userData?.WhatsappNumber || "",
        facebookUrl: userData?.FacebookUrl || "",
        jobTitle: userData?.JobTitle || "",
        branchId: userData?.BranchID || "",
      };

      setFormData(newObj);
    }
  }, [isEdit]);

  // countries
  const { data: branchesList, isLoading: branchesLoading } = useQuery({
    queryFn: () => {
      return getCompanyBranchesFn(
        {
          numOfElements: "2000",
          companyId: 1,
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    retry: 2,

    queryKey: ["branches"],
  });

  // Data transformation : to only return arrays
  const branches = getDataForTableRows(branchesList?.success?.response?.data);

  const handleLogout = () => {
    logout();
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const {
    mutate: editProfile,
    isPending: editLoading,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: editProfileFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfileData"]);
      showSnackbar("Profile Data Edited Successfully", "success");
      setIsEdit(false);
    },
    onError: (error) => {
      showSnackbar("Faild to edit Profile Data", "error");
    },
  });
  const handleSubmit = () => {
    const errors = validateEditProfile(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      // edit profile data
      editProfile({ reqBody: formData, token });
    }
  };

  return (
    <Box
      sx={{
        width: " 100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ThemeProvider theme={customTheme}>
        <Box
          sx={{
            minWidth: "60%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Section 2: Avatar, Name, and Buttons */}
          <Section>
            <ProfileContainer>
              <Avatar
                alt="User Avatar"
                src={userData?.Image || ""} // Replace with user's avatar image
                sx={{ width: 100, height: 100, marginBottom: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {userData?.Name || ""}
              </Typography>
              {!isEdit ? (
                <Box display="flex" gap={2} marginTop={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEdit(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <Box display="flex" gap={2} marginTop={2}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleSubmit}
                  >
                    {editLoading ? "Loading..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setIsEdit(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </ProfileContainer>
          </Section>

          {/* Section 3: Personal Info */}

          {!isEdit ? (
            <>
              <Section>
                <Typography variant="h6" gutterBottom>
                  Personal Info
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Full Name"
                    value={userData?.Name || ""}
                    variant="outlined"
                    readOnly
                  />
                  <TextField
                    label="certificate"
                    value={userData?.JobTitle || ""}
                    variant="outlined"
                    readOnly
                  />
                  <TextField
                    label="Branch"
                    value={
                      branches.find((item) => item.id == userData?.BranchID)
                        ?.Name_en || ""
                    }
                    variant="outlined"
                    readOnly
                  />
                  <TextField
                    label="Country"
                    value={userData?.CountryID || ""}
                    variant="outlined"
                    readOnly
                  />
                </Box>
              </Section>

              {/* Section 4: Contact Info */}
              <Section>
                <Typography variant="h6" gutterBottom>
                  Contact Info
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Mobile"
                    value={userData?.PhoneNumber || ""}
                    variant="outlined"
                    readOnly
                    type="number"
                  />
                  <TextField
                    label="Email"
                    value={userData?.Email || ""}
                    variant="outlined"
                    readOnly
                  />
                  <TextField
                    label="Second Email"
                    value={userData?.Email2 || ""}
                    variant="outlined"
                    readOnly
                  />
                  <TextField
                    label="WhatsApp"
                    value={userData?.WhatsappNumber || ""}
                    variant="outlined"
                    readOnly
                    type="number"
                  />
                  <TextField
                    label="Materials/Hands-Out"
                    value={userData?.FacebookUrl || ""}
                    variant="outlined"
                    readOnly
                  />
                </Box>
              </Section>
            </>
          ) : (
            // edit form
            <>
              <Section>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Full Name *"
                    value={formData?.name || ""}
                    variant="outlined"
                    id="name"
                    onChange={handleFormChange}
                    error={Boolean(formErrors?.name)}
                    helperText={formErrors?.name}
                  />
                  <TextField
                    label="Second Email"
                    value={formData?.email2 || ""}
                    variant="outlined"
                    id="email2"
                    onChange={handleFormChange}
                  />

                  <TextField
                    label="WhatsApp *"
                    value={formData?.whatsappNum || ""}
                    variant="outlined"
                    id="whatsappNum"
                    onChange={handleFormChange}
                    error={Boolean(formErrors?.whatsappNum)}
                    helperText={formErrors?.whatsappNum}
                  />
                  <TextField
                    label="Facebook Profile"
                    value={formData?.facebookUrl || ""}
                    variant="outlined"
                    id="facebookUrl"
                    onChange={handleFormChange}
                  />
                  <TextField
                    label="Job Title *"
                    value={formData?.jobTitle || ""}
                    variant="outlined"
                    id="jobTitle"
                    onChange={handleFormChange}
                  />
                  <Autocomplete
                    onChange={(e, value) => {
                      setFormData({
                        ...formData,
                        branchId: value?.id,
                      });
                    }}
                    value={
                      branches.find((item) => item.id == formData?.branchId) ||
                      null
                    }
                    options={branches}
                    loading={branchesLoading}
                    getOptionLabel={(option) => option?.Name_en}
                    renderInput={(params) => (
                      <TextField
                        error={Boolean(formErrors?.branchId)}
                        helperText={formErrors?.branchId}
                        autoComplete="off"
                        autoCorrect="off"
                        {...params}
                        label="Branch *"
                        sx={{ marginBottom: "8px" }}
                      />
                    )}
                  />
                </Box>
              </Section>
            </>
          )}
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default UserProfile;
