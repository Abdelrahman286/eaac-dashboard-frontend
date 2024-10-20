import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "../../styles/rounds.css";
// MUI
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomIconButton from "../CustomIconButton";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";
// contexts
import { UserContext } from "../../contexts/UserContext";
import { AppContext } from "../../contexts/AppContext";

// utils
import { getDataForTableRows } from "../../utils/tables";

// requests
import {
  deleteRoundsFn,
  getRoundsFn,
  restoreRoundsFn,
} from "../../requests/rounds";
// components
import DeleteConfirmation from "../DeleteConfirmation";
import RestoreConfirmation from "../RestoreConfirmation";
import MutationForm from "./MutationForm";
import Modal from "../Modal";

//dates
import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
import FormButton from "../FormButton";
dayjs.extend(customParseFormat); // Ensure the plugin is loaded

const RoundsTable = ({ onDataChange }) => {
  const queryClient = useQueryClient();

  const { token } = useContext(UserContext);
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
  if (searchResults?.key == "round" && searchResults?.searchTerm) {
    paginationReqBody.search = searchResults?.searchTerm;
    dataListReqBody.search = searchResults?.searchTerm;
  }

  // check disabled key in request body

  if (disabledList?.key == "round") {
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
      return getRoundsFn(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "round-pagination",
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
      "round-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getRoundsFn(dataListReqBody, token, {
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
    if (listData) {
      onDataChange(dataList);
    }
  }, [listData]);

  //------------- delete Round-------------------------
  const { mutate: deleteRound, isPending: deleteLoading } = useMutation({
    mutationFn: deleteRoundsFn,
    onSuccess: () => {
      console.log("Round deleted successfully");
      // Invalidate the query with key 'company-list'
      queryClient.invalidateQueries({
        queryKey: ["round-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["round-list"],
      });
      showSnackbar("Round Deleted Successfully ", "info");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.log("Error at Deleting Round ", error);
      showSnackbar("Failed to Delete Round Data", "error");
    },
  });

  // handle delete
  const handleDelete = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.id);
  };
  const confirmDelete = () => {
    deleteRound({
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
    setIdToRestore(`${rowData?.id}`);
  };
  const confirmRestore = () => {
    restoreRound({
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
  const { mutate: restoreRound, isPending: restoreLoading } = useMutation({
    mutationFn: restoreRoundsFn,

    onSuccess: () => {
      console.log("Round restored");
      queryClient.invalidateQueries({
        queryKey: ["round-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["round-list"],
      });
      setShowRestoreModal(false);
      showSnackbar("Round Data Restored Successfully ", "success");
    },
    onError: (error) => {
      console.log("error at restoring Round data", error);
      showSnackbar("Failed to Restore Round Data", "error");
    },
  });

  console.log(updatedDataList);

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "startEndDate",
      headerName: "Start/End Dates",

      renderCell: (params) => {
        const startDate = dayjs(params.row?.StartDate?.split(" ")[0]).format(
          "D MMMM YYYY"
        );
        const endDate = dayjs(params.row?.EndDate?.split(" ")[0]).format(
          "D MMMM YYYY"
        );

        return (
          <div
            style={{
              paddingTop: "4px",
              display: "flex",
              flexDirection: "column",
              lineHeight: "1.5", // Adjust line spacing for better readability
              alignItems: "flex-start", // Ensure start of the text is aligned
              overflow: "visible", // Allow content to be visible
              wrap: "nowrap",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Start:</strong> {startDate}
            </p>
            <p style={{ margin: 0 }}>
              <strong>End:</strong> {endDate}
            </p>
          </div>
        );
      },
      flex: 1.2,
      minWidth: 100, // Increase width for better visibility
    },
    {
      field: "Name",
      headerName: "Round Name",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "BranchID.Name_en",
      headerName: "BranchID",
      valueGetter: (value, row) => {
        return `${row?.BranchID?.Name_en || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Instructor",
      headerName: "Instructor",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.InstructorID?.Name || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "room",
      headerName: "Room",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.RoomID?.RoomCode || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "course",
      headerName: "Course",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.CourseID?.Name_en || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Sessions",
      headerName: "Sessions",

      //   editable: true,
      renderCell: (params) => {
        return (
          <div>
            <FormButton
              className="show-sessions main-btn"
              buttonText={"Show"}
              onClick={() => {
                console.log("show sessions");
              }}
            ></FormButton>
          </div>
        );
      },
      flex: 0.7,
      minWidth: 80,
    },
    {
      field: "capacity",
      headerName: "Capacity",

      valueGetter: (value, row) => {
        return `${row?.Capacity || ""}`;
      },
      flex: 0.7,
      minWidth: 80,
    },

    {
      field: "controls",
      headerName: "Controls",
      flex: 1.5,
      minWidth: 100,
      renderCell: (params) => {
        if (disabledList?.key == "round") {
          return (
            <CustomIconButton
              icon={"restore"}
              title="Restore"
              onClick={() => handleRestore(params.row)}
            ></CustomIconButton>
          );
        }
        return (
          <div>
            <CustomIconButton
              icon={"view"}
              title="view"
              onClick={() => console.log("show session")}
            ></CustomIconButton>
            <CustomIconButton
              icon={"attendance"}
              title="Attendance"
              onClick={() => console.log("show attendance")}
            ></CustomIconButton>
            <CustomIconButton
              icon={"enroll"}
              title="Enroll Student"
              onClick={() => console.log("Enroll Student")}
            ></CustomIconButton>
            <CustomIconButton
              icon={"edit"}
              title="Edit"
              onClick={() => handleEdit(params.row)}
            ></CustomIconButton>
            <CustomIconButton
              icon={"delete"}
              title="Delete"
              onClick={() => handleDelete(params.row)}
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
    <div className="instuctors-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      {showEditModal && (
        <Modal
          //   classNames={"h-70per"}
          title={"Edit Round"}
          classNames={"round-mutation-form"}
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

export default RoundsTable;
