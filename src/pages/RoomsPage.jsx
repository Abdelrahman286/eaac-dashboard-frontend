import React, { useState, lazy, Suspense } from "react";
// import HeaderActions from "../components/rooms/HeaderActions";
// import RoomsTable from "../components/rooms/RoomsTable";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() => import("../components/rooms/HeaderActions"));
const RoomsTable = lazy(() => import("../components/rooms/RoomsTable"));
const RoomsPage = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };

  return (
    <div className="rooms-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>
        {/* // data grid table */}
        <RoomsTable onDataChange={handleDataChange}></RoomsTable>
      </Suspense>
    </div>
  );
};

export default RoomsPage;
