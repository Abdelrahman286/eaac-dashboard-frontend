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
  transferStudentFn,
  getPaymentMethodsFn,
  getPromoCodes,
  calculatePriceFn,
  enrollFn,
} from "../../requests/students";

// utils
import { getDataForTableRows } from "../../utils/tables";

// components
import SearchableDropdown from "../SearchableDropdown";

// validation
import { validateTransfer } from "../../utils/validateStudents";

const TransferTab = ({ data, groups, closeFn }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [formErrors, setFormErrors] = useState({});
  const [selectedPromoCode, setSelectedPromoCode] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [paidNow, setPaidNow] = useState("");

  const [selectedCurrentGroup, setCurrentGroup] = useState({});
  const [selectedTargetGroup, setTargetGroup] = useState({});

  const handleSelectTarget = (selectedRound) => {
    console.log(selectedRound);
    setTargetGroup(selectedRound);
  };

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

  //------------ Send Transfer data
  const { mutate: sendTransferData, isPending: transferLoading } = useMutation({
    mutationFn: transferStudentFn,
    onSuccess: () => {
      showSnackbar("Student Transfered Successfully ", "success");
      closeFn();
    },
    onError: (error) => {
      showSnackbar("Student Transfer Failed", "error");
    },
  });

  const handleTransfer = () => {
    const errors = validateTransfer(
      selectedCurrentGroup,
      selectedTargetGroup,
      selectedPaymentMethod,
      paidNow
    );

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      // send transfer request

      sendTransferData({
        reqBody: {
          studentId: data?.id,
          currentRoundId: selectedCurrentGroup?.id,
          targetRoundId: selectedTargetGroup?.id,
          paymentMethodId: selectedPaymentMethod?.id,
          discountVoucherId: selectedPromoCode?.id || "",
          deposit: paidNow,
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
      {/* current group */}

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
            groups.find((item) => item.id == selectedCurrentGroup?.id) || null
          }
          onChange={(e, value) => setCurrentGroup(value)}
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

        {selectedCurrentGroup?.id ? (
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
                ??/{`${selectedCurrentGroup?.RoomID?.Capacity || ""}`}
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
                {`${selectedCurrentGroup?.Name_en || ""}`}
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
                {`${selectedCurrentGroup?.CourseID?.Name_en || ""} `}
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
                {`${selectedCurrentGroup?.CourseID?.CourseCode || ""} `}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Room
              </Typography>
              <Typography variant="body1">
                {`${selectedCurrentGroup?.RoomID?.RoomCode || ""} `}
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
                {selectedCurrentGroup?.StartDate?.split(" ")[0] || ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                End Date
              </Typography>
              <Typography variant="body1">
                {selectedCurrentGroup?.EndDate?.split(" ")[0] || ""}
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
                {selectedCurrentGroup?.CourseID?.NonMemberPrice || ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Members Price
              </Typography>
              <Typography variant="body1">
                {selectedCurrentGroup?.CourseID?.MemberPrice || ""}
              </Typography>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Box>

      {/* Transfer To */}
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
          sx={{ textAlign: "center", marginTop: "10px" }}
          color="primary"
        >
          Transfer To
        </Typography>
        <SearchableDropdown
          styles={{
            marginTop: 1,
          }}
          //   styles={{ width: "48%" }}
          isError={Boolean(formErrors?.targetGroup)}
          helperText={formErrors?.targetGroup}
          isFromData={false}
          requestParams={{ studentId: 1 }}
          label="Traget Round"
          fetchData={getRoundsFn}
          queryKey="rounds"
          getOptionLabel={(option) => `${option?.Name_en}`}
          getOptionId={(option) => option?.id} // Custom ID field
          onSelect={handleSelectTarget}
        ></SearchableDropdown>

        {/* round data card  */}
        {selectedTargetGroup?.id ? (
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
                ??/{`${selectedTargetGroup?.RoomID?.Capacity || ""}`}
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
                {`${selectedTargetGroup?.Name_en || ""}`}
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
                {`${selectedTargetGroup?.CourseID?.Name_en || ""} `}
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
                {`${selectedTargetGroup?.CourseID?.CourseCode || ""} `}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Room
              </Typography>
              <Typography variant="body1">
                {`${selectedTargetGroup?.RoomID?.RoomCode || ""} `}
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
                {selectedTargetGroup?.StartDate?.split(" ")[0] || ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                End Date
              </Typography>
              <Typography variant="body1">
                {selectedTargetGroup?.EndDate?.split(" ")[0] || ""}
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
                {selectedTargetGroup?.CourseID?.NonMemberPrice || ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Members Price
              </Typography>
              <Typography variant="body1">
                {selectedTargetGroup?.CourseID?.MemberPrice || ""}
              </Typography>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Box>

      {/* Transfer Actions  */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ flex: 1, padding: 2 }}>
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
              Current Group
            </Typography>
            <Typography variant="body1">
              {selectedCurrentGroup?.Name_en || ""}
            </Typography>
          </Box>

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
              Target Group/Round
            </Typography>
            <Typography variant="body1">
              {" "}
              {selectedTargetGroup?.Name_en || ""}
            </Typography>
          </Box>
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
            InputProps={{ readOnly: true }}
            sx={{ marginTop: "8x" }}
            id="difference"
            value={"??"}
            //   onChange={handleFormChange}
            //   error={Boolean(formErrors?.nameEn)}
            //   helperText={formErrors?.nameEn}
            //   value={}
            InputLabelProps={{ shrink: true }}
            label="Difference"
            name="difference"
            size="small"
          />
          <TextField
            sx={{ marginTop: "12px" }}
            id="paidNow"
            onChange={(e) => setPaidNow(e.target.value)}
            error={Boolean(formErrors?.paidNow)}
            helperText={formErrors?.paidNow}
            value={paidNow}
            type="number"
            InputLabelProps={{ shrink: true }}
            label="Paid Now"
            name="paidNow"
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
        <Box sx={{ flex: 1 }}>
          <Button
            sx={{ margin: 2 }}
            variant="contained"
            color="success"
            onClick={handleTransfer}
          >
            {transferLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "  Pay & Transfer Student"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TransferTab;
