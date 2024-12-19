import React, { useState, lazy, Suspense, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/Instructors.css";

import { UserContext } from "../contexts/UserContext";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() =>
  import("../components/Instructors/HeaderActions")
);
const InstructorsTable = lazy(() =>
  import("../components/Instructors/InstructorsTable")
);

const InstructorsPage = () => {
  const navigate = useNavigate();
  const { hasPermission, userPermissionsLoading } = useContext(UserContext);
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Instructors List") && !userPermissionsLoading) {
      navigate("/");
    }
  }, []);

  return (
    <div className="instructors-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>
        <InstructorsTable onDataChange={handleDataChange}></InstructorsTable>
      </Suspense>
    </div>
  );
};

export default InstructorsPage;
