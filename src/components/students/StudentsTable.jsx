import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  deleteStudentFn,
  getStudentFn,
  restoreStudentFn,
  blockStudentFn,
  searchStudentFn,
} from "../../requests/students";

// components
import DeleteConfirmation from "../DeleteConfirmation";
import RestoreConfirmation from "../RestoreConfirmation";
import MutationForm from "./MutationForm";
import Modal from "../Modal";
import CustomIconButton from "../CustomIconButton";
import GroupsModal from "./GroupsModal";
import ViewStudentData from "./ViewStudentData";
import StudentReceiptModal from "./StudentReceiptModal";

const StudentsTable = ({ onDataChange }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { token, hasPermission } = useContext(UserContext);
  const {
    showSnackbar,
    searchResults,
    disabledList,
    studentReceipt,
    setStudentReceipt,
  } = useContext(AppContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [dataToEdit, setDataToEdit] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showGroupsModal, setShowGroupsModal] = useState(false);

  const [studentDataToShow, setStudentDataToShow] = useState({});

  // restore
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [idToRestore, setIdToRestore] = useState("");

  // view student data

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [dataToShow, setDataToShow] = useState({});

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
  if (searchResults?.key == "student" && searchResults?.searchTerm) {
    paginationReqBody.search = searchResults?.searchTerm;
    dataListReqBody.search = searchResults?.searchTerm;
  }

  // check disabled key in request body

  if (disabledList?.key == "student") {
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
      return getStudentFn(paginationReqBody, token, {
        isFormData: false,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "student-pagination",
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
      "student-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getStudentFn(dataListReqBody, token, {
        isFormData: false,
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

  //------------- delete Student-------------------------
  const { mutate: deleteStudent, isPending: deleteLoading } = useMutation({
    mutationFn: deleteStudentFn,
    onSuccess: () => {
      console.log("Student deleted successfully");
      // Invalidate the query with key 'company-list'
      queryClient.invalidateQueries({
        queryKey: ["student-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["student-list"],
      });
      showSnackbar("Student Deleted Successfully ", "success");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.log("Error at Deleting Student ", error);
      showSnackbar("Failed to Delete Student Data", "error");
    },
  });

  // handle delete
  const handleDelete = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.id); // it can be id OR studentID
  };
  const confirmDelete = () => {
    deleteStudent({
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
    restoreStudent({
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
  const { mutate: restoreStudent, isPending: restoreLoading } = useMutation({
    mutationFn: restoreStudentFn,

    onSuccess: () => {
      console.log("student restored");
      queryClient.invalidateQueries({
        queryKey: ["student-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["student-list"],
      });
      setShowRestoreModal(false);
      showSnackbar("Student Data Restored Successfully ", "success");
    },
    onError: (error) => {
      console.log("error at restoring Student data", error);
      showSnackbar("Failed to Restore Student Data", "error");
    },
  });

  const handleGroupsPopup = (row) => {
    setShowGroupsModal(true);
    setStudentDataToShow(row);
  };

  // handleBlock

  const { mutate: blockStudent, isPending: blockLoading } = useMutation({
    mutationFn: blockStudentFn,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["student-list"],
      });
      showSnackbar("Student Block status changed Successfully ", "success");
    },
    onError: (error) => {
      //   console.log("error at blocking Student data", error);
      showSnackbar("Failed to to change Student Data", "error");
    },
  });

  const handleBlock = (row) => {
    let statusValue = row?.StatusID?.id == 1 ? 2 : 1;

    blockStudent({
      reqBody: {
        id: [row?.id],
        statusId: statusValue,
      },
      token,
      config: {
        isFormData: true,
      },
    });
  };

  // view student data

  const handleViewStudentData = (row) => {
    setShowStudentModal(true);
    setDataToShow(row);
  };

  // redirect to student attedance

  const handleRedirectToAttendance = (row) => {
    navigate(`/attendance/students/${row?.id}`);
  };

  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5,
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
      field: "companyName",
      headerName: "Company Name",
      valueGetter: (value, row) => {
        return `${row?.CompanyID?.Name_en || ""}`;
      },
      flex: 1.2,
      minWidth: 100,
    },

    {
      field: "MembershipCode",
      headerName: "MembershipCode",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.membership?.MembershipCode || ""}`;
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

      //   editable: true,
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

      flex: 1,
      minWidth: 100,
    },
    {
      field: "Blocked",
      headerName: "Blocked",
      renderCell: (params) => {
        if (params.row.StatusID.id == 1) {
          return (
            <Chip
              label={"Active"}
              color="success"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "12px" }}
            />
          );
        } else if (params.row.StatusID.id == 2) {
          return (
            <Chip
              label={"Blocked"}
              color="error"
              size="small"
              sx={{ fontWeight: "bold", fontSize: "12px" }}
            />
          );
        }
      },
      flex: 1, // This column will take up more space compared to others
      minWidth: 100,
    },
    {
      field: "controls",
      headerName: "Controls",
      flex: 3,
      minWidth: 400,
      renderCell: (params) => {
        if (disabledList?.key == "student") {
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
              icon={"roundsClasses"}
              title="Groups"
              onClick={() => handleGroupsPopup(params.row)}
            ></CustomIconButton>

            {hasPermission("View Client/Student Info") && (
              <CustomIconButton
                icon={"view"}
                title="view"
                onClick={() => handleViewStudentData(params.row)}
              ></CustomIconButton>
            )}

            <CustomIconButton
              icon={"attendance"}
              title="Attendance"
              onClick={() => handleRedirectToAttendance(params.row)}
            ></CustomIconButton>
            <CustomIconButton
              icon={"memberships"}
              title="Membership"
              onClick={() =>
                navigate(`/membership?studentTableId=${params?.row?.id}`)
              }
            ></CustomIconButton>
            <CustomIconButton
              icon={"payments"}
              title="Payments"
              //   onClick={() => setStudentReceipt({ name: "test" })}
              onClick={() =>
                navigate(
                  `/accounting/client-payments?studentTableId=${params?.row?.id}`
                )
              }
            ></CustomIconButton>

            {hasPermission("Block Client") && (
              <CustomIconButton
                icon={"blockUser"}
                title={params?.row?.StatusID?.id == 1 ? "Block" : "unblock"}
                onClick={() => handleBlock(params.row)}
              ></CustomIconButton>
            )}

            {hasPermission("Edit Student/Client") && (
              <CustomIconButton
                icon={"edit"}
                title="Edit"
                onClick={() => handleEdit(params.row)}
              ></CustomIconButton>
            )}

            {hasPermission("Edit Student/Client") && (
              <CustomIconButton
                icon={"delete"}
                title="Delete"
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

      {/* receipt modal */}
      {studentReceipt?.name && (
        <Modal
          classNames={"h-70per"}
          title={"Payment Receipt"}
          //   classNames={"student-mutation-form"}
          onClose={() => setStudentReceipt({})}
        >
          <StudentReceiptModal
          // onClose={() => setShowEditModal(false)}
          // isEditData={true}
          // data={dataToEdit}
          ></StudentReceiptModal>
        </Modal>
      )}

      {showEditModal && (
        <Modal
          //   classNames={"h-70per"}
          title={"Edit Student"}
          classNames={"student-mutation-form"}
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

      {showGroupsModal && (
        <Modal
          classNames={"student-enroll-form "}
          title={"Manage Enrollment"}
          onClose={() => setShowGroupsModal(false)}
        >
          <GroupsModal
            data={studentDataToShow}
            closeFn={() => setShowGroupsModal(false)}
          ></GroupsModal>
        </Modal>
      )}

      {showStudentModal && (
        <Modal
          classNames={"student-view-modal "}
          title={"Client Data"}
          onClose={() => setShowStudentModal(false)}
        >
          <ViewStudentData
            data={dataToShow}
            closeFn={() => setShowStudentModal(false)}
          ></ViewStudentData>
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
          getRowId={(row) => row?.id} // Custom ID logic
          autoHeight
          //   rows={updatedDataList || []} // Use the modified dataList
          rows={updatedDataList}
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

export default StudentsTable;
