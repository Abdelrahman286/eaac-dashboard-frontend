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
import { getCompanyBranchesFn } from "../../../requests/companies";

// utils
import { getDataForTableRows } from "../../../utils/tables";
import BranchesList from "./BranchesList";
import AddNewBranch from "./AddNewBranch.jsx";

// components
import LoadingSpinner from "../../LoadingSpinner";
const ViewBranches = ({ id }) => {
  const { token } = useContext(UserContext);
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();

  // Branches List
  const { data: branchesList, isLoading: branchesLoading } = useQuery({
    queryFn: () => {
      return getCompanyBranchesFn(
        {
          numOfElements: "9000",
          companyId: id,
        },
        token
      );
    },
    enabled: !!id,
    queryKey: ["companyBranches", id],
  });
  const branches =
    getDataForTableRows(branchesList?.success?.response?.data) || {};

  console.log(branches);
  return (
    <div
      style={{
        minWidth: "60vw",
        padding: "20px 0px",
      }}
      className="contacts-modal"
    >
      {/* Add New Branches Form */}

      <AddNewBranch id={id}></AddNewBranch>
      {branchesLoading && (
        <div>
          <LoadingSpinner></LoadingSpinner>
          <p style={{ textAlign: "center" }}>Loading...</p>
        </div>
      )}
      {(branches?.length == 0 || !branches) && !branchesLoading ? (
        <p style={{ textAlign: "center" }}>No Branches Found !</p>
      ) : (
        <BranchesList data={branches} companyId={id}></BranchesList>
      )}
    </div>
  );
};

export default ViewBranches;
