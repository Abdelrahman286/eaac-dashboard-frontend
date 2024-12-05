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
import {
  getUsersMemeberships,
  deleteMemebershipFn,
} from "../../requests/membership";
// components
import DeleteConfirmation from "../DeleteConfirmation";
import CustomIconButton from "../CustomIconButton";
import MutationForm from "./MutationForm";
import Renew from "./Renew";
import Modal from "../Modal";

const MemebershipTable = ({ onDataChange = () => {}, filterData }) => {
  const { search, cardStatusId, clientId, membershipTypeId } = filterData;
  const queryClient = useQueryClient();

  const { token } = useContext(UserContext);
  const { showSnackbar, searchResults, disabledList } = useContext(AppContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [dataToEdit, setDataToEdit] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // restore
  const [showRenewModal, setShowRenewModal] = useState(false);

  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI uses 0-based index
    pageSize: 10, // Initial page size
  });

  const paginationReqBody = {
    // filter parameters
    ...(search && { search }),
    ...(cardStatusId && { cardStatusId }),
    ...(clientId && { clientId }),
    ...(membershipTypeId && { membershipTypeId }),
  };
  const dataListReqBody = {
    numOfElements: paginationModel.pageSize,

    // filter parameters
    ...(search && { search }),
    ...(cardStatusId && { cardStatusId }),
    ...(clientId && { clientId }),
    ...(membershipTypeId && { membershipTypeId }),
  };

  const {
    data: paginationData,
    isLoading: isPaginationLoading,
    isError: paginationErr,
  } = useQuery({
    queryFn: () => {
      return getUsersMemeberships(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`,
      });
    },
    queryKey: [
      "membership-pagination",
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
      "membership-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getUsersMemeberships(dataListReqBody, token, {
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

  //------------- delete course-------------------------
  const { mutate: deleteMembership, isPending: deleteLoading } = useMutation({
    mutationFn: deleteMemebershipFn,
    onSuccess: () => {
      // Invalidate the query with key 'company-list'
      queryClient.invalidateQueries({
        queryKey: ["membership-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["membership-list"],
      });
      showSnackbar("Membership Deleted Successfully ", "info");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      showSnackbar("Failed to Delete Membership Data", "error");
    },
  });

  // handle delete
  const handleDelete = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.id);
  };
  const confirmDelete = () => {
    deleteMembership({
      reqBody: {
        id: [idToDelete],
        statusId: "4",
      },
      token,
      config: {
        isFormData: false,
      },
    });
  };

  // handle edit
  const handleEdit = (row) => {
    setShowEditModal(true);
    setDataToEdit(row);
  };

  // handle Renew
  const handleRenew = (row) => {
    setShowRenewModal(true);
    setDataToEdit(row);
  };



  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "Image",
      headerName: "Image",
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
              src={params?.row?.UserID?.Image}
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
        return `${row?.UserID?.Name || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Company",
      headerName: "Comapany Name",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.companyName || "?"}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "Phone",
      headerName: "Phone",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.UserID?.PhoneNumber || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "memebershipCode",
      headerName: "Membership Code",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.MembershipCode || ""}`;
      },
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "issueDate",
      headerName: "Issue Date",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.startAt || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "expireDate",
      headerName: "Expire Date",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.endAt || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },
    {
      field: "cardStatus",
      headerName: "Card Status",

      renderCell: (params) => {
        if (params?.row?.CardStatusID?.id == 6) {
          // requested to print
          return (
            <Chip
              label={"Pending"}
              color="warning"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        } else if (params?.row?.CardStatusID?.id == 7) {
          // ready to delivery
          return (
            <Chip
              label={"Ready"}
              color="primary"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        } else if (params?.row?.CardStatusID?.id == 8) {
          // Delivered
          return (
            <Chip
              label={"Delivered"}
              color="success"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        }
      },
      flex: 1.2,
      minWidth: 110,
    },
    {
      field: "membershipType",
      headerName: "Membership Type",

      renderCell: (params) => {
        if (params?.row?.MembershipTypeID?.id == 1) {
          return (
            <Chip
              label={"lifetime"}
              color="primary"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        } else if (params?.row?.MembershipTypeID?.id == 2) {
          return (
            <Chip
              label={"Student"}
              color="secondary"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        } else return "-";
      },
      flex: 1.2,
      minWidth: 140,
    },
    {
      field: "membershipStatus",
      headerName: "Membership status",

      renderCell: (params) => {
        if (params?.row?.StatusID?.id == 1) {
          return (
            <Chip
              label={"Active"}
              color="success"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            />
          );
        }
      },
      flex: 1.2,
      minWidth: 120,
    },
    {
      field: "ClientPhotos",
      headerName: "Client Photos",

      renderCell: (params) => {
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
              href={params?.row?.Image}
              style={{
                fontSize: "12px",
              }}
            >
              Image
            </a>
          </div>
        );
      },
      flex: 1.2,
      minWidth: 100,
    },
    // {
    //   field: "notes",
    //   headerName: "Notes",
    //   minWidth: 100,
    //   flex: 0.5,
    // },

    {
      field: "controls",
      headerName: "Controls",
      flex: 2,
      minWidth: 260,
      renderCell: (params) => {
        if (disabledList?.key == "membership") {
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
              icon={"renew"}
              title="Renew"
              onClick={() => handleRenew(params.row)}
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
    <div className="membership-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      {showEditModal && (
        <Modal
          classNames={"edit-membership-modal"}
          title={"Edit Membership"}
          onClose={() => setShowEditModal(false)}
        >
          <MutationForm
            isEditData={true}
            data={dataToEdit}
            onClose={() => setShowEditModal(false)}
          ></MutationForm>
        </Modal>
      )}

      {showRenewModal && (
        <Modal
          classNames={"edit-membership-modal"}
          title={"Renew Membership"}
          onClose={() => setShowRenewModal(false)}
        >
          <Renew
            data={dataToEdit}
            onClose={() => setShowRenewModal(false)}
          ></Renew>
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

      {/* {showRestoreModal && (
        <Modal title={""} onClose={() => setShowRestoreModal(false)}>
          <RestoreConfirmation
            closeFn={() => setShowRestoreModal(false)}
            restoreFn={confirmRestore}
            isLoading={restoreLoading}
          ></RestoreConfirmation>
        </Modal>
      )} */}

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
