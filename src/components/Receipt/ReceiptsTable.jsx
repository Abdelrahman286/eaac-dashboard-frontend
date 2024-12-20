import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// MUI
import { Box, Chip, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";
// contexts
import { UserContext } from "../../contexts/UserContext";
import { AppContext } from "../../contexts/AppContext";

// utils
import { getDataForTableRows } from "../../utils/tables";
// requests
import { getReceiptsFn } from "../../requests/receipts";
// components
import CustomIconButton from "../CustomIconButton";
import EditNotes from "./EditNotes";
import Modal from "../Modal";

import ReceiptModal from "../ReceiptModal/ReceiptModal";

const ReceiptsTable = ({ onDataChange = () => {}, filterData }) => {
  // studentId, receipt type, search , start date, end date
  const { studentId } = filterData;
  const queryClient = useQueryClient();

  const { token, hasPermission } = useContext(UserContext);
  const { showSnackbar, searchResults, disabledList } = useContext(AppContext);

  // show receipt
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptToShow, setReceiptToShow] = useState({});

  // edit notes
  const [showEditModal, setShowEditModal] = useState(false);
  const [receiptToEdit, setReceiptToEdit] = useState({});

  const handleShow = (row) => {
    setShowReceiptModal(true);
    setReceiptToShow(row);
  };
  const handleEdit = (row) => {
    setReceiptToEdit(row);
    setShowEditModal(true);
  };
  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI uses 0-based index
    pageSize: 10, // Initial page size
  });

  const paginationReqBody = {
    // filter parameters
    ...(studentId && { studentId }),
  };
  const dataListReqBody = {
    numOfElements: paginationModel.pageSize,
    // filter parameters
    ...(studentId && { studentId }),
  };

  const {
    data: paginationData,
    isLoading: isPaginationLoading,
    isError: paginationErr,
  } = useQuery({
    queryFn: () => {
      return getReceiptsFn(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`,
      });
    },
    queryKey: ["receipt-pagination", paginationReqBody, dataListReqBody],
    retry: 1,
  });

  // Now, only trigger the list data fetching when paginationData is available
  const {
    data: listData,
    isLoading: isListLoading,
    isError: dataError,
  } = useQuery({
    queryKey: [
      "receipt-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
    ],
    queryFn: () => {
      return getReceiptsFn(dataListReqBody, token, {
        isFormData: true,
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
      flex: 0.5,
    },

    {
      field: "BillCode",
      headerName: "Receipt Code",
      valueGetter: (value, row) => {
        return `${row?.BillCode || "-"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },

    {
      field: "type",
      headerName: "Type",
      valueGetter: (value, row) => {
        return `${row?.type || "-"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },

    {
      field: "Description",
      headerName: "Description",
      valueGetter: (value, row) => {
        return `${row?.Description || "-"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Notes",
      headerName: "Notes",
      valueGetter: (value, row) => {
        return `${row?.Notes || "-"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "4",
      headerName: "Date",
      valueGetter: (value, row) => {
        return `${row?.created_at?.split(" ")[0] || "-"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "issuedTo",
      headerName: "Issued To",
      valueGetter: (value, row) => {
        return `${row?.Payor?.Name || "-"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "round",
      headerName: "Round",
      valueGetter: (value, row) => {
        return `${row?.RoundID?.Name_en || "-"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "controls",
      headerName: "Controls",
      flex: 1.2,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <div>
            {hasPermission("View Receipt (Print)") && (
              <CustomIconButton
                icon={"receipt"}
                title="Receipt"
                onClick={() => handleShow(params.row)}
              ></CustomIconButton>
            )}

            {hasPermission("Edit Receipt (Notes)") && (
              <CustomIconButton
                icon={"edit"}
                title="Edit"
                onClick={() => handleEdit(params.row)}
              ></CustomIconButton>
            )}
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

      {showReceiptModal && (
        <Modal
          //   classNames={"edit-receipt-modal"}
          title={"Receipt Data"}
          onClose={() => setShowReceiptModal(false)}
        >
          <ReceiptModal
            data={receiptToShow}
            onClose={() => setShowReceiptModal(false)}
          ></ReceiptModal>
        </Modal>
      )}

      {showEditModal && (
        <Modal title={"Edit Notes"} onClose={() => setShowEditModal(false)}>
          <EditNotes
            data={receiptToEdit}
            onClose={() => setShowEditModal(false)}
          ></EditNotes>
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

export default ReceiptsTable;
