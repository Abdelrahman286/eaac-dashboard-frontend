import React, { useState, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// components
import HeaderActions from "./HeaderActions";
import DataTable from "./DataTable";

const InstructorAttendace = () => {
  const { instructorId: paramsInstructorId } = useParams();

  const queryClient = useQueryClient();
  // states to get instructor attendence (request body states)
  const [instructorId, setInstructorId] = useState("");
  const [roundId, setRoundId] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // for excel export
  const [data, setData] = useState([]);
  const handleExcelData = (attendanceData) => {
    setData(attendanceData);
  };

  const handleChange = (params) => {
    const { instructorId, roundId, sessionId, startDate, endDate } = params;
    setInstructorId(instructorId);
    setRoundId(roundId);
    setSessionId(sessionId);

    // we may need conversion here
    setStartDate(startDate);
    setEndDate(endDate);
    queryClient.invalidateQueries({
      queryKey: ["instructorAttendance-pagination"],
    });
    queryClient.invalidateQueries({
      queryKey: ["instructorAttendance-list"],
    });
  };

  return (
    <div className="instructor-attendance">
      <div>
        <HeaderActions
          onChange={handleChange}
          paramsInstructorId={paramsInstructorId}
          excelData={data}
        ></HeaderActions>
        <DataTable
          onDataChange={handleExcelData}
          instructorId={instructorId}
          sessionId={sessionId}
          roundId={roundId}
          startDate={startDate}
          endDate={endDate}
        ></DataTable>
      </div>
    </div>
  );
};

export default InstructorAttendace;
