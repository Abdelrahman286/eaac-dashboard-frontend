import React, { useEffect, useState, useContext } from "react";

import "../../styles/courses.css";

import { AppContext } from "../../contexts/AppContext";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArchiveIcon from "@mui/icons-material/Archive";
import PreviewIcon from "@mui/icons-material/Preview";

// components
import FormButton from "../FormButton";
import Modal from "../Modal";
import MutationForm from "./MutationForm";

import ExportToExcel from "../ExportToExcel";
const HeaderActions = ({ data }) => {
  const { setSearchResults, disabledList, setDisabledList } =
    useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleClose = () => {
    setShowModal(false);
  };

  // headers for excel export
  const headers = [
    { key: "BranchID.Name_en", label: "Branch Name En" },
    { key: "CourseCategoryID.Name_en", label: "Course Category" },
    { key: "subcategory.Name_en", label: "Sub Category" },
    { key: "CourseCode", label: "Course Code" },
    { key: "CourseTime", label: "Course Time" },
    { key: "Description_en", label: "Describtion" },
    {
      key: "NonMemberPrice",
      label: "Non Memeber Price",
    },
    { key: "MemberPrice", label: "Memeber Price" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // for pressing enter

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchResults({
      key: "course",
      searchTerm: searchTerm,
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults({});
  };

  const handleDisabled = (e) => {
    // toogle show disabled list

    if (disabledList?.key == "course") {
      setDisabledList({});
    } else {
      setDisabledList({ key: "course" });
    }
  };

  const handleGoBack = () => {
    setDisabledList({});
  };
  return (
    <div className="page-actions">
      <div className="search-wrapper">
        {disabledList?.key == "course" && (
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
              disabledList?.key == "course"
                ? "Search Deleted Courses"
                : "Search Courses"
            }
            inputProps={{ "aria-label": "search courses" }}
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
          fileName={"courses"}
          headers={headers}
        ></ExportToExcel>

        <FormButton
          onClick={handleDisabled}
          icon={
            disabledList?.key == "course" ? (
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
            disabledList?.key == "course" ? "Hide Disabled" : "Show Disabled"
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
          buttonText={"Add Course"}
          className="add-course-btn dashboard-actions-btn"
        ></FormButton>
      </div>

      {showModal && (
        <Modal
          title={"Add Course"}
          onClose={handleClose}
          classNames={"h-70per course-form-width"}
        >
          <MutationForm onClose={handleClose}></MutationForm>
        </Modal>
      )}
    </div>
  );
};

export default HeaderActions;
