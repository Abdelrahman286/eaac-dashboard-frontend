import React, { useState, lazy, Suspense, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/students.css";
import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() =>
  import("../components/students/HeaderActions")
);
const StudentsTable = lazy(() =>
  import("../components/students/StudentsTable")
);
const StudentsPage = () => {
  const { hasPermission, userPermissionsLoading } = useContext(UserContext);
  const navigate = useNavigate();

  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Clients List") && !userPermissionsLoading) {
      navigate("/");
    }
  }, []);

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
