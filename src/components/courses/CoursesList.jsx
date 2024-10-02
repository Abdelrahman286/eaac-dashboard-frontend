import React, { useState } from "react";
import HeaderActions from "./HeaderActions";
import CoursesTable from "./CoursesTable";
const CoursesList = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };
  return (
    <div className="courses-page">
      <HeaderActions data={data}></HeaderActions>
      {/* // data grid table */}
      <CoursesTable onDataChange={handleDataChange}></CoursesTable>
    </div>
  );
};

export default CoursesList;
