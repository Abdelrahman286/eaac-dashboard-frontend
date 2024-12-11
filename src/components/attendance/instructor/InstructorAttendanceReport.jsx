import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // Import MUI DataGrid

// contexts
import { UserContext } from "../../../contexts/UserContext";

// requests
import { getInstructorAttendanceReportFn } from "../../../requests/attendance";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import { getTimeDifference } from "../../../utils/functions";

// excel
import ExportToExcel from "../../ExportToExcel";

const InstructorAttendanceReport = ({ instructorId }) => {
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
  const { data: dataList, isLoading: dataLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getInstructorAttendanceReportFn(
        {
          ...(instructorId && { instructorId: instructorId }),
          numOfElements: 99999999999,
        },
        token,
        { isFormData: false }
      );
    },
    queryKey: ["instructorAttendanceReport", instructorId],
  });

  const instructorAttendance = getDataForTableRows(
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

  const columns = [
    { field: "sessionIndex", headerName: "Session", width: 100 },
    {
      field: "AttendTime",
      headerName: "Check In",
      width: 150,
      renderCell: (params) => {
        return params?.row?.AttendTime || "-";
      },
    },
    {
      field: "LeaveTime",
      headerName: "Check Out",
      width: 150,
      renderCell: (params) => {
        return params?.row?.LeaveTime || "-";
      },
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 100,
      renderCell: (params) => {
        return (
          getTimeDifference(params?.row?.AttendTime, params?.row?.LeaveTime) ||
          "-"
        );
      },
    },
    { field: "Notes", headerName: "Notes", width: 200 },
    { field: "signature", headerName: "Signature", width: 150 },
  ];

  //------------ excel ----------------
  const excelHeader = [
    { key: "sessionIndex", label: "Session" },
    { key: "AttendTime", label: "Check In" },
    { key: "LeaveTime", label: "Check Out" },
    { key: "hours", label: "Hours" },
    { key: "Notes", label: "Notes" },
    { key: "signature", label: "signature" },
  ];

  const excelData = rows?.map((ele) => {
    return {
      sessionIndex: ele.sessionIndex || "-",
      AttendTime: ele?.AttendTime || "-",

      LeaveTime: ele?.LeaveTime || "-",
      hours: getTimeDifference(ele?.AttendTime, ele?.LeaveTime) || "",
      Notes: ele?.Notes || "",
      signature: "",
    };
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
          fileName={"instructor-attendance-report"}
          headers={excelHeader}
        ></ExportToExcel>
      </Box>

      <div className="student-report-content">
        <Box
          style={{
            minHeight: "50vh",
          }}
        >
          {/* Instructor Data */}
          <Box>
            <Box
              sx={{
                padding: 2,
                margin: "8px 0px",
                border: "1px solid #ddd",
                backgroundColor: "#fafafa",
              }}
            >
              {/* Instructor Details */}
              <Typography variant="h6" gutterBottom>
                {instructorAttendance[0]?.roundData?.RoundCode || ""}
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
                  {instructorAttendance[0]?.roundData?.CourseID?.Name_en ||
                    "N/A"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              {/* Add other instructor details */}
            </Box>
          </Box>

          {/* Instructor Table */}
          <Box
            sx={{
              height: 400,
              width: "100%",
              marginTop: 2,
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              disableColumnResize
              autoHeight
              pageSize={100}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default InstructorAttendanceReport;
