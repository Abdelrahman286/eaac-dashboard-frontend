import React, { useState, lazy, Suspense } from "react";
import "../styles/admins.css";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() => import("../components/Admins/HeaderActions"));
const AdminsTable = lazy(() => import("../components/Admins/AdminsTable"));

const AdminsPage = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };

  return (
    <div className="admins-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>
        {/* // data grid table */}
        <AdminsTable onDataChange={handleDataChange}></AdminsTable>
      </Suspense>
    </div>
  );
};

export default AdminsPage;
