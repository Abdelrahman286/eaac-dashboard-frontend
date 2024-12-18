import React, { useEffect, useState, useContext } from "react";

import "../../styles/companies.css";
import { AppContext } from "../../contexts/AppContext";

import { UserContext } from "../../contexts/UserContext";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

// icons
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArchiveIcon from "@mui/icons-material/Archive";
import PreviewIcon from "@mui/icons-material/Preview";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// components
import FormButton from "../FormButton";
import Modal from "../Modal";
import MutationForm from "./MutationForm";

import ExportToExcel from "../ExportToExcel";
const HeaderActions = ({ data }) => {
  const { hasPermission } = useContext(UserContext);
  const { setSearchResults, disabledList, setDisabledList } =
    useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleClose = () => {
    setShowModal(false);
  };

  const headers = [
    { key: "Name_en", label: "Company Name" },
    { key: "NameAr", label: "اسم الشركه" },
    { key: "Business", label: "Name" },
    { key: "MainPhone", label: "Main Phone" },
    { key: "websiteUrl", label: "website URL" },
    { key: "HqAdressID.Address", label: "Address" },
    {
      key: "CommercialRegistrationNumber",
      label: "Commercial Registration No",
    },
    { key: "TaxCardNumber", label: "Tax Card Number" },

    { key: "ClientCode", label: "Company Code" },
    { key: "Notes", label: "Notes" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // for pressing enter

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchResults({
      key: "company",
      searchTerm: searchTerm,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults({});
  };

  const handleDisabled = (e) => {
    // toogle show disabled list

    if (disabledList?.key == "company") {
      setDisabledList({});
    } else {
      setDisabledList({ key: "company" });
    }
  };

  const handleGoBack = () => {
    setDisabledList({});
  };

  return (
    <div className="page-actions">
      <div className="search-wrapper">
        {disabledList?.key == "company" && (
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
              disabledList?.key == "company"
                ? "Search Deleted Companies"
                : "Search Companies"
            }
            inputProps={{ "aria-label": "search companies" }}
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
        {/* )} */}
      </div>
      <div className="buttons">
        <ExportToExcel
          data={data}
          fileName={"Companies"}
          headers={headers}
        ></ExportToExcel>

        <FormButton
          onClick={handleDisabled}
          icon={
            disabledList?.key == "company" ? (
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
            disabledList?.key == "company" ? "Hide Disabled" : "Show Disabled"
          }
          className="archive-btn dashboard-actions-btn"
        ></FormButton>

        {hasPermission("Add Company") && (
          <FormButton
            onClick={() => setShowModal(true)}
            icon={
              <AddCircleIcon
                sx={{ verticalAlign: "middle", margin: "0px 3px" }}
              ></AddCircleIcon>
            }
            buttonText={"Add Company"}
            className="add-company-btn dashboard-actions-btn"
          ></FormButton>
        )}
      </div>

      {showModal && (
        <Modal
          title={"Add Company"}
          onClose={handleClose}
          classNames={"h-70per"}
        >
          <MutationForm onClose={handleClose}></MutationForm>
        </Modal>
      )}
    </div>
  );
};

export default HeaderActions;
