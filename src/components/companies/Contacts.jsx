import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

const ContactsTable = ({ onContactsChange, error, isError }) => {
  const [contacts, setContacts] = useState([
    // { id: 1, fullName: "", title: "", phone: "", email: "", notes: "" },
  ]);

  // Add a new contact row
  const handleAddRow = () => {
    // Generate a new unique ID
    const newId = contacts.length
      ? Math.max(...contacts.map((c) => c.id)) + 1
      : 1;

    console.log("Adding new contact with ID:", newId);

    setContacts([
      ...contacts,
      { id: newId, fullName: "", title: "", phone: "", email: "", notes: "" },
    ]);
  };

  // Handle change in any input field
  const handleProcessRowUpdate = (newRow) => {
    console.log("Processing row update:", newRow);

    const updatedContacts = contacts.map((contact) =>
      contact.id == newRow.id ? newRow : contact
    );

    setContacts(updatedContacts);

    // Ensure the row ID is valid
    if (!updatedContacts.some((contact) => contact.id === newRow.id)) {
      console.error(`Row with ID ${newRow.id} not found.`);
    }

    return newRow;
  };

  // Handle delete contact row
  const handleDeleteRow = (id) => {
    console.log("Deleting contact with ID:", id);

    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  useEffect(() => {
    onContactsChange(contacts);
  }, [contacts]);

  // Columns configuration
  const columns = [
    {
      field: "fullName",
      headerName: "Full Name *",
      width: 150,
      flex: 1,
      editable: true,
    },
    {
      field: "title",
      headerName: "Title",
      width: 100,
      editable: true,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone *",
      width: 100,
      editable: true,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      width: 100,
      editable: true,
      flex: 1,
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 100,
      editable: true,
      flex: 1,
    },
    {
      field: "controls",
      headerName: "Controls",
      width: 100,
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
        margin: "20px 0",
        marginLeft: "10px",
      }}
    >
      {/* Header with Add Icon */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "400",
            // fontSize: "15px",
          }}
        >
          Contacts
        </Typography>
        <IconButton onClick={handleAddRow} size="small">
          <AddIcon />
        </IconButton>
      </Box>

      {/* DataGrid Component */}
      <div style={{ height: 200, width: "100%" }}>
        <DataGrid
          rows={contacts}
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
        {isError && <h5 className="invalid-message ">{error}</h5>}
      </div>
    </Box>
  );
};

export default ContactsTable;
