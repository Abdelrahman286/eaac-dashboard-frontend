import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// MUI
import { Box, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

import CustomIconButton from "../CustomIconButton";
import Tooltip from "@mui/material/Tooltip";
// contexts
import { UserContext } from "../../contexts/UserContext";
import { AppContext } from "../../contexts/AppContext";

// utils
import { getDataForTableRows } from "../../utils/tables";

// requests
import {
  deleteInstructorsFn,
  getInstructorsFn,
  restoreInstructorFn,
} from "../../requests/instructors";
// components
import ViewInstructorData from "./ViewInstructorData";
import DeleteConfirmation from "../DeleteConfirmation";
import RestoreConfirmation from "../RestoreConfirmation";
import MutationForm from "./MutationForm";
import Modal from "../Modal";

const InstructorsTable = ({ onDataChange }) => {
  const queryClient = useQueryClient();

  const { token, hasPermission } = useContext(UserContext);
  const { showSnackbar, searchResults, disabledList } = useContext(AppContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [dataToEdit, setDataToEdit] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // instructor data view
  const [showInstuctorModal, setShowInstructorModal] = useState(false);
  const [dataToShow, setDataToShow] = useState({});

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
  if (searchResults?.key == "instructor" && searchResults?.searchTerm) {
    paginationReqBody.search = searchResults?.searchTerm;
    dataListReqBody.search = searchResults?.searchTerm;
  }

  // check disabled key in request body

  if (disabledList?.key == "instructor") {
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
      return getInstructorsFn(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "instructor-pagination",
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    retry: 1,
  });

  // Now, only trigger the list data fetching when paginationData is available
  const {
    data: listData,
    isLoading: isListLoading,
    isError: dataError,
  } = useQuery({
    queryKey: [
      "instructor-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getInstructorsFn(dataListReqBody, token, {
        isFormData: true,
        urlParams: `page=${paginationModel.page + 1}`, // Use the dynamic page number
      });
    },

    enabled: !!paginationData, // Enable this query only when paginationData is available
    keepPreviousData: true, // Keep previous data while fetching new data
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
    if (dataObject) {
      onDataChange(dataList);
    } else {
      // to export empty excel if there's no data found
      onDataChange([]);
    }
  }, [listData]);

  //------------- delete Instructor-------------------------
  const { mutate: deleteInstructor, isPending: deleteLoading } = useMutation({
    mutationFn: deleteInstructorsFn,
    onSuccess: () => {
      console.log("Instructor deleted successfully");
      // Invalidate the query with key 'company-list'
      queryClient.invalidateQueries({
        queryKey: ["instructor-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-list"],
      });
      showSnackbar("Instructor Deleted Successfully ", "info");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.log("Error at Deleting Instructor ", error);
      showSnackbar("Failed to Delete Instructor Data", "error");
    },
  });

  // handle delete
  const handleDelete = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.InstructorID);
  };
  const confirmDelete = () => {
    deleteInstructor({
      reqBody: {
        id: idToDelete,
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
    setIdToRestore(`${rowData?.InstructorID}`);
  };
  const confirmRestore = () => {
    restoreInstructor({
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
  const { mutate: restoreInstructor, isPending: restoreLoading } = useMutation({
    mutationFn: restoreInstructorFn,

    onSuccess: () => {
      console.log("instructor restored");
      queryClient.invalidateQueries({
        queryKey: ["instructor-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-list"],
      });
      setShowRestoreModal(false);
      showSnackbar("Instructor Data Restored Successfully ", "success");
    },
    onError: (error) => {
      showSnackbar("Failed to Restore Instructor Data", "error");
    },
  });

  // handle view instructor data
  const handleViewInstructorData = (row) => {
    setShowInstructorModal(true);
    setDataToShow(row);
  };

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "Name",
      headerName: "Name",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.Name || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "JobTitle",
      headerName: "Job Title",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.JobTitle || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },

    {
      field: "Email",
      headerName: "Email",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.Email || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "PhoneNumber",
      headerName: "Phone Number",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.PhoneNumber || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },

    {
      field: "WhatsappNumber",
      headerName: "WhatsApp Number",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.WhatsappNumber || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "GovIssuedID",
      headerName: "Government ID",
      valueGetter: (value, row) => {
        return `${row?.GovIssuedID || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "BranchID.Name_en",
      headerName: "BranchID",
      valueGetter: (value, row) => {
        return `${row?.BranchID?.name_en || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Notes",
      headerName: "Notes",
      valueGetter: (value, row) => {
        return `${row?.Notes || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },
    {
      field: "controls",
      headerName: "Controls",
      flex: 1.5,
      minWidth: 160,
      renderCell: (params) => {
        if (disabledList?.key == "instructor") {
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
            <CustomIconButton
              icon={"view"}
              title="view"
              onClick={() => handleViewInstructorData(params.row)}
            ></CustomIconButton>

            {hasPermission("Edit Instructor") && (
              <CustomIconButton
                disabled={deleteLoading}
                icon={"edit"}
                title="Edit"
                onClick={() => handleEdit(params.row)}
              ></CustomIconButton>
            )}

            {hasPermission("Edit Instructor") && (
              <CustomIconButton
                icon={"delete"}
                title="Delete"
                disabled={deleteLoading}
                onClick={() => handleDelete(params.row)}
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
    <div className="instuctors-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      {showEditModal && (
        <Modal
          //   classNames={"h-70per"}
          title={"Edit Instructor"}
          classNames={"instructor-mutation-form"}
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

      {showInstuctorModal && (
        <Modal
          classNames={"student-view-modal "}
          title={"Instructor Data"}
          onClose={() => setShowInstructorModal(false)}
        >
          <ViewInstructorData
            data={dataToShow}
            closeFn={() => setShowInstructorModal(false)}
          ></ViewInstructorData>
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
          getRowId={(row) => row.InstructorID} // Custom ID logic
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

export default InstructorsTable;
