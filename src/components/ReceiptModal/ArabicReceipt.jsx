import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import html2pdf from "html2pdf.js";
import PrintIcon from "@mui/icons-material/Print";

import "../../styles/students.css";
// Images
import receiptLogo from "../../assets/receipt-logo.png";

const ArabicReceipt = ({ data }) => {
  const handlePrintPdf = () => {
    const documentClass = "receipt-box-ar";
    const element = document.querySelector(`.${documentClass}`);

    if (element) {
      const opt = {
        margin: [10, 20, 0, 20],
        filename: "receipt.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          logging: true,
          width: 650, // Updated width
          windowWidth: 650, // Updated window width
          allowTaint: true,
          useCORS: true,
        },
        jsPDF: {
          unit: "px",
          format: [650, 1050], // Updated width in format
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      html2pdf().from(element).set(opt).save();
    } else {
      console.error(`Element with class ${documentClass} not found.`);
    }
  };

  console.log(data);

  return (
    <div>
      <div
        className="receipt-box-ar"
        style={{
          width: "600px",
          margin: "auto",
          padding: "16px", // Reduced padding
          borderRadius: "8px",
          border: "1px solid #d3d3d3",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "white",
          direction: "rtl",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "16px", // Reduced margin
          }}
        >
          {/* First Box - Right aligned */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <h4
              style={{
                fontWeight: "bold",
                color: "#4a4a4a",
                margin: "0",
                fontSize: "20px",
              }}
            >
              إيصال الدفع #{data?.BillCode || "--"}
            </h4>
            <p style={{ color: "#6c757d", margin: "4px 0" }}>
              {data?.created_at?.split(" ")[0] || "--"} |{" "}
              {data?.created_at?.split(" ")[1] || "--"}
            </p>
          </div>

          {/* Second Box - Left aligned with image */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              //   flexShrink: 0,
            }}
          >
            <img
              style={{
                width: "50%",
                height: "auto",
                marginLeft: "16px",
              }}
              src={receiptLogo}
              alt="Logo"
            />
          </div>
        </div>
        {/* Content */}
        <div style={{ marginBottom: "0px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column", // Stack the content vertically
              gap: "4px", // Reduced gap
              marginBottom: "12px", // Reduced margin
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>المبلغ المدفوع</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.Credit || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>طريقة الدفع</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.PaymentMethodID?.Method_en || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>اسم العميل (AR)</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.Payor?.Name || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>اسم العميل (EN)</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.Payor?.Name || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "4px 0" }}>رقم الموبايل</p>
                <p style={{ margin: "4px 0" }}>
                  {data?.Payor?.PhoneNumber || "--"}
                </p>
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ margin: "4px 0" }}>الايميل</p>
                <p style={{ margin: "4px 0" }}>{data?.Payor?.Email || "--"}</p>
              </div>
            </div>

            {/* Added a new row for "رقم العضوية" */}
            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>رقم العضوية</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.MembershipID?.MembershipCode || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>البيان</p>
              <p
                style={{
                  margin: "4px 0",
                  flex: "2",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  width: "500px",
                }}
              >
                {data?.Description || ""}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>الملاحظات</p>
              <p style={{ margin: "4px 0", flex: "2" }}>{data?.Notes || ""}</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>اسم الكورس</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.RoundID?.CourseID?.Name_en || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>اسم الدوره</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.RoundID?.Name_en || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>إجمالي سعر الدورة</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.CoursePrice || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>كود الخصم</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.DiscountVoucherID?.VoucherCode || "--"}
              </p>
              <p style={{ margin: "4px 0", flex: "1" }}>قيمه الخصم</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.DiscountVoucherID?.DiscountPercentage || "--"}
                {data?.DiscountVoucherID?.DiscountPercentage == 1 &&
                data?.DiscountVoucherID?.VoucherCode
                  ? " % "
                  : "  EGP  "}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>المتبقي</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.Balance || "EGP"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>اسم الموظف</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.Receiver?.Name || "--"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ margin: "4px 0", flex: "1" }}>كود الموظف</p>
              <p style={{ margin: "4px 0", flex: "2" }}>
                {data?.Receiver?.id || "--"}
              </p>
            </div>
          </div>
        </div>
        <hr style={{ marginBottom: "12px" }} /> {/* Reduced margin */}
        {/* Footer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px", // Reduced gap
          }}
        >
          <div>
            <p style={{ margin: "4px 0" }}>الفرع</p>
            <p style={{ margin: "4px 0" }}>{data?.BranchID?.Name_en || "--"}</p>
          </div>
          <div>
            <p style={{ margin: "4px 0" }}>التوقيع</p>
            <p style={{ margin: "4px 0" }}>
              {data?.signature || "___________"}
            </p>
          </div>
        </div>
        {/* Footer Note */}
        <p
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "16px",
            color: "#6c757d",
          }}
        >
          www.erp.eaacgroup.org | شركة إياك للخدمات
        </p>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        <Button
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={handlePrintPdf}
        >
          حفظ PDF
        </Button>
      </div>
    </div>
  );
};

export default ArabicReceipt;
