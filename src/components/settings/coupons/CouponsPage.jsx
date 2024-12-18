import React, { useState, lazy, Suspense, useContext, useEffect } from "react";

import { UserContext } from "../../../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingSpinner from "../../../components/LoadingSpinner";
const Header = lazy(() => import("./Header"));
const DataTable = lazy(() => import("./DataTable"));
const CouponsPage = () => {
  const { hasPermission } = useContext(UserContext);
  const navigate = useNavigate();

  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };

  return (
    <div className="rooms-page">
      {hasPermission("View list Coupons") && (
        <Suspense fallback={<LoadingSpinner />}>
          <Header data={data}></Header>
          <DataTable onDataChange={handleDataChange}></DataTable>
        </Suspense>
      )}
    </div>
  );
};

export default CouponsPage;
