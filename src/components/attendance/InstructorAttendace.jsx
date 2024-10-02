import React from "react";
import { useParams } from "react-router-dom";
const InstructorAttendace = () => {
  const { instructorId } = useParams();

  console.log(instructorId);
  return (
    <div>
      <div>
        Iinstuctor Attendance
        <p> {instructorId}</p>
      </div>
    </div>
  );
};

export default InstructorAttendace;
