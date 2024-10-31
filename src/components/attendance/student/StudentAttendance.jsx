import React from "react";

import { useParams } from "react-router-dom";

// components
import HeaderActions from "./HeaderActions";
import DataTable from "./DataTable";
const StudentAttendance = () => {
  const { studentId } = useParams();

  console.log(studentId);
  return (
    <div>
      {/* <HeaderActions></HeaderActions> */}

      {/* <DataTable></DataTable> */}
    </div>
  );
};

export default StudentAttendance;
