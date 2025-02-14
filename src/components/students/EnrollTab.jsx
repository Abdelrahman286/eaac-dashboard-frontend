import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Divider,
  CircularProgress,
} from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// requests
import {
  getRoundsFn,
  getPaymentMethodsFn,
  getPromoCodes,
  calculatePriceFn,
  enrollFn,
} from "../../requests/students";

// utils
import { getDataForTableRows } from "../../utils/tables";

// validation
import { validateEnroll } from "../../utils/validateStudents";

// components
import SearchableDropdown from "../SearchableDropdown";

const EnrollTab = ({ data, closeFn }) => {
  const { showSnackbar } = useContext(AppContext);
  const { token, hasPermission } = useContext(UserContext);
  const [formErrors, setFormErrors] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({});
  const [selectedPromoCode, setSelectedPromoCode] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [deposit, setDeposit] = useState();

  const handleRoundSelect = (selectedRound) => {
    setSelectedGroup(selectedRound);
  };

  // payment methods (Method_en)
  const { data: paymentMethodsList, isLoading: paymentMethodLoading } =
    useQuery({
      queryFn: () => {
        return getPaymentMethodsFn(
          {
            numOfElements: "2000",
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

  // promo codes (VoucherCode)
  const { data: promoCodesList, isLoading: promoCodesLoading } = useQuery({
    queryFn: () => {
      return getPromoCodes(
        {
          numOfElements: "2000",
        },
        token,
        { isFormData: false }
      );
    },

    queryKey: ["promoCodes"],
  });
  const promoCodes = getDataForTableRows(
    promoCodesList?.success?.response?.data
  );

  // Calculate Price
  const { data: finalPrice_, isLoading: priceLoading } = useQuery({
    enabled: !!selectedGroup?.id,
    queryFn: () => {
      const payload = {
        studentId: data?.id,
        roundId: selectedGroup?.id,
        ...(selectedPromoCode
          ? { discountVoucherId: selectedPromoCode.id }
          : {}),
      };

      return calculatePriceFn(payload, token, { isFormData: false });
    },

    queryKey: ["finalPrice", selectedPromoCode],
  });
  const finalPrice = finalPrice_?.success?.response?.data;

  // Send Enroll data
  const {
    mutate: sendEnrollData,
    isPending: enrollLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: enrollFn,
    onSuccess: () => {
      showSnackbar("Student Enrolled Successfully ", "success");
      closeFn();
    },
    onError: (error) => {
      showSnackbar("Student Enrollment Failed", "error");
    },
  });

  const handleEnroll = () => {
    const errors = validateEnroll(
      selectedGroup,
      selectedPaymentMethod,
      deposit
    );

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      // send enroll request

      sendEnrollData({
        reqBody: {
          studentId: data?.id,
          roundId: selectedGroup?.id,
          paymentMethodId: selectedPaymentMethod?.id,
          discountVoucherId: selectedPromoCode?.id || "",
          deposit: deposit,
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
      {hasPermission("Enroll Client") && (
        <Box
          sx={{
            paddingBottom: "40px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <SearchableDropdown
              styles={{
                width: "100%",
                //   padding: "0px",
                //   marginTop: "-12px",
              }}
              isError={Boolean(formErrors?.group)}
              helperText={formErrors?.group}
              isFromData={false}
              // requestParams={{ studentId: 1 }}
              label="Round"
              fetchData={getRoundsFn}
              queryKey="rounds"
              getOptionLabel={(option) => `${option?.Name_en}`}
              getOptionId={(option) => option?.id} // Custom ID field
              onSelect={handleRoundSelect}
              error={true}
              placeholderText="Please Start Typing to Show Results"
            ></SearchableDropdown>

            {/* round data card  */}
            {selectedGroup?.id ? (
              <Box
                sx={{
                  padding: 2,
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
                    Group Capacity:
                  </Typography>
                  <Typography variant="body1">
                    {`${selectedGroup?.Capacity?.numOfAttendees || ""}`}/
                    {`${selectedGroup?.RoomID?.Capacity || ""}`}
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
                  <Typography variant="body1">{`${
                    selectedGroup?.Name_en || ""
                  }`}</Typography>
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
                    sx={{
                      opacity: data?.membership?.MembershipCode ? "0.5" : "1",
                    }}
                  >
                    Non Members Price
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: data?.membership?.MembershipCode ? "0.5" : "1",
                    }}
                  >
                    {selectedGroup?.CourseID?.NonMemberPrice || ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{
                      opacity: data?.membership?.MembershipCode ? "1" : "0.5",
                    }}
                  >
                    Members Price
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: data?.membership?.MembershipCode ? "1" : "0.5",
                    }}
                  >
                    {" "}
                    {selectedGroup?.CourseID?.MemberPrice || ""}
                  </Typography>
                </Box>
              </Box>
            ) : (
              ""
            )}
          </Box>
          {/* enroll actions  */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                loading={promoCodesLoading}
                value={
                  promoCodes.find((item) => item.id == selectedPromoCode?.id) ||
                  null
                }
                onChange={(e, value) => setSelectedPromoCode(value)}
                options={promoCodes}
                getOptionLabel={(option) => option.VoucherCode || ""}
                //------
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Discount/Promo Code"
                    margin="normal"
                    fullWidth
                  />
                )}
              />

              <Box
                sx={{
                  paddingLeft: "10px",
                  marginBottom: 1,
                  display: "flex",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Price After Discount
                </Typography>
                <Typography variant="body1">
                  {priceLoading
                    ? "Loading..."
                    : !finalPrice
                    ? "no discount"
                    : finalPrice}
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
                id="deposit"
                onChange={(e) => setDeposit(e.target.value)}
                error={Boolean(formErrors?.deposit)}
                helperText={formErrors?.deposit}
                value={deposit}
                type="number"
                InputLabelProps={{ shrink: true }}
                label="Deposit"
                name="deposit"
                size="small"
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
            <Box
              sx={{
                flex: 1,
                justifyContent: "flex-end",

                alignItems: "flex-end",
              }}
            >
              <Button
                sx={{ margin: 2 }}
                variant="contained"
                color="success"
                onClick={handleEnroll}
                disabled={enrollLoading}
              >
                {enrollLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Enroll"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {isAddError && (
        <p className="invalid-message">
          {addError?.responseError?.failed?.response?.msg ||
            "An Error Occured, please try again"}
        </p>
      )}
    </Box>
  );
};

export default EnrollTab;
