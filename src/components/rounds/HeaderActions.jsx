import React, { useState, useContext, useEffect } from "react";

import "../../styles/rounds.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
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
import CustomIconButton from "../CustomIconButton";

// hooks
import useQueryParam from "../../hooks/useQueryParams";

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

  // headers for excel export -----------------
  const headers = [
    { key: "Name", label: "Name" },
    { key: "JobTitle", label: "Job Title" },
    { key: "Email", label: "Email" },
    { key: "PhoneNumber", label: "Phone Number" },
    { key: "WhatsappNumber", label: "WhatsApp Number" },
    { key: "GovIssuedID", label: "Government ID" },
    { key: "BranchID.Name_en", label: "Branch Name (En)" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // for pressing enter

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchResults({
      key: "round",
      searchTerm: searchTerm,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults({});
  };

  const handleDisabled = (e) => {
    // toogle show disabled list

    if (disabledList?.key == "round") {
      setDisabledList({});
    } else {
      setDisabledList({ key: "round" });
    }
  };

  const handleGoBack = () => {
    setDisabledList({});
  };

  // url action handler
  const urlAction = useQueryParam("action");
  useEffect(() => {
    if (urlAction == "add") {
      setShowModal(true);
    }
  }, [urlAction]);

  return (
    <div className="page-actions">
      <div className="search-wrapper">
        {disabledList?.key == "round" && (
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
              disabledList?.key == "round"
                ? "Search Deleted Rounds"
                : "Search Rounds"
            }
            inputProps={{ "aria-label": "search rounds" }}
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
          fileName={"Rounds"}
          headers={headers}
        ></ExportToExcel>

        <FormButton
          onClick={handleDisabled}
          icon={
            disabledList?.key == "round" ? (
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
            disabledList?.key == "round" ? "Hide Disabled" : "Show Disabled"
          }
          className="archive-btn dashboard-actions-btn"
        ></FormButton>

        {hasPermission("Add Round") && (
          <FormButton
            onClick={() => setShowModal(true)}
            icon={
              <AddCircleIcon
                sx={{ verticalAlign: "middle", margin: "0px 3px" }}
              ></AddCircleIcon>
            }
            buttonText={"Add Round"}
            className="add-round-btn dashboard-actions-btn"
          ></FormButton>
        )}
      </div>
      {showModal && (
        <Modal
          title={"Add Round"}
          onClose={handleClose}
          classNames="round-mutation-form "
        >
          <MutationForm onClose={handleClose}></MutationForm>
        </Modal>
      )}
    </div>
  );
};

export default HeaderActions;
