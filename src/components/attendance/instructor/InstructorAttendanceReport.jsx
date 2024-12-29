import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Divider,
  AppBar,
  Toolbar,
  Button,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // Import MUI DataGrid

// icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import html2pdf from "html2pdf.js";
import "../../../styles/financial-reports.css";

import companyLogo from "../../../assets/receipt-logo.png";
// contexts
import { UserContext } from "../../../contexts/UserContext";

// requests
import { getInstructorAttendanceReportFn } from "../../../requests/attendance";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import { getTimeDifference } from "../../../utils/functions";

const InstructorAttendanceReport = ({
  instructorId,
  roundId,
  filterDataView,
}) => {
  const { token } = useContext(UserContext);

  // Fix z-index issue for header inputs
  useEffect(() => {
    const header = document.querySelector(".header-wrapper");

    if (header) {
      header.style.zIndex = 0;
      const childElements = header.querySelectorAll("*");
      const originalZIndexes = Array.from(childElements).map(
        (element) => element.style.zIndex
      );

      childElements.forEach((element) => {
        element.style.zIndex = 0;
      });

      return () => {
        childElements.forEach((element, index) => {
          element.style.zIndex = originalZIndexes[index];
        });
      };
    }
  }, []);

  // Fetch attendance data
  const {
    data: dataList,
    isLoading,
    isError,
  } = useQuery({
    retry: 2,
    queryFn: () => {
      return getInstructorAttendanceReportFn(
        {
          ...(instructorId && { instructorId: instructorId }),
          ...(roundId && { roundId: roundId }),
          numOfElements: 99999999999,
        },

        token,
        { isFormData: false }
      );
    },
    enabled: !!instructorId && !!roundId,
    queryKey: ["instructorAttendanceReport", instructorId, roundId],
  });

  const instructorAttendance = getDataForTableRows(
    dataList?.success?.response?.data
  );

  if (isLoading)
    return (
      <Box
        sx={{
          minWidth: "40vw",
          minHeight: "50vh",
        }}
      >
        <Typography sx={{ textAlign: "center" }}>Loading...</Typography>
      </Box>
    );
  if (!instructorAttendance?.length)
    return (
      <Box
        sx={{
          minWidth: "40vw",
          minHeight: "50vh",
        }}
      >
        <Typography>No attendance data available.</Typography>
      </Box>
    );

  // Prepare rows and columns for the DataGrid
  const rows = instructorAttendance.map((item, index) => {
    return { ...item, sessionIndex: index + 1 };
  });

  const handlePrintPdf = () => {
    const documentClass = "report-content-page";
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

  return (
    <div
      style={{
        minWidth: "50vw",
      }}
    >
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
      <div className="student-report-content">
        <Box
          style={{
            minHeight: "50vh",
          }}
        >
          <div className="report-content-page">
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
                  Instructor Attendance Report
                </Typography>
              </Toolbar>
            </AppBar>
            {/* header data */}
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                minWidth: "800px",
                width: "100%",
                margin: "10px 0px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "2px",
                }}
              >
                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Instructor
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.instructorId?.Name || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Round Code
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.roundId?.RoundCode || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Course Name
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.roundId?.CourseID?.Name_en || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    No. of Students
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.roundId?.Capacity?.numOfAttendees || "N/A"}{" "}
                    / {filterDataView?.roundId?.Capacity?.roomCapicity || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Total Hours
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.roundId?.Capacity?.totalHours || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Start/End Date
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.roundId?.StartDate?.split(" ")[0] || "N/A"}{" "}
                    - {filterDataView?.roundId?.EndDate?.split(" ")[0] || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Time
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.totalHours || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Room{" "}
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.roundId?.RoomID?.RoomCode || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Days
                  </h4>
                  <p style={{ margin: 0 }}>
                    {filterDataView?.roundId?.days || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                    Today's Date
                  </h4>
                  <p style={{ margin: 0 }}>
                    {`${new Date().getDate()}/${
                      new Date().getMonth() + 1
                    }/${new Date().getFullYear()}`}
                  </p>
                </div>
              </div>
            </div>

            {/* table data */}
            {isError && <p style={{ textAlign: "center" }}>No Rows Found</p>}
            {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
            {rows?.length !== 0 && (
              <div>
                <div>
                  <div className="report-table">
                    <div className="header">
                      <span>#</span>
                      <span>Check In</span>
                      <span>Check Out</span>
                      <span>Hours</span>
                      <span>Round Code</span>
                      <span>Notes</span>
                      <span>Signature</span>
                    </div>

                    <div className="data-list">
                      {rows?.map((ele, index) => {
                        return (
                          <div className="row-wrapper" key={index}>
                            <div className="data-row">
                              <span>{index + 1 || "-"}</span>
                              <span>{ele?.AttendTime || "-"}</span>
                              <span>{ele?.LeaveTime || "-"}</span>
                              <span>
                                {getTimeDifference(
                                  ele?.AttendTime,
                                  ele?.LeaveTime
                                ) || "-"}
                              </span>
                              <span>{ele?.RoundID?.RoundCode}</span>
                              <span>{""}</span>
                              <span>{""}</span>
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
        </Box>
      </div>
    </div>
  );
};

export default InstructorAttendanceReport;
