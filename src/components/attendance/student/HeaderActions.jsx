import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DownloadIcon from "@mui/icons-material/Download";
// MUI
import { Box, TextField, Autocomplete, Button } from "@mui/material";

// contexts
import { AppContext } from "../../../contexts/AppContext";
import { UserContext } from "../../../contexts/UserContext";

// requests
import {
  getStudentFn,
  getRoundsFn,
  getSessionsFn,
} from "../../../requests/attendance";

// excel
import ExportToExcel from "../../ExportToExcel";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// components
import SearchableDropdown from "../../SearchableDropdown";
import StudentAttendanceReport from "./StudentAttendanceReport";
import Modal from "../../Modal";

// hooks
import useQueryParam from "../../../hooks/useQueryParams";

const HeaderActions = ({ onChange, paramStudentId, excelData }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token, hasPermission } = useContext(UserContext);

  const [clientId, setClientId] = useState("");
  const [roundId, setRoundId] = useState("");
  const [sessionId, setSessionId] = useState("");

  // attendance report
  const [showReport, setShowReport] = useState(false);

  // get params student
  const { data: studentObj, isLoading: getStudentLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getStudentFn(
        {
          ...(paramStudentId && { id: paramStudentId }),
        },
        token,

        { isFormData: false }
      );
    },
    enabled: !!paramStudentId,
    queryKey: ["paramsStudent", paramStudentId],
  });
  const paramsStudent =
    getDataForTableRows(studentObj?.success?.response?.data)[0] || {};

  // get groups
  const { data: groupsList, isLoading: groupsLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getRoundsFn(
        {
          numOfElements: "2000",
          ...(clientId && { studentId: clientId }),
        },
        token,
        { isFormData: true }
      );
    },

    queryKey: ["studentGroups", clientId],
  });
  const groups = getDataForTableRows(groupsList?.success?.response?.data);

  // get sessions
  const { data: sessionsList, isLoading: sessionsLoading } = useQuery({
    queryFn: () => {
      return getSessionsFn(
        {
          numOfElements: "3000",
          ...(roundId && { roundId: roundId }),
        },
        token
      );
    },
    enabled: !!roundId,
    queryKey: ["roundSessions", roundId],
  });
  const sessions = getDataForTableRows(sessionsList?.success?.response?.data);

  const handleStudentSelect = (_student) => {
    setClientId(_student?.id);
    setRoundId("");
    setSessionId("");
  };

  const handleFilters = () => {
    const params = {
      clientId,
      roundId,
      sessionId,
    };

    onChange(params);
  };

  // Excel export
  const headers = [
    { key: "Name", label: "Name" },
    { key: "PhoneNumber", label: "Phone" },
    { key: "RoundID.Name_en", label: "Group" },
    { key: "RoomID.Name_en", label: "Room" },
    { key: "Date", label: "Session Name" },
    { key: "Name_en", label: "Session Date" },
    { key: "AttendFlag", label: "Attendance" },
    { key: "numberOfSessionsAttended", label: "No.of Attendance" },
    { key: "percentageOfSessionsAttended", label: "Percentage" },
  ];

  // handle notification redirect
  const roundParamsId = useQueryParam("paramsRound");
  useEffect(() => {
    if (roundParamsId) {
      setRoundId(roundParamsId);
    }
  }, [roundParamsId]);
  return (
    <div className="header-wrapper">
      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {showReport && (
          <Modal
            //   classNames={"h-70per"}
            title={"Students Attendance Report"}
            onClose={() => setShowReport(false)}
          >
            <StudentAttendanceReport
              onClose={() => setShowReport(false)}
              clientId={clientId}
              roundId={roundId}
              sessionId={sessionId}
              // isEditData={true}
              // data={dataToEdit}
            ></StudentAttendanceReport>
          </Modal>
        )}

        {/* Row 1 - Group/Round, Session, and Instructor */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <SearchableDropdown
              onSelect={(_client) => {
                handleStudentSelect(_client);
              }}
              fetchData={getStudentFn}
              isFromData={false}
              label="Student"
              queryKey="studentForMemebership"
              getOptionLabel={(option) => `[${option?.id}] - ${option?.Name} `}
              getOptionId={(option) => option?.id} // Custom ID field
              // to limit the number of elements in dropdown
              requestParams={{ numOfElements: 50 }}
              // initial Value
              //   initialValue={paramsStudent}
            ></SearchableDropdown>
          </Box>
          {/* Autocomplete for Group/Round */}
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              value={groups.find((item) => item.id == roundId) || null}
              onChange={(e, value) => {
                setRoundId(value?.id);
              }}
              loading={groupsLoading}
              options={groups || []}
              getOptionLabel={(option) => option?.Name_en || ""}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Group/Round" fullWidth />
              )}
            />
          </Box>

          {/* Autocomplete for Session */}
          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              value={sessions.find((item) => item.id == sessionId) || null}
              onChange={(e, value) => {
                setSessionId(value?.id);
              }}
              options={sessions}
              getOptionLabel={(option) =>
                `${option?.Name_en} (${option?.StartTime})` || ""
              }
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Session" fullWidth />
              )}
            />
          </Box>

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

          {/* Autocomplete for student */}
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
            {hasPermission("Show/Print Student Attendance Report") && (
              <Button
                onClick={() => setShowReport(true)}
                size="small"
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                sx={{
                  width: "280px", // Constant width
                  paddingY: 0.1,
                  height: "40px",
                  padding: "16px 4px",
                  borderRadius: "20px",
                }}
              >
                Show Attendance Report
              </Button>
            )}
          </Box>

          <ExportToExcel
            data={excelData}
            fileName={"stundet attenance"}
            headers={headers}
          ></ExportToExcel>
        </Box>
      </Box>
    </div>
  );
};

export default HeaderActions;
