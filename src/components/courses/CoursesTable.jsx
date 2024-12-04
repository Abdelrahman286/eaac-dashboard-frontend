import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../contexts/UserContext";
import { AppContext } from "../../contexts/AppContext";
import { getDataForTableRows } from "../../utils/tables";

import Modal from "../Modal";
import ViewExtras from "./Extras/ViewExtras";
// table controls
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";

// request functions
import {
  deleteCourseFn,
  getCoursesFn,
  restoreCourseFn,
} from "../../requests/courses";

import DeleteConfirmation from "../DeleteConfirmation";
import RestoreConfirmation from "../RestoreConfirmation";

import MutationForm from "./MutationForm";
const CoursesTable = ({ onDataChange }) => {
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

  // course extra states
  const [courseExtraToshow, setCourseExtraToshow] = useState({});
  const [showExtras, setShowExtras] = useState(false);

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
  if (searchResults?.key == "course" && searchResults?.searchTerm) {
    paginationReqBody.search = searchResults?.searchTerm;
    dataListReqBody.search = searchResults?.searchTerm;
  }

  // check disabled key in request body

  if (disabledList?.key == "course") {
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
      return getCoursesFn(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "course-pagination",
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
      "course-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getCoursesFn(dataListReqBody, token, {
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
  const { mutate: deleteCourse, isPending: deleteLoading } = useMutation({
    mutationFn: deleteCourseFn,
    onSuccess: () => {
      console.log("Course deleted successfully");
      // Invalidate the query with key 'company-list'
      queryClient.invalidateQueries({
        queryKey: ["course-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-list"],
      });
      showSnackbar("Course Deleted Successfully ", "info");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.log("Error at Deleting Course ", error);
      showSnackbar("Failed to delete course data", "error");
    },
  });

  const handleDelete = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.id);
  };

  const confirmDelete = () => {
    deleteCourse({
      reqBody: {
        id: idToDelete,
      },
      token,
      config: {
        isFormData: true,
      },
    });
  };

  const handleEdit = (row) => {
    setShowEditModal(true);
    setDataToEdit(row);
  };

  // restore deleted company
  const { mutate: restoreCourse, isPending: restoreLoading } = useMutation({
    mutationFn: restoreCourseFn,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-list"],
      });
      showSnackbar("Course Data Restored Successfully ", "success");
      setShowRestoreModal(false);
    },
    onError: (error) => {
      console.log("error at restoring Course data", error);
      showSnackbar("Failed to restore course data", "error");
    },
  });

  // restore
  const handleRestore = (rowData) => {
    setShowRestoreModal(true);
    setIdToRestore(`${rowData?.id}`);
  };
  const confirmRestore = () => {
    restoreCourse({
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

  // handle extras modal

  const handleExtras = (row) => {
    setCourseExtraToshow(row);
    setShowExtras(true);
  };
  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },

    {
      field: "BranchID.Name_en",
      headerName: "Branch",
      valueGetter: (value, row) => {
        return `${row?.BranchID?.Name_en || ""}`;
      },
      flex: 1.1, // This column will take up more space compared to others
      minWidth: 100,
    },
    {
      field: "CourseCategoryID.Name_en",
      headerName: "Category",

      //   editable: true,
      valueGetter: (value, row) => {
        return `${row?.CourseCategoryID?.Name_en || ""}`;
      },
      flex: 1,
      minWidth: 100,
    },
    {
      field: "subcategory.Name_en",
      headerName: "Sub Category",
      flex: 1,
      minWidth: 100,
      valueGetter: (value, row) => {
        return `${row?.SubCategoryID?.Name_en || ""}`;
      },
    },
    {
      field: "Name_en",
      headerName: "Course Name",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "CourseCode",
      headerName: "Course Code",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "CourseTime",
      headerName: "Course Hours",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "Description_en",
      headerName: "Describtion",

      flex: 1,
      minWidth: 100,
    },

    {
      field: "NonMemberPrice",
      headerName: "Price (non Memebers)",

      flex: 1,
      minWidth: 100,
    },

    {
      field: "MemberPrice",
      headerName: "Price (Memebers)",
      flex: 1,
      minWidth: 100,
    },

    {
      field: "controls",
      headerName: "Controls",
      flex: 2,
      minWidth: 150,
      renderCell: (params) => {
        if (disabledList?.key == "course") {
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
            <Tooltip title="Extras">
              <IconButton
                // disabled={deleteLoading}
                color="primary"
                aria-label="extras"
                onClick={() => handleExtras(params.row)}
              >
                <ListAltIcon />
              </IconButton>
            </Tooltip>
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
                // disabled={deleteLoading}
                color="error"
                aria-label="delete"
                onClick={() => handleDelete(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
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
    <div className="courses-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      {showExtras && (
        <Modal
          classNames={"h-70per"}
          title={"Course Extras"}
          onClose={() => setShowExtras(false)}
        >
          <ViewExtras
            onClose={() => setShowExtras(false)}
            isEditData={true}
            data={courseExtraToshow}
          ></ViewExtras>
        </Modal>
      )}

      {showEditModal && (
        <Modal
          classNames={"h-70per"}
          title={"Edit Course"}
          onClose={() => setShowEditModal(false)}
        >
          <MutationForm
            onClose={() => setShowEditModal(false)}
            isEditData={true}
            data={dataToEdit}
          ></MutationForm>
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

      {showDeleteModal && (
        <Modal title={""} onClose={() => setShowDeleteModal(false)}>
          <DeleteConfirmation
            closeFn={() => setShowDeleteModal(false)}
            deleteFn={confirmDelete}
            isLoading={deleteLoading}
          ></DeleteConfirmation>
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

export default CoursesTable;
