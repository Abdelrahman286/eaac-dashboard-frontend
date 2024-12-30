import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Box, Typography, Button, AppBar, Toolbar } from "@mui/material";
import "../../styles/financial-reports.css";
// requests
import { getSessionsFn } from "../../requests/rounds";

// contextsp
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

import companyLogo from "../../assets/receipt-logo.png";
// icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import html2pdf from "html2pdf.js";

// utils
import { getDataForTableRows } from "../../utils/tables";

// loading
import LoadingSpinner from "../../components/LoadingSpinner";

const ViewRound = ({ onClose, roundData }) => {
  const { token } = useContext(UserContext);
  //----- Sessions
  const {
    data: sessionsList,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => {
      return getSessionsFn(
        {
          numOfElements: "3000",
          roundId: `${roundData?.id}`,
        },
        token
      );
    },

    queryKey: ["roundSessions1", roundData?.id],
  });
  const sessions = getDataForTableRows(sessionsList?.success?.response?.data);

  const handlePrintPdf = () => {
    const documentClass = "view-round-content";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        margin: [0, 20, 0, 20], // [top, left, bottom, right] in px (adjusted for 1400px width)
        filename: "round-data.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Increase scale for better quality with larger width
          logging: true,
          width: 1400, // Set width to 1400px
          windowWidth: 1400, // Ensure the capture area matches the div size
          allowTaint: true, // Allow cross-origin images
          useCORS: true, // Enable CORS for cross-origin image support
        },
        jsPDF: {
          unit: "px", // Use pixels for precise size control
          format: [1440, 1754], // Width 1400px + 40px margins, height in pixels
          orientation: "portrait",
          putTotalPages: true,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      };

      // Use html2pdf to convert the element to PDF
      html2pdf().from(element).set(opt).save();
    } else {
      console.error(`Element with class ${documentClass} not found.`);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handlePrintPdf}
          size="small"
          variant="contained"
          color="success"
          startIcon={<PictureAsPdfIcon />}
          sx={{
            minWidth: "160px",
            paddingY: 0.1,
            height: "40px",
            padding: "16px 4px",
            borderRadius: "20px",
            marginTop: "20px",
          }}
        >
          Export PDF
        </Button>
      </Box>

      <div className="separator" style={{ margin: "10px 0px" }}></div>

      <div className="view-round-content">
        <AppBar
          position="static"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Toolbar sx={{ justifyContent: "center", position: "relative" }}>
            {/* Logo on the left */}
            <Box
              component="img"
              src={companyLogo}
              alt="Logo"
              sx={{
                height: 40,
                position: "absolute",
                left: 16,
                cursor: "pointer",
              }}
            />
            {/* Centered Header Text */}
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: "center", color: "black" }}
            >
              {roundData?.Name_en || ""} Round
            </Typography>
          </Toolbar>
        </AppBar>

        {/* round data  */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            minWidth: "800px",
            width: "100%",
            margin: "10px 0px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2px",
            }}
          >
            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Round Code
              </h4>
              <p style={{ margin: 0 }}>{roundData?.RoundCode || "N/A"}</p>
            </div>
            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Instructor
              </h4>
              <p style={{ margin: 0 }}>
                {roundData?.InstructorID?.Name || "N/A"}
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Course Name
              </h4>
              <p style={{ margin: 0 }}>
                {roundData?.CourseID?.Name_en || "N/A"}
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Room Name
              </h4>
              <p style={{ margin: 0 }}>{roundData?.RoomID?.Name_en || "N/A"}</p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>Branch</h4>
              <p style={{ margin: 0 }}>
                {roundData?.BranchID?.Name_en || "N/A"}
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: "4px", color: "#6c757d" }}>
                Today's Date
              </h4>
              <p style={{ margin: 0 }}>
                {`${new Date().getDate()}/${
                  new Date().getMonth() + 1
                }/${new Date().getFullYear()}`}
              </p>
            </div>
          </div>
        </div>

        <Typography
          variant="h5"
          align="center"
          fontWeight={400}
          color="primary"
          sx={{ padding: "10px 0px" }}
        >
          Sessions
        </Typography>

        {/* <SessionsList roundId={roundData.id}></SessionsList> */}

        {isError && <p style={{ textAlign: "center" }}>No Rows Found</p>}
        {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {sessions?.length !== 0 && (
          <div>
            <div>
              <div className="report-table">
                <div className="header">
                  <span>#</span>
                  <span>Session Name</span>
                  <span>Date</span>
                  <span>Start Time</span>
                  <span>End Time</span>
                  <span>Description</span>
                  <span>Room</span>
                  <span>Instructor</span>
                </div>

                <div className="data-list">
                  {sessions?.map((ele, index) => {
                    return (
                      <div className="row-wrapper" key={index}>
                        <div className="data-row">
                          <span>{index + 1 || "-"}</span>
                          <span>{ele?.Name_en || "-"}</span>
                          <span>{ele?.SessionDate?.split(" ")[0]}</span>
                          <span>{ele?.StartTime?.split(" ")[1]}</span>
                          <span>{ele?.EndTime?.split(" ")[1]}</span>
                          <span>{ele?.Description_en}</span>
                          <span>{ele?.RoomID?.Name_en}</span>
                          <span>{ele?.InstructorID?.Name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRound;
