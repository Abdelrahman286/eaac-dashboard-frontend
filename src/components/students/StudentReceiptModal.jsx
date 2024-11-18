import React, { useContext } from "react";

import html2pdf from "html2pdf.js";
import "../../styles/companies.css";

import FormButton from "../FormButton";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/students.css";

import {
  Box,
  Typography,
  Divider,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { useQuery } from "@tanstack/react-query";

// utils
import { getDataForTableRows } from "../../utils/tables";

// images
import receiptLogo from "../../assets/receipt-logo.png";
import { amiriFontBase64 } from "../../assets/fonts/Amiri-Regular-normal";
const StudentReceiptModal = () => {
  const handleDownloadPdf = () => {
    // not working in arabic characters
  };

  const printSpecificElement = () => {
    const elementToPrint = document.querySelector(".receipt-section");
    if (!elementToPrint) return;

    // Open a new window to print the content
    const printWindow = window.open("", "", "height=600,width=800");

    // Copy all the stylesheets from the current document to the print window
    const styles = document.querySelectorAll("link[rel='stylesheet'], style");

    printWindow.document.write("<html><head><title>Print</title>");

    // Add the stylesheets to the print window
    styles.forEach((style) => {
      printWindow.document.write(style.outerHTML);
    });

    printWindow.document.write("</head><body>");

    // Write the content of the specific element to the new window
    printWindow.document.write(elementToPrint.outerHTML); // Include the entire content

    printWindow.document.write("</body></html>");
    printWindow.document.close();

    // Wait for the window to load, then trigger the print dialog
    printWindow.onload = () => {
      printWindow.print(); // Open the print dialog
      // Uncomment the following line if you want to close the print window after printing
      // printWindow.close();
    };
  };

  return (
    <div className="student-receipt-modal">
      <div className="separator"></div>
      <br></br>
      <div className="receipt-section">
        <Box
          sx={{
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            direction: "rtl",
            width: 650,
            margin: "auto",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography variant="h6">
                <strong>رقم#</strong> 324325
              </Typography>
              <Typography variant="body1">
                <strong>التاريخ</strong> 2024-10-10
              </Typography>
            </Box>
            <Box sx={{ width: "25%" }}>
              <img
                src={receiptLogo}
                alt="Logo"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Content */}
          <Box mt={2} mb={2}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong> العميل:</strong> احمد محمد محمود حسن
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong> المبلغ:</strong> 1200 (EGP)
            </Typography>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1">
                <strong> طريقه الدفع:</strong> visa
              </Typography>
              <Typography variant="body1">
                <strong>كوبون الخصم:</strong> ABCD132
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong> رقم الموبايل:</strong> 1032131432324
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong> البيان:</strong> ايصال اشتراك في مجموعه
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong> ملاحظات:</strong> ...
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong> المجموعه | الدوره:</strong> محاسبه
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong> اجمالي سعر الدوره:</strong> 2000 (EGP)
            </Typography>
          </Box>

          <Divider />

          {/* Summary */}
          <Box mt={2} mb={2}>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1">
                <strong> المدفوع:</strong> 1200
              </Typography>
              <Typography variant="body1">
                <strong> المتبقي:</strong> 200
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1">
                <strong> المسلم:</strong> احمد محمد
              </Typography>
              <Typography variant="body1">
                <strong> كود الموظف:</strong> 214
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">
                <strong> التوقيع:</strong>
              </Typography>
              <Typography variant="body1">
                <strong> فرع:</strong> الاسكندريه
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>
      <br></br>
      <div className="separator"></div>
      {/* action buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 2,
          borderRadius: "8px",
          //   backgroundColor: "#f5f5f5",
          //   boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          //   width: "100%",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
          onClick={() => {
            console.log("Download clicked");
            handleDownloadPdf();
          }}
        >
          Download
        </Button> */}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<PrintIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
          onClick={() => {
            console.log("Print clicked");
            printSpecificElement();
          }}
        >
          Print
        </Button>
      </Box>
    </div>
  );
};

export default StudentReceiptModal;
