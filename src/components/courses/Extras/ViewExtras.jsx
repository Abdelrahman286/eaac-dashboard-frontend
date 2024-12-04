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

import { getExtrasFn } from "../../../requests/courses";
// utils
import { getDataForTableRows } from "../../../utils/tables";
import ExtrasList from "./ExtrasList";
import AddNewExtra from "./AddNewExtra";

// components
import LoadingSpinner from "../../LoadingSpinner";
const ViewExtras = ({ data }) => {
  // data = whole course data
  const { token } = useContext(UserContext);
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();

  // Contacts List
  const {
    data: dataList,
    isLoading: dataLoading,
    isError,
  } = useQuery({
    queryFn: () => {
      return getExtrasFn(
        {
          numOfElements: "9000",
          courseId: data?.id,
        },
        token
      );
    },
    enabled: !!data?.id,
    retry: 1,
    queryKey: ["courseExtras", data.id],
  });
  const extras = getDataForTableRows(dataList?.success?.response?.data) || {};
  console.log(extras);
  return (
    <div
      style={{
        minWidth: "60vw",
        padding: "20px 0px",
      }}
      className="contacts-modal"
    >
      {/* Add New Contact Form */}

      <AddNewExtra id={data?.id}></AddNewExtra>
      {dataLoading && (
        <div>
          <LoadingSpinner></LoadingSpinner>
          <p style={{ textAlign: "center" }}>Loading...</p>
        </div>
      )}
      {isError ? (
        <p style={{ textAlign: "center" }}>
          No Extras Found !. Please try again.
        </p>
      ) : (extras?.length == 0 || !extras) && !dataLoading ? (
        <p style={{ textAlign: "center" }}>No Contacts Found !</p>
      ) : (
        <ExtrasList data={extras} courseId={data?.id}></ExtrasList>
      )}
    </div>
  );
};

export default ViewExtras;
