import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

const CourseExtras = ({ onDataChange, error, isError, isEdit, editData }) => {
  const [data, setData] = useState([
    // { id: 1, extraName: "", description: "", type: "", price: "" },
  ]);

  const handleAddRow = () => {
    // Generate a new unique ID
    const newId = data.length ? Math.max(...data.map((c) => c.id)) + 1 : 1;

    console.log("Adding new Course Extra with ID:", newId);

    setData([
      ...data,
      {
        id: newId,
        extraName: "",
        description: "",
        type: "",
        price: "",
      },
    ]);
  };

  // Handle change in any input field
  const handleProcessRowUpdate = (newRow) => {
    console.log("Processing row update:", newRow);

    const updatedData = data.map((item) =>
      item.id == newRow.id ? newRow : item
    );

    setData(updatedData);

    // Ensure the row ID is valid
    if (!updatedData.some((item) => item.id == newRow.id)) {
      console.error(`Row with ID ${newRow.id} not found.`);
    }

    return newRow;
  };

  const handleDeleteRow = (id) => {
    console.log("Deleting Course Extra with ID:", id);

    setData(data.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (isEdit) {
      setData(editData);
    }
  }, [isEdit, editData]);

  useEffect(() => {
    onDataChange(data);
  }, [data]);

  // Columns configuration
  const columns = [
    {
      field: "extraName",
      headerName: "Extra Name *",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 120,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price *",
      flex: 1,
      minWidth: 80,
      editable: true,
    },
    {
      minWidth: 100,
      field: "controls",
      headerName: "Controls",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDeleteRow(params.row.id)}
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
        backgroundColor: "#f4f4f494",
        padding: "10px",
        borderRadius: "8px",
        // margin: "20px 0",
      }}
    >
      {/* Header with Add Icon */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "400",
            fontSize: "15px",
          }}
        >
          Course Extras
        </Typography>
        <IconButton onClick={handleAddRow} size="small">
          <AddIcon />
        </IconButton>
      </Box>

      {/* DataGrid Component */}
      <Box sx={{ height: 200 }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={99}
          rowHeight={30} // Set row height to make it dense
          processRowUpdate={handleProcessRowUpdate}
          sx={{
            "& .MuiDataGrid-cell": {
              //   padding: "2px 1px", // Reduced padding for cells
            },
            "& .MuiDataGrid-columnHeader": {
              //   padding: "2px 1px", // Reduced padding for column headers
              //   height: "36px", // Smaller header height
              //   fontSize: "13px", // Smaller font size
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none", // Hide footer to remove pagination
            },
          }}
        />
      </Box>
      {isError && <h5 className="invalid-message">{error}</h5>}
    </Box>
  );
};

export default CourseExtras;
