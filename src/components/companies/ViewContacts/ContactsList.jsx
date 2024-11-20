import React from "react";

const ContactsList = ({ data }) => {
  const arrayWithIndex = data?.map((item, index) => ({
    ...item,
    rowIndex: index + 1, // Add the index to each object
  }));

  console.log(data);
  //Name , JobTitle , PhoneNum1 , PhoneNum2 , WhatsAppNum , Email1 , Notes
  return (
    <div className="contacts-list">
      <div className="header">
        <span>#</span>

        <span>Name</span>
        <span>Job Title</span>
        <span>Phone Number 1</span>
        <span>Phone Number 2</span>
        <span>What's App Number</span>
        <span>Email</span>
        <span>Notes</span>
        <span>Controls</span>
      </div>

      {arrayWithIndex?.length == 0 && (
        <p style={{ textAlign: "center" }}>No Rows</p>
      )}
      <div className="data-list">
        {arrayWithIndex.map((ele) => {
          return (
            <div className="contact-row" key={ele?.rowIndex}>
              <div className="data-row">
                <span>{ele?.rowIndex}</span>
                <span>{ele?.Name || "-"}</span>
                <span>{ele?.JobTitle || "-"}</span>
                <span>{ele?.PhoneNum1 || "-"}</span>
                <span>{ele?.PhoneNum2 || "-"}</span>
                <span>{ele?.WhatsAppNum || "-"}</span>
                <span>{ele?.Email1 || "-"}</span>
                <span>{ele?.Notes || "-"}</span>
                <span>{ele?.sessionName || "1 2 "}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactsList;
