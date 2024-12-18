import React, { useState, lazy, Suspense } from "react";
import "../styles/admins.css";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() =>
  import("../components/Profiles/HeaderActions")
);
const DataTable = lazy(() => import("../components/Profiles/DataTable"));

const Profiles = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };

  return (
    <div className="admins-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>
        <DataTable onDataChange={handleDataChange}></DataTable>
      </Suspense>
    </div>
  );
};

export default Profiles;
