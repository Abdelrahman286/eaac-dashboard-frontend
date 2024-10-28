import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

const FormSessionsTable = ({ data, handleDeleteRow }) => {
  // Add index for array objects
  const arrayWithIndex = data.map((item, index) => ({
    ...item,
    rowIndex: index, // Add the index to each object
  }));

  // Columns configuration
  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.3,
      minWidth: 30,
    },
    {
      field: "sessionName",
      headerName: "Session Name",
      minWidth: 100,
      flex: 1,
    },
    { field: "sessionDate", headerName: "Date", minwidth: 100 },
    {
      field: "sessionStartTime",
      headerName: "Start Time",
      minWidth: 60,
      flex: 1,
    },
    {
      field: "sessionEndTime",
      headerName: "End Time",
      minWidth: 60,
      flex: 1,
    },
    {
      field: "sessionRoomId",
      headerName: "Room",
      minWidth: 100,
      flex: 1,
      valueGetter: (value, row) => {
        return `${row?.sessionRoomId?.name || "-"}`;
      },
    },
    {
      field: "instructorId",
      headerName: "Instructor",
      minWidth: 100,
      flex: 1,
      valueGetter: (value, row) => {
        return `${row?.instructorId?.name || "-"}`;
      },
    },
    {
      field: "sessionDescription",
      headerName: "Description",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "controls",
      headerName: "Controls",
      minWidth: 60,
      flex: 0.5,
      renderCell: (params) => (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDeleteRow(params.row.rowIndex)}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        backgroundColor: "#f4f4f494",
      }}
    >
      {/* DataGrid Component */}
      <div style={{ width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.rowIndex} // Custom ID logic
          autoHeight
          rows={arrayWithIndex}
          columns={columns}
          pageSize={99}
          rowHeight={30} // Set row height to make it dense
          sx={{
            "& .MuiDataGrid-cell": {},
            "& .MuiDataGrid-columnHeader": {},
            "& .MuiDataGrid-footerContainer": {
              //   display: "none",
            },
          }}
        />
      </div>
    </Box>
  );
};

export default FormSessionsTable;
