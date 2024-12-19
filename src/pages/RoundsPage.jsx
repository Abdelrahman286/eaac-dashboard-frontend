import React, { useState, lazy, Suspense, useContext, useEffect } from "react";
import "../styles/rounds.css";

import { useLocation, useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() => import("../components/rounds/HeaderActions"));
const RoundsTable = lazy(() => import("../components/rounds/RoundsTable"));
const RoundsPage = () => {
  const navigate = useNavigate();
  const { hasPermission, userPermissionsLoading } = useContext(UserContext);

  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (roundsData) => {
    setData(roundsData);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Rounds List") && !userPermissionsLoading) {
      navigate("/");
    }
  }, []);

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
