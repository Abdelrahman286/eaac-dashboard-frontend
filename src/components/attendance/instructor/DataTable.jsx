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

import CalculateIcon from "@mui/icons-material/Calculate";

import ClearIcon from "@mui/icons-material/Clear";
// contexts
import { UserContext } from "../../../contexts/UserContext";
import { AppContext } from "../../../contexts/AppContext";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import { convertTo12HourFormat } from "../../../utils/functions";
// requests

import {
  getInstructorsAttendanceFn,
  postInstructorAttendanceFn,
} from "../../../requests/attendance";

// components
import Modal from "../../Modal";

const DataTable = ({}) => {
  const queryClient = useQueryClient();

  const { token } = useContext(UserContext);
  const { showSnackbar } = useContext(AppContext);

  const [startTime, setStartTime] = useState({
    id: "",
    value: "",
  });

  const [endTime, setEndTime] = useState({
    id: "",
    value: "",
  });

  const [timeErrors, setTimeErrors] = useState({});

  const handleCalculateTime = (id) => {
    // reset everything
    setTimeErrors({});
    // set errors
    const errors = {};
    if (startTime?.id !== id) {
      errors.startTime = id;
    }
    if (endTime?.id !== id) {
      errors.endTime = id;
    }
    setTimeErrors(errors);

    // make the request if data is valid

    if ((startTime.id == endTime.id) == id) {
      console.log("mutate attendance data");
      //   sendAttendanceData({
      //     reqBody: {
      //       instructorId: 10,
      //       roundId: 40,
      //       sessionId: 1657,
      //       date: "2024/2/20",
      //       attendTime: "7:30:00",
      //       leaveTime: "08:00:00",
      //       attendFlag: 1,
      //       notes: "NOTES DAF",
      //     },
      //     token,
      //     config: {
      //       isFormData: false,
      //     },
      //   });
    }
  };

  // Mutate Attendance

  const {
    mutate: sendAttendanceData,
    isPending: attendanceLoading,
    isError: isAttendanceError,
    error: attendanceError,
  } = useMutation({
    onError: (error) => {},
    mutationFn: postInstructorAttendanceFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instructorAttendance-pagination"],
      });

      queryClient.invalidateQueries({
        queryKey: ["instructorAttendance-list"],
      });
      showSnackbar("Attendce Submitted Successfully", "success");
    },
  });
  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI uses 0-based index
    pageSize: 10, // Initial page size
  });

  const paginationReqBody = {};
  const dataListReqBody = {
    numOfElements: paginationModel.pageSize,
  };

  // Query to fetch pagination data (e.g., total elements, number of pages)
  const {
    data: paginationData,
    isLoading: isPaginationLoading,
    isError: paginationErr,
  } = useQuery({
    queryFn: () => {
      // Remove hardcoded `page=1` and use the current page from paginationModel
      return getInstructorsAttendanceFn(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "instructorAttendance-pagination",
      paginationReqBody,
      dataListReqBody,
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
      "instructorAttendance-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
    ],
    queryFn: () => {
      return getInstructorsAttendanceFn(dataListReqBody, token, {
        isFormData: true,
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
        return `${row?.Date || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },

    {
      field: "checkIn",
      headerName: "Check-In",

      renderCell: (params) => {
        return (
          <Chip
            label={convertTo12HourFormat(params?.row.AttendTime)}
            color="primary"
            size="small"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          />
        );
      },

      flex: 1,
      minWidth: 120,
    },

    {
      field: "checkOut",
      headerName: "Check-Out",

      renderCell: (params) => {
        return (
          <Chip
            label={convertTo12HourFormat(params?.row?.LeaveTime)}
            color="primary"
            size="small"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          />
        );
      },
      flex: 1,
      minWidth: 120,
    },

    {
      field: "workedHours",
      headerName: "Hours",
      renderCell: (params) => {
        return (
          <Chip
            label={params?.row?.workedHours}
            color="success"
            size="small"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          />
        );
      },

      flex: 1,
      minWidth: 100,
    },
    {
      field: "controls",
      headerName: "Controls",
      flex: 1.5,
      minWidth: 360,
      renderCell: (params) => {
        return (
          <Box sx={{ margin: "0", padding: "10px 3px" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                error={Boolean(timeErrors?.startTime == params.row.id)}
                label="Attendance Time"
                type="time"
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 150 }}
                onChange={(e) =>
                  setStartTime({
                    id: params.row.id,
                    value: e.target.value,
                  })
                }
              />
              <TextField
                error={Boolean(timeErrors?.endTime == params.row.id)}
                label="Leave Time"
                type="time"
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 150 }}
                onChange={(e) =>
                  setEndTime({
                    id: params.row.id,
                    value: e.target.value,
                  })
                }
              />

              <Tooltip title="Calculate">
                <IconButton
                  size="large"
                  color="primary"
                  onClick={() => {
                    handleCalculateTime(params.row.id);
                  }}
                >
                  <CalculateIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        );
      },
    },
  ];

  // to update the table elements if user deleted the only search result appeared
  if (paginationErr) {
    updatedDataList = [];
  }

  console.log(updatedDataList);
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
