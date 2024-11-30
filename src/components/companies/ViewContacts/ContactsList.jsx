import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// components
import CustomIconButton from "../../../components/CustomIconButton";

// requests
import { editContactFn } from "../../../requests/companies";
// MUI
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Autocomplete,
  Button,
  IconButton,
} from "@mui/material";

// icons
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// components
import EditForm from "./EditForm";

const ContactsList = ({ data, companyId }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const arrayWithIndex = data?.map((item, index) => ({
    ...item,
    rowIndex: index + 1, // Add the index to each object
  }));

  const [idToDelete, setIdToDelete] = useState("");
  const [idToEdit, setIdToEdit] = useState("");

  // Delete Mutation
  const {
    mutate: deletContact,
    isPending: deleteLoading,
    isError: isDeleteError,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Faild to Delete Contact Data", "error");
    },
    mutationFn: editContactFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyContacts"]);
      showSnackbar("Contact Deleted Successfully", "success");
      setIdToDelete("");
    },
  });

  const handleDeleteContact = (contact) => {
    deletContact({
      reqBody: { id: [contact.id], statusId: "4" },
      token,
      config: { isFormData: true },
    });
  };

  return (
    <div className="contacts-list">
      <div className="header">
        <span>#</span>

        <span>Name</span>
        <span>Job Title</span>
        <span>Phone Number 1</span>
        <span>Phone Number 2</span>
        <span>What's App Number</span>
        <span>Email</span>
        <span>Notes</span>
        <span>Controls</span>
      </div>

      {arrayWithIndex?.length == 0 && (
        <p style={{ textAlign: "center" }}>No Rows</p>
      )}
      <div className="data-list">
        {arrayWithIndex.map((ele) => {
          return (
            <div className="contact-row" key={ele?.rowIndex}>
              {idToEdit !== ele.id && (
                <div className="data-row">
                  <span>{ele?.rowIndex}</span>
                  <span>{ele?.Name || "-"}</span>
                  <span>{ele?.JobTitle || "-"}</span>
                  <span>{ele?.PhoneNum1 || "-"}</span>
                  <span>{ele?.PhoneNum2 || "-"}</span>
                  <span>{ele?.WhatsAppNum || "-"}</span>
                  <span>{ele?.Email1 || "-"}</span>
                  <span>{ele?.Notes || "-"}</span>
                  <span>
                    <CustomIconButton
                      icon={"edit"}
                      title="Edit"
                      onClick={() => setIdToEdit(ele?.id)}
                    ></CustomIconButton>
                    <CustomIconButton
                      sx={{ marginLeft: "10px" }}
                      icon={"delete"}
                      title="Delete"
                      onClick={() => {
                        setIdToDelete(ele?.id);
                      }}
                    ></CustomIconButton>
                  </span>
                </div>
              )}

              {idToDelete == ele?.id && (
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="text"
                    // color="error"
                    onClick={(e) => {
                      setIdToDelete("");
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    sx={{
                      marginLeft: "20px",
                    }}
                    disabled={deleteLoading}
                    onClick={(e) => {
                      handleDeleteContact(ele);
                    }}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                </div>
              )}

              {idToEdit == ele.id && (
                <div className="data-row">
                  <EditForm
                    companyId={companyId}
                    contact={ele}
                    onCancel={() => setIdToEdit("")}
                  ></EditForm>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactsList;
