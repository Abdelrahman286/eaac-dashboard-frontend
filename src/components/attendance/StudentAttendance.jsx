import React from "react";

import { useParams } from "react-router-dom";
const StudentAttendance = () => {
  const { studentId } = useParams();

  console.log(studentId);
  return (
    <div>
      Student Attendance
      <p>{studentId}</p>
    </div>
  );
};

export default StudentAttendance;
