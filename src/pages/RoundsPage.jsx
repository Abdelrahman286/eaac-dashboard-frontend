import React, { useState, lazy, Suspense } from "react";
import "../styles/rounds.css";
import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() => import("../components/rounds/HeaderActions"));
const RoundsTable = lazy(() => import("../components/rounds/RoundsTable"));
const RoundsPage = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (roundsData) => {
    setData(roundsData);
  };

  return (
    <div className="rounds-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>
        {/* // data grid table */}
        <RoundsTable onDataChange={handleDataChange}></RoundsTable>
      </Suspense>
    </div>
  );
};

export default RoundsPage;
