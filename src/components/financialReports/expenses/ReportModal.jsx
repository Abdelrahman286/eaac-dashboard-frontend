import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import html2pdf from "html2pdf.js";
import "../../../styles/financial-reports.css";
// MUI
import {
  Box,
  Chip,
  Avatar,
  Typography,
  Divider,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";

// contexts
import { UserContext } from "../../../contexts/UserContext";
import { AppContext } from "../../../contexts/AppContext";

// icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import companyLogo from "../../../assets/receipt-logo.png";
// requests
import { getExpensesReport } from "../../../requests/financialReports";

const ReportModal = ({ filterData, onClose, filterDataView }) => {
  const { token } = useContext(UserContext);
  const { paymentMethodId, startDate, endDate } = filterData;
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

  // get report data

  const {
    data: reportDataList,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => {
      return getExpensesReport(
        {
          numOfElements: "5000",
          ...(paymentMethodId && { paymentMethodId }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
        token,
        { isFormData: false }
      );
    },

    queryKey: ["expensesReportPdf", paymentMethodId, startDate, endDate],
  });
  const expensesReport = getDataForTableRows(
    reportDataList?.success?.response?.data
  );

  const handlePrintPdf = () => {
    const documentClass = "expenses-report";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        margin: [0, 20, 0, 20], // [top, left, bottom, right] in px (adjusted for 1200px width)
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Increase scale for better quality with larger width
          logging: true,
          width: 1200, // Set width to 1200px
          windowWidth: 1200, // Ensure the capture area matches the div size
          allowTaint: true, // Allow cross-origin images
          useCORS: true, // Enable CORS for cross-origin image support
        },
        jsPDF: {
          unit: "px", // Use pixels for precise size control
          format: [1240, 1754], // Width 1200px + 40px margins, height in pixels
          orientation: "portrait",
          putTotalPages: true,
        },
        pagebreak: {
          //   mode: ["avoid-all", "css", "legacy"],
        },
      };

      // Use html2pdf to convert the element to PDF
      html2pdf().from(element).set(opt).save();
    } else {
      console.error(`Element with class ${documentClass} not found.`);
    }
  };

  const getTotal = () => {
    let sum = 0;
    if (expensesReport?.length == 0 || !Array.isArray(expensesReport)) return 0;

    expensesReport?.forEach((ele) => {
      if (ele?.Debit) {
        sum += ele?.Debit;
      }
    });

    return sum;
  };

  return (
    <div>
      <div style={{ width: "900px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handlePrintPdf}
            size="small"
            variant="contained"
            color="success"
            startIcon={<PictureAsPdfIcon />}
            sx={{
              minWidth: "160px",
              paddingY: 0.1,
              height: "40px",
              padding: "16px 4px",
              borderRadius: "20px",
              marginTop: "20px",
            }}
          >
            Export PDF
          </Button>
        </Box>

        <div className="separator" style={{ margin: "10px 0px" }}></div>

        <div className="expenses-report">
          <AppBar
            position="static"
            sx={{ backgroundColor: "transparent", boxShadow: "none" }}
          >
            <Toolbar sx={{ justifyContent: "center", position: "relative" }}>
              {/* Logo on the left */}
              <Box
                component="img"
                src={companyLogo}
                alt="Logo"
                sx={{
                  height: 40,
                  position: "absolute",
                  left: 16,
                  cursor: "pointer",
                }}
              />
              {/* Centered Header Text */}
              <Typography
                variant="h6"
                component="div"
                sx={{ textAlign: "center", color: "black" }}
              >
                Expenses Report
              </Typography>
            </Toolbar>
          </AppBar>
          {/* header data */}
          <Box>
            <Box
              sx={{
                padding: 2,
                margin: "8px 0px",
                border: "1px solid #ddd",
                backgroundColor: "#fafafa",
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Branch
                  </Typography>
                  <Typography variant="body1">
                    {filterDataView?.branchId || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {filterDataView?.paymentMethodId || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {filterData?.startDate || "N/A"}
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
                    {filterData?.endDate || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Total Expenses
                  </Typography>
                  <Typography variant="body1">
                    {`${getTotal()} Egp` || "N/A"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifySelf: "flex-end",
                    justifyContent: "flex-end",
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    {`${new Date().getDate()}/${
                      new Date().getMonth() + 1
                    }/${new Date().getFullYear()}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* table data */}
          {isError && <p style={{ textAlign: "center" }}>No Rows Found</p>}
          {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
          {expensesReport?.length !== 0 && (
            <div>
              <div>
                <div className="report-table">
                  <div className="header">
                    <span>#</span>
                    <span>Descripition</span>
                    <span>Expenses Type</span>
                    <span>Receipt Serial NO.</span>
                    <span>Payment Method</span>
                    <span>Notes</span>
                    <span>Paid (EGP)</span>
                  </div>

                  <div className="data-list">
                    {expensesReport?.map((ele, index) => {
                      return (
                        <div className="row-wrapper" key={index}>
                          <div className="data-row">
                            <span>{index + 1 || "-"}</span>
                            <span>
                              {ele?.ExpenseTypeID?.Description_en || "-"}
                            </span>
                            <span>{ele?.ExpenseTypeID?.Name_en || "-"}</span>
                            <span>{ele?.BillID?.BillCode || "-"}</span>
                            <span>
                              {ele?.PaymentMethodID?.Method_en || "-"}
                            </span>
                            <span>{ele?.Notes || "-"}</span>
                            <span>
                              {ele?.Debit == undefined ? "-" : ele.Debit || "0"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
