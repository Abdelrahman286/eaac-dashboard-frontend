import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import "../../../styles/rounds.css";
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
import FormButton from "../../FormButton";
import CustomIconButton from "../../CustomIconButton";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EditSessionForm from "./EditSessionForm";

// Requests
import {
  EditRoundFn,
  getInstructorsFn,
  getRoomsFn,
  getSessionsFn,
  updateSessionFn,
} from "../../../requests/rounds";

// validations
import {
  validateAddRound,
  validateEditRound,
} from "../../../utils/requestValidations";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const EditSessionsForm = ({ data, onClose }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const [idToEdit, setIdToEdit] = useState();

  // sessions list
  const { data: sessionsList, isLoading: sessionsLoading } = useQuery({
    queryFn: () => {
      return getSessionsFn(
        {
          numOfElements: "3000",
          roundId: `${data?.id}`,
        },
        token
      );
    },

    queryKey: ["roundSessions", data?.id],
  });
  const sessions = getDataForTableRows(sessionsList?.success?.response?.data);

  const arrayWithIndex = sessions.map((item, index) => ({
    ...item,
    rowIndex: index + 1, // Add the index to each object
  }));

  const handleGoBack = () => {
    setShowAddForm(false);
  };

  // Delete Mutation
  const {
    mutate: deleteSession,
    isPending: deleteLoading,
    isError: isDeleteError,
  } = useMutation({
    onError: (error) => {
      //   console.log(error.responseError?.failed?.response?.msg);
      console.log("Error at editing Round data", error);
      showSnackbar("Faild to edit Round Data", "error");
    },
    mutationFn: updateSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["roundSessions"]);
      showSnackbar("Session Deleted Successfully", "success");
    },
  });

  const handleDeleteSession = (session) => {
    console.log(session);

    //statusId = 4

    deleteSession({
      reqBody: { id: [session.id], session: [{ statusId: 4 }] },
      token,
      config: { isFormData: false },
    });
  };
  return (
    <div className="edit-sessions">
      {/* Add button */}
      <div className="header">
        {showAddForm && (
          <IconButton
            sx={{
              backgroundColor: "#f5f5f5", // Lighter grayish color
              "&:hover": {
                backgroundColor: "#eeeeee", // Slightly darker light gray on hover
              },

              display: "flex",
              justifySelf: "flex-end",
            }}
            color=""
            aria-label="go back"
            onClick={handleGoBack}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {!showAddForm && (
          <Button
            variant="outlined"
            color="success"
            sx={{
              marginLeft: "auto",
            }}
            //   disabled={showAddForm}
            startIcon={<AddIcon />}
            onClick={(e) => {
              setShowAddForm(true);
            }}
          >
            Add New Sessions
          </Button>
        )}
      </div>
      {!showAddForm && (
        <div className="sessions-list">
          <div className="one-by-one-sessionsList">
            <div className="header">
              <span>#</span>
              <span>Session Name</span>
              <span>Date</span>
              <span>Start Time</span>
              <span>End Time</span>
              <span>Description</span>
              <span>Room</span>
              <span>Instructor</span>
              <span>Controls</span>
            </div>

            {arrayWithIndex?.length == 0 && !sessionsLoading ? (
              <p style={{ textAlign: "center" }}>No Rows</p>
            ) : (
              ""
            )}
            {sessionsLoading && (
              <LoadingSpinner height={"100px"}></LoadingSpinner>
            )}
            <div className="data-list">
              {arrayWithIndex.map((ele) => {
                return (
                  <div className="session-row" key={ele?.rowIndex}>
                    {idToEdit !== ele.id && (
                      <div className="data-row">
                        <span>{ele?.rowIndex}</span>
                        <span>{ele?.Name_en || "-"}</span>
                        <span>{ele?.SessionDate?.split(" ")[0]}</span>
                        <span>{ele?.StartTime?.split(" ")[1]}</span>
                        <span>{ele?.EndTime?.split(" ")[1]}</span>
                        <span>{ele?.Description_en}</span>
                        <span>{ele?.RoomID?.Name_en}</span>
                        <span>{ele?.InstructorID?.Name}</span>
                        <span>
                          <CustomIconButton
                            icon={"edit"}
                            title="Edit"
                            onClick={() => setIdToEdit(ele.id)}
                          ></CustomIconButton>
                          <CustomIconButton
                            sx={{ marginLeft: "20px" }}
                            icon={"delete"}
                            title="Delete"
                            onClick={() => {
                              setIdToDelete(ele.id);
                            }}
                          ></CustomIconButton>
                        </span>
                      </div>
                    )}
                    <div>
                      {idToDelete == ele.id && (
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
                            variant="contained"
                            color="error"
                            onClick={(e) => {
                              handleDeleteSession(ele);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>

                    {idToEdit == ele.id && (
                      <div>
                        <EditSessionForm
                          session={ele}
                          onCancel={() => setIdToEdit("")}
                        ></EditSessionForm>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSessionsForm;
