import React from "react";
import { useParams } from "react-router-dom";
// components
import DataTable from "./DataTable";
import HeaderActions from "./HeaderActions";
const InstructorAttendace = () => {
  const { instructorId } = useParams();

  console.log(instructorId);
  return (
    <div className="instructor-attendance">
      <div>
        <HeaderActions></HeaderActions>

        <DataTable></DataTable>
      </div>
    </div>
  );
};

export default InstructorAttendace;
