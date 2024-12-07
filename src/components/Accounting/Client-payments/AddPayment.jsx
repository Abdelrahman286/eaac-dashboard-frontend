import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import "../../../styles/accounting.css";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// utils
import {
  getStudentFn,
  getRoundsFn,
  getPaymentMethodsFn,
  getExtrasFn,
  addPayemntFn,
} from "../../../requests/ClientPayments";

// components
import SearchableDropdown from "../../SearchableDropdown";

// validation
import { validateAddPayment } from "./validate";

// utils
import { getDataForTableRows } from "../../../utils/tables";

const AddPayment = ({ onClose }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [courseId, setCourseId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState({});
  const [selectedRound, setSelectedRound] = useState({});
  const [selectedExtra, setSelectedExtra] = useState({});

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // fix z index issue for header inputs
  useEffect(() => {
    const header = document.querySelector(".header-wrapper");

    if (header) {
      header.style.zIndex = 0;
      // Capture and store original zIndex values
      const childElements = header.querySelectorAll("*");
      const originalZIndexes = Array.from(childElements).map(
        (element) => element.style.zIndex
      );

      // Set zIndex to 0 for all elements inside the header
      childElements.forEach((element) => {
        element.style.zIndex = 0;
      });

      // Cleanup function to restore original zIndex values
      return () => {
        childElements.forEach((element, index) => {
          element.style.zIndex = originalZIndexes[index];
        });
      };
    }
  }, []);

  // rounds list
  const { data: groupsList, isLoading: groupsLoading } = useQuery({
    retry: 2,
    enabled: !!formData?.clientId,
    queryFn: () => {
      return getRoundsFn(
        {
          numOfElements: "2000",
          ...(formData?.clientId && { studentId: formData?.clientId }),
        },

        token,
        { isFormData: true }
      );
    },
    queryKey: ["studentGroupsForAddPayment", formData?.clientId],
  });
  const rounds = getDataForTableRows(groupsList?.success?.response?.data);

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

  // course extras
  const { data: courseExtrasList, isLoading: courseExtrasLoading } = useQuery({
    queryFn: () => {
      return getExtrasFn(
        {
          numOfElements: "9000",
          courseId: courseId,
          //   courseId: 52,
        },
        token,
        { isFormData: true }
      );
    },
    enabled: !!formData?.roundId,
    queryKey: ["courseExtras", courseId],
  });
  const courseExtras = getDataForTableRows(
    courseExtrasList?.success?.response?.data
  );

  const {
    mutate: addPayment,
    isPending: addLoading,
    isError: isError,
    error: addError,
  } = useMutation({
    mutationFn: addPayemntFn,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientPayments-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientPayments-list"],
      });
      showSnackbar("Payment Submitted Successfully", "success");
      onClose();
    },
    onError: (error) => {
      showSnackbar("Error At Adding New Payment", "error");
    },
  });
  const handleSubmit = () => {
    const errors = validateAddPayment(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      addPayment({
        reqBody: cleanedFormData,
        token,
        config: {
          isFormData: false,
        },
      });
    }
  };

  return (
    <div>
      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 1 }}
      >
        {/* 3 Dropdowns row */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <SearchableDropdown
              isError={Boolean(formErrors?.clientId)}
              helperText={formErrors?.clientId}
              onSelect={(_client) => {
                setSelectedStudent(_client);
                setFormData({ ...formData, clientId: _client?.id || "" });
              }}
              fetchData={getStudentFn}
              isFromData={false}
              label="Student"
              queryKey="studentForReceipt"
              // to limit the number of elements in dropdown
              requestParams={{ numOfElements: 50 }}
              getOptionLabel={(option) => `[${option?.id}] - ${option?.Name} `}
              getOptionId={(option) => option.id} // Custom ID field
            ></SearchableDropdown>
          </Box>
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              value={
                rounds.find((item) => item.id == formData?.roundId) || null
              }
              onChange={(e, value) => {
                setCourseId(value?.CourseID?.id);
                setSelectedRound(value);
                setFormData({ ...formData, roundId: value?.id || "" });
              }}
              loading={groupsLoading}
              options={rounds || []}
              getOptionLabel={(option) => option?.Name_en || ""}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Group/Round"
                  error={Boolean(formErrors?.roundId)}
                  helperText={formErrors?.roundId}
                  fullWidth
                />
              )}
            />
          </Box>{" "}
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              value={
                courseExtras.find((item) => item.id == formData?.extraId) ||
                null
              }
              onChange={(e, value) => {
                setSelectedExtra(value);
                setFormData({ ...formData, extraId: value?.id || "" });
              }}
              loading={courseExtrasLoading}
              options={courseExtras || []}
              getOptionLabel={(option) => option?.Name_en || ""}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Course Extra" fullWidth />
              )}
            />
          </Box>
        </Box>

        {/* student Data  */}
        <Box>
          <Box
            sx={{
              padding: 2,
              margin: "4px 0px",
              border: "1px solid #ddd",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Student Information
            </Typography>

            <Box sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Name
              </Typography>
              <Typography variant="body1">
                {selectedStudent?.Name || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Phone Number
              </Typography>
              <Typography variant="body1">
                {selectedStudent?.PhoneNumber || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />
            <Box sx={{ mb: 1, display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Membership Code
              </Typography>
              <Typography variant="body1">
                {selectedStudent?.membership?.MembershipCode || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {selectedStudent?.membership?.startAt || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  End Date
                </Typography>
                <Typography variant="body1">
                  {selectedStudent?.membership?.endAt || "N/A"}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Membership Type
              </Typography>
              <Typography variant="body1">
                {selectedStudent?.membership?.MembershipTypeID?.Name_en ||
                  "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Round Payment Data  */}
        {!selectedExtra?.id && selectedRound?.id ? (
          <Box>
            <Box
              sx={{
                padding: 2,
                margin: "4px 0px",
                border: "1px solid #ddd",
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Round Payment
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Selected Group
                </Typography>
                <Typography variant="body1">
                  {selectedRound?.Name_en || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Total (EGP)
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent?.StartDate?.split(" ")[0] || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Paid (EGP)
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent?.EndDate?.split(" ")[0] || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Remaining (EGP)
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent?.EndDate?.split(" ")[0] || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}

        {/* extra data */}
        {selectedExtra?.id && (
          <Box>
            <Box
              sx={{
                padding: 2,
                margin: "4px 0px",
                border: "1px solid #ddd",
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Course Extra Data
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Selected Extra
                </Typography>
                <Typography variant="body1">
                  {selectedExtra?.Name_en || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Member Price (EGP)
                  </Typography>
                  <Typography variant="body1">
                    {selectedExtra?.MemberPrice || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Non Member Price (Egp)
                  </Typography>
                  <Typography variant="body1">
                    {selectedExtra?.NonMemberPrice || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* payment inputs  */}
        <Box>
          <TextField
            id="paymentAmount"
            onChange={(e) => {
              setFormData({ ...formData, paymentAmount: e.target.value || "" });
            }}
            error={Boolean(formErrors?.paymentAmount)}
            helperText={formErrors?.paymentAmount}
            value={formData?.paymentAmount || ""}
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Paid Amount (EGP)"
            name="paymentAmount"
            size="small"
            style={{ margin: "10px 0px" }}
          />
          <Autocomplete
            loading={paymentMethodLoading}
            value={
              paymentMethods.find(
                (item) => item.id == formData?.paymentMethodId
              ) || null
            }
            onChange={(e, value) => {
              setFormData({ ...formData, paymentMethodId: value?.id || "" });
            }}
            options={paymentMethods}
            getOptionLabel={(option) => option.Method_en || ""}
            size="small"
            renderInput={(params) => (
              <TextField
                id="paymentMethod"
                error={Boolean(formErrors?.paymentMethodId)}
                helperText={formErrors?.paymentMethodId}
                {...params}
                label="Payment Method"
                fullWidth
              />
            )}
          />
          <TextField
            id="paymentAmount"
            onChange={(e) => {
              setFormData({ ...formData, notes: e.target.value || "" });
            }}
            error={Boolean(formErrors?.notes)}
            helperText={formErrors?.notes}
            value={formData?.notes || ""}
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Notes"
            name="paymentAmount"
            size="small"
            rows={3}
            multiline
            style={{ margin: "10px 0px" }}
          />
        </Box>

        {isError && (
          <p className="invalid-message">
            {addError?.responseError?.failed?.response?.msg ||
              "An Error Occurred, please try Again"}
          </p>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => {
              handleSubmit();
            }}
            size="small"
            variant="contained"
            color="success"
            sx={{
              minWidth: "130px", // Constant width
              paddingY: 0.1,
              height: "40px",
              padding: "16px 4px",
              borderRadius: "20px",
            }}
          >
            {addLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Pay"
            )}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default AddPayment;
