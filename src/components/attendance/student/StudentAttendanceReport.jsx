import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";

// contexts
import { UserContext } from "../../../contexts/UserContext";

// requests
import { getStudentAttendanceReportFn } from "../../../requests/attendance";

// utils
import { getDataForTableRows } from "../../../utils/tables";

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
    queryKey: ["studentAttendanceReport", clientId],
  });

  const studentAttendance = getDataForTableRows(
    dataList?.success?.response?.data
  );

  if (dataLoading) return <Typography>Loading...</Typography>;
  if (!studentAttendance?.length)
    return <Typography>No attendance data available.</Typography>;

  return (
    <Box
      style={{
        minHeight: "50vh",
      }}
    >
      <Box
        sx={{
          margin: 9,
          padding: 2,
          //   display: "inline-block",
          transform: "rotate(-90deg)",
          transformOrigin: "left bottom",
        }}
      >
        <Typography variant="body1">{`1 / 1 / 2020`}</Typography>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Student Attendance Report
      </Typography>
      <Box>
        {studentAttendance[0]?.userData?.map((user, userIndex) => (
          <Box
            key={userIndex}
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: 2,
              //   borderBottom: "1px solid #ddd",
              paddingBottom: 1,
              gap: 2,
              width: "maxContent",
            }}
          >
            {/* Student Name */}
            <Typography
              variant="body1"
              sx={{
                minWidth: "120px", // Fixed width for student name
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              name is
              {user?.UserID}
            </Typography>

            {/* Attendance Cells */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                // gap: 1,
              }}
            >
              {user?.Attendance?.map((session, sessionIndex) => (
                <Box
                  key={sessionIndex}
                  sx={{
                    border: "1px solid black",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0px 1px",
                    backgroundColor: session?.AttendFlag
                      ? "#d4edda"
                      : "#f8d7da",
                    color: session?.AttendFlag ? "#155724" : "#721c24",
                    borderRadius: "4px",
                    // whiteSpace: "nowrap",
                  }}
                >
                  {session?.AttendFlag ? "Y" : "N"}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StudentAttendanceReport;
