import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import { Box, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCompaniesFn, restoreCompanyFn } from "../../requests/companies";
import { UserContext } from "../../contexts/UserContext";
import { AppContext } from "../../contexts/AppContext";
import { getDataForTableRows } from "../../utils/tables";

// table controls
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";

// request functions
import { deleteCompanyFn } from "../../requests/companies";

// components
import Modal from "../Modal";
import LoadingSpinner from "../LoadingSpinner";
import DeleteConfirmation from "../DeleteConfirmation";
import RestoreConfirmation from "../RestoreConfirmation";

// lazy loaded components
const MutationForm = lazy(() => import("./MutationForm"));
const ViewCompany = lazy(() => import("./ViewCompany"));

const CompaniesTable = ({ onDataChange }) => {
  const queryClient = useQueryClient();

  const { token } = useContext(UserContext);
  const { showSnackbar, searchResults, disabledList } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [dataToEdit, setDataToEdit] = useState({});

  // restore
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [idToRestore, setIdToRestore] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };
  const [companyToShow, setCompanyToShow] = useState({});

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
  if (searchResults?.key == "company" && searchResults?.searchTerm) {
    paginationReqBody.search = searchResults?.searchTerm;
    dataListReqBody.search = searchResults?.searchTerm;
  }

  // check disabled key in request body

  if (disabledList?.key == "company") {
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
      return getCompaniesFn(paginationReqBody, token, {
        isFormData: true,
        urlParams: `page=1`, // Use dynamic page number
      });
    },
    queryKey: [
      "company-pagination",
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
      "company-list",
      paginationModel.page,
      paginationModel.pageSize,
      paginationReqBody,
      dataListReqBody,
      disabledList?.key,
    ],
    queryFn: () => {
      return getCompaniesFn(dataListReqBody, token, {
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

  //------------- delete company-------------------------
  const { mutate: deletCompany, isPending: deleteLoading } = useMutation({
    mutationFn: deleteCompanyFn,
    onSuccess: () => {
      console.log("company deleted successfully");
      // Invalidate the query with key 'company-list' , searchResults

      queryClient.invalidateQueries({
        queryKey: ["company-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["company-list"],
      });
      showSnackbar("Company Deleted Successfully ", "info");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.log("Error at Deleting Company ", error);
    },
  });

  const handleDeleteCompany = (rowData) => {
    setShowDeleteModal(true);
    setIdToDelete(rowData?.id);
  };

  const confirmDelete = () => {
    deletCompany({
      reqBody: {
        id: idToDelete,
      },
      token,
      config: {
        isFormData: true,
      },
    });
  };

  const handleShowCompany = (row) => {
    setShowModal(true);
    setCompanyToShow(row);
  };

  const handleEdit = (row) => {
    setShowEditModal(true);
    setDataToEdit(row);
  };

  // restore deleted company
  const { mutate: restoreCompany, isPending: restoreLoading } = useMutation({
    mutationFn: restoreCompanyFn,

    onSuccess: () => {
      console.log("company restored");
      queryClient.invalidateQueries({
        queryKey: ["company-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["company-list"],
      });
      setShowRestoreModal(false);
      showSnackbar("Company Data Restored Successfully ", "success");
    },
    onError: (error) => {
      console.log("error at restoring compay data", error);
    },
  });
  const restoreDisabledCompany = (row) => {
    const id = row?.id;

    restoreCompany({
      reqBody: {
        id: [id],
        // id: id,
        statusId: "1",
      },
      token,
    });
  };

  // restore
  const handleRestore = (rowData) => {
    setShowRestoreModal(true);
    setIdToRestore(`${rowData?.id}`);
  };
  const confirmRestore = () => {
    restoreCompany({
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

  console.log(updatedDataList);
  const columns = [
    {
      field: "rowIndex",
      headerName: "#",
      flex: 0.5, // Makes the column responsive, taking up half a unit of space
    },
    {
      field: "Logo",
      headerName: "Logo",
      flex: 1,
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
              src={params?.row.Logo}
              alt="Logo"
              variant="circular"
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        );
      },
    },
    {
      field: "ClientCode",
      headerName: "Company Code",
      flex: 1.5, // This column will take up more space compared to others
      minWidth: 120,
    },
    {
      field: "Name_ar",
      headerName: "اسم الشركه",
      flex: 1.2,
      minWidth: 120,
    },
    {
      field: "Name_en",
      headerName: "Company Name",
      flex: 1.5,
      minWidth: 120,
    },
    {
      field: "Business",
      headerName: "Business Line",
      flex: 1.5,
      minWidth: 120,
    },
    {
      field: "MainPhone",
      headerName: "Main Phone",
      flex: 1.5,
      minWidth: 120,
    },
    // {
    //   field: "sdasagfd",
    //   headerName: "Website",
    //   flex: 1,
    // },
    {
      field: "HqAdressID",
      headerName: "HQ Address",
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => {
        // console.log(params?.Address);
        return `${row?.HqAdressID?.Address || ""}`;
      },
    },
    {
      field: "CommercialRegistrationNumber",
      headerName: "Commercial Registration",
      flex: 2,
      minWidth: 120,
    },
    {
      field: "TaxCardNumber",
      headerName: "Tax Number",
      flex: 1,
      minWidth: 120,
    },

    {
      field: "companyType",
      headerName: "Type",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        const typeCode = params?.row?.DeginoviaClient?.code;
        if (typeCode == "1") {
          return <span className="company-type-badge blue-badge">Main</span>;
        } else if (typeCode == "2") {
          return <span className="company-type-badge green-badge">Client</span>;
        } else if (typeCode == "3") {
          return (
            <span className="company-type-badge yellow-badge">Vendor</span>
          );
        }
      },
    },
    {
      field: "Notes",
      headerName: "Notes",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "controls",
      headerName: "Controls",
      flex: 2,
      minWidth: 150,
      renderCell: (params) => {
        if (disabledList?.key === "company") {
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

        if (params?.row?.DeginoviaClient?.code == "1") {
          return <div></div>;
        } else {
          return (
            <div>
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
                  onClick={() => handleDeleteCompany(params.row)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View">
                <IconButton
                  color="primary"
                  aria-label="view"
                  onClick={() => handleShowCompany(params.row)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </div>
          );
        }
      },
    },
  ];

  // to update the table elements if user deleted the only search result appeared
  if (paginationErr) {
    updatedDataList = [];
  }

  return (
    <div className="companies-table-wrapper">
      {paginationErr && (
        <h2 className="invalid-message">
          No data available. Please try again.
        </h2>
      )}

      {showEditModal && (
        <Modal
          classNames={"h-70per"}
          title={"Edit Company"}
          onClose={() => setShowEditModal(false)}
        >
          <Suspense
            fallback={<LoadingSpinner minWidth={"50vw"}></LoadingSpinner>}
          >
            <MutationForm
              onClose={() => setShowEditModal(false)}
              isEditData={true}
              data={dataToEdit}
            ></MutationForm>
          </Suspense>
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

      {showModal && (
        <Modal
          title={"Company Data"}
          onClose={handleClose}
          classNames={"h-70per"}
        >
          <Suspense
            fallback={<LoadingSpinner minWidth={"40vw"}></LoadingSpinner>}
          >
            <ViewCompany rowData={companyToShow}></ViewCompany>
          </Suspense>
        </Modal>
      )}

      <Box sx={{ height: "auto", width: "100%" }}>
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

export default CompaniesTable;
