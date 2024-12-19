import React, { useContext, useEffect } from "react";

import html2pdf from "html2pdf.js";

import "../../styles/students.css";

import { Box, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

// images
import receiptLogo from "../../assets/receipt-logo.png";

const ReceiptModal = ({ data, onClose }) => {
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

  const handlePrintPdf = () => {
    const documentClass = "receipt-box";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        margin: [10, 20, 0, 20], // [top, left, bottom, right] in px
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Increase scale for better quality
          logging: true,
          width: 750, // Set width to 750px
          windowWidth: 750, // Match the capture area to the div size
          allowTaint: true, // Allow cross-origin images
          useCORS: true, // Enable CORS for cross-origin image support
        },
        jsPDF: {
          unit: "px", // Use pixels for precise size control
          format: [750, 1050], // Set format width to 750px
          orientation: "portrait",
          putTotalPages: true,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"], // Avoid breaking important elements
        },
      };

      // Use html2pdf to convert the element to PDF
      html2pdf().from(element).set(opt).save();
    } else {
      console.error(`Element with class ${documentClass} not found.`);
    }
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
                <strong>رقم#</strong> <span>{data?.BillCode || "..."}</span>
              </p>
              <p>
                <strong>التاريخ</strong>{" "}
                <span>{data?.created_at || "..."}</span>
              </p>
            </div>
            <div className="header-right">
              <img src={receiptLogo} alt="Logo" className="receipt-logo" />
            </div>
          </div>

          <hr className="divider" />

          <div className="content">
            <p>
              <strong> العميل</strong> <span>{data?.Payor?.Name || "..."}</span>
            </p>
            <p>
              <strong> المبلغ</strong> <span>{data?.totalPrice || "..."}</span>
            </p>
            <div className="content-row">
              <p>
                <strong> طريقه الدفع</strong>{" "}
                <span> {data?.PaymentMethodID?.Method_en || "..."}</span>
              </p>
              <p>
                <strong>كوبون الخصم</strong>{" "}
                <span> {data?.DiscountVoucherID?.VoucherCode || "..."}</span>
              </p>
            </div>
            <p>
              <strong> رقم الموبايل</strong>{" "}
              <span>{data?.Payor?.PhoneNumber || "..."}</span>
            </p>
            <p>
              <strong>كود العضويه</strong>{" "}
              <span>{data?.MembershipID?.MembershipCode || "..."}</span>
            </p>
            <p>
              <strong> البيان </strong>
              <span>{data?.Description || "..."}</span>
            </p>
            <p>
              <strong> ملاحظات</strong> <span>{data?.Notes || "..."}</span>
            </p>

            <div className="content-row">
              <p>
                <strong> المجموعه | الدوره</strong>{" "}
                <span> {data?.RoundID?.Name_en || "..."}</span>
              </p>
              <p>
                <strong>الكورس</strong> <span> {data?.course || "..."}</span>
              </p>
            </div>
            <p>
              <strong> اجمالي سعر الدوره</strong>
              <span>{data?.totalPrice || "???"}</span>
            </p>
          </div>

          <hr className="divider" />

          <div className="summary">
            <div className="summary-row">
              <p>
                <strong> المدفوع</strong> <span>{data?.Debit || "???"}</span>
              </p>
              <p>
                <strong> المتبقي</strong> <span>{data?.rem || "???"}</span>
              </p>
            </div>
            <div className="summary-row">
              <p>
                <strong>اسم الموظف</strong> <span>??</span>
              </p>
              <p>
                <strong> كود الموظف</strong> <span>??</span>
              </p>
            </div>
            <div className="summary-row">
              <p>
                <strong> التوقيع</strong>
              </p>
              <p>
                <strong> فرع</strong> <span>???</span>
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
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<PrintIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
          onClick={handlePrintPdf}
        >
          Print PDF
        </Button>
      </Box>
    </div>
  );
};

export default ReceiptModal;
