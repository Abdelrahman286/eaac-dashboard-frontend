import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// MUI
import { Box, Chip, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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
import { deleteRoomFn, getRoomsFn, restoreRoomFn } from "../../requests/rooms";
// components
import DeleteConfirmation from "../DeleteConfirmation";
import RestoreConfirmation from "../RestoreConfirmation";
import CustomIconButton from "../CustomIconButton";
// import MutationForm from "./MutationForm";
import Modal from "../Modal";

const MemebershipTable = ({ onDataChange = () => {} }) => {
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
  if (searchResults?.key == "room" && searchResults?.searchTerm) {
    paginationReqBody.search = searchResults?.searchTerm;
    dataListReqBody.search = searchResults?.searchTerm;
  }

  // check disabled key in request body

  if (disabledList?.key == "room") {
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
      return getRoomsFn(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "room-pagination",
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
      "room-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getRoomsFn(dataListReqBody, token, {
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

  //------------- delete course-------------------------
  const { mutate: deleteRoom, isPending: deleteLoading } = useMutation({
    mutationFn: deleteRoomFn,
    onSuccess: () => {
      console.log("Room deleted successfully");
      // Invalidate the query with key 'company-list'
      queryClient.invalidateQueries({
        queryKey: ["room-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["room-list"],
      });
      showSnackbar("Room Deleted Successfully ", "info");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.log("Error at Deleting Room ", error);
      showSnackbar("Failed to Delete Room Data", "error");
    },
  });

  // handle delete
  const handleDelete = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.id);
  };
  const confirmDelete = () => {
    deleteRoom({
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
    restoreRoom({
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
  const { mutate: restoreRoom, isPending: restoreLoading } = useMutation({
    mutationFn: restoreRoomFn,

    onSuccess: () => {
      console.log("room restored");
      queryClient.invalidateQueries({
        queryKey: ["room-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["room-list"],
      });
      setShowRestoreModal(false);
      showSnackbar("Room Data Restored Successfully ", "success");
    },
    onError: (error) => {
      console.log("error at restoring Room data", error);
      showSnackbar("Failed to Restore Room Data", "error");
    },
  });

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "Image",
      headerName: "Logo",
      flex: 0.6,
      minWidth: 50,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "6px",
            }}
          >
            <Avatar
              src={params?.row.Image}
              alt="Logo"
              variant="circular"
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        );
      },
    },

    {
      field: "Name_en",
      headerName: "Student Name",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Company",
      headerName: "Comapany Name",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Phone",
      headerName: "Phone",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "memebershipCode",
      headerName: "Membership Code",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "issueDate",
      headerName: "Issue Date",

      //   editable: true,
      valueGetter: (value, row) => {
        // return `${row?.Name_en || ""}`;
        return "1-1-2020";
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "expireDate",
      headerName: "Expire Date",

      //   editable: true,
      valueGetter: (value, row) => {
        // return `${row?.Name_en || ""}`;
        return "1-1-2020";
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "cardStatus",
      headerName: "Card Status",

      //   editable: true,
      renderCell: () => {
        return (
          <Chip
            label={"Ready"}
            color="warning"
            size="small"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          />
        );
      },
      flex: 1.2,
      minWidth: 110,
    },
    {
      field: "membershipType",
      headerName: "Membership Type",

      //   editable: true,
      renderCell: () => {
        return (
          <Chip
            label={"lifetime"}
            color="primary"
            size="small"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          />
        );
      },
      flex: 1.2,
      minWidth: 140,
    },
    {
      field: "membershipStatus",
      headerName: "Membership status ",

      renderCell: () => {
        return (
          <Chip
            label={"Active"}
            color="success"
            size="small"
            sx={{ fontWeight: "bold", fontSize: "14px" }}
          />
        );
      },
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: "ClientPhotos",
      headerName: "Client Photos",

      renderCell: () => {
        return (
          <div
            style={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <a
              href="https://google.com"
              style={{
                fontSize: "12px",
              }}
            >
              link aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </a>
          </div>
        );
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "notes",
      headerName: "Notes",
      minWidth: 100,
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "controls",
      headerName: "Controls",
      flex: 2,
      minWidth: 260,
      renderCell: (params) => {
        if (disabledList?.key == "room") {
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
              icon={"receipt"}
              title="Receipt"
              //   onClick={() => handleEdit(params.row)}
            ></CustomIconButton>
            <CustomIconButton
              icon={"view"}
              title="View"
              //   onClick={() => handleEdit(params.row)}
            ></CustomIconButton>
            <CustomIconButton
              icon={"renew"}
              title="Renew"
              //   onClick={() => handleEdit(params.row)}
            ></CustomIconButton>
            <CustomIconButton
              icon={"edit"}
              title="Edit"
              //   onClick={() => handleEdit(params.row)}
            ></CustomIconButton>
            <CustomIconButton
              icon={"delete"}
              title="Delete"
              //   onClick={() => handleDelete(params.row)}
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

      {/* {showEditModal && (
        <Modal
          classNames={"h-70per"}
          title={"Edit Room"}
          onClose={() => setShowEditModal(false)}
        >
          <MutationForm
            onClose={() => setShowEditModal(false)}
            isEditData={true}
            data={dataToEdit}
          ></MutationForm>
        </Modal>
      )} */}

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

export default MemebershipTable;
