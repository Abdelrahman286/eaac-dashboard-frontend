import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// components
import CustomIconButton from "../../CustomIconButton";

// requests
import { editExtraFn } from "../../../requests/courses";
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

const ExtrasList = ({ data, courseId }) => {
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
    mutate: deleteExtra,
    isPending: deleteLoading,
    isError: isDeleteError,
  } = useMutation({
    onError: (error) => {
      showSnackbar("Faild to Delete Extra Data", "error");
    },
    mutationFn: editExtraFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["courseExtras"]);
      showSnackbar("Course Extra Deleted Successfully", "success");
      setIdToDelete("");
    },
  });

  const handleDeleteExtra = (extra) => {
    deleteExtra({
      reqBody: { id: [extra.id], statusId: "4" },
      token,
      config: { isFormData: true },
    });
  };

  return (
    <div className="contacts-list">
      <div className="header">
        <span>#</span>

        <span>Extra Name</span>
        <span>Description</span>

        <span>Type</span>
        <span>Member Price</span>
        <span>Non Member Price</span>
        <span
          style={{
            width: "140px",
          }}
        >
          Controls
        </span>
      </div>

      {arrayWithIndex?.length == 0 && (
        <p style={{ textAlign: "center" }}>No Rows</p>
      )}
      <div className="data-list">
        {arrayWithIndex.map((ele) => {
          console.log(ele);
          return (
            <div className="contact-row" key={ele?.rowIndex}>
              {idToEdit !== ele.id && (
                <div className="data-row">
                  <span>{ele?.rowIndex}</span>

                  <span>{ele?.Name_en || "-"}</span>
                  <span>{ele?.Description_en || "-"}</span>
                  <span>{ele?.ExtraType || "-"}</span>
                  <span>{ele?.MemberPrice || "-"}</span>
                  <span>{ele?.NonMemberPrice || "-"}</span>

                  <span
                    style={{
                      width: "140px",
                    }}
                  >
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
                      handleDeleteExtra(ele);
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
                    courseId={courseId}
                    extra={ele}
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

export default ExtrasList;
