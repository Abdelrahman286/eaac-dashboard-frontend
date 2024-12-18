import React, { useState, useContext } from "react";

import "../../../styles/rooms.css";

import { useNavigate } from "react-router-dom";
// contexts
import { AppContext } from "../../../contexts/AppContext";

import { UserContext } from "../../../contexts/UserContext";

// MUI
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
import Modal from "../../Modal";
import MutationForm from "./MutationForm";
import FormButton from "../../FormButton";

// utils
import ExportToExcel from "../../ExportToExcel";

const Header = ({ data }) => {
  const { hasPermission } = useContext(UserContext);

  const navigate = useNavigate();
  const { setSearchResults, disabledList, setDisabledList } =
    useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleClose = () => {
    setShowModal(false);
  };

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
      key: "promoCodes",
      searchTerm: searchTerm,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults({});
  };

  const handleDisabled = (e) => {
    if (disabledList?.key == "promoCodes") {
      setDisabledList({});
    } else {
      setDisabledList({ key: "promoCodes" });
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
              disabledList?.key == "promoCodes"
                ? "Search Deleted Coupons"
                : "Search Coupons"
            }
            inputProps={{ "aria-label": "search Promo Codes" }}
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
        {/* <ExportToExcel
          data={data}
          fileName={"promoCodes"}
          headers={headers}
        ></ExportToExcel> */}

        <FormButton
          onClick={handleDisabled}
          icon={
            disabledList?.key == "promoCodes" ? (
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
            disabledList?.key == "promoCodes"
              ? "Hide Disabled"
              : "Show Disabled"
          }
          className="archive-btn dashboard-actions-btn"
        ></FormButton>

        {hasPermission("Add Coupon") && (
          <FormButton
            onClick={() => setShowModal(true)}
            icon={
              <AddCircleIcon
                sx={{ verticalAlign: "middle", margin: "0px 3px" }}
              ></AddCircleIcon>
            }
            buttonText={"Add Coupon"}
            className="add-room-btn dashboard-actions-btn"
          ></FormButton>
        )}
      </div>
      {showModal && (
        <Modal
          title={"Add Coupon"}
          onClose={handleClose}
          classNames={"course-form-width"}
        >
          <MutationForm onClose={handleClose}></MutationForm>
        </Modal>
      )}
    </div>
  );
};

export default Header;
