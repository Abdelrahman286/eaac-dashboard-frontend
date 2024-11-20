import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Box, TextField, Autocomplete, Button } from "@mui/material";
import "../../../styles/companies.css";

// icons
import AddIcon from "@mui/icons-material/Add";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// requests
import { getCompanyContactsFn } from "../../../requests/companies";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import ContactsList from "./ContactsList";
import AddNewContact from "./AddNewContact";
const ViewContacts = ({ id }) => {
  const { token } = useContext(UserContext);
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();

  // Contacts List
  const { data: contactsList, isLoading: contactsLoading } = useQuery({
    queryFn: () => {
      return getCompanyContactsFn(
        {
          numOfElements: "9000",
          companyId: id,
        },
        token
      );
    },
    enabled: !!id,
    queryKey: ["companyContacts", id],
  });
  const contacts =
    getDataForTableRows(contactsList?.success?.response?.data) || {};

  return (
    <div
      style={{
        minWidth: "60vw",
        padding: "20px 0px",
      }}
      className="contacts-modal"
    >
      {/* Add New Contact Form */}

      <AddNewContact id={id}></AddNewContact>
      {contactsLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {(contacts?.length == 0 || !contacts) && !contactsLoading ? (
        <p style={{ textAlign: "center" }}>No Contacts Found !</p>
      ) : (
        <ContactsList data={contacts}></ContactsList>
      )}
    </div>
  );
};

export default ViewContacts;
