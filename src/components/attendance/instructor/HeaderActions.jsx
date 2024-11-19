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
  getInstructorsFn,
  getRoundsFn,
  getSessionsFn,
} from "../../../requests/attendance";

// excel
import ExportToExcel from "../../ExportToExcel";

// utils
import { getDataForTableRows } from "../../../utils/tables";

const HeaderActions = ({ onChange, paramsInstructorId, excelData }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  const [instructorId, setInstructorId] = useState("");
  const [roundId, setRoundId] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // handle redirect
  useEffect(() => {
    if (paramsInstructorId) {
      setInstructorId(paramsInstructorId);
    }
  }, []);

  // get groups
  const { data: groupsList, isLoading: groupsLoading } = useQuery({
    retry: 2,
    queryFn: () => {
      return getRoundsFn(
        {
          numOfElements: "2000",
          ...(instructorId && { instructorId: instructorId }),
        },
        token,
        { isFormData: true }
      );
    },

    queryKey: ["instructorGroups", instructorId],
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

  // get students
  const { data: instructorsList, isLoading: instructorLoading } = useQuery({
    queryFn: () => {
      return getInstructorsFn(
        {
          numOfElements: "6000",
        },
        token
      );
    },

    queryKey: ["instructors"],
  });
  const instructors = getDataForTableRows(
    instructorsList?.success?.response?.data
  );

  const handleInstructorSelect = (_instructor) => {
    setInstructorId(_instructor?.InstructorID);
    setRoundId("");
    setSessionId("");
  };

  const handleFilters = () => {
    const params = {
      instructorId,
      roundId,
      sessionId,
      startDate,
      endDate,
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
    { key: "AttendTime", label: "checkIn" },
    { key: "LeaveTime", label: "checkOut" },
    { key: "workedHours", label: "worked Hours" },
  ];

  useEffect(() => {
    console.log(instructorId);
  }, [instructorId]);

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
            <Autocomplete
              value={
                instructors.find(
                  (item) => item?.InstructorID === instructorId
                ) || null
              }
              onChange={(e, value) => {
                handleInstructorSelect(value);
              }}
              loading={instructorLoading}
              options={instructors || []}
              getOptionLabel={(option) =>
                `[${option?.InstructorID}]-${option?.Name}` || ""
              }
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Instructors"
                  margin="normal"
                  fullWidth
                />
              )}
            />
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
                <TextField
                  {...params}
                  label="Group/Round"
                  margin="normal"
                  fullWidth
                />
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
                <TextField
                  {...params}
                  label="Session"
                  margin="normal"
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
          <TextField
            //   error={Boolean(formErrors?.startDate)}
            //   helperText={formErrors?.startDate}
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            label="Start Date"
            name="startDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            //   error={Boolean(formErrors?.endDate)}
            //   helperText={formErrors?.endDate}
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            label="End Date"
            name="endDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            onClick={handleFilters}
            variant="contained"
            color="primary"
            sx={{
              height: "40px",
              padding: 0,
              margin: 0,
              marginTop: "16px",
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
          </Box>

          {/* Export XLS Button */}

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
