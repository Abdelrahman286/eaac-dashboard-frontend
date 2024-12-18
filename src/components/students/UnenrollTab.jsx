import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  Divider,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// requests
import {
  getRoundsFn,
  unEnrollStudentFn,
  getPaidAmountFn,
  getPaymentMethodsFn,
} from "../../requests/students";

// utils
import { getDataForTableRows } from "../../utils/tables";

// validation
import { validateUnEnroll } from "../../utils/validateStudents";

const UnenrollTab = ({ data, groups, closeFn }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token, hasPermission } = useContext(UserContext);

  const [formErrors, setFormErrors] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [refundAmount, setRefundAmount] = useState("");

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

  // get paid amount
  const { data: paidAmountObj, isLoading: paidAmountLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getPaidAmountFn(
        {
          studentId: data?.id,
          roundId: selectedGroup?.id,
        },
        token,
        { isFormData: false }
      );
    },

    queryKey: ["paidAmount", data?.id, selectedGroup?.id],
  });
  const paidAmount = paidAmountObj?.success?.response?.Balance;

  //------------ Send unEnroll data
  const { mutate: sendUnenrollData, isPending: unEnrollLoading } = useMutation({
    mutationFn: unEnrollStudentFn,
    onSuccess: () => {
      showSnackbar("Student Unenrolled Successfully ", "success");
      closeFn();
    },
    onError: (error) => {
      showSnackbar("Student Unenrollment Failed", "error");
    },
  });

  const handleUnenroll = () => {
    const errors = validateUnEnroll(
      selectedGroup,
      selectedPaymentMethod,
      refundAmount
    );

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      // send transfer request

      sendUnenrollData({
        reqBody: {
          studentId: data?.id,
          roundId: selectedGroup?.id,
          paymentMethodId: selectedPaymentMethod?.id,
          refund: refundAmount,
        },
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  return (
    <Box>
      {hasPermission("Unenroll Client") && (
        <Box
          sx={{
            paddingBottom: "40px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{ textAlign: "center", paddingTop: "10px" }}
              color="primary"
            >
              Current Group
            </Typography>

            <Autocomplete
              //   loading={promoCodesLoading}
              value={
                groups.find((item) => item.id == selectedGroup?.id) || null
              }
              onChange={(e, value) => setSelectedGroup(value)}
              options={groups}
              getOptionLabel={(option) => option.Name_en || ""}
              //------
              size="small"
              renderInput={(params) => (
                <TextField
                  error={Boolean(formErrors?.currentGroup)}
                  helperText={formErrors?.currentGroup}
                  {...params}
                  label="Current Groups"
                  margin="normal"
                  fullWidth
                />
              )}
            />

            {/* round data card  */}

            {selectedGroup?.id ? (
              <Box
                sx={{
                  // flex: 1,
                  padding: 2,
                  // maxWidth: 400,
                  // width: "48%",
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Round Data
                </Typography>

                <Box sx={{ marginBottom: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Group Capacity
                  </Typography>
                  <Typography variant="body1">
                    {" "}
                    ??/{`${selectedGroup?.RoomID?.Capacity || ""}`}
                  </Typography>
                </Box>

                <Box sx={{ marginBottom: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Group Name
                  </Typography>
                  <Typography variant="body1">
                    {`${selectedGroup?.Name_en || ""}`}
                  </Typography>
                </Box>

                <Box sx={{ marginBottom: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Course Name
                  </Typography>
                  <Typography variant="body1">
                    {" "}
                    {`${selectedGroup?.CourseID?.Name_en || ""} `}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Course Code
                  </Typography>
                  <Typography variant="body1">
                    {`${selectedGroup?.CourseID?.CourseCode || ""} `}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Room
                  </Typography>
                  <Typography variant="body1">
                    {`${selectedGroup?.RoomID?.RoomCode || ""} `}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedGroup?.StartDate?.split(" ")[0] || ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedGroup?.EndDate?.split(" ")[0] || ""}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Non Members Price
                  </Typography>
                  <Typography variant="body1">
                    {selectedGroup?.CourseID?.NonMemberPrice || ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Members Price
                  </Typography>
                  <Typography variant="body1">
                    {selectedGroup?.CourseID?.MemberPrice || ""}
                  </Typography>
                </Box>
              </Box>
            ) : (
              ""
            )}
          </Box>

          {/* unenroll actions  */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  paddingLeft: "10px",
                  marginBottom: 1,
                  display: "flex",
                  gap: 2,

                  padding: 3,
                  marginTop: "14px",
                  borderRadius: "20px",
                  border: "1px dashed gray",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Paid Amount For this round
                </Typography>
                <Typography variant="body1">
                  {paidAmountLoading ? "Loading..." : paidAmount || "-"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "16px 10px",
              }}
            >
              <TextField
                id="Refund(EGP)"
                onChange={(e) => setRefundAmount(e.target.value)}
                error={Boolean(formErrors?.paidNow)}
                helperText={formErrors?.paidNow}
                value={refundAmount}
                InputLabelProps={{ shrink: true }}
                label="Refund(EGP)"
                name="Refund(EGP)"
                size="small"
                type="number"
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
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Button
                sx={{ margin: 2 }}
                variant="contained"
                color="error"
                onClick={handleUnenroll}
              >
                {unEnrollLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Unenroll Student & Refund"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UnenrollTab;
