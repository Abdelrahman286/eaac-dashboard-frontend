import React, { useState, lazy, Suspense, useContext, useEffect } from "react";

import { UserContext } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() => import("../components/rooms/HeaderActions"));
const RoomsTable = lazy(() => import("../components/rooms/RoomsTable"));
const RoomsPage = () => {
  const { hasPermission, userPermissionsLoading } = useContext(UserContext);
  const navigate = useNavigate();

  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Rooms List") && !userPermissionsLoading) {
      navigate("/");
    }
  }, []);

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
