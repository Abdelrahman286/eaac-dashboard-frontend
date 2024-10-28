import React, { useState, lazy, Suspense } from "react";
import "../styles/students.css";
import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() =>
  import("../components/students/HeaderActions")
);
const StudentsTable = lazy(() =>
  import("../components/students/StudentsTable")
);
const StudentsPage = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };

  return (
    <div className="students-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>

        <StudentsTable onDataChange={handleDataChange}></StudentsTable>
      </Suspense>
    </div>
  );
};

export default StudentsPage;
