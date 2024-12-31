import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, Tab, Typography, Box } from "@mui/material";
// components
import ArabicReceipt from "./ArabicReceipt";
import EnglishReceipt from "./EnglishReceipt";

// utils
import { getDataForTableRows } from "../../utils/tables";
// contexts
import { UserContext } from "../../contexts/UserContext";
// requests
import { getReceiptsFn } from "../../requests/receipts";
const ReceiptPage = ({ data, onClose, paymentId, membershipId }) => {
  const { token } = useContext(UserContext);

  // membershipt receipt query
  const {
    data: membershipReceiptObj,
    isLoading: membershipReceiptLoading,
    isError: error1,
  } = useQuery({
    queryFn: () => {
      return getReceiptsFn(
        {
          membershipId: membershipId,
        },
        token,
        { isFormData: false }
      );
    },
    enabled: !!membershipId,
    queryKey: ["membershipReceipt", membershipId],
  });
  const membershipReceipt = getDataForTableRows(
    membershipReceiptObj?.success?.response?.data
  )[0];

  // payment receipt
  const {
    data: paymentReceiptObj,
    isLoading: paymentLoading,
    isError: error2,
  } = useQuery({
    queryFn: () => {
      return getReceiptsFn(
        {
          paymentId: paymentId,
        },
        token,
        { isFormData: false }
      );
    },
    enabled: !!paymentId,

    queryKey: ["paymentReceipt", paymentId],
  });
  const paymentReceipt = getDataForTableRows(
    paymentReceiptObj?.success?.response?.data
  )[0];

  let receiptData = {};
  // 1- normal receipt
  if (data?.id) {
    receiptData = { ...data };
  }
  //2- membership receipt
  if (membershipId) {
    receiptData = { ...membershipReceipt };
  }
  //3- payment receipt
  if (paymentId) {
    receiptData = { ...paymentReceipt };
  }

  // states
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

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

  if (paymentLoading || membershipReceiptLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          minWidth: "700px",
          minHeight: "40vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error1 || error2) {
    return (
      <div
        className="invalid-message"
        style={{
          textAlign: "center",
          minWidth: "700px",
          minHeight: "40vh",
        }}
      >
        Can't Find Receipt Data
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4"></Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        centered
      >
        <Tab label="Arabic Receipt" />
        <Tab label="English Receipt" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {tabIndex == 0 && <ArabicReceipt data={receiptData}></ArabicReceipt>}
        {tabIndex == 1 && <EnglishReceipt data={receiptData}></EnglishReceipt>}
      </Box>
    </Box>
  );
};

export default ReceiptPage;
