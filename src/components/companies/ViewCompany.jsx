import React, { useContext } from "react";
import html2pdf from "html2pdf.js";
import "../../styles/companies.css";
import PrintIcon from "@mui/icons-material/Print";
import FormButton from "../FormButton";
import { UserContext } from "../../contexts/UserContext";

// requests
import {
  getCompanyContactsFn,
  getCompanyBranchesFn,
} from "../../requests/companies";

import { useQuery } from "@tanstack/react-query";

const ViewCompany = ({ rowData }) => {
  const { token } = useContext(UserContext);
  // fetch contacts
  const { data: contactsList } = useQuery({
    queryFn: () => {
      return getCompanyContactsFn(
        {
          companyId: `${rowData.id}`,
          //   companyId: "1",
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
  const { data: branchesList } = useQuery({
    queryFn: () => {
      return getCompanyBranchesFn(
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
    queryKey: ["company-branches"],
  });
  const branches = branchesList?.success?.response?.data;

  // company attachement
  const attachements = rowData?.CompanyAttach;

  const handlePrintDocument = async () => {
    const documentClass = "view-single-company-page";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        margin: 1,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2, // Use a scale that better fits your div size
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

        <div className="data-row">
          <label>Company Name</label>
          <span> {rowData?.Name_ar || ""}</span>

          <span> {rowData?.Name_en || ""}</span>

          <label>Code</label>

          <span>{rowData?.ClientCode}</span>
        </div>

        <div className="data-row">
          <label>Phone</label>
          <span>{rowData?.MainPhone}</span>

          <label>Commercial Registeration No. </label>
          <span>{rowData?.CommercialRegistrationNumber || ""}</span>

          <label>Tax Registeration No.</label>

          <span>{rowData?.TaxCardNumber || ""}</span>
        </div>

        <div className="data-row">
          <label>Business Lines (Fields of Work)</label>

          <span>{rowData?.Business || ""}</span>
        </div>

        <div className="data-row">
          <label>Notes</label>

          <span>{rowData?.Notes || ""}</span>
        </div>

        <h2>Branches</h2>

        <div className="group">
          {branches?.length > 0
            ? branches.map((ele, index) => {
                return (
                  <div key={index}>
                    <div className="data-row">
                      <label># {index + 1}</label>
                      <span>{ele.Name_ar || ""}</span>
                      <span>{ele.Name_en || ""}</span>
                      <span>{ele.MainPhone || ""}</span>

                      <label htmlFor="">opens at</label>
                      <span>{ele.OpensAt || ""}</span>

                      <label htmlFor="">closes at</label>
                      <span>{ele.ClosesAt || ""}</span>

                      <p>{ele.AddressID.Address || ""}</p>

                      <br></br>
                      <br></br>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>

        <h2>Contacts</h2>

        {contacts?.length > 0 && (
          <div className="group">
            <table
              style={{
                maxWidth: "600px",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f2f2f2",
                      width: "50px", // Set a fixed width for the index column
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f2f2f2",
                      width: "150px", // Fixed width for name column
                      wordWrap: "break-word", // Ensure long text wraps
                      overflowWrap: "break-word",
                      whiteSpace: "normal", // Ensure wrapping
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f2f2f2",
                      width: "150px", // Fixed width for title column
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f2f2f2",
                      width: "150px", // Fixed width for phone number column
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Phone Number
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f2f2f2",
                      width: "200px", // Fixed width for email column
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f2f2f2",
                      width: "200px", // Fixed width for notes column
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {contact?.Name || ""}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {contact?.Title || ".."}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {contact?.PhoneNum1 || ".."}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {contact?.Email1 || ".."}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {contact?.Notes || ".."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
