import React, { useContext } from "react";

import html2pdf from "html2pdf.js";
import "../../styles/companies.css";
import PrintIcon from "@mui/icons-material/Print";
import FormButton from "../FormButton";
import { UserContext } from "../../contexts/UserContext";

import {
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

// utils
import { getDataForTableRows } from "../../utils/tables";

// requests
import { getRoundsFn } from "../../requests/students";

const ViewInstructorData = ({ data }) => {
  const { token } = useContext(UserContext);

  // retrieve groups in which the student is enrolled

  const { data: groupsList, isLoading: groupsLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getRoundsFn(
        {
          numOfElements: "2000",
          instructorId: data?.InstructorID,
          //   studentId: 9,
        },
        token,
        { isFormData: true }
      );
    },

    queryKey: ["instructorGroups", data?.InstructorID],
  });
  const groups = getDataForTableRows(groupsList?.success?.response?.data);

  const handlePrintDocument = async () => {
    const documentClass = "student-modal-content";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        // margin: 0.2,
        margin: [0, 1, 0, 1], // [top, left, bottom, right] in inches
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 1.5, // Use a scale that better fits your div size
          logging: true,
          width: 740, // Set width explicitly to match your div size
          windowWidth: 740, // Ensures the capture size is correct
          // Adjust the following if needed for better image rendering
          allowTaint: true, // Allows cross-origin images to be drawn
          useCORS: true, // Enables CORS if images are from a different origin
        },
        jsPDF: {
          unit: "in",
          format: [7.4, 11], // Match the width (740px ~ 7.4 inches), height is a standard letter size
          orientation: "portrait",
          putTotalPages: true,
        },
        pagebreak: {
          //   mode: ["avoid-all", "css", "legacy"],
        },
      };

      // Use html2pdf to convert the element to PDF
      html2pdf().from(element).set(opt).save();
    } else {
      console.error(`Element with class ${documentClass} not found.`);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="separator"></div>
      <div className="student-modal-content" style={{ width: "100%" }}>
        <Paper
          elevation={3}
          sx={{ padding: 4, width: "700px", margin: "auto" }}
        >
          {/* Title */}
          <Typography variant="h5" align="center" gutterBottom>
            User Information Document
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          {/* General Information */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Name:</strong> {data?.Name || ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Job Title:</strong> {data?.JobTitle || ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Email:</strong> {data?.Email || ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {data?.PhoneNumber || ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>WhatsApp Number:</strong> {data?.WhatsappNumber || ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Government ID:</strong> {data?.GovIssuedID || ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Branch:</strong> {data?.BranchID?.name_en || ""}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          {/* Notes */}
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {data?.Notes || "No additional notes provided."}
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          {/* Group Enrollments */}
          <Typography variant="h6" gutterBottom>
            Enrolled Groups
          </Typography>
          {groups && groups.length > 0 ? (
            <List dense>
              {groups.map((group, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={group?.Name_en}
                    secondary={`Start Date: ${
                      group?.StartDate?.split(" ")[0]
                    } | End Date: ${group?.EndDate?.split(" ")[0]}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">No groups enrolled.</Typography>
          )}
        </Paper>
      </div>

      <div className="action-btn-wrapper">
        <FormButton
          className="main-btn"
          buttonText={"Print"}
          icon={<PrintIcon></PrintIcon>}
          onClick={handlePrintDocument}
        ></FormButton>
      </div>
    </div>
  );
};

export default ViewInstructorData;
