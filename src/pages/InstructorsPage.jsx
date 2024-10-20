import React, { useState, lazy, Suspense } from "react";
import "../styles/Instructors.css";
import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() =>
  import("../components/Instructors/HeaderActions")
);
const InstructorsTable = lazy(() =>
  import("../components/Instructors/InstructorsTable")
);
const RoomsPage = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };

  return (
    <div className="instructors-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>
        {/* // data grid table */}
        <InstructorsTable onDataChange={handleDataChange}></InstructorsTable>
      </Suspense>
    </div>
  );
};

export default RoomsPage;
