import React from "react";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import FormButton from "./FormButton";

// Helper function to access nested keys in an object
const getNestedValue = (obj, key) => {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const ExportToExcel = ({ headers, data, fileName }) => {
  const handleExport = () => {
    if (!data || !headers) {
      console.error("Data or headers are missing");
      return;
    }

    if (!Array.isArray(data) || !Array.isArray(headers)) {
      console.error("Data or headers are not arrays");
      return;
    }

    // Map the data rows with support for nested keys
    const dataRows = data.map((row) =>
      headers.map((header) => getNestedValue(row, header.key) || "")
    );

    console.log("Data Rows:", dataRows); // Check dataRows content

    const ws = XLSX.utils.aoa_to_sheet([
      headers.map((header) => header.label), // First row for header labels
      ...dataRows, // Append the data rows
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    console.log("Workbook:", wb); // Check workbook content

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <FormButton
      icon={
        <DownloadIcon sx={{ verticalAlign: "middle", margin: "0px 3px" }} />
      }
      buttonText="Export XLS"
      onClick={handleExport}
      className="xls-btn dashboard-actions-btn"
    />
  );
};

export default ExportToExcel;
