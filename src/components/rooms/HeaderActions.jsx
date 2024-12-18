import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

import "../../styles/rooms.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Typography } from "@mui/material";

// icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArchiveIcon from "@mui/icons-material/Archive";
import PreviewIcon from "@mui/icons-material/Preview";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// components
import FormButton from "../FormButton";
import Modal from "../Modal";
import MutationForm from "./MutationForm";

// utils
import ExportToExcel from "../ExportToExcel";

const HeaderActions = ({ data }) => {
  const { hasPermission } = useContext(UserContext);
  const navigate = useNavigate();
  const { setSearchResults, disabledList, setDisabledList } =
    useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleClose = () => {
    setShowModal(false);
  };

  // modify the data for excel export

  const modifiedDataRows = data.map((ele) => {
    const { WhiteBoardFlag, ScreenFlag, SpecialNeedsFlag, PcFlag } = ele;

    let finalText = `
      has whiteBoard: ${WhiteBoardFlag == "1" ? "yes" : "no"} \n
      has projector: ${ScreenFlag == "1" ? "yes" : "no"} \n
      has PC: ${PcFlag == "1" ? "yes" : "no"} \n
      has Special Needs: ${SpecialNeedsFlag == "1" ? "yes" : "no"}
    `;

    // Return a new object with the original data and the roomFeatures
    return {
      ...ele,
      roomFeatures: finalText.trim(), // Add the finalText to the new field
    };
  });

  // headers for excel export -----------------
  const headers = [
    { key: "BranchID.Name_en", label: "Branch Name (En)" },
    { key: "Name_en", label: "Room Name" },
    { key: "RoomCode", label: "Room Code" },
    { key: "Capacity", label: "Capacity" },
    { key: "Description_en", label: "Describtion" },
    { key: "roomFeatures", label: "Room Features" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // for pressing enter

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchResults({
      key: "room",
      searchTerm: searchTerm,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults({});
  };

  const handleDisabled = (e) => {
    // toogle show disabled list

    if (disabledList?.key == "room") {
      setDisabledList({});
    } else {
      setDisabledList({ key: "room" });
    }
  };

  const handleGoBack = () => {
    setDisabledList({});
  };

  return (
    <div className="page-actions">
      <div className="search-wrapper">
        {disabledList?.key == "room" && (
          <div className="page-go-back-icon-wrapper">
            <IconButton
              sx={{
                backgroundColor: "#f5f5f5", // Lighter grayish color
                "&:hover": {
                  backgroundColor: "#eeeeee", // Slightly darker light gray on hover
                },
              }}
              color=""
              aria-label="go back"
              onClick={handleGoBack}
            >
              <ArrowBackIcon />
              {/* <Typography sx={{ marginLeft: 1 }}>Back</Typography> */}
            </IconButton>
          </div>
        )}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: "2px 8px",
            display: "flex",
            alignItems: "center",
            background: "#f5f3f4",
            borderRadius: "20px",
            boxShadow: "initial",
            ":focus-within": {
              border: "1px solid rgb(225 232 238)",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={
              disabledList?.key == "room"
                ? "Search Deleted Rooms"
                : "Search Rooms"
            }
            inputProps={{ "aria-label": "search rooms" }}
            onChange={handleSearchChange}
            value={searchTerm}
          />

          {searchTerm?.length > 0 && (
            <IconButton
              onClick={clearSearch}
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          )}

          <IconButton
            onClick={handleSearchSubmit}
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
      <div className="buttons">
        <ExportToExcel
          data={modifiedDataRows}
          fileName={"rooms"}
          headers={headers}
        ></ExportToExcel>

        <FormButton
          onClick={handleDisabled}
          icon={
            disabledList?.key == "room" ? (
              <ArchiveIcon
                sx={{ verticalAlign: "middle", margin: "0px 3px" }}
              ></ArchiveIcon>
            ) : (
              <PreviewIcon
                sx={{ verticalAlign: "middle", margin: "0px 3px" }}
              ></PreviewIcon>
            )
          }
          buttonText={
            disabledList?.key == "room" ? "Hide Disabled" : "Show Disabled"
          }
          className="archive-btn dashboard-actions-btn"
        ></FormButton>

        {hasPermission("Add Room") && (
          <FormButton
            onClick={() => setShowModal(true)}
            icon={
              <AddCircleIcon
                sx={{ verticalAlign: "middle", margin: "0px 3px" }}
              ></AddCircleIcon>
            }
            buttonText={"Add Room"}
            className="add-room-btn dashboard-actions-btn"
          ></FormButton>
        )}
      </div>
      {showModal && (
        <Modal
          title={"Add Room"}
          onClose={handleClose}
          classNames={"course-form-width"}
        >
          <MutationForm onClose={handleClose}></MutationForm>
        </Modal>
      )}
    </div>
  );
};

export default HeaderActions;
