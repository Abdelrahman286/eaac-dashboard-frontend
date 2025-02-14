import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Divider,
  Button,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import html2pdf from "html2pdf.js";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// contexts
import { UserContext } from "../../../contexts/UserContext";

import companyLogo from "../../../assets/receipt-logo.png";
// requests
import { getStudentAttendanceReportFn } from "../../../requests/attendance";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import { getReportHeader } from "./getReportHeader";

// icons
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";

// excel
import ExportToExcel from "../../ExportToExcelWithInfo";

const StudentAttendanceReport = ({ clientId, roundId, sessionId }) => {
  const { token } = useContext(UserContext);

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

  // Fetch attendance data
  const { data: dataList, isLoading: dataLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getStudentAttendanceReportFn(
        {
          //   ...(clientId && { clientId: clientId }),
          ...(roundId && { roundId: roundId }),
          //   ...(sessionId && { sessionId: sessionId }),
        },
        token,
        { isFormData: false }
      );
    },
    queryKey: ["studentAttendanceReport", clientId, roundId, sessionId],
  });

  const studentAttendance = getDataForTableRows(
    dataList?.success?.response?.data
  );

  if (dataLoading)
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
  if (!studentAttendance?.length) return;
  <Box
    sx={{
      minWidth: "40vw",
      minHeight: "50vh",
    }}
  >
    <Typography>No attendance data available.</Typography>
  </Box>;

  let header = getReportHeader(studentAttendance);
  let headerCounts = [];

  if (Array.isArray(header) && header?.length !== 0) {
    headerCounts =
      header?.map((_, index) => {
        return { key: `cell-${index + 1}`, label: `Session ${index + 1}` };
      }) || {};
  }

  const excelHeader = [
    { key: "studentName", label: "Student Name" },
    ...headerCounts,
  ];

  const excelData = studentAttendance[0]?.userData?.map((user, userIndex) => {
    const firstCell = {
      studentName: `${user?.UserID?.Name || ""}`, // Add username
    };

    // Check if attendance data exists
    const restOfCells = user?.Attendance?.length
      ? user?.Attendance?.reduce((acc, session, sessionIndex) => {
          const attendanceFlag = session?.AttendFlag;

          // Check the value of AttendFlag and return the appropriate string

          const status =
            attendanceFlag == "1"
              ? "attended"
              : attendanceFlag == "0"
              ? "absent"
              : !attendanceFlag
              ? ""
              : "";

          acc[`cell-${sessionIndex + 1}`] = status;

          return acc;
        }, {}) // Start with an empty object and accumulate properties
      : Array(excelHeader.length - 1)
          .fill(null)
          .reduce((acc, _, index) => {
            acc[`cell-${index + 1}`] = "-"; // Empty cell for each session
            return acc;
          }, {}); // Accumulate into an object

    return { ...firstCell, ...restOfCells };
  });

  const additionalRows = [
    [
      "Round Code",
      "Instructor",
      "Course Name",
      "No. of Students",
      "Start/End Date",
      "Time",
      "Room",
      "Today's Date",
    ],
    [
      `${studentAttendance[0]?.roundData?.RoundCode || "N/A"}`,
      `${studentAttendance[0]?.roundData?.InstructorID?.Name || "N/A"}`,
      `${studentAttendance[0]?.roundData?.CourseID?.Name_en || "N/A"}`,
      `${studentAttendance[0]?.roundData?.numOfStudents || "N/A"}`,
      `${studentAttendance[0]?.roundData?.StartDate?.split(" ")[0] || "N/A"}/
                ${
                  studentAttendance[0]?.roundData?.EndDate?.split(" ")[0] ||
                  "N/A"
                }`,

      `${studentAttendance[0]?.time || "N/A"}`,

      `${studentAttendance[0]?.roundData?.RoomID?.Name_en || "N/A"}`,
      `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    ],
  ];

  const handlePrintPdf = () => {
    const documentClass = "student-report-content";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const pdfWidth = element.scrollWidth; // Final width for the PDF
      // const tableHeight = element.scrollHeight;
      // const pdfHeight = tableHeight + 100; // Add extra space for the height
      const opt = {
        margin: [10, 10, 10, 10], // Margins in pixels
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Increase scale for better quality with larger width
          logging: true,
          windowWidth: pdfWidth, // Adjust window width to match the table
          allowTaint: true, // Allow cross-origin images
          useCORS: true, // Enable CORS for cross-origin image support
        },
        jsPDF: {
          unit: "px", // Use pixels for precise size control
          format: [pdfWidth, 1754], // Dynamic Scale Pdf
          orientation: "landscape", // landscape
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

  // get total students count

  const getTotalStudentsCount = () => {
    if (
      !Array.isArray(studentAttendance[0]?.userData) ||
      studentAttendance[0]?.userData?.length == 0
    )
      return;
    let total = 0;
    studentAttendance[0]?.userData?.forEach((ele) => {
      total++;
    });

    return total || "";
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
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <ExportToExcel
          data={excelData}
          fileName={"student-attendance-report"}
          headers={excelHeader}
          additionalRows={additionalRows}
        ></ExportToExcel>

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
            marginLeft: "10px",
          }}
        >
          Export PDF
        </Button>
      </Box>

      <div style={{ margin: "10px 0px" }} className="separator"></div>

      <div style={{ minHeight: "50vh" }} className="student-report-content">
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
              Students Attendance Report
            </Typography>
          </Toolbar>
        </AppBar>
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
                Round Code
              </h4>
              <p style={{ margin: 0 }}>
                {studentAttendance[0]?.roundData?.RoundCode || "N/A"}
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Instructor
              </h4>
              <p style={{ margin: 0 }}>
                {studentAttendance[0]?.roundData?.InstructorID?.Name || "N/A"}
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Course Name
              </h4>
              <p style={{ margin: 0 }}>
                {studentAttendance[0]?.roundData?.CourseID?.Name_en || "N/A"}
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                No. of Students
              </h4>
              <p style={{ margin: 0 }}>{getTotalStudentsCount() || "N/A"}</p>
            </div>

            {/* <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Total Hours
              </h4>
              <p style={{ margin: 0 }}>
                {studentAttendance[0]?.totalHours || "N/A"}
              </p>
            </div> */}

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Start/End Date
              </h4>
              <p style={{ margin: 0 }}>
                {studentAttendance[0]?.roundData?.StartDate?.split(" ")[0] ||
                  "N/A"}{" "}
                /{" "}
                {studentAttendance[0]?.roundData?.EndDate?.split(" ")[0] ||
                  "N/A"}
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>Time</h4>
              <p style={{ margin: 0 }}>
                {studentAttendance[0]?.userData[0]?.Attendance[0]?.SessionID[0]?.StartTime?.split(
                  " "
                )[1] || "N/A"}{" "}
                -{" "}
                {studentAttendance[0]?.userData[0]?.Attendance[0]?.SessionID[0]?.EndTime?.split(
                  " "
                )[1] || "N/A"}
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>Room </h4>
              <p style={{ margin: 0 }}>
                {studentAttendance[0]?.roundData?.RoomID?.Name_en || "N/A"}
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

        <div
          style={{
            width: "max-content",
            border: "1px solid #b0b0b0",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
              gap: "16px",
              background: "#f5f3f4",
              minWidth: "100%",
              width: "max-content",
            }}
          >
            <p
              style={{
                minWidth: "200px",
                maxWidth: "200px",
                paddingLeft: "10px",
                boxSizing: "border-box",
                textAlign: "left",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              Student Name
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                minWidth: "100%",
              }}
            >
              {header?.map((headerCell, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0px 1px",
                    width: "25px",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0px 1px",
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {studentAttendance[0]?.userData?.map((user, userIndex) => (
            <div
              key={userIndex}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "16px",
                width: "max-content",
              }}
            >
              <p
                style={{
                  minWidth: "200px",
                  maxWidth: "200px",
                  textAlign: "left",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  paddingLeft: "10px",
                  boxSizing: "border-box",
                }}
              >
                {userIndex + 1}- {user?.UserID?.Name || ""}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                }}
              >
                {user?.Attendance?.map((session, sessionIndex) => (
                  <div
                    key={sessionIndex}
                    style={{
                      border: "1px solid black",
                      width: "25px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0px 1px",
                      backgroundColor:
                        session?.AttendFlag == 1
                          ? "#d4edda"
                          : session?.AttendFlag == 0
                          ? "#f8d7da"
                          : "#ffffff",
                      color:
                        session?.AttendFlag == 1
                          ? "#155724"
                          : session?.AttendFlag == 0
                          ? "#721c24"
                          : "#000",
                      borderRadius: "4px",
                    }}
                  >
                    {session?.AttendFlag == 1
                      ? "✔"
                      : session?.AttendFlag == 0
                      ? "✘"
                      : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceReport;
