import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// components
import CustomIconButton from "../../CustomIconButton";

// requests
import { deletBranchFn } from "../../../requests/companies";
// MUI
import { Button } from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// components
import EditForm from "./EditForm";

const BranchesList = ({ data, companyId }) => {
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
    mutate: deletBranch,
    isPending: deleteLoading,
    isError: isDeleteError,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Faild to Delete Branch Data", "error");
    },
    mutationFn: deletBranchFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyBranches"]);
      showSnackbar("Branch Deleted Successfully", "success");
    },
  });

  const handleDeleteBranch = (branch) => {
    deletBranch({
      reqBody: { id: branch.id },
      token,
      config: { isFormData: true },
    });
  };

  return (
    <div className="contacts-list">
      <div className="header">
        <span>#</span>

        <span>Name (AR)</span>
        <span>Name (EN)</span>
        <span>Description</span>
        <span>Main Phone</span>
        <span>Code</span>
        <span>Address</span>
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
                  <span>{ele?.Name_ar || "-"}</span>

                  <span>{ele?.Name_en || "-"}</span>
                  <span>{ele?.Description_ar || "-"}</span>
                  <span>{ele?.MainPhone || "-"}</span>
                  <span>{ele?.BranchCode || "-"}</span>
                  <span>{ele?.AddressID?.Address || "-"}</span>

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
                      handleDeleteBranch(ele);
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
                    branch={ele}
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

export default BranchesList;
