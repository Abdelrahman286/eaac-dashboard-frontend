import React, { useState, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// components
import HeaderActions from "./HeaderActions";
import DataTable from "./DataTable";
const StudentAttendance = () => {
  const { studentId: paramStudentId } = useParams();
  
  const queryClient = useQueryClient();
  // states to get student attendence (request body states)
  const [clientId, setClientId] = useState("");
  const [roundId, setRoundId] = useState("");
  const [sessionId, setSessionId] = useState("");

  // for excel export
  const [data, setData] = useState([]);
  const handleExcelData = (attendanceData) => {
    setData(attendanceData);
  };

  const handleChange = (params) => {
    const { clientId, roundId, sessionId } = params;
    setClientId(clientId);
    setRoundId(roundId);
    setSessionId(sessionId);
    queryClient.invalidateQueries({
      queryKey: ["studentAttendance-pagination"],
    });
    queryClient.invalidateQueries({
      queryKey: ["studentAttendance-list"],
    });
  };

  return (
    <div>
      <HeaderActions
        onChange={handleChange}
        paramStudentId={paramStudentId}
        excelData={data}
      ></HeaderActions>
      <DataTable
        onDataChange={handleExcelData}
        clientId={clientId}
        sessionId={sessionId}
        roundId={roundId}
      ></DataTable>
    </div>
  );
};

export default StudentAttendance;
