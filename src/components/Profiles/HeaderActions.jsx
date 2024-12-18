import React, { useState, useContext } from "react";

import { AppContext } from "../../contexts/AppContext";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

// icons
import ArchiveIcon from "@mui/icons-material/Archive";
import PreviewIcon from "@mui/icons-material/Preview";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// components
import FormButton from "../FormButton";

// utils
import ExportToExcel from "../ExportToExcel";
const HeaderActions = ({ data }) => {
  const { setSearchResults, disabledList, setDisabledList } =
    useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");

  // headers for excel export -----------------
  const headers = [
    { key: "Name", label: "Name" },
    { key: "Email", label: "Email" },
    { key: "JobTitle", label: "Job Title" },
    // add address here
    { key: "Nationality", label: "Nationality" },
    { key: "GovIssuedID", label: "Government ID" },
    { key: "WhatsappNumber", label: "WhatsApp Number" },
    { key: "FacebookUrl", label: "Facebook URL" },
    { key: "PhoneNumber", label: "Phone Number" },
    { key: "Notes", label: "Notes" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // for pressing enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchResults({
      key: "profiles",
      searchTerm: searchTerm,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults({});
  };

  const handleDisabled = (e) => {
    // toogle show disabled list

    if (disabledList?.key == "profiles") {
      setDisabledList({});
    } else {
      setDisabledList({ key: "profiles" });
    }
  };

  const handleGoBack = () => {
    setDisabledList({});
  };

  return (
    <div className="page-actions">
      <div className="search-wrapper">
        {disabledList?.key == "profiles" && (
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
              disabledList?.key == "profiles"
                ? "Search Deleted profiles"
                : "Search profiles"
            }
            inputProps={{ "aria-label": "search profiles" }}
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
          fileName={"profiles"}
          headers={headers}
        ></ExportToExcel>

        <FormButton
          onClick={handleDisabled}
          icon={
            disabledList?.key == "profiles" ? (
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
            disabledList?.key == "profiles" ? "Hide Disabled" : "Show Disabled"
          }
          className="archive-btn dashboard-actions-btn"
        ></FormButton>
      </div>
    </div>
  );
};

export default HeaderActions;
