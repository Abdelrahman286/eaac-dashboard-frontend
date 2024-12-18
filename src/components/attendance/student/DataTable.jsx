import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// MUI
import {
  Box,
  Chip,
  Avatar,
  TextField,
  IconButton,
  Stack,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import CustomIconButton from "../../CustomIconButton";

import ClearIcon from "@mui/icons-material/Clear";
// contexts
import { UserContext } from "../../../contexts/UserContext";
import { AppContext } from "../../../contexts/AppContext";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import { convertTo12HourFormat } from "../../../utils/functions";
// requests

import {
  getStudentsAttendanceFn,
  postStudentAttendanceFn,
} from "../../../requests/attendance";

// components
import Modal from "../../Modal";

const DataTable = ({ clientId, sessionId, roundId, onDataChange }) => {
  const queryClient = useQueryClient();

  const { token, hasPermission } = useContext(UserContext);
  const { showSnackbar } = useContext(AppContext);

  // Mutate Attendance

  const {
    mutate: sendAttendanceData,
    isPending: attendanceLoading,
    isError: isAttendanceError,
    error: attendanceError,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Error at sending at Attendance", "error");
    },
    mutationFn: postStudentAttendanceFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["studentAttendance-pagination"],
      });

      queryClient.invalidateQueries({
        queryKey: ["studentAttendance-list"],
      });
      showSnackbar("Attendce Submitted Successfully", "success");
    },
  });

  const handleAttendance = (row, value) => {
    sendAttendanceData({
      reqBody: {
        clientId: row?.UserID,
        roundId: row?.RoundID?.id,
        sessionId: row?.SessionID?.id,
        attendFlag: value || 0,
      },
      token,
      config: {
        isFormData: false,
      },
    });
  };

  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI uses 0-based index
    pageSize: 10, // Initial page size
  });

  const paginationReqBody = {};

  // request body
  const dataListReqBody = {
    numOfElements: paginationModel.pageSize,
    ...(clientId && { clientId }),
    ...(sessionId && { sessionId }),
    ...(roundId && { roundId }),
  };

  // Query to fetch pagination data (e.g., total elements, number of pages)
  const {
    data: paginationData,
    isLoading: isPaginationLoading,
    isError: paginationErr,
  } = useQuery({
    queryFn: () => {
      // pagination request body is the same as data list body
      return getStudentsAttendanceFn(dataListReqBody, token, {
        isFormData: false,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "studentAttendance-pagination",
      paginationReqBody,
      dataListReqBody,
      clientId,
      sessionId,
      roundId,
    ],
    retry: 1,
  });

  // Now, only trigger the list data fetching when paginationData is available
  const {
    data: listData,
    isLoading: isListLoading,
    isError: dataError,
  } = useQuery({
    queryKey: [
      "studentAttendance-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,

      clientId,
      sessionId,
      roundId,
    ],
    queryFn: () => {
      return getStudentsAttendanceFn(dataListReqBody, token, {
        isFormData: false,
        urlParams: `page=${paginationModel.page + 1}`,
      });
    },

    enabled: !!paginationData, // Enable this query only when paginationData is available
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  //------------------- Data transformation
  const dataObject = listData?.success?.response?.data;
  const dataList = getDataForTableRows(dataObject);

  // Total elements fetched from the server
  let totalElements =
    paginationData?.success?.response?.numOfWholeElements || 0;

  // Compute the row indices based on pagination
  let updatedDataList = dataList.map((row, index) => ({
    ...row,
    rowIndex: paginationModel.page * paginationModel.pageSize + index + 1,
  }));

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },
    {
      field: "Image",
      headerName: "Logo",
      flex: 0.6,
      minWidth: 50,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "6px",
            }}
          >
            <Avatar
              src={params?.row.Image}
              alt="Logo"
              variant="circular"
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        );
      },
    },

    {
      field: "Name",
      headerName: "Name",
      valueGetter: (value, row) => {
        return `${row?.Name || ""}`;
      },
      flex: 1.2,
      minWidth: 140,
    },
    {
      field: "PhoneNumber",
      headerName: "Phone",
      valueGetter: (value, row) => {
        return `${row?.PhoneNumber || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },

    {
      field: "RoundID",
      headerName: "Group/Round",
      valueGetter: (value, row) => {
        return `${row?.RoundID?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },

    {
      field: "RoomID",
      headerName: "Room",
      valueGetter: (value, row) => {
        return `${row?.RoomID?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "SessionID",
      headerName: "Session Name",
      valueGetter: (value, row) => {
        return `${row?.SessionID?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "SessionDate",
      headerName: "Session Date",
      valueGetter: (value, row) => {
        return `${row?.Date || "-"}`;
      },
      flex: 1,
      minWidth: 100,
    },

    {
      field: "AttendFlag",
      headerName: "Attended",

      renderCell: (params) => {
        if (params?.row?.AttendFlag == 1) {
          return (
            <Chip
              label={"Attended"}
              color="success"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        } else if (params?.row?.AttendFlag == 0) {
          return (
            <Chip
              label={"Absent"}
              color="error"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        } else {
          return <span>-</span>;
        }
      },

      flex: 1,
      minWidth: 120,
    },

    //numberOfSessionsAttended

    {
      field: "numberOfSessionsAttended",
      headerName: "No.of Attended Sessions",
      valueGetter: (value, row) => {
        return `${row?.numberOfSessionsAttended || "-"}`;
      },
      flex: 1,
      minWidth: 100,
    },

    //percentageOfSessionsAttended

    {
      field: "percentageOfSessionsAttended",
      headerName: "Percentage",
      valueGetter: (value, row) => {
        return `${row?.percentageOfSessionsAttended || "-"}`;
      },
      flex: 1,
      minWidth: 100,
    },

    {
      field: "controls",
      headerName: "Controls",
      flex: 1.5,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <>
            {hasPermission("Submit Student Attendance") && (
              <Box sx={{ margin: "0" }}>
                <CustomIconButton
                  onClick={() => handleAttendance(params.row, 1)}
                  icon={"attended"}
                  title={"Attended"}
                ></CustomIconButton>

                <CustomIconButton
                  onClick={() => handleAttendance(params.row, 0)}
                  icon={"absent"}
                  title={"Absent"}
                ></CustomIconButton>
              </Box>
            )}
          </>
        );
      },
    },
  ];

  // to update the table elements if user deleted the only search result appeared
  if (paginationErr) {
    updatedDataList = [];
  }

  // hoist data for excel export
  useEffect(() => {
    if (dataList?.length !== 0) {
      onDataChange(dataList);
    }
  }, [listData]);

  return (
    <div className="instuctors-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rowHeight={60}
          // pagination buttons
          slotProps={{
            pagination: {
              showFirstButton: true,
              showLastButton: true,
            },
          }}
          //   getRowId={(row) => row.InstructorID} // Custom ID logic
          autoHeight
          rows={updatedDataList || []} // Use the modified dataList
          columns={columns}
          paginationMode="server" // Enable server-side pagination
          rowCount={totalElements} // Total rows from server response
          page={paginationModel.page} // Current 0-based page for DataGrid
          pageSize={paginationModel.pageSize} // Current page size
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)} // Update pagination state
          pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]} // Add more options for page size
          loading={isListLoading || isPaginationLoading || attendanceLoading} // Show loading state
          //   checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel,
            },
          }}
          sx={{
            // change header background
            "& .MuiDataGrid-container--top [role=row]": {
              background: "#f5f3f4",
              border: "none",
              borderStyle: "none",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
            },

            // header font weight
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold", // Ensure header text is bold
            },

            "&, [class^=MuiDataGrid]": {
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default DataTable;
