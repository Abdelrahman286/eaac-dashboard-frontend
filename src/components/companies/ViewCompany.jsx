import React, { useContext } from "react";
import html2pdf from "html2pdf.js";
import "../../styles/companies.css";
import "../../styles/financial-reports.css";
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
// requests
import {
  getCompanyContactsFn,
  getCompanyBranchesFn,
} from "../../requests/companies";

import { useQuery } from "@tanstack/react-query";

const ViewCompany = ({ rowData }) => {
  const { token } = useContext(UserContext);
  // fetch contacts
  const { data: contactsList, isLoading: contactsLoading } = useQuery({
    queryFn: () => {
      return getCompanyContactsFn(
        {
          companyId: `${rowData.id}`,
          numOfElements: "20000",
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    queryKey: ["company-contacts", rowData.id],
  });
  const contacts = contactsList?.success?.response?.data;

  // fetch branches
  const { data: branchesList, isLoading: branchesLoading } = useQuery({
    queryFn: () => {
      return getCompanyBranchesFn(
        {
          companyId: `${rowData?.id}`,
          numOfElements: "20000",
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    queryKey: ["company-branches", rowData.id],
  });
  const branches = branchesList?.success?.response?.data;

  // company attachement
  const attachements = rowData?.CompanyAttach;

  const handlePrintDocument = () => {
    const documentClass = "view-single-company-page";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        margin: [0, 20, 0, 20], // [top, left, bottom, right] in px (adjusted for 1200px width)
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Increase scale for better quality with larger width
          logging: true,
          width: 1200, // Set width to 1200px
          windowWidth: 1200, // Ensure the capture area matches the div size
          allowTaint: true, // Allow cross-origin images
          useCORS: true, // Enable CORS for cross-origin image support
        },
        jsPDF: {
          unit: "px", // Use pixels for precise size control
          format: [1240, 1754], // Width 1200px + 40px margins, height in pixels
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
    <div>
      <div className="separator"></div>
      <div className="view-single-company-page">
        <h2>Company #{rowData?.id || ""}</h2>

        <div className="img-row">
          <div className="img-container">
            <img src={rowData.Logo} alt="company-logo" />
          </div>
        </div>

        {/* // start company data */}
        <div style={{ margin: "16px 0" }}>
          {/* General Information */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
                <strong>Name (AR):</strong>{" "}
                <span>{rowData?.Name_ar || ""}</span>
              </p>
            </div>
            <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
                <strong>Name (EN):</strong> {rowData?.Name_en || ""}
              </p>
            </div>
            <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
                <strong>Code:</strong> {rowData?.ClientCode || ""}
              </p>
            </div>
            <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
                <strong>Phone Number:</strong> {rowData?.MainPhone || ""}
              </p>
            </div>
            <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
                <strong>Commercial Registration No:</strong>{" "}
                {rowData?.CommercialRegistrationNumber || ""}
              </p>
            </div>
            <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
                <strong>Tax Registration No.:</strong>{" "}
                {rowData?.TaxCardNumber || ""}
              </p>
            </div>
            <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
                <strong>Business Lines (Fields of Work):</strong>{" "}
                {rowData?.Business || ""}
              </p>
            </div>
          </div>

          <div
            style={{ margin: "16px 0", borderBottom: "1px solid #ccc" }}
          ></div>

          {/* Notes */}
          <h6
            style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "bold" }}
          >
            Notes
          </h6>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.5",
              whiteSpace: "pre-line",
            }}
          >
            {rowData?.Notes || "No additional notes provided."}
          </p>
        </div>
        {/* // end company data */}

        <h2>Branches</h2>
        {branchesLoading && <p style={{ textAlign: "center" }}>Loading...</p>}

        {branches?.length > 0 && (
          <div style={{ width: "100%" }}>
            <div className="report-table">
              <div className="header">
                <span>#</span>
                <span
                  style={{
                    width: "100px",
                  }}
                >
                  Name (AR)
                </span>
                <span
                  style={{
                    width: "100px",
                  }}
                >
                  Branch Code
                </span>
                <span>Main Phone</span>
                <span>Description</span>
                <span>Address</span>
              </div>

              <div className="data-list">
                {branches?.map((ele, index) => {
                  return (
                    <div className="row-wrapper" key={index}>
                      <div className="data-row">
                        <span>{index + 1 || "-"}</span>
                        <span
                          style={{
                            width: "100px",
                          }}
                        >
                          {ele?.Name_ar || "-"}
                        </span>
                        <span
                          style={{
                            width: "100px",
                          }}
                        >
                          {ele?.BranchCode || "-"}
                        </span>
                        <span>{ele?.MainPhone || "-"}</span>
                        <span>{ele?.Description_ar || "-"}</span>
                        <span>{ele?.AddressID?.Address || "-"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <h2>Contacts</h2>
        {contactsLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {contacts?.length > 0 && (
          <div style={{ width: "100%" }}>
            <div className="report-table">
              <div className="header">
                <span>#</span>
                <span>Name</span>
                <span>Title</span>
                <span>Phone Number</span>
                <span>Email</span>
                <span>Notes</span>
              </div>

              <div className="data-list">
                {contacts?.map((ele, index) => {
                  return (
                    <div className="row-wrapper" key={index}>
                      <div className="data-row">
                        <span>{index + 1 || "-"}</span>
                        <span>{ele?.Name || "-"}</span>
                        <span>{ele?.Title || "-"}</span>
                        <span>{ele?.PhoneNum1 || "-"}</span>
                        <span>{ele?.Email1 || "-"}</span>
                        <span>{ele?.Notes || "-"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <h2>Attachments</h2>
        {attachements?.length > 0 &&
          attachements.map((ele, index) => {
            return (
              <div key={index}>
                <label># {index + 1}</label>
                <span>
                  <a target="_blank" href={ele.Attach}>
                    {ele.Name || ele.Attach}
                  </a>
                  <br></br>
                  <br></br>
                </span>
              </div>
            );
          })}
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

export default ViewCompany;
