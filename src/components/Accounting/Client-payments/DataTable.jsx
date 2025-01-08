import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// MUI
import { Box, Chip, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";
// contexts
import { UserContext } from "../../../contexts/UserContext";
import { AppContext } from "../../../contexts/AppContext";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// requests
import { getPaymentsFn } from "../../../requests/ClientPayments";

// components
import Modal from "../../Modal";
import CustomIconButton from "../../CustomIconButton";
import CorrectCertainMovement from "./CorrectCertainMovement";

import ReceiptPage from "../../ReceiptModal/ReceiptModal";

const DataTable = ({ onDataChange = () => {}, filterData }) => {
  const { studentId, roundId, paymentMethodId, startDate, endDate } =
    filterData;

  const queryClient = useQueryClient();
  const { token, hasPermission } = useContext(UserContext);
  const { showSnackbar, searchResults, disabledList } = useContext(AppContext);

  const [showCorrection, setShowCorrection] = useState(false);
  const [idToCorrect, setIdToCorrect] = useState("");

  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI uses 0-based index
    pageSize: 10, // Initial page size
  });

  // receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptId, setReceiptId] = useState("");

  const paginationReqBody = {
    // filter parameters
    ...(studentId && { studentId }),
    ...(roundId && { roundId }),
    ...(paymentMethodId && { paymentMethodId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
  const dataListReqBody = {
    numOfElements: paginationModel.pageSize,

    // filter parameters
    ...(studentId && { studentId }),
    ...(roundId && { roundId }),
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
      return getPaymentsFn(paginationReqBody, token, {
        isFormData: false,
        urlParams: `page=1`,
      });
    },
    queryKey: ["clientPayments-pagination", paginationReqBody, dataListReqBody],
    retry: 1,
  });

  // Now, only trigger the list data fetching when paginationData is available
  const {
    data: listData,
    isLoading: isListLoading,
    isError: dataError,
  } = useQuery({
    queryKey: [
      "clientPayments-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
    ],
    queryFn: () => {
      return getPaymentsFn(dataListReqBody, token, {
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

  // hoist the data for excel export
  useEffect(() => {
    if (listData) {
      onDataChange(dataList);
    }
  }, [listData]);

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "Name_en",
      headerName: "Student Name",
      valueGetter: (value, row) => {
        return `${row?.Payor?.Name || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Description",
      headerName: "Descripition",
      valueGetter: (value, row) => {
        return `${row?.Description || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Notes",
      headerName: "Notes",
      valueGetter: (value, row) => {
        return `${row?.Notes || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Round",
      headerName: "Round Code",
      valueGetter: (value, row) => {
        return `${row?.RoundID?.RoundCode || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      valueGetter: (value, row) => {
        return `${row?.PaymentMethodID?.Method_en || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "Date",
      headerName: "Date",
      valueGetter: (value, row) => {
        return `${row?.created_at?.split(" ")[0] || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "time",
      headerName: "Time",
      valueGetter: (value, row) => {
        return `${row?.created_at?.split(" ")[1] || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },
    {
      field: "InstallmentNo",
      headerName: "Installment No.",
      valueGetter: (value, row) => {
        return `${row?.InstallmentNumber || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Credit",
      headerName: "Credit",

      valueGetter: (value, row) =>
        row?.Credit == undefined ? "-" : row?.Credit || "0",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Debit",
      headerName: "Debit",
      valueGetter: (value, row) =>
        row?.Debit == undefined ? "-" : row?.Debit || "0",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Balance",
      headerName: "Balance",
      valueGetter: (value, row) =>
        row?.Balance == undefined ? "-" : row?.Balance || "0",
      flex: 1.2,
      minWidth: 100,
    },

    {
      field: "controls",
      headerName: "Controls",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <div>
            {hasPermission("View Client Receipts") && (
              <CustomIconButton
                icon={"receipt"}
                title="Receipt"
                onClick={() => {
                  setShowReceipt(true);
                  setReceiptId(params?.row?.id);
                }}
              ></CustomIconButton>
            )}

            <CustomIconButton
              icon={"edit"}
              title="Correct Movement"
              onClick={() => {
                setShowCorrection(true);
                setIdToCorrect(params?.row?.id);
              }}
            ></CustomIconButton>
          </div>
        );
      },
    },
  ];

  // to update the table elements if user deleted the only search result appeared
  if (paginationErr) {
    updatedDataList = [];
  }

  return (
    <div className="membership-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      {showCorrection && (
        <Modal
          title={"Correct Movement"}
          onClose={() => setShowCorrection(false)}
        >
          <CorrectCertainMovement
            onClose={() => setShowCorrection(false)}
            idToCorrect={idToCorrect}
          ></CorrectCertainMovement>
        </Modal>
      )}

      {showReceipt && (
        <Modal title={"Payment Receipt"} onClose={() => setShowReceipt(false)}>
          <ReceiptPage
            closeFn={() => setShowReceipt(false)}
            paymentId={receiptId}
          ></ReceiptPage>
        </Modal>
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
