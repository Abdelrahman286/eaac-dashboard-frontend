import React, { useState, lazy, Suspense, useContext, useEffect } from "react";
import "../styles/admins.css";

import { UserContext } from "../contexts/UserContext";

import { useLocation, useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() => import("../components/Admins/HeaderActions"));
const AdminsTable = lazy(() => import("../components/Admins/AdminsTable"));

const AdminsPage = () => {
  const { hasPermission } = useContext(UserContext);
  const navigate = useNavigate();

  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Users")) {
      navigate("/");
    }
  }, []);

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
