import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// MUI
import { Box, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";
// contexts
import { UserContext } from "../../../contexts/UserContext";
import { AppContext } from "../../../contexts/AppContext";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// requests

import {
  updatePaymentMethodFn,
  getPyamentMethodsFn,
} from "../../../requests/settings";
// components
import DeleteConfirmation from "../../DeleteConfirmation";
import RestoreConfirmation from "../../RestoreConfirmation";
import MutationForm from "./MutationForm";
import Modal from "../../Modal";

const DataTable = ({ onDataChange }) => {
  const queryClient = useQueryClient();

  const { token, hasPermission } = useContext(UserContext);
  const { showSnackbar, searchResults, disabledList } = useContext(AppContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [dataToEdit, setDataToEdit] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // restore
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [idToRestore, setIdToRestore] = useState("");

  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI uses 0-based index
    pageSize: 10, // Initial page size
  });

  const paginationReqBody = {};
  const dataListReqBody = {
    numOfElements: paginationModel.pageSize,
  };

  // check if there's search term
  if (searchResults?.key == "paymentMethods" && searchResults?.searchTerm) {
    paginationReqBody.search = searchResults?.searchTerm;
    dataListReqBody.search = searchResults?.searchTerm;
  }

  // check disabled key in request body
  if (disabledList?.key == "paymentMethods") {
    paginationReqBody.disabled = "1"; // get pagination data
    dataListReqBody.disabled = "1"; // get the list
  }

  // Query to fetch pagination data (e.g., total elements, number of pages)
  const {
    data: paginationData,
    isLoading: isPaginationLoading,
    isError: paginationErr,
  } = useQuery({
    queryFn: () => {
      // Remove hardcoded `page=1` and use the current page from paginationModel
      return getPyamentMethodsFn(paginationReqBody, token, {
        isFormData: false,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "paymentMethods-pagination",
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    retry: 1,
  });

  const {
    data: listData,
    isLoading: isListLoading,
    isError: dataError,
  } = useQuery({
    queryKey: [
      "paymentMethods-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getPyamentMethodsFn(dataListReqBody, token, {
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

  //------------- delete course-------------------------
  const { mutate: deleteRecord, isPending: deleteLoading } = useMutation({
    mutationFn: updatePaymentMethodFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paymentMethods-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentMethods-list"],
      });
      showSnackbar("Payment Method Deleted Successfully ", "info");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      showSnackbar("Failed to Delete Payment Method Data", "error");
    },
  });

  // handle delete
  const handleDelete = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.id);
  };
  const confirmDelete = () => {
    deleteRecord({
      reqBody: {
        id: [idToDelete],
        statusId: 4,
      },
      token,
      config: {
        isFormData: true,
      },
    });
  };

  // restore
  const handleRestore = (rowData) => {
    setShowRestoreModal(true);
    setIdToRestore(`${rowData?.id}`);
  };
  const confirmRestore = () => {
    restoreRecord({
      reqBody: {
        id: [idToRestore],
        statusId: "1",
      },
      token,
      config: {
        isFormData: true,
      },
    });
  };

  // handle edit

  const handleEdit = (row) => {
    setShowEditModal(true);
    setDataToEdit(row);
  };

  // restore deleted company
  const { mutate: restoreRecord, isPending: restoreLoading } = useMutation({
    mutationFn: updatePaymentMethodFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paymentMethods-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentMethods-list"],
      });
      setShowRestoreModal(false);
      showSnackbar("Payment Method Data Restored Successfully ", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Restore Payment Method Data", "error");
    },
  });

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5,
    },
    {
      field: "NameAr",
      headerName: "Name (AR)",
      valueGetter: (value, row) => {
        return `${row?.Method_ar || ""}`;
      },
      flex: 1.5,
      minWidth: 100,
    },

    {
      field: "NameEn",
      headerName: "Name (EN)",
      valueGetter: (value, row) => {
        return `${row?.Method_en || ""}`;
      },
      flex: 1.5,
      minWidth: 100,
    },

    {
      field: "Description_ar",
      headerName: "Description (AR)",
      valueGetter: (value, row) => {
        return `${row?.Description_ar || ""}`;
      },
      flex: 1.5,
      minWidth: 100,
    },

    {
      field: "Description_en",
      headerName: "Description (EN)",
      valueGetter: (value, row) => {
        return `${row?.Description_en || ""}`;
      },
      flex: 1.5,
      minWidth: 100,
    },
    {
      field: "BranchID.Name_en",
      headerName: "Branch",
      valueGetter: (value, row) => {
        return `${row?.BranchID?.Name_en || ""}`;
      },
      flex: 1.5, // This column will take up more space compared to others
      minWidth: 100,
    },

    {
      field: "controls",
      headerName: "Controls",
      flex: 1.5,
      minWidth: 100,
      renderCell: (params) => {
        if (disabledList?.key == "paymentMethods") {
          return (
            <Tooltip title="Restore">
              <IconButton
                color="primary"
                aria-label="restore"
                onClick={() => handleRestore(params.row)}
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>
          );
        }
        return (
          <div>
            {hasPermission("Edit Payment Method") && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEdit(params.row)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    disabled={deleteLoading}
                    color="error"
                    aria-label="delete"
                    onClick={() => handleDelete(params.row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
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
    <div className="rooms-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      {showEditModal && (
        <Modal
          //   classNames={"h-70per"}
          title={"Edit Payment Method"}
          onClose={() => setShowEditModal(false)}
        >
          <MutationForm
            onClose={() => setShowEditModal(false)}
            isEditData={true}
            data={dataToEdit}
          ></MutationForm>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal title={""} onClose={() => setShowDeleteModal(false)}>
          <DeleteConfirmation
            closeFn={() => setShowDeleteModal(false)}
            deleteFn={confirmDelete}
            isLoading={deleteLoading}
          ></DeleteConfirmation>
        </Modal>
      )}

      {showRestoreModal && (
        <Modal title={""} onClose={() => setShowRestoreModal(false)}>
          <RestoreConfirmation
            closeFn={() => setShowRestoreModal(false)}
            restoreFn={confirmRestore}
            isLoading={restoreLoading}
          ></RestoreConfirmation>
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
