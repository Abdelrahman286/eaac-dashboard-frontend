import React from "react";
import { useParams } from "react-router-dom";
// components
import HeaderActions from "./HeaderActions";
const InstructorAttendace = () => {
  const { instructorId } = useParams();

  console.log(instructorId);
  return (
    <div>
      <div>
        {/* <HeaderActions></HeaderActions> */}
      </div>
    </div>
  );
};

export default InstructorAttendace;
