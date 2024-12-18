import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Divider, Button } from "@mui/material";

// contexts
import { UserContext } from "../../../contexts/UserContext";

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
import ExportToExcel from "../../ExportToExcel";

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
          ...(clientId && { clientId: clientId }),
          ...(roundId && { roundId: roundId }),
          ...(sessionId && { sessionId: sessionId }),
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
      studentName: `student name${userIndex}`, // Add username
    };

    // Check if attendance data exists
    const restOfCells = user?.Attendance?.length
      ? user?.Attendance?.reduce((acc, session, sessionIndex) => {
          const attendanceFlag = session?.AttendFlag;

          // Check the value of AttendFlag and return the appropriate string
          const status = !attendanceFlag
            ? ""
            : attendanceFlag === 1
            ? "attended"
            : attendanceFlag === 0
            ? "absent"
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
        <ExportToExcel
          data={excelData}
          fileName={"student-attendance-report"}
          headers={excelHeader}
        ></ExportToExcel>
      </Box>

      <div className="student-report-content">
        <Box
          style={{
            minHeight: "50vh",
          }}
        >
          {/* Round Data  */}
          <Box>
            <Box
              sx={{
                padding: 2,
                margin: "8px 0px",
                border: "1px solid #ddd",
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {studentAttendance[0]?.roundData?.RoundCode || ""}
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Course
                </Typography>
                <Typography variant="body1">
                  {studentAttendance[0]?.roundData?.CourseID?.Name_en || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Instructor
                </Typography>
                <Typography variant="body1">
                  {studentAttendance[0]?.roundData?.InstructorID?.Name || "N/A"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />
              <Box
                sx={{ mb: 1, display: "flex", gap: 1, alignItems: "center" }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Room Code
                </Typography>
                <Typography variant="body1">
                  {studentAttendance[0]?.roundData?.RoomID?.RoomCode || "N/A"}
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
                    {studentAttendance[0]?.roundData?.StartDate.split(" ")[0] ||
                      "N/A"}
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
                    {studentAttendance[0]?.roundData?.EndDate.split(" ")[0] ||
                      "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: "max-content",
              border: "1px solid #b0b0b0",
              marginBottom: "10px",
            }}
          >
            {/* header  */}

            {header && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 2,
                  paddingBottom: 1,
                  gap: 2,
                  background: "#f5f3f4",
                  padding: "10px 0px",
                  minWidth: "100%",
                  width: "max-content",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
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
                </Typography>

                {/* Attendance Cells */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    minWidth: "100%",
                  }}
                >
                  {header?.map((headerCell, index) => (
                    <Box
                      key={index}
                      sx={{
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
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/*   Student rows */}
            {studentAttendance[0]?.userData?.map((user, userIndex) => (
              <Box
                key={userIndex}
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  marginBottom: 2,
                  paddingBottom: 1,
                  gap: 2,
                  paddingTop: "10px",
                  width: "max-content",
                  "&:hover": {
                    background: "#f5f3f4",
                  },
                }}
              >
                {/* Student Name */}
                <Typography
                  variant="body1"
                  sx={{
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
                  {userIndex + 1}- {user?.UserID?.Name}
                </Typography>

                {/* Attendance Cells */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                  }}
                >
                  {user?.Attendance?.map((session, sessionIndex) => (
                    <Box
                      key={sessionIndex}
                      sx={{
                        border: "1px solid black",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0px 1px",
                        // backgroundColor: session?.AttendFlag
                        //   ? "#d4edda"
                        //   : "#f8d7da",
                        backgroundColor:
                          session?.AttendFlag == 1
                            ? "#d4edda"
                            : session?.AttendFlag == 0
                            ? "#f8d7da"
                            : "#ffffff",
                        color: session?.AttendFlag ? "#155724" : "#721c24",
                        borderRadius: "4px",
                      }}
                    >
                      {session?.AttendFlag == 1 ? (
                        <CheckIcon fontSize="small" />
                      ) : session?.AttendFlag == 0 ? (
                        <CloseIcon fontSize="small" />
                      ) : null}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default StudentAttendanceReport;
