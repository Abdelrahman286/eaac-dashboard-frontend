import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DownloadIcon from "@mui/icons-material/Download";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  InputAdornment,
} from "@mui/material";

// icons
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// requests
import {
  getInstructorsFn,
  getRoundsFn,
  getSessionsFn,
} from "../../requests/attendance";

// excel
import ExportToExcel from "../ExportToExcel";

// utils
import { getDataForTableRows } from "../../utils/tables";

// components
import MutationForm from "./MutationForm";
import Modal from "../Modal";

// Dummy data
const memebershipStatus = [
  { id: 1, value: "Active" },
  { id: 2, value: "Expired" },
];

const membershipCardStatus = [
  { id: 1, value: "All" },
  { id: 2, value: "Requested to print" },
  { id: 3, value: "Ready to Deliver" },
  { id: 4, value: "Deleivered" },
];

const membershipTypes = [
  { id: 1, value: "student" },
  { id: 2, value: "livetime" },
];

const Header = ({ onChange, paramsInstructorId, excelData }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [clientId, setClientId] = useState("");
  const [roundId, setRoundId] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMembership = () => {
    setShowAddForm(true);
  };

  // handle redirect
  //   useEffect(() => {
  //     if (paramsInstructorId) {
  //       setInstructorId(paramsInstructorId);
  //     }
  //   }, []);

  // get students
  const { data: studentList, isLoading: studentLoading } = useQuery({
    queryFn: () => {
      return getStudentFn(
        {
          numOfElements: "6000",
        },
        token,
        { isFormData: false }
      );
    },

    queryKey: ["students"],
  });
  const students = getDataForTableRows(studentList?.success?.response?.data);

  //   const handleInstructorSelect = (_instructor) => {
  //     setInstructorId(_instructor?.InstructorID);
  //     setRoundId("");
  //     setSessionId("");
  //   };

  const handleFilters = () => {
    //     const params = {
    //       instructorId,
    //       roundId,
    //       sessionId,
    //       startDate,
    //       endDate,
    //     };
    //     onChange(params);
  };

  // Excel export
  const headers = [
    { key: "Name", label: "Name" },
    { key: "PhoneNumber", label: "Phone" },
    { key: "RoundID.Name_en", label: "Group" },
    { key: "RoomID.Name_en", label: "Room" },
    { key: "Date", label: "Session Name" },
    { key: "Name_en", label: "Session Date" },
    { key: "AttendTime", label: "checkIn" },
    { key: "LeaveTime", label: "checkOut" },
    { key: "workedHours", label: "worked Hours" },
  ];

  //   useEffect(() => {
  //     console.log(instructorId);
  //   }, [instructorId]);

  return (
    <div className="header-wrapper">
      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Row 1 - Group/Round, Session, and Instructor */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <TextField
              size={"small"}
              label="Search By Memebership Code"
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* Autocomplete for Group/Round */}
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              sx={{
                flex: 1,
              }}
              //   value={students.find((item) => item.id == clientId) || null}
              //   onChange={(e, value) => {
              //     handleStudentSelect(value);
              //   }}
              //   loading={studentLoading}
              options={memebershipStatus || []}
              getOptionLabel={(option) => `${option?.value}` || ""}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Membership Status" fullWidth />
              )}
            />
          </Box>

          {/* Autocomplete for Session */}
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              sx={{
                flex: 1,
              }}
              //   value={students.find((item) => item.id == clientId) || null}
              //   onChange={(e, value) => {
              //     handleStudentSelect(value);
              //   }}
              //   loading={studentLoading}
              options={membershipCardStatus || []}
              getOptionLabel={(option) => `${option?.value}` || ""}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Membership Card (Status)"
                  fullWidth
                />
              )}
            />
          </Box>

          {/* Autocomplete for student */}
        </Box>
        {/* start & end time row */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Autocomplete
            sx={{
              flex: 1,
            }}
            value={students.find((item) => item.id == clientId) || null}
            onChange={(e, value) => {
              handleStudentSelect(value);
            }}
            loading={studentLoading}
            options={students || []}
            getOptionLabel={(option) => `[${option?.id}]-${option?.Name}` || ""}
            size="small"
            renderInput={(params) => (
              <TextField {...params} label="Students" fullWidth />
            )}
          />

          <Autocomplete
            sx={{
              flex: 1,
            }}
            //   value={students.find((item) => item.id == clientId) || null}
            //   onChange={(e, value) => {
            //     handleStudentSelect(value);
            //   }}
            //   loading={studentLoading}
            options={membershipTypes || []}
            getOptionLabel={(option) => `${option?.value}` || ""}
            size="small"
            renderInput={(params) => (
              <TextField {...params} label="Membership Type" fullWidth />
            )}
          />

          <Button
            onClick={handleFilters}
            variant="contained"
            color="primary"
            sx={{
              height: "40px",
              padding: 0,
              margin: 0,
            }}
          >
            Filter
          </Button>
        </Box>

        {/* Row 3 - Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: { sm: "flex-end" },
            marginLeft: "auto",

            width: {
              xs: "100%",
              sm: "100%",
              md: "70%",
              lg: "50%",
            },
          }}
        >
          {/* Show Attendance Report Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              sx={{
                width: "180px",
                paddingY: 0.1,
                height: "40px",
                padding: "16px 4px",
                borderRadius: "20px",
              }}
              onClick={handleAddMembership}
            >
              Add Membership
            </Button>
          </Box>

          {/* Export XLS Button */}

          <ExportToExcel
            data={excelData}
            fileName={"stundet attenance"}
            headers={headers}
          ></ExportToExcel>
        </Box>

        {showAddForm && (
          <Modal
            classNames={"h-70per"}
            title={"Add Membership"}
            onClose={() => setShowAddForm(false)}
          >
            <MutationForm onClose={() => setShowAddForm(false)}></MutationForm>
          </Modal>
        )}
      </Box>
    </div>
  );
};

export default Header;
