import React, { useContext } from "react";

import html2pdf from "html2pdf.js";

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

const StudentReceiptModal = () => {
  const handleDownloadPdf = () => {
    // not working in arabic characters
  };
  const printSpecificElement = () => {
    const elementToPrint = document.querySelector(".receipt-section");
    if (!elementToPrint) return;

    // Open a new window to print the content
    const printWindow = window.open("", "", "height=600,width=800");

    // Write the basic HTML structure to the new window
    printWindow.document.write("<html><head><title>Print</title>");

    // Copy styles from the main document to the print window
    const styles = document.querySelectorAll("link[rel='stylesheet'], style");

    // Add the stylesheets to the print window
    styles.forEach((style) => {
      printWindow.document.write(style.outerHTML);
    });

    // Add a small CSS to ensure the printed content fits well
    printWindow.document.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .receipt-section {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          direction: rtl;
          width: 650px;
          margin: auto;
        }
           .receipt-box {
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    direction: rtl;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .header-left p {
    margin: 0;
  }

  .header-right {
    width: 25%;
  }

  .receipt-logo {
    width: 100%;
    border-radius: 4px;
  }

  /* Divider */
  .divider {
    margin: 16px 0;
    border: none;
    border-top: 1px solid #ddd;
  }

  /* Content */
  .content {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .content p {
    margin-bottom: 8px;
  }

  .content-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  /* Summary */
  .summary {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
      </style>
    `);

    printWindow.document.write("</head><body>");

    // Write the content of the receipt-section element to the new window
    printWindow.document.write(elementToPrint.outerHTML);

    printWindow.document.write("</body></html>");
    printWindow.document.close();

    // Wait for the window to load, then trigger the print dialog
    printWindow.onload = () => {
      printWindow.print(); // Open the print dialog
    };
  };

  return (
    <div className="student-receipt-modal">
      <div className="separator"></div>
      <br></br>
      <div className="receipt-section">
        <div className="receipt-box">
          <div className="header">
            <div className="header-left">
              <p>
                <strong>رقم#</strong> 324325
              </p>
              <p>
                <strong>التاريخ</strong>
                <span>{receiptData?.created_at || "..."}</span>
              </p>
            </div>
            <div className="header-right">
              <img src={receiptLogo} alt="Logo" className="receipt-logo" />
            </div>
          </div>

          <hr className="divider" />

          <div className="content">
            <p>
              <strong> العميل:</strong> احمد محمد محمود حسن
            </p>
            <p>
              <strong> المبلغ:</strong> 1200 (EGP)
            </p>
            <div className="content-row">
              <p>
                <strong> طريقه الدفع:</strong> visa
              </p>
              <p>
                <strong>كوبون الخصم:</strong> ABCD132
              </p>
            </div>
            <p>
              <strong> رقم الموبايل:</strong> 1032131432324
            </p>
            <p>
              <strong> البيان:</strong> ايصال اشتراك في مجموعه
            </p>
            <p>
              <strong> ملاحظات:</strong> ...
            </p>
            <p>
              <strong> المجموعه | الدوره:</strong> محاسبه
            </p>
            <p>
              <strong> اجمالي سعر الدوره:</strong> 2000 (EGP)
            </p>
          </div>

          <hr className="divider" />

          <div className="summary">
            <div className="summary-row">
              <p>
                <strong> المدفوع:</strong> 1200
              </p>
              <p>
                <strong> المتبقي:</strong> 200
              </p>
            </div>
            <div className="summary-row">
              <p>
                <strong> المسلم:</strong> احمد محمد
              </p>
              <p>
                <strong> كود الموظف:</strong> 214
              </p>
            </div>
            <div className="summary-row">
              <p>
                <strong> التوقيع:</strong>
              </p>
              <p>
                <strong> فرع:</strong> الاسكندريه
              </p>
            </div>
          </div>
        </div>
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
