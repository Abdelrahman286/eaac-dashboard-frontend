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
          numOfElements: "20000",
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    queryKey: ["company-contacts"],
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

  const handlePrintDocument = () => {
    const documentClass = "view-single-company-page";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        margin: 1,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
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

          <span>#.....</span>
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
          {branches?.length > 0 &&
            branches.map((ele, index) => {
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
            })}
        </div>

        <h2>Contacts</h2>

        {contacts?.length > 0 && (
          <div className="group">
            <div className="data-row">
              {contacts.map((contact, index) => {
                return (
                  <div key={index}>
                    <label>
                      <p>
                        # {index + 1} | {contact?.Name || ""}
                      </p>
                      {/* <span>{contact?.Name || ""}</span> */}
                    </label>

                    <span>{contact?.JobTitle || ""}</span>

                    <span>{contact?.Email1 || ""}</span>

                    <span>{contact?.PhoneNum1 || ""}</span>
                    <span>{contact?.PhoneNum2 || ""}</span>

                    <span>{contact?.Notes || ""}</span>
                  </div>
                );
              })}
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

      <div className="separator"></div>

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
