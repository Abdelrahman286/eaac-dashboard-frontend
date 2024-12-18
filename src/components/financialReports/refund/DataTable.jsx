import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// MUI
import { Box, Chip, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// contexts
import { UserContext } from "../../../contexts/UserContext";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// requests
import { getRefundReport } from "../../../requests/financialReports";

const DataTable = ({ filterData }) => {
  const { paymentMethodId, startDate, endDate } = filterData;

  const { token } = useContext(UserContext);

  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI uses 0-based index
    pageSize: 10, // Initial page size
  });

  const paginationReqBody = {
    // filter parameters
    ...(paymentMethodId && { paymentMethodId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
  const dataListReqBody = {
    numOfElements: paginationModel.pageSize,

    // filter parameters
    ...(paymentMethodId && { paymentMethodId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const {
    data: paginationData,
    isLoading: isPaginationLoading,
    isError: paginationErr,
  } = useQuery({
    queryFn: () => {
      return getRefundReport(paginationReqBody, token, {
        isFormData: false,
        urlParams: `page=1`,
      });
    },
    queryKey: ["refundReport-pagination", paginationReqBody, dataListReqBody],
    retry: 1,
  });

  // Now, only trigger the list data fetching when paginationData is available
  const {
    data: listData,
    isLoading: isListLoading,
    isError: dataError,
  } = useQuery({
    queryKey: [
      "refundReport-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
    ],
    queryFn: () => {
      return getRefundReport(dataListReqBody, token, {
        isFormData: false,
        urlParams: `page=${paginationModel.page + 1}`,
      });
    },

    enabled: !!paginationData,
    keepPreviousData: true,
  });

  //------------------- Data transformation
  const dataObject = listData?.success?.response?.data;
  const dataList = getDataForTableRows(dataObject);

  // Total elements fetched from the server
  let totalElements =
    paginationData?.success?.response?.numOfWholeElements || 0;

  // Compute the row indices based on pagination
  let updatedDataList = dataList.map((row, index) => ({
    ...row,
    rowIndex: paginationModel.page * paginationModel.pageSize + index + 1,
  }));

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "clientName",
      headerName: "Client's Name",
      valueGetter: (value, row) => {
        return `${row?.Payor?.Name || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },

    {
      field: "round",
      headerName: "Group/Round",
      valueGetter: (value, row) => {
        return `${row?.RoundID?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },

    {
      field: "Description",
      headerName: "Description",
      valueGetter: (value, row) => {
        return `${row?.Description || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },
    {
      field: "Notes",
      headerName: "Notes",
      valueGetter: (value, row) => {
        return `${row?.Notes || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },

    {
      field: "totalCoursePrice",
      headerName: "totalCoursePrice",
      valueGetter: (value, row) => {
        return `${row?.totalCoursePrice || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },

    {
      field: "totalPaidByClient",
      headerName: "Total Paid By Client",
      valueGetter: (value, row) => {
        return `${row?.totalPaidByClient || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },
    {
      field: "Payment Method",
      headerName: "Payment Method",
      valueGetter: (value, row) => {
        return `${row?.PaymentMethodID?.Method_en || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },
    {
      field: "refundedValue",
      headerName: "Refunded Value",
      valueGetter: (value, row) => {
        return `${row?.refundedValue || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },
    {
      field: "receiptNumber",
      headerName: "Receipt Serial NO.",
      valueGetter: (value, row) => {
        return `${row?.BillID?.BillCode || ""}`;
      },
      flex: 1.2,
      minWidth: 120,
    },
  ];

  // to update the table elements if user deleted the only search result appeared
  if (paginationErr) {
    updatedDataList = [];
  }
  return (
    <div>
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          // pagination buttons
          slotProps={{
            pagination: {
              showFirstButton: true,
              showLastButton: true,
            },
          }}
          autoHeight
          rows={updatedDataList || []} // Use the modified dataList
          columns={columns}
          paginationMode="server" // Enable server-side pagination
          rowCount={totalElements} // Total rows from server response
          page={paginationModel.page} // Current 0-based page for DataGrid
          pageSize={paginationModel.pageSize} // Current page size
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)} // Update pagination state
          pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]} // Add more options for page size
          loading={isListLoading || isPaginationLoading} // Show loading state
          //   checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel,
            },
          }}
          sx={{
            // change header background
            "& .MuiDataGrid-container--top [role=row]": {
              background: "#f5f3f4",
              border: "none",
              borderStyle: "none",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
            },

            // header font weight
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold", // Ensure header text is bold
            },

            "&, [class^=MuiDataGrid]": {
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default DataTable;
