import React, { useState, useContext } from "react";

import "../../styles/students.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

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
  console.log(data);
  const { setSearchResults, disabledList, setDisabledList } =
    useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleClose = () => {
    setShowModal(false);
  };

  // headers for excel export -----------------
  const headers = [
    { key: "Name", label: "Name" },
    { key: "CompanyID.Name_en", label: "Company" },
    { key: "Email", label: "Email" },
    { key: "PhoneNumber", label: "Phone Number" },
    { key: "WhatsappNumber", label: "WhatsApp Number" },
    { key: "GovIssuedID", label: "Government ID" },
    { key: "BranchID.name_en", label: "Branch Name (En)" },
    { key: "Notes", label: "Notes" },
  ];

  const handleSearchChange = (e) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };

  // for pressing enter

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchResults({
      key: "student",
      searchTerm: searchTerm,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults({});
  };

  const handleDisabled = (e) => {
    // toogle show disabled list

    if (disabledList?.key == "student") {
      setDisabledList({});
    } else {
      setDisabledList({ key: "student" });
    }
  };

  const handleGoBack = () => {
    setDisabledList({});
  };

  return (
    <div className="page-actions">
      <div className="search-wrapper">
        {disabledList?.key == "student" && (
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
              disabledList?.key == "student"
                ? "Search Deleted Students"
                : "Search Students"
            }
            inputProps={{ "aria-label": "Search Students" }}
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
          data={data}
          fileName={"Students"}
          headers={headers}
        ></ExportToExcel>

        <FormButton
          onClick={handleDisabled}
          icon={
            disabledList?.key == "student" ? (
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
            disabledList?.key == "student" ? "Hide Disabled" : "Show Disabled"
          }
          className="archive-btn dashboard-actions-btn"
        ></FormButton>

        <FormButton
          onClick={() => setShowModal(true)}
          icon={
            <AddCircleIcon
              sx={{ verticalAlign: "middle", margin: "0px 3px" }}
            ></AddCircleIcon>
          }
          buttonText={"Add Student"}
          className="add-student-btn dashboard-actions-btn"
        ></FormButton>
      </div>
      {showModal && (
        <Modal
          title={"Add Student"}
          onClose={handleClose}
          classNames="student-mutation-form "
        >
          <MutationForm onClose={handleClose}></MutationForm>
        </Modal>
      )}
    </div>
  );
};

export default HeaderActions;
